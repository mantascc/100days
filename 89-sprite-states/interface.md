# 89-sprite-states

## idea
Documentation page for the `create-sprite` four-state atlas — a clear-channel style spec sheet for the `idle / working / attention / error` character sprite emitted by the root-level `create-sprite/` tool. Reads like a datasheet: overview, atlas map, live playback at 80×80, per-state timing, and the raw sheet.

## states
| row | id | meaning | signal |
|---|---|---|---|
| 0 | `idle` | agent is waiting for input | slow blink, calm posture |
| 1 | `working` | agent is executing a task | eye squint, subtle bounce |
| 2 | `attention_need` | agent needs a decision | orange `?` above head |
| 3 | `failed` | agent hit an error | red `!` above head |

## atlas
- 4 rows × 4 columns · 128 × 128 cells · transparent PNG
- default fps 6 · looped
- source: `tool/sample-sketch/` (packed with the sketch)

## layout
```
89-sprite-states/
  index.html          docs page
  interface.md        this file
  sprite_sheet.png    atlas used by the docs page
  sprite_atlas.json   frame rects + animations
  tool/               packed create-sprite tool
    README.md
    interface.md      tool workflow contract
    create_sprite.py  scaffold command
    sample-sketch/    working example
      README.md
      generate_sprite.py
      demo.html
      sprite_sheet.png
      sprite_atlas.json
```

To regenerate the sample from scratch:
```sh
cd tool/sample-sketch
python3 generate_sprite.py
```

## demo
Playback canvas renders each state at **80 × 80** with `image-rendering: pixelated` and `imageSmoothingEnabled = false` — nearest-neighbor downsample from the native 128 cell. State selector switches rows; frame slider scrubs manually; fps input drives the loop.

## responsive
Desktop: two-column layout — playback on the left, state selector + metadata on the right. Below 720px the playback stacks above the controls; the atlas map reflows from 4-column to 2-column. Frame chips wrap on narrow widths.

## stack
vanilla · JetBrains Mono · canvas · CSS grid
