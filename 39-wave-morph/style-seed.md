
  Color Scheme

  Dark theme with modern tech aesthetic:
  - Background Level 1 (main): #0F1016 - Very dark blue-gray
  - Background Level 2 (cards): #151621 - Slightly lighter dark blue
  - Accent 1: #002FFF - Bright blue
  - Accent 2: #B4E03C - Lime green
  - Text Primary: #F5F5F7 - Off-white
  - Text Secondary: #86868B - Medium gray

  Typography

  Dual font system:
  - Headers: 'Instrument Serif' (serif) - Elegant, editorial feel
  - Body: Monospace stack - SF Mono, Monaco, Inconsolata, Fira Code -
  Technical, code-like feel

  Layout Structure

  Three-layer system:

  1. Fixed Background Canvas (styles.css:28-34)
    - Full viewport canvas with pixelated rendering
    - Fixed positioning with inset: 0
  2. Fixed Center Overlay (styles.css:36-44)
    - Centered using translate(-50%, -50%)
    - Contains clock (64px serif) and body text (16px mono)
    - pointer-events: none for click-through
  3. Scrollable Cards (styles.css:60-82)
    - Starts at 90vh (pushes content below fold)
    - 800px max width, 90% on mobile
    - 16px gap between cards
    - 16px border radius
    - Shadow trick: box-shadow: 0 0 100px 100px var(--bg-level-2) creates
  seamless blend

  Card Design

  - Padding: 24px/48px (top/sides) on desktop, 16px/32px on mobile
  - Headers: 32px serif (24px mobile)
  - Body text: 14px mono, 1.6 line-height (12px mobile)

  Responsive Breakpoint

  768px - Reduces font sizes and padding for mobile devices

  This creates a sophisticated portfolio aesthetic with fixed animated
  background, centered hero content, and scrolling card-based content below.