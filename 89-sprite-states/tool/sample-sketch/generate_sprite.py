from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw


OUT_DIR = Path(__file__).resolve().parent
CELL = 128
SCALE = 2
LOW = CELL // SCALE
FRAMES_PER_STATE = 4
NEAREST = getattr(getattr(Image, "Resampling", Image), "NEAREST")

COLORS = {
    "outline": (12, 13, 13, 255),
    "yellow": (255, 198, 13, 255),
    "yellow_light": (255, 232, 50, 255),
    "yellow_mid": (246, 176, 0, 255),
    "orange": (229, 132, 0, 255),
    "orange_dark": (199, 103, 0, 255),
    "warning": (255, 50, 54, 255),
}


def rect(draw: ImageDraw.ImageDraw, xy: tuple[int, int, int, int], fill: tuple[int, int, int, int]) -> None:
    draw.rectangle(xy, fill=fill)


def poly(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], fill: tuple[int, int, int, int]) -> None:
    draw.polygon(points, fill=fill)


def step_line(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], width: int = 2, fill=None) -> None:
    draw.line(points, fill=fill or COLORS["outline"], width=width, joint="curve")


def shifted(points: list[tuple[int, int]], dx: int, dy: int) -> list[tuple[int, int]]:
    return [(x + dx, y + dy) for x, y in points]


def draw_cat_base(draw: ImageDraw.ImageDraw, dx: int = 0, dy: int = 0, turn: int = 0) -> None:
    outer = [
        (9, 56),
        (9, 25),
        (11, 25),
        (11, 11),
        (13, 11),
        (13, 8),
        (19, 8),
        (19, 11),
        (22, 11),
        (22, 14),
        (25, 14),
        (25, 17),
        (28, 17),
        (28, 19),
        (36, 19),
        (36, 17),
        (39, 17),
        (39, 14),
        (42, 14),
        (42, 11),
        (45, 11),
        (45, 8),
        (51, 8),
        (51, 11),
        (53, 11),
        (53, 25),
        (55, 25),
        (55, 56),
        (52, 59),
        (12, 59),
    ]
    inner = [
        (12, 54),
        (12, 27),
        (14, 27),
        (14, 13),
        (16, 13),
        (16, 11),
        (18, 11),
        (18, 13),
        (21, 13),
        (21, 16),
        (24, 16),
        (24, 19),
        (27, 19),
        (27, 21),
        (37, 21),
        (37, 19),
        (40, 19),
        (40, 16),
        (43, 16),
        (43, 13),
        (46, 13),
        (46, 11),
        (48, 11),
        (48, 13),
        (50, 13),
        (50, 27),
        (52, 27),
        (52, 54),
        (49, 56),
        (15, 56),
    ]
    poly(draw, shifted(outer, dx, dy), COLORS["outline"])
    poly(draw, shifted(inner, dx, dy), COLORS["yellow"])

    # Orange side planes and bottom lip from the seed.
    left_shadow = [(12, 27), (14, 27), (14, 50), (16, 50), (16, 54), (19, 54), (19, 56), (15, 56), (12, 54)]
    right_shadow = [(50, 27), (52, 27), (52, 54), (49, 56), (45, 56), (45, 54), (48, 54), (48, 50), (50, 50)]
    bottom_shadow = [(15, 56), (49, 56), (47, 58), (17, 58)]
    poly(draw, shifted(left_shadow, dx + max(0, -turn), dy), COLORS["yellow_mid"])
    poly(draw, shifted(right_shadow, dx - max(0, turn), dy), COLORS["yellow_mid"])
    poly(draw, shifted(bottom_shadow, dx, dy), COLORS["orange"])
    rect(draw, (14 + dx, 29 + dy, 15 + dx, 37 + dy), COLORS["orange"])
    rect(draw, (49 + dx, 29 + dy, 50 + dx, 37 + dy), COLORS["orange"])
    rect(draw, (17 + dx, 54 + dy, 47 + dx, 55 + dy), COLORS["yellow_light"])

    # Ear highlights.
    left_ear = [(16, 12), (18, 13), (21, 16), (24, 19), (25, 21), (20, 21), (18, 18), (16, 17)]
    right_ear = [(48, 12), (46, 13), (43, 16), (40, 19), (39, 21), (44, 21), (46, 18), (48, 17)]
    poly(draw, shifted(left_ear, dx, dy), COLORS["yellow_light"])
    poly(draw, shifted(right_ear, dx, dy), COLORS["yellow_light"])


def draw_eye_curve(draw: ImageDraw.ImageDraw, x: int, y: int, flatness: int, dx: int, dy: int) -> None:
    if flatness == 2:
        rect(draw, (x + 1 + dx, y + 4 + dy, x + 12 + dx, y + 5 + dy), COLORS["outline"])
    elif flatness == 1:
        pts = [(x + 1, y + 2), (x + 1, y + 5), (x + 3, y + 7), (x + 10, y + 7), (x + 12, y + 5), (x + 12, y + 3)]
        step_line(draw, shifted(pts, dx, dy), 2)
    else:
        pts = [(x + 1, y), (x + 1, y + 4), (x + 3, y + 7), (x + 5, y + 9), (x + 10, y + 9), (x + 12, y + 7), (x + 12, y + 5), (x + 12, y + 2)]
        step_line(draw, shifted(pts, dx, dy), 2)


