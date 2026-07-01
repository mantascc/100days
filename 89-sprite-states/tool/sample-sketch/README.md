# Sample Sketch

Working sample for `create-sprite`, based on the yellow pixel cat.

Files:

- `sprite_sheet.png`: transparent 4 x 4 sprite sheet
- `sprite_atlas.json`: named frame rectangles
- `generate_sprite.py`: deterministic character-specific generator
- `demo.html`: canvas preview

Grid:

```text
cell: 128 x 128
cols: 4
rows:
  0 idle
  1 working
  2 attention_need
  3 failed
```

To regenerate:

```sh
python3 generate_sprite.py
```

To preview from this folder:

```sh
python3 -m http.server 8766
```

Then open `http://127.0.0.1:8766/demo.html`.
