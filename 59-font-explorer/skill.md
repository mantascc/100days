---
description: Generate a font explorer sketch for any Google Font
argument-hint: [font name] | [color story 1], [color story 2], ...
allowed-tools: Bash, Write, Read, Glob
author: https://github.com/mantascc
---

Generate a complete font explorer HTML sketch in the `daily-sketch/` folder.

## Arguments

Raw input from user: $ARGUMENTS

Parse it as: everything before `|` is the **font name**, everything after `|` is a comma-separated list of **color stories**.

Examples:
- `Space Mono | hot pink/black, navy/cream` → font: "Space Mono", themes: hot-pink+black, navy+cream
- `Fira Code` → font: "Fira Code", themes: use a tasteful default dark minimal
- `JetBrains Mono | forest green/white, paper/ink` → 3 themes total (always include minimal dark as theme 1)

---

## Step 1 — Parse inputs

- **Font name**: e.g. "Space Mono"
- **Font slug for Google Fonts URL**: replace spaces with `+`, e.g. `Space+Mono`
- **Font slug for folder name**: lowercase, hyphens, e.g. `space-mono`
- **Color stories**: parse each as a `background/foreground` pair or single mood word. Invent tasteful hex values that match the story. Always add the standard dark minimal as theme `minimal` (index 0).
- **Weight variants to load**: detect if the font is variable-weight or has distinct weights. For monospace fonts, try `300;400;500`. If unsure, use `400` only and adjust specimen weights to use opacity instead.

---

## Step 2 — Design the themes

For each color story, derive a full set of CSS custom property values:

```
--ground-void     main background
--ground-raised   hover/elevated surface (slightly different from void)
--ground-surface  used for subtle rule lines (often rgba overlay)
--text-primary    highest contrast text (titles)
--text-default    body text
--text-secondary  labels, metadata (60–70% opacity of text-primary)
--text-tertiary   hints (35–40% opacity)
--text-ghost      barely-there (15–25% opacity)
--border-default  structural lines
--accent          single punch color — cursor, section numbers, active dots
```

**Dark theme (always included as "minimal"):**
```
void:#0a0a0a, raised:#141414, surface:#1a1a1a,
primary:#fff, default:#f5f5f7, secondary:#a8aab8,
tertiary:#666, ghost:#333, border:#2a2a2a, accent:#00a8ff
```