def draw_face(draw: ImageDraw.ImageDraw, state: str, frame: int, dx: int = 0, dy: int = 0, turn: int = 0) -> None:
    face_dx = dx + turn
    if state == "idle":
        flatness = 2
    else:
        flatness = 0

    if state == "failed":
        draw_eye_curve(draw, 15, 29, 2, face_dx, dy)
        draw_eye_curve(draw, 37, 29, 2, face_dx, dy)
    else:
        draw_eye_curve(draw, 15, 28, flatness, face_dx, dy)
        draw_eye_curve(draw, 37, 28, flatness, face_dx, dy)

    # Big trapezoid-to-point nose, close to the seed silhouette.
    nose = [(27, 38), (37, 38), (37, 41), (35, 41), (35, 44), (33, 44), (33, 49), (31, 49), (31, 44), (29, 44), (29, 41), (27, 41)]
    poly(draw, shifted(nose, face_dx, dy), COLORS["outline"])

    if state == "failed":
        left_mouth = [(31, 49), (28, 49), (28, 51), (22, 51), (22, 49), (19, 49), (19, 47), (17, 47), (17, 45)]
        right_mouth = [(33, 49), (36, 49), (36, 51), (42, 51), (42, 49), (45, 49), (45, 47), (47, 47), (47, 45)]
    else:
        left_mouth = [(31, 49), (28, 49), (28, 51), (22, 51), (22, 49), (19, 49), (19, 47), (17, 47), (17, 45)]
        right_mouth = [(33, 49), (36, 49), (36, 51), (42, 51), (42, 49), (45, 49), (45, 47), (47, 47), (47, 45)]
    step_line(draw, shifted(left_mouth, face_dx, dy), 2)
    step_line(draw, shifted(right_mouth, face_dx, dy), 2)

    cheek_shift = 1 if state == "attention_need" and abs(turn) > 1 else 0
    cheek_points = [(15, 40), (20, 40), (17, 45), (43, 40), (48, 40), (46, 45)]
    for index, (x, y) in enumerate(cheek_points):
        side = -1 if index < 3 else 1
        rect(draw, (x + face_dx + side * cheek_shift, y + dy, x + face_dx + side * cheek_shift + 1, y + dy + 1), COLORS["outline"])


def draw_failed_mark(draw: ImageDraw.ImageDraw, frame: int) -> None:
    color = COLORS["warning"] if frame in (1, 2) else COLORS["outline"]
    rect(draw, (31, 2, 34, 10), color)
    rect(draw, (31, 13, 34, 16), color)


def draw_attention_mark(draw: ImageDraw.ImageDraw, frame: int) -> None:
    y = [2, 1, 0, 1][frame]
    color = COLORS["yellow_light"]
    rect(draw, (30, y, 35, y + 1), color)
    rect(draw, (35, y + 2, 37, y + 4), color)
    rect(draw, (33, y + 5, 35, y + 6), color)
    rect(draw, (31, y + 7, 33, y + 8), color)
    rect(draw, (31, y + 11, 33, y + 12), color)


def make_frame(state: str, frame: int) -> Image.Image:
    img = Image.new("RGBA", (LOW, LOW), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    if state == "working":
        dx, dy = [(0, 0), (1, -1), (0, 1), (-1, 0)][frame]
        turn = 0
    elif state == "attention_need":
        dx, dy = [(0, 0), (0, -1), (0, -2), (0, -1)][frame]
        turn = 0
        draw_attention_mark(draw, frame)
    elif state == "failed":
        dx, dy = [(0, 0), (1, 0), (-1, 0), (0, 1)][frame]
        turn = 0
        draw_failed_mark(draw, frame)
    else:
        dx, dy = [(0, 0), (0, 0), (0, 0), (0, 0)][frame]
        turn = 0

    draw_cat_base(draw, dx=dx, dy=dy, turn=turn)
    draw_face(draw, state, frame, dx=dx, dy=dy, turn=turn)
    return img.resize((CELL, CELL), NEAREST)


def main() -> None:
    states = ["idle", "working", "attention_need", "failed"]
    sheet = Image.new("RGBA", (CELL * FRAMES_PER_STATE, CELL * len(states)), (0, 0, 0, 0))
    atlas = {
        "meta": {
            "image": "sprite_sheet.png",
            "cell": {"w": CELL, "h": CELL},
            "cols": FRAMES_PER_STATE,
            "rows": len(states),
            "fps": 6,
            "states": states,
        },
        "frames": {},
        "animations": {},
    }

    for row, state in enumerate(states):
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
    (OUT_DIR / "sprite_atlas.json").write_text(json.dumps(atlas, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
