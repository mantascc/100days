---
description: Create a new daily-sketch in daily-sketch/
argument-hint: [sketch-name]
allowed-tools: Bash, Write, Read, Glob
---

Create a new daily-sketch for this 100-days creative coding project.

## Arguments

Sketch name (kebab-case): $ARGUMENTS

## Instructions

1. Derive the folder name: `sketch-$ARGUMENTS` (if not already prefixed with `sketch-`, prepend it).
2. Create the directory `daily-sketch/sketch-$ARGUMENTS/` relative to the project root `/Users/mantas/Documents/hello world/100days/`.
3. Create `interface.md` inside it with the stub below.
4. Create `index.html` inside it using the starter template below.
5. Print a short confirmation with the path and next steps.

Do NOT create any other files. Do NOT add the sketch to projects.json or index.html yet — that happens when it graduates to a numbered day.

---

## interface.md stub

```
# sketch-$ARGUMENTS

## idea
<!-- one-line description -->

## tags
<!-- e.g. typography, generative, interactive -->

## stack
vanilla · IBM Plex Mono · canvas/CSS

## motion
<!-- describe any animation intent -->
```

---

## index.html starter template

Self-contained single file. IBM Plex Mono from Google Fonts. Computational-minimalism color system. No external dependencies beyond the font.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>sketch-$ARGUMENTS</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&display=swap">
  <style>
    :root {
      --ground-void: #0a0a0a;
      --ground-base: #0f0f0f;
      --ground-raised: #141414;
      --ground-surface: #1a1a1a;
      --text-primary: #ffffff;
      --text-default: #f5f5f7;
      --text-secondary: #a8aab8;
      --text-tertiary: #666666;
      --text-ghost: #333333;
      --border-subtle: #1a1a1a;
      --border-default: #2a2a2a;
      --accent: #00a8ff;
      --font-mono: 'IBM Plex Mono', monospace;
      --space-4: 4px;
      --space-8: 8px;
      --space-16: 16px;
      --space-24: 24px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { height: 100%; background: var(--ground-void); color: var(--text-default); font-family: var(--font-mono); overflow: hidden; }

    header {
      position: fixed;
      top: 24px;
      left: 24px;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-secondary);
      z-index: 10;
      pointer-events: none;
    }

    main {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>

<header>sketch-$ARGUMENTS</header>

<main>
  <!-- sketch goes here -->
</main>

<script>
  // sketch logic
</script>

</body>
</html>
```

Write the actual files with the exact content shown above (replace `$ARGUMENTS` with the actual sketch name the user provided). Do not include the markdown fences in the written files.
