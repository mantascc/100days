// ─── Helpers ─────────────────────────────────────────────────────────────────

const pause = ms => new Promise(r => setTimeout(r, ms));

function mk(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls)  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function addMsg(parent, role, content, extraCls = '') {
  const wrap = mk('div', 'msg in');
  const r = mk('span', `msg-role ${role}`, role);
  const c = mk('div', `msg-content ${extraCls}`, content);
  wrap.append(r, c);
  parent.appendChild(wrap);
  return wrap;
}

function sep(parent, text = '') {
  parent.appendChild(mk('div', 'sep', text));
}

// ─── 1. Approval Gate ────────────────────────────────────────────────────────

async function exprApprovalGate(body) {
  // Pipeline stages
  const stagesEl = mk('div', 'stages in');
  const stageData = [
    { name: 'build',  status: 'done' },
    { name: 'test',   status: 'done' },
    { name: 'stage',  status: 'done' },
    { name: 'deploy', status: 'pend' },
  ];
  const boxes = stageData.map((s, i) => {
    const box = mk('div', `stage-box ${s.status}`, s.name);
    stagesEl.appendChild(box);
    if (i < stageData.length - 1) stagesEl.appendChild(mk('div', 'stage-arr', '→'));
    return box;
  });
  body.appendChild(stagesEl);

  await pause(600);

  // Agent reaches deploy — gate fires
  boxes[3].className = 'stage-box hold';
  boxes[3].textContent = 'deploy';

  await pause(700);
  sep(body, 'approval required');
  await pause(300);

  // Approval dialog
  const dlg = mk('div', 'dialog in');
  const hdr = mk('div', 'dialog-hdr', 'APPROVAL REQUIRED');
  const dbody = mk('div', 'dialog-body');

  [
    ['action',  'send_to_production()'],
    ['target',  'prod-us-east-1'],
    ['affects', '47,000 active users'],
    ['risk',    'IRREVERSIBLE'],
  ].forEach(([k, v], i) => {
    const row = mk('div', 'dialog-row');
    const vEl = mk('div', 'dialog-v', v);
    if (i === 3) vEl.style.color = 'var(--err)';
    row.append(mk('div', 'dialog-k', k), vEl);
    dbody.appendChild(row);
  });

  const ftr = mk('div', 'dialog-ftr');
  const btnOk = mk('button', 'btn ok', 'approve');
  const btnNo = mk('button', 'btn err', 'reject');
  ftr.append(btnOk, btnNo);
  dlg.append(hdr, dbody, ftr);
  body.appendChild(dlg);

  await pause(1800); // human reviewing

  // Human approves
  btnOk.style.background = 'rgba(0,255,136,0.12)';

  await pause(350);
  addMsg(body, 'human', 'approved — deploy to prod');

  await pause(500);
  boxes[3].className = 'stage-box active';

  await pause(1000);
  boxes[3].className = 'stage-box done';

  await pause(400);
  const done = mk('div', 'task-sub in', '✓ deployed — 3 pods healthy, 0 errors');
  done.style.marginTop = '6px';
  body.appendChild(done);
}

// ─── 2. Interrupt on Uncertainty ─────────────────────────────────────────────

