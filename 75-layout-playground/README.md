# 75 · Layout Playground

A sandbox for layout-system exploration.

This is a low-fidelity, structural prototype — a place to test how an interface's regions nest, collapse, expand, and divide space. Text is abstracted to wireframe rectangles so attention stays on structure, hierarchy, and behavior rather than visual design or copy.

The working interface is **Mintis**: a macOS-style shell with a floating sidebar, a centered canvas, and a right-hand tool window.

## Files

- [index.html](index.html) — the playground
- [system.md](system.md) — design tokens and principles
- [interface.md](interface.md) — component-level documentation

## Run

```
python3 -m http.server 3333
```

Then open http://localhost:3333.
