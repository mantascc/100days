# Day 59: Font Explorer

> "A type specimen as an interactive object."

A full-page JetBrains Mono specimen with eight thematic sections, three switchable color themes, and live CSS animations. Built as a reusable skill for generating font specimen pages.

[Live Demo](index.html)

---

## Concept

Type specimens typically print a font's range — weights, sizes, glyphs — as a static document. This one treats each property as something to experience: tracking animates, weights stack side by side, glyphs render as a browsable grid. Three themes (minimal, yellow, blue) reframe the same content in radically different registers.

## Sections

| Section | What it shows |
|---------|---------------|
| **specimen** | Large display text — the opening statement |
| **weights** | Light / Regular / Medium side by side |
| **scale** | Type scale from caption to display |
| **mono** | Monospace utility — code and aligned columns |
| **tracking** | Letter-spacing range animated live |
| **glyphs** | Character grid — punctuation, symbols, numerals |
| **compose** | Multi-line typeset sample |
| **animate** | CSS keyframe animations on type |

Navigation via a side dot-nav; active section tracked with `IntersectionObserver`.

## Themes

| Theme | Register |
|-------|----------|
| **minimal** | Black ground, white text, blue accent |
| **yellow** | Yellow ground, black text |
| **blue** | Pure blue ground, white text |

## Tech Stack

- Vanilla HTML + CSS + JavaScript
- JetBrains Mono (Google Fonts)
- CSS custom properties for full theme switching
- `IntersectionObserver` for section tracking
- CSS keyframe animations (no JS animation loop)

## Skill

The project embeds a `font-specimen` skill template (`#skill-content`) for generating new specimen pages with different typefaces.

*Part of the 100 Days of Creative Coding challenge.*