async function exprInterruptUncertainty(body) {
  await pause(200);
  addMsg(body, 'thought', 'Patient: 78y, CKD stage 3. Looking up warfarin dosing protocol.');
  await pause(650);
  addMsg(body, 'action', 'lookup_protocol({ drug: "warfarin", profile: "elderly_renal" })', 'action');
  await pause(800);
  addMsg(body, 'obs', '{ "base_dose": "2mg", "renal_adj": "required", "eGFR": "conflicting" }', 'obs');
  await pause(650);
  addMsg(body, 'thought', 'Two conflicting eGFR values in record. Cannot safely compute dose reduction.');

  await pause(600);
  sep(body, 'uncertainty signal');
  await pause(300);

  // Confidence meter
  const confRow = mk('div', 'meter-item in');
  const confHdr = mk('div', 'meter-hdr');
  confHdr.append(mk('div', 'meter-lbl', 'confidence'), mk('div', 'meter-val', '38%'));
  const track = mk('div', 'meter-track');
  const fill = mk('div', 'meter-fill');
  fill.style.width = '0%';
  fill.style.background = 'var(--warn)';
  const thresh = mk('div', 'meter-thresh');
  thresh.style.left = '70%';
  track.append(fill, thresh);
  const dec = mk('div', 'meter-dec esc', '↑ below 70% threshold — escalating to human');
  confRow.append(confHdr, track, dec);
  body.appendChild(confRow);
  setTimeout(() => { fill.style.width = '38%'; }, 80);

  await pause(900);

  // Uncertainty signal
  const sig = mk('div', 'dialog in');
  const sigHdr = mk('div', 'dialog-hdr', 'UNCERTAINTY SIGNAL');
  const sigBody = mk('div', 'dialog-body');
  sigBody.style.gap = '4px';

  [
    ['', 'Conflicting eGFR values in the patient record:'],
    ['lab-2024-11', '28 mL/min  (post-procedure)'],
    ['lab-2024-09', '41 mL/min'],
    ['', 'Which value should I use for dose adjustment?'],
  ].forEach(([k, v]) => {
    if (!k) {
      const p = mk('div', 'dialog-v', v);
      p.style.fontSize = '12px';
      sigBody.appendChild(p);
    } else {
      const row = mk('div', 'dialog-row');
      const kEl = mk('div', 'dialog-k', k);
      kEl.style.color = 'var(--t4)';
      kEl.style.fontVariantNumeric = 'tabular-nums';
      row.append(kEl, mk('div', 'dialog-v', v));
      sigBody.appendChild(row);
    }
  });

  sig.append(sigHdr, sigBody);
  body.appendChild(sig);

  await pause(1700);
  addMsg(body, 'human', 'Use 28 mL/min — November result is post-procedure, use the most recent.');

  await pause(500);
  sep(body, 'resuming');
  await pause(300);

  addMsg(body, 'thought', 'eGFR 28 mL/min confirmed. CKD stage 3+ — apply 50% dose reduction.');
  await pause(600);
  addMsg(body, 'answer', 'Recommended: 1 mg warfarin daily (50% reduction for CKD stage 3+).', 'answer');
}

// ─── 3. Post-hoc Review ──────────────────────────────────────────────────────

async function exprPosthocReview(body) {
  // Agent running fast
  const counter = mk('div', 'task-sub in', 'agent processing batch — 0 documents');
  body.appendChild(counter);

  let n = 0;
  const tick = setInterval(() => {
    n = Math.min(n + 2, 48);
    counter.textContent = `agent processing batch — ${n} documents`;
  }, 50);

  await pause(1300);
  clearInterval(tick);
  counter.textContent = 'processed 48 documents — outputs staged, not committed';

  await pause(500);
  sep(body, 'staged — pending review');
  await pause(300);

  const items = [
    { file: 'contract-4821.pdf',   note: '3 unfavorable clauses in §4 and §7' },
    { file: 'memo-q3-final.docx',  note: 'Summary: revenue −12%, two material risks flagged' },
    { file: 'nda-template-v7.pdf', note: 'Non-standard IP assignment clause detected' },
  ];

  const stagedEls = [];
  for (const item of items) {
    await pause(380);
    const row = mk('div', 'staged-row in');
    const tag = mk('div', 'staged-tag pending', 'staged');
    const bdy = mk('div', 'staged-body');
    bdy.appendChild(mk('div', 'staged-file', item.file));
    bdy.appendChild(mk('div', 'staged-note', item.note));
    row.append(tag, bdy);
    body.appendChild(row);
    stagedEls.push({ row, tag, bdy });
  }

  await pause(600);
  sep(body, 'review');
  await pause(400);

  // Approve first two
  stagedEls[0].tag.className = 'staged-tag approved';
  stagedEls[0].tag.textContent = 'committed';
  await pause(480);

  stagedEls[1].tag.className = 'staged-tag approved';
  stagedEls[1].tag.textContent = 'committed';
  await pause(480);

  // Reject third
  stagedEls[2].tag.className = 'staged-tag rejected';
  stagedEls[2].tag.textContent = 'rejected';
  await pause(200);

  const rej = mk('div', 'staged-note in');
  rej.style.color = 'var(--err)';
  rej.textContent = '↳ IP clause needs legal review — requeued with context';
  stagedEls[2].bdy.appendChild(rej);

  await pause(600);
  const summary = mk('div', 'task-sub in', '✓ committed: 2   rejected: 1   requeued to agent');
  summary.style.marginTop = '6px';
  body.appendChild(summary);
}

