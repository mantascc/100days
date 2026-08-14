# Imagination

**Oblique Strategies that has read your work.**

A context layer for a creative practice. Not a record of what you built — a
map of what you keep returning to, and an instrument for finding what to
make next.

Markdown files with YAML frontmatter, in a folder, in your repo. No
database, no build, no service. `cat` a file to read it.

---

## The idea

Eno and Schmidt's Oblique Strategies works because a card breaks your
pattern. It also has a permanent ceiling: the deck cannot know what you
have made. The same hundred cards for every practice on earth.

Imagination is the same job done against your actual corpus. It reads
every note in your practice, notices what recurs, tracks which obsessions
are warm and which have gone quiet, and proposes the next piece — the
collision you have not tried, the idea you have been avoiding since
spring, the habit you should break today.

Every note system before this one was inhale-only — Zettelkasten,
evergreen notes, PARA, digital gardens, decision logs. They accumulate;
none of them generate. Not an oversight: the exhale needs a reader that
can hold a whole corpus and synthesize a specific proposal from it, and
that reader did not exist. Now it does.

---

## What's here

```
imagination/
├── SPEC.md        the format definition (v0.1)
├── validate.py    conformance checker, stdlib-only
├── index.md       at-a-glance listing of every entity, by charge
├── log.md         chronological history of the layer
├── rituals/       the /spark and /inhale prompts
├── threads/       what you keep making
├── techniques/    craft you own
├── themes/        questions you keep asking
├── sources/       what feeds the work
├── seeds/         ideas not yet made
└── collisions/    proposed pairings (grows via /spark)
```

Six entity types. Each answers one question:

| Type | Answers |
|---|---|
| **Seed** | "I want to make X" |
| **Thread** | "I keep returning to X" |
| **Technique** | "I now know how to do X" |
| **Theme** | "How do I X?" — never closes |
| **Source** | "X feeds my work" |
| **Collision** | "What if X met Y?" |

---

## The daily loop

A breathing cycle. Two steps, both lightweight.

- **Before you work — `/spark` (exhale).** It reads the whole layer and
  proposes four prompts: **Collide** two distant obsessions, **Revive** a
  dormant one, **Press** a new technique against an old question, and
  **Break** — deliberately violate your strongest habit. Pick one, or
  ignore all four and work on something else.
- **Make the thing.** Write its note as usual. The layer stays out of the
  way.
- **After — `/inhale` (harvest).** Run it on the new work. It proposes
  small diffs: a new technique, a thread gaining a member, a charge
  ticking up. Approve and it writes the files.
- **Weekly — skim `index.md`.** See the shape of the field. Notice what's
  gone quiet, and what keeps resurfacing unmade.

---

## Two ideas worth stealing even if you never adopt the format

**Charge is vibe, not priority.** How alive something feels right now,
allowed to be irrational. It is not an importance score and nothing is
owed. This is the field that keeps the layer from decaying into a backlog,
which is what happens to every creative system that lets itself be ranked
by importance.

**Avoidance is signal.** A pairing that `/spark` proposes and you skip is
not discarded — it is written down, and its charge goes *up* each time you
dodge it again. The things you keep flinching from accumulate pressure
until the layer is nagging you, with receipts, about the work you are
afraid to make.

---

## Getting started

**From scratch.** Make the folders, start writing entities as you notice
them. Do not try to fill it — a Thread you declared on day one is a guess;
a Thread you noticed on day forty is a finding.

**From an existing practice.** Better. Point an agent at everything you
have already made and ask it to run the retroactive harvest described in
`rituals/inhale.md` across the whole corpus. In the reference instance
this produced 44 entities in one pass and was the moment the layer became
worth having.

**Install the rituals** as slash commands in Claude Code, Cowork, or
anything that reads markdown prompts:

```bash
mkdir -p .claude/commands && cp imagination/rituals/*.md .claude/commands/
```

Or paste a ritual file into a session by hand. Nothing here depends on a
particular agent.

**Check conformance** after any structural change:

```bash
python3 imagination/validate.py imagination/
```

---

## Status — read this before adopting

This is **v0.1, one practice, six months**. It is an RFC, not a settled
format.

Demonstrated: the retroactive harvest works, and the **Collide** strategy
produced a real piece within days.

Not demonstrated:

- **The aging rule has never fired.** No collision has yet been proposed,
  dodged, and re-proposed. The most distinctive idea in the format is
  currently theory.
- **Sustained cadence.** The rituals ran twice in the reference instance,
  not daily.
- **A second practice.** Everything was designed by one maker, in one
  medium. The claim that the six types are domain-general is untested.

`SPEC.md` §0 says the same thing in more detail. If you run this in a
non-visual practice — writing, research, music — that is the experiment
the format most needs, and the disagreement is more useful than the
adoption.

---

## The one rule worth remembering

Nothing here closes. Entities go **dormant** and **revive**; they are
never deleted. Themes are kept open on purpose. The shape of what you
abandoned is information too.
