from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path


STATES = ["idle", "working", "attention_need", "failed"]


DEMO_HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sprite Sheet Preview</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      min-height: 100%;
      margin: 0;
      background: #11100f;
      color: #f6e7d7;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    body {
      display: grid;
      place-items: center;
      padding: 24px;
    }
    main {
      width: min(1040px, 100%);
      display: grid;
      gap: 18px;
    }
    .preview {
      display: grid;
      grid-template-columns: minmax(240px, 360px) 1fr;
      gap: 20px;
      align-items: center;
    }
    .stage {
      min-height: 360px;
      display: grid;
      place-items: center;
      background:
        linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%);
      background-size: 24px 24px;
      background-position: 0 0, 0 12px, 12px -12px, -12px 0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
    }
    canvas {
      width: 320px;
      height: 320px;
      image-rendering: pixelated;
    }
    .controls {
      display: grid;
      gap: 12px;
      align-content: center;
    }
    .state-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    button, input {
      min-height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.16);
      background: #1e1b18;
      color: inherit;
      border-radius: 6px;
      font: inherit;
    }
    button { cursor: pointer; }
    button[aria-pressed="true"] {
      border-color: #78cdbc;
      background: #26322f;
    }
    label {
      display: grid;
      gap: 6px;
      font-size: 12px;
      color: rgba(246, 231, 215, 0.72);
    }
    input { padding: 0 12px; }
    .sheet {
      max-width: 100%;
      image-rendering: pixelated;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      background:
        linear-gradient(45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255,255,255,0.04) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.04) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.04) 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0;
    }
    @media (max-width: 760px) {
      .preview { grid-template-columns: 1fr; }
      .stage { min-height: 300px; }
      canvas { width: 256px; height: 256px; }
    }
  </style>
</head>
<body>
  <main>
    <section class="preview">
      <div class="stage">
        <canvas id="sprite"></canvas>
      </div>
      <div class="controls">
        <div class="state-grid" id="states"></div>
        <label>
          FPS
          <input id="fps" type="number" min="1" max="24" value="6">
        </label>
      </div>
    </section>
    <img class="sheet" src="sprite_sheet.png" alt="Sprite sheet">
  </main>

  <script>
    const states = ["idle", "working", "attention_need", "failed"];
    const labels = {
      idle: "Idle",
      working: "Working",
      attention_need: "Attention",
      failed: "Failed"
    };
    const cell = 128;
    const canvas = document.getElementById("sprite");
    const ctx = canvas.getContext("2d");
    const fpsInput = document.getElementById("fps");
    const buttons = document.getElementById("states");
    const img = new Image();
    let state = "idle";
    let tick = 0;
    let last = 0;

    canvas.width = cell;
    canvas.height = cell;
    ctx.imageSmoothingEnabled = false;

    for (const key of states) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = labels[key];
      button.setAttribute("aria-pressed", key === state ? "true" : "false");
      button.addEventListener("click", () => {
        state = key;
        tick = 0;
        for (const node of buttons.children) {
          node.setAttribute("aria-pressed", node === button ? "true" : "false");
        }
      });
      buttons.append(button);
    }

    function draw(time) {
      const fps = Math.max(1, Math.min(24, Number(fpsInput.value) || 6));
      if (time - last > 1000 / fps) {
        tick += 1;
        last = time;
      }
      const row = states.indexOf(state);
      const col = tick % 4;
      ctx.clearRect(0, 0, cell, cell);
      ctx.drawImage(img, col * cell, row * cell, cell, cell, 0, 0, cell, cell);
      requestAnimationFrame(draw);
    }

    img.onload = () => requestAnimationFrame(draw);
    img.src = "sprite_sheet.png";
  </script>
</body>
</html>
"""


GENERATOR_PLACEHOLDER = """from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


OUT_DIR = Path(__file__).resolve().parent
CELL = 128
FRAMES_PER_STATE = 4
STATES = ["idle", "working", "attention_need", "failed"]