**Color story translation guide:**
- Light backgrounds (paper, cream, white): use dark text, muted accent
- Saturated backgrounds (yellow, red, blue, green): use full black or white text, accent = text color
- "Ink/paper" → warm off-white bg (#f4f0e8), near-black text (#1a1612), accent = dark brown/sepia
- "Ocean" → deep navy bg (#001a3a), white text, cyan accent
- "Forest" → dark green (#0d1f0d), pale green text, bright green accent
- "Hot pink" → #ff0066 bg, white text, accent white or yellow
- Always: raised = bg ± 8% brightness, surface = rgba overlay at 8% opacity

For light themes: raised should be slightly *darker* than void. For dark themes: raised slightly *lighter*.

---

## Step 3 — Create files

### Directory
Create: `daily-sketch/sketch-{font-slug}/`

### interface.md
```
# sketch-{font-slug}

## idea
Font explorer: {Font Name} — specimen, weights, scale, monospace proof, tracking, glyphs, compose, animate.

## tags
typography, interactive, specimen

## stack
vanilla · {Font Name} · CSS themes

## themes
{list each theme slug and its color story}
```

### index.html

Write a **complete, self-contained** HTML file. Use the exact structure below as a template, substituting `{FONT_NAME}`, `{FONT_URL_SLUG}`, `{FONT_WEIGHTS}`, theme CSS blocks, and theme switcher buttons.

**Critical structural rules (do not deviate):**
- Scroll container `.scroller` with `scroll-snap-type: y mandatory`
- Each `<section>` is `display:flex; flex-direction:column; height:100dvh`
- `.sec-label` is **in-flow** (not absolute) — `flex-shrink:0; height:56px; display:flex; align-items:flex-end; padding:0 var(--edge) 12px`
- `.sec-body` is `flex:1; display:flex; flex-direction:column; overflow:hidden`
- Section-specific layout lives on `#section-id .sec-body`, NOT on the `section` itself
- Side nav uses IntersectionObserver with `threshold:0.5, root:scroller`
- Theme switcher: fixed bottom-right, 20×20px colored squares, active gets `box-shadow:0 0 0 1px var(--text-default)` + `scale(1.25)`, invisible tap target via `::before { inset:-10px }`
- Theme switching: `document.documentElement.dataset.theme = btn.dataset.theme`
- **DOM order must match SECTIONS array order exactly** — mismatch causes nav to skip sections. Order: specimen → weights → scale → mono → tracking → glyphs → compose → animate

**8 sections (IDs: specimen, weights, scale, mono, tracking, glyphs, compose, animate):**

1. **specimen** — font name split across 3 lines at `clamp(72px,18vw,240px)`, right-aligned, weights 300/400/500 progressively, blinking block cursor (accent color, CSS `step-end` animation), bottom-left meta: font designer + year + "open source" if applicable
2. **weights** — 3-column grid divided by 1px `--border-default` lines; each col: giant "Aa" at `clamp(80px,12vw,180px)`, weight name (light/regular/medium), weight number in 32px `--text-ghost`; hover → `--ground-raised` bg, number → `--accent`, pangram fades in
3. **scale** — rows of "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG" at sizes `[180,100,60,42,28,20,15,11]px`, left-aligned, overflow hidden, generated by JS
4. **mono** — 5 rows proving equal advance width: `["MMMMMMMM·iiiiiiii","WWWWWWWW·llllllll","@@@@@@@@·........","00000000·11111111","########·--------"]` at `clamp(28px,4.5vw,64px)`, left `--text-default`, right `--text-ghost`; absolute bottom label "every character · equal advance width"
5. **tracking** — 7 rows of font name or "MONOSPACE" at tracking `[-0.05em, 0em, 0.08em, 0.15em, 0.25em, 0.40em, 0.60em]`, space-between with value label right, borders top/bottom, generated by JS
6. **glyphs** — CSS grid `auto-fill minmax(48px,1fr)`, gap 1px background `--border-default`; chars: 0-9, A-Z, a-z, special; hover → `--ground-surface` bg, `--accent` color, `::after` shows U+XXXX codepoint in 6px
7. **compose** — large `contenteditable` div, placeholder "type here_" via `:empty::before`, `caret-color:--accent`; controls below border: weight buttons (3), size slider 16–120px, tracking slider -5 to 30 (÷100 = em); all show live values
8. **animate** — 3×2 grid of `.anim-cell` divs (border-right on cols 1–2, border-bottom on row 1), each with a `.anim-display` and `.anim-label` (9px, absolute bottom-center). Font size `clamp(15px,1.8vw,26px)`. 6 independent animations, all start on page load, run indefinitely:

   - **slots** (`#slots-display`) — 3 rows of words (typography terms, 4–5 chars each). All characters spin as random chars at 50ms for 2s, then chars lock left-to-right at 60ms each. 3s pause then repeat. Use 5 word-sets, cycle through them.
   - **typing** (`#typing-display`) — Typewriter: types a sentence at 80ms/char, pauses 1.8s, deletes at 38ms/char, pauses 400ms, types next. Blinking cursor via `<span class="anim-cursor">` (same style as main cursor: thin block, accent bg, `step-end` blink). 5 short sentences cycling.
   - **glitch** (`#glitch-display`) — Word shown normally. Every 600–1000ms: corrupt 1–3 random char positions to random chars for 60–180ms, restore. After 4–8 hits, wait 3s, next word.
   - **cipher** (`#cipher-display`) — Show word caesar-shifted by random N (7–19). After 900ms, decrypt char by char left→right: each char cycles through intermediate alphabet values at 35ms/step until it reaches plaintext. After full decode, pause 2.5s, re-show encrypted, wait 600ms, repeat with next word.
   - **wave** (`#wave-display`) — Word rendered as individual `<span>` per character. `setInterval` at 30ms updates each span's `opacity` = `0.08 + 0.92 * (0.5 + 0.5 * sin(phase - i * 0.75))`, then increments `phase += 0.07`. Words cycle every 5s via separate interval (re-render spans on word change).
   - **redact** (`#redact-display`) — Show word, then replace chars with `█` one by one at 75ms. Once fully redacted, pause 1s, then uncover chars one by one at 75ms. Pause 1.5s, next word.

**CSS for animate section:**
```css
#animate .sec-body {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  overflow: hidden;
}
.anim-cell {
  border-right: 1px solid var(--border-default);
  border-bottom: 1px solid var(--border-default);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px 16px 36px; overflow: hidden; position: relative;
}
.anim-cell:nth-child(3n)  { border-right: none; }
.anim-cell:nth-child(n+4) { border-bottom: none; }
.anim-display { font-size: clamp(15px,1.8vw,26px); font-weight: 400; color: var(--text-primary); letter-spacing: 0.08em; text-align: center; line-height: 1.6; }
.anim-cursor  { display: inline-block; width: 0.06em; height: 0.82em; background: var(--accent); vertical-align: middle; margin-left: 0.03em; animation: blink 1.1s step-end infinite; }
.anim-label   { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-tertiary); white-space: nowrap; }
#wave-display span { display: inline-block; }
```

**JS sections:**
- Side nav build + IntersectionObserver (add `animate` to SECTIONS array)
- Scale rows: append to `#scale-body`
- Mono rows: append to `#mono-body`
- Tracking rows: append to `#track-body`
- Glyph grid: append to `#glyph-grid`
- Compose controls: weight buttons, size slider, tracking slider
- Theme switcher
- All 6 animate IIFEs (slots, typing, glitch, cipher, wave, redact) — wrap each in `(function(){ ... })();`
- Shared `const ANIM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#+-=?';` before the IIFEs

---

## Step 4 — Output

After writing the files, print:
```
created: daily-sketch/sketch-{font-slug}/
  index.html
  interface.md

themes: {list each theme slug}
open in browser to explore.
```

Do not add to projects.json or root index.html — that happens when the sketch graduates to a numbered day.
