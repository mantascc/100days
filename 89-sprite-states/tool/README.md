# create-sprite

Root-level tool for turning one character image into a four-state transparent sprite sheet.

```sh
python3 create-sprite/create_sprite.py path/to/seed.png path/to/output-folder
```

The command scaffolds a sprite project with:

- `seed.png`
- `sprite_brief.json`
- `generate_sprite.py`
- `demo.html`
- `README.md`

Then author `generate_sprite.py` from the seed image and export:

- `sprite_sheet.png`
- `sprite_atlas.json`

See `interface.md` for the workflow contract.

## Sample

A working example lives in `sample-sketch/`.

```sh
cd create-sprite/sample-sketch
python3 generate_sprite.py
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/demo.html`.