// ─── 4. Async Audit ──────────────────────────────────────────────────────────

async function exprAsyncAudit(body) {
  const logEl = mk('div', 'in');
  body.appendChild(logEl);

  const entries = [
    { ts: '14:28:01', act: 'fetch_user_records(segment: "enterprise")',      dur: '823ms', ok: true  },
    { ts: '14:28:04', act: 'generate_report(type: "churn", period: "Q4")',   dur: '1.2s',  ok: true  },
    { ts: '14:28:06', act: 'write_file("churn-analysis-Q4.pdf")',            dur: '0.1s',  ok: true  },
    { ts: '14:29:18', act: 'send_digest(to: "sales@corp.com")',              dur: '0.8s',  ok: true  },
    { ts: '14:31:55', act: 'fetch_user_records(segment: "all_users")',       dur: '4.1s',  ok: true  },
    { ts: '14:32:07', act: 'bulk_export(records: 91847, dest: "s3://…")',   dur: '—',     ok: false },
  ];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    await pause(i < 4 ? 260 : 650);
    const row = mk('div', e.ok ? 'trace-row in' : 'trace-row anomaly in');
    row.append(
      mk('div', 'trace-ts',  e.ts),
      mk('div', 'trace-act', e.act),
      mk('div', 'trace-dur', e.dur),
      mk('div', e.ok ? 'trace-st ok' : 'trace-st warn', e.ok ? '✓' : '⚠'),
    );
    logEl.appendChild(row);
  }

  await pause(800);
  sep(body, 'anomaly detected by auditor');
  await pause(400);

  // Auditor flag
  const flag = mk('div', 'dialog in');
  const flagHdr = mk('div', 'dialog-hdr', 'AUDITOR FLAG — 14:32:07');
  const flagBody = mk('div', 'dialog-body');

  [
    ['pattern', 'bulk export follows full-corpus fetch'],
    ['records', '91,847 — no prior run exceeded 2,000'],
    ['dest',    's3://ext-transfer — not in approved list'],
  ].forEach(([k, v]) => {
    const row = mk('div', 'dialog-row');
    const vEl = mk('div', 'dialog-v', v);
    if (k === 'dest') vEl.style.color = 'var(--err)';
    row.append(mk('div', 'dialog-k', k), vEl);
    flagBody.appendChild(row);
  });

  flag.append(flagHdr, flagBody);
  body.appendChild(flag);

  await pause(1200);
  sep(body, 'rollback');
  await pause(400);

  // Rollback timeline
  const rb1 = mk('div', 'tl-item in');
  const bd1 = mk('div', 'tl-body');
  bd1.appendChild(mk('div', 'tl-title', 'rollback initiated — bulk_export @ 14:32:07'));
  rb1.append(mk('div', 'tl-dot info'), bd1, mk('div', 'tl-date', '14:33:01'));
  body.appendChild(rb1);

  await pause(800);

  const rb2 = mk('div', 'tl-item in');
  const bd2 = mk('div', 'tl-body');
  bd2.appendChild(mk('div', 'tl-title', '0 records committed — task suspended pending review'));
  rb2.append(mk('div', 'tl-dot ok'), bd2, mk('div', 'tl-date', '14:33:02'));
  body.appendChild(rb2);
}

// ─── Router ──────────────────────────────────────────────────────────────────

const handlers = {
  'approval-gate':         exprApprovalGate,
  'interrupt-uncertainty': exprInterruptUncertainty,
  'posthoc-review':        exprPosthocReview,
  'async-audit':           exprAsyncAudit,
};

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const key = this.dataset.target;
    const body = document.getElementById('expr-' + key);
    if (!body) return;
    body.innerHTML = '';
    const fn = handlers[key];
    if (fn) {
      this.textContent = 'replay';
      fn(body);
    }
  });
});
