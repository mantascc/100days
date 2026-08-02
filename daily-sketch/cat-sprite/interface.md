# Cat Sprite Sheet Workflow

## Idea
Turn one still character image into a usable game sprite sheet: preserve the source character's silhouette, palette, face grammar, and emotional tone, then author four subtle animation states in a uniform transparent PNG grid.

The source image is treated as the character bible, not just visual inspiration. The goal is for every frame to still feel like the same cat when viewed at game scale.

## Input
- One seed image of the character, ideally front-facing and already close to pixel-art proportions
- Four required states: `idle`, `working`, `attention_need`, `failed`
- A target cell size, here `128 x 128`
- A fixed frame count per state, here `4`

## Extraction
Read the image for stable identity traits before drawing frames:

| trait | keep |
|---|---|
| silhouette | square cat head, tall ears, flat-ish top valley, wide lower body |
| palette | saturated yellow fill, orange side/bottom shadows, near-black outline |
| face | closed stepped eyes, large central black nose, W-shaped mouth, cheek pixels |
| render style | chunky pixels, hard edges, no antialiasing, transparent background |

The first pass should reproduce the neutral character as a static sprite before any animation is designed.

## State Design
Each state changes only one or two readable things. The cat should not become a new character between rows.

| state | behavior | visual rule |
|---|---|---|
| `idle` | sleepy | eyes stay as flat dash marks: `- -` |
| `working` | active but calm | whole body shifts subtly around the cell |
| `attention_need` | curious / asking | gentle bounce plus a small yellow `?` above the head |
| `failed` | error | sleepy/error face plus a `!` above the head |

Avoid dramatic acting. These are status loops for an interface character, so the animations should be glanceable and quiet.

## Sprite Sheet
Use an implicit grid for the primary asset:

```text
sheet: 512 x 512 PNG
cell: 128 x 128
cols: 4
rows: 4
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

Columns are animation frames `01` through `04`.

## Atlas
Generate a sidecar JSON atlas even when the grid is uniform. It makes the asset easier to use in engines that expect named frames, while the PNG still works with simple CSS or canvas stepping.

```json
{
  "meta": {
    "image": "cat_sprite_sheet.png",
    "cell": { "w": 128, "h": 128 },
    "cols": 4,
    "rows": 4,
    "fps": 6,
    "states": ["idle", "working", "attention_need", "failed"]
  },
  "animations": {
    "idle": ["idle_01", "idle_02", "idle_03", "idle_04"]
  }
}
```

## Preview Loop
The preview is part of the interface, not a bonus. It should show:

- the animated current state on a checkerboard transparency stage
- buttons for the four states
- an FPS control
- the full sprite sheet below the live preview

Review each state at the final display scale. If an animation reads as the wrong emotion, change the motion first, not the label.

## Implementation
This folder uses a deterministic Python generator:

```text
generate_cat_sprite.py -> cat_sprite_sheet.png + cat_sprite_atlas.json
demo.html -> canvas preview
```

Drawing is done at low resolution, then scaled with nearest-neighbor sampling. This keeps every edge pixel-crisp and prevents accidental blur.

## Verification
Before accepting the sheet:

- PNG dimensions match `cols * cellW` by `rows * cellH`
- every cell has transparent padding and visible opaque pixels
- all frames share the same registration and scale
- state rows read correctly without explanation
- browser preview loads the new sheet after regeneration

## Product Direction
This workflow is for small agent/status companions in tools: a character that can quietly signal rest, work, attention, and failure without becoming noisy UI chrome.
