# Cat Sprite Sheet

Generated from the yellow pixel-cat seed.

- `cat_sprite_sheet.png`: transparent 4 x 4 sprite sheet
- `cat_sprite_atlas.json`: named frame rects and animation rows
- `demo.html`: canvas preview with state buttons and FPS control
- `generate_cat_sprite.py`: deterministic source generator

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

The animation read-head moves left to right across each row.
