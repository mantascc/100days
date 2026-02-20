# Day 31: CLI Material Palette

## Idea
Comprehensive design reference documenting the fundamental visual and interactive materials of command-line interfaces

## Description
This project catalogs the design language of CLI (command-line interface) applications, organizing materials into six categories: Spatial, Temporal, Typography, Colors, Symbols, and Interactive. Each section documents standard patterns with live examples that can be executed in terminal or browser. The reference includes ANSI color codes, Unicode symbols, progress animations, tree structures, and interactive patterns. Examples provide both bash commands for terminal execution and browser demonstrations for instant visualization.

The implementation serves as both educational resource and practical reference for CLI tool designers. It documents conventions like 80-120 character width, monospace grid alignment, ANSI 16-color palette, braille spinners, box-drawing characters, and standard interaction patterns (menus, checkboxes, confirmations, tabs). The project bridges theoretical documentation with executable examples, making CLI design principles immediately tangible.

## Data Concepts
- **Primary**: Visual (typography, color systems, symbol vocabularies, spatial layout)
- **Secondary**: Temporal (animation patterns, progress indicators), Interactive (UI patterns, state feedback)

## Conceptual Tags
#cli-design #terminal-ui #design-system #ansi-codes #unicode-symbols #interaction-patterns #documentation #design-reference #typography #spatial-design

## Technical Tags
#bash-commands #ansi-escape-codes #unicode #monospace-grid #interactive-examples #design-catalog

## Stack
- HTML5
- Vanilla JavaScript
- External app.js for interactive examples
- Bash command generation
- ANSI escape sequences

## Mechanics
- **Spatial Materials**: Character grid (80-120 cols), whitespace hierarchy, tree structures using box-drawing characters (├─└│)
- **Typography**: ANSI modifiers - bold (\033[1m), dim (\033[2m), underline (\033[4m), inverse (\033[7m), strikethrough (\033[9m)
- **Colors**: ANSI 16-color palette (8 base + 8 bright), codes 30-37 and 90-97, semantic mapping (red=errors, green=success, yellow=warnings, blue=info)
- **Symbols**: Status (✓✗⚠ℹ), tree (├└│─), arrows (→←↑↓⇒⇐), progress (⠋⠙⠹⠸), checkboxes (■□☐☑☒), spinners (braille patterns)
- **Temporal**: Progress indicators using character animation frames, braille spinners (⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏), block progress (▏▎▍▌▋▊▉█), rotating symbols (◐◓◑◒)
- **Interactive**: Menu selection, checkbox/radio groups, confirmation dialogs, tab navigation - all with keyboard controls

## Parameters
- Standard grid width: 80-120 characters
- ANSI color codes: 30-37 (normal), 90-97 (bright)
- Common spinner speeds: 8-12 frames
- Progress bar resolution: 8 steps (eighth blocks)
- Box-drawing: ├─└│ for tree structures
- Status symbols: ✓ (success), ✗ (error), ⚠ (warning), ℹ (info)

## Notes
- The project documents CLI as a design medium with constrained materials requiring creative solutions
- Monospace grid constraint forces alignment-based layout vs free positioning
- ANSI 16-color limitation creates shared vocabulary across terminal themes
- Unicode box-drawing characters (U+2500 block) enable sophisticated tree/table structures
- Braille patterns (U+2800 block) provide high-density spinner animations
- The reference distinguishes terminal-executable vs browser-only examples
- Bash command copying enables immediate experimentation in real terminal
- The project serves CLI tool developers similar to how design systems serve web developers
- Historical context: CLI design predates GUI, developed on teletypes and VT100 terminals
- Semantic color conventions (red=danger, green=success) transcend specific themes
- The material palette concept treats characters, colors, and symbols as design primitives
- Interactive patterns section codifies common CLI UX conventions (arrow keys for navigation, space for selection)
- The reference bridges documentation and tool - both reference and executable examples
- Compiled attribution suggests personal design resource, not just academic documentation
