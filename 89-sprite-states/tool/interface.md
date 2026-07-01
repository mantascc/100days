# create-sprite

## Purpose
Create a four-state pixel sprite sheet from a single character image.

The tool is for interface companions, status mascots, and tiny game characters where the important constraint is identity preservation: every frame should still feel like the source character.

## Input
- `seed.png`: one still image of the character
- `cell`: sprite cell size, default `128 x 128`
- `frames`: frames per state, default `4`
- `fps`: preview speed, default `6`
- states: `idle`, `working`, `attention_need`, `failed`

Good seeds are front-facing, simple, high-contrast, and already close to the desired pixel-art pose.

## Workflow
1. Copy the seed into a new sprite project.
2. Extract the character identity:
   - silhouette
   - palette
   - facial features
   - outline weight
   - shadow/highlight logic
3. Rebuild a neutral pixel sprite first.
4. Author the four state rows.
5. Export a transparent uniform-grid PNG.
6. Export a JSON atlas with named frames.
7. Preview the animation in canvas at final display scale.
8. Iterate when a state reads as the wrong behavior.

## State Rules
Each state should change only one or two readable features.

| state | behavior | animation cue |
|---|---|---|
| `idle` | sleepy/resting | flat dash eyes, quiet loop |
| `working` | calmly active | small body movement |
| `attention_need` | asking/curious | gentle bounce, optional `?` |
| `failed` | error/failure | `!` above head, slight disturbance |

Avoid overacting. These states are meant to sit inside an interface, so they should be legible but not noisy.

## Sprite Sheet Contract
Default sheet:

```text
cell: 128 x 128
cols: 4
rows: 4
sheet: 512 x 512
background: transparent
read order: left-to-right, top-to-bottom
```

Rows:

```text
0 idle
1 working
2 attention_need
3 failed
```

Frame names:

```text
idle_01 ... idle_04
working_01 ... working_04
attention_need_01 ... attention_need_04
failed_01 ... failed_04
```

## Output
- `seed.png`
- `sprite_brief.json`
- `generate_sprite.py`
- `sprite_sheet.png`
- `sprite_atlas.json`
- `demo.html`
- `README.md`

The scaffold creates the brief, README, generator placeholder, and preview. The character-specific generator should then be authored against the seed.

## Verification
Accept the sheet only when:

- PNG size is `cols * cellW` by `rows * cellH`
- every frame cell has transparent padding and visible opaque pixels
- the character scale and registration stay stable
- each row reads correctly without labels
- atlas rectangles match the grid exactly
- preview reloads and animates all four states

## Current Reference
The first reference implementation lives in:

```text
daily-sketch/cat-sprite/
```

It uses a deterministic Python generator and a canvas preview.

## Sample Sketch
This tool also includes a portable sample:

```text
create-sprite/sample-sketch/
```

Use it as the smallest complete example of the contract: generator, transparent PNG sheet, JSON atlas, and canvas preview.