def make_frame(state: str, frame: int) -> Image.Image:
    # Replace this placeholder with character-specific pixel drawing.
    # Keep the source identity from seed.png: silhouette, palette, face, outline.
    return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))


def main() -> None:
    sheet = Image.new("RGBA", (CELL * FRAMES_PER_STATE, CELL * len(STATES)), (0, 0, 0, 0))
    atlas = {
        "meta": {
            "image": "sprite_sheet.png",
            "cell": {"w": CELL, "h": CELL},
            "cols": FRAMES_PER_STATE,
            "rows": len(STATES),
            "fps": 6,
            "states": STATES,
        },
        "frames": {},
        "animations": {},
    }

    for row, state in enumerate(STATES):
        atlas["animations"][state] = []
        for col in range(FRAMES_PER_STATE):
            frame = make_frame(state, col)
            x = col * CELL
            y = row * CELL
            sheet.alpha_composite(frame, (x, y))
            name = f"{state}_{col + 1:02d}"
            atlas["frames"][name] = {"frame": {"x": x, "y": y, "w": CELL, "h": CELL}}
            atlas["animations"][state].append(name)

    sheet.save(OUT_DIR / "sprite_sheet.png")
    (OUT_DIR / "sprite_atlas.json").write_text(json.dumps(atlas, indent=2) + "\\n", encoding="utf-8")


if __name__ == "__main__":
    main()
"""


def build_brief(seed: Path, cell: int, frames: int, fps: int) -> dict:
    return {
        "seed": "seed.png",
        "source": str(seed),
        "cell": {"w": cell, "h": cell},
        "frames_per_state": frames,
        "fps": fps,
        "states": STATES,
        "state_rules": {
            "idle": "sleepy/resting; flat dash eyes, quiet loop",
            "working": "calm activity; small body movement",
            "attention_need": "asking/curious; gentle bounce, optional question mark",
            "failed": "error/failure; exclamation mark and slight disturbance",
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Scaffold a four-state sprite sheet project from one seed image.")
    parser.add_argument("seed", type=Path, help="Path to source character image.")
    parser.add_argument("out", type=Path, help="Output project folder.")
    parser.add_argument("--cell", type=int, default=128, help="Cell width/height in pixels.")
    parser.add_argument("--frames", type=int, default=4, help="Frames per state.")
    parser.add_argument("--fps", type=int, default=6, help="Preview frames per second.")
    args = parser.parse_args()

    seed = args.seed.expanduser().resolve()
    out = args.out.expanduser().resolve()

    if not seed.exists():
        raise SystemExit(f"Seed image not found: {seed}")

    out.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(seed, out / "seed.png")

    generator = (
        GENERATOR_PLACEHOLDER
        .replace("CELL = 128", f"CELL = {args.cell}")
        .replace("FRAMES_PER_STATE = 4", f"FRAMES_PER_STATE = {args.frames}")
        .replace('"fps": 6', f'"fps": {args.fps}')
    )
    demo = (
        DEMO_HTML
        .replace('value="6"', f'value="{args.fps}"')
        .replace("const cell = 128;", f"const cell = {args.cell};")
        .replace("tick % 4", f"tick % {args.frames}")
    )

    (out / "sprite_brief.json").write_text(json.dumps(build_brief(seed, args.cell, args.frames, args.fps), indent=2) + "\n", encoding="utf-8")
    (out / "generate_sprite.py").write_text(generator, encoding="utf-8")
    (out / "demo.html").write_text(demo, encoding="utf-8")
    (out / "README.md").write_text(
        "# Sprite Project\n\n"
        "1. Inspect `seed.png` and capture silhouette, palette, face, and outline rules.\n"
        "2. Replace the placeholder drawing in `generate_sprite.py`.\n"
        "3. Run `python3 generate_sprite.py`.\n"
        "4. Preview `demo.html` with a local static server.\n",
        encoding="utf-8",
    )

    print(f"Created sprite project: {out}")


if __name__ == "__main__":
    main()
