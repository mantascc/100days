import os

def create_cat_variations(filepath):
    # Left half of the symmetric face, 16 characters wide per line
    # Total grid will be 16x32
    
    # 0: bg, 1: border, 2: fill, 3: face
    # We will build base frames and mirror them.
    
    # Base eyes closed (sleepy)
    base_left = [
        "  11            ", # 0
        " 1221           ", # 1
        " 12221          ", # 2
        " 122221111111111", # 3
        " 122222222222222", # 4
        " 122222222222222", # 5
        " 122222333222222", # 6  (eye)
        " 122223323322222", # 7  (eye)
        " 122222222222222", # 8
        " 122222222223333", # 9  (nose)
        " 122222222223333", # 10 (nose)
        " 122222223322233", # 11 (mouth)
        " 122222222332222", # 12 (mouth)
        " 122222222233333", # 13 (mouth/chin)
        "  12222222222222", # 14
        "   1111111111111"  # 15
    ]

    # Eyes open
    open_left = base_left.copy()
    open_left[6] = " 122223333322222"
    open_left[7] = " 122223323322222"

    # Happy / kawaii eyes
    kawaii_left = base_left.copy()
    kawaii_left[6] = " 122223323322222"
    kawaii_left[7] = " 122222333222222"

    # Non-symmetric logic
    def mirror(left_half):
        return [L + L[::-1] for L in left_half]
        
    def render(grid, bg, border, fill, face):
        res = []
        for row in grid:
            s = ""
            for char in row:
                if char == ' ' or char == '0': s += bg
                elif char == '1': s += border
                elif char == '2': s += fill
                elif char == '3': s += face
            res.append(s)
        return res

    frames = [
        mirror(base_left),
        mirror(open_left),
        mirror(kawaii_left),
    ]

    # Palettes (bg, border, fill, face)
    palettes = [
        (' ', 'O', '.', '#'),
        (' ', '█', '░', '▓'),
        (' ', '*', ' ', '@'),
        ('.', '+', ' ', 'O'),
        (' ', '#', '-', '*'),
        (' ', '/', '\\', 'O'),
        (' ', '!', '.', '?'),
        ('░', '█', '▒', ' '),
        (' ', 'X', 'x', 'o'),
        (' ', '@', '~', '+'),
        (' ', ':', '·', 'O'),
        (' ', '|', '-', '+'),
    ]

    with open(filepath, 'w') as f:
        f.write("# 16x32 Cat Face ASCII Options\n\n")
        f.write("A collection of 20 variations of a cat face closely modeled on the reference image.\n\n")
        
        count = 1
        for i in range(20):
            frame = frames[i % len(frames)]
            
            # Winking variation for the 4th frame (every 4th option)
            if i % 4 == 3:
                # Left eye kawai, right eye open
                left = kawaii_left
                right = [L[::-1] for L in open_left]
                frame = [L + R for L, R in zip(left, right)]

            pal = palettes[i % len(palettes)]
            
            f.write(f"## Option {count}\n")
            f.write(f"**Style:** `Border: {pal[1]} | Fill: {pal[2]} | Face: {pal[3]} | BG: '{pal[0]}'`\n\n")
            f.write("```text\n")
            
            rendered = render(frame, pal[0], pal[1], pal[2], pal[3])
            for row in rendered:
                f.write(row + "\n")
            f.write("```\n\n")
            count += 1

if __name__ == '__main__':
    create_cat_variations('cat_options.md')
