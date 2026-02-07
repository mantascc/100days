# Emerging Component Style: "Data-First Industrial"
Based on the analysis of `Button`, `MultiMetricScoreCard`, `MetricGrid`, and `tokens.css`, the following style definition has emerged.
## 1. Core Philosophy
**"Precision & Clarity"**
The interface prioritizes data legibility and structural clarity over decoration. It uses a high-contrast, rigid grid system with a distinct "Lime Green" accent to signal primary actions.
## 2. Color Palette
### Neutrals (Structural)
- **Background:** White (`#fff`)
- **Borders:** Gray-200 (`#e5e7eb`) for containers, Lighter (`#f0f0f0`) for internal dividers.
- **Text:**
  - **Primary:** Black (`#000`) - Used for values and primary data.
  - **Secondary:** Gray-500 (`#666`) - Used for labels and meta-info.
### Accents (Action & Brand)
- **Primary Action:** Lime Green (`#B4E03C`)
  - **Hover:** `#A0CC35`
  - **Active:** `#8CB82E`
  - *Note: This specific lime green is currently hardcoded in Button.module.css and not yet in tokens.css.*
### Data Visualization
- **Palette:** Blue, Green, Orange, Purple (derived from tokens).
## 3. Typography
**Font Family:** `Inter` (sans-serif)
### Type Scale & Hierarchy
| Role | Size | Weight | Color | Example |
|------|------|--------|-------|---------|
| **Metric Value** | 24px | Bold (700) | Black | `1,234` |
| **Button Text** | 14px | Semibold (600) | Black | `Submit` |
| **Label/Header** | 12px | Medium (500) | Gray-500 | `Total Revenue` |
| **Meta/Legend** | 11px | Regular/Medium | Gray-500 | `vs last week` |
*Feature:* `font-variant-numeric: tabular-nums` is used on data values for alignment.
## 4. Spacing & Layout
**Grid System:** 4px baseline grid.
- **Padding:** 12px, 16px, 24px common.
- **Gaps:** 4px (tight), 12px (standard), 16px (section).
## 5. Component Patterns
### Cards (`MultiMetricScoreCard`)
- **Container:** White bg, 1px border (Gray-200), Radius-8.
- **Internal Structure:**
  - Header (Label)
  - Body (Big Value)
  - Footer/Extension (Chart + Legend)
- **Dividers:** Subtle top borders for legends/footers.
### Buttons (`Button`)
- **Shape:** Radius-8, Padding 12px 24px.
- **Primary:** Lime Green bg, Black text, No shadow (Flat).
- **Secondary:** White bg, Border-only.
- **Interaction:** `transform: all 0.2s ease`.
## 6. Missing/Inconsistent Elements (To Refine)
- **Lime Green Token:** The primary action color `#B4E03C` is not in `tokens.css`.
- **Shadows:** Minimal to no usage of shadows observed; style relies on borders.