# Day 23: Interactive Typography

## Idea
"Hello World" text where each letter cycles through different fonts on hover and randomizes on click

## Description
This project creates playful interactive typography where individual letters of "Hello World" respond to user interaction. On desktop, hovering over any letter cycles it through a curated set of Google Fonts. On mobile, tapping anywhere randomizes all letters with 40% receiving a single dominant font and the remaining 60% getting random fonts. The large-scale typography (120px desktop, 64px mobile) and bright blue color (#0000FF) create bold visual presence against the muted grey-blue background.

The implementation treats each letter as an independent inline-block element with its own font-cycling state. Desktop interaction uses per-letter font indices that increment on mouseenter, while mobile uses Fisher-Yates shuffle to randomly distribute letters into dominant vs random font groups.

## Data Concepts
- **Primary**: Visual (typography, font variation, text styling)
- **Secondary**: Temporal (state cycling, interaction response)

## Conceptual Tags
#interactive-typography #font-variation #generative-design #playful-ui #google-fonts #per-letter-interaction #randomization

## Technical Tags
#google-fonts-api #css-transitions #mouseenter-events #responsive-typography #inline-block

## Stack
- HTML5
- Vanilla JavaScript
- Google Fonts (Roboto, Instrument Serif, Lato, Montserrat, Oswald)
- CSS transitions

## Mechanics
- **Letter Isolation**: Each character wrapped in span.letter with inline-block display for independent styling
- **Desktop Hover**: Each letter maintains fontIndex counter; mouseenter increments modulo 5, applies new font from array
- **Mobile Tap**: Click on body triggers full randomization - (1) Fisher-Yates shuffle letters array, (2) pick random dominant font, (3) apply dominant to first 40% of shuffled array, (4) apply random fonts to remaining 60%
- **Font Application**: Dynamic style.fontFamily updates with CSS font-family string format: `'FontName', sans-serif`
- **Transitions**: 0.3s ease transitions on font-family and font-size changes for smooth visual morphing
- **Space Handling**: Space character gets .space class with 0.3em width, excluded from font changes

## Parameters
- `fonts: 5` - Array of Google Font names (Roboto, Instrument Serif, Lato, Montserrat, Oswald)
- `fontSize: 120px` (desktop) / `64px` (mobile)
- `color: #0000FF` (bright blue)
- `background: #2A2D43` (grey-blue)
- `transition: 0.3s ease` - Font change animation duration
- `dominantRatio: 0.4` - Fraction of letters receiving dominant font on mobile tap

## Notes
- The 40/60 split on mobile creates visual coherence - not purely random but not overly uniform
- Font selection curated for diversity: Roboto (geometric sans), Instrument Serif (italic display), Lato (humanist sans), Montserrat (bold geometric), Oswald (condensed sans)
- Hover-to-cycle interaction encourages playful exploration - each letter independent agent with own state
- Mobile randomization addresses lack of hover - tap anywhere for instant variation
- Fisher-Yates shuffle ensures unbiased random letter selection for dominant font group
- The large font size (120px) makes typography central focus, not supporting element
- Bright blue (#0000FF) against muted background creates maximum visual pop
- user-select: none prevents text selection during interaction
- vertical-align: baseline maintains consistent letter alignment despite font changes
- Font preloading via Google Fonts API prevents FOUT (flash of unstyled text)
- The project demonstrates typography as interactive medium, not static communication
- Each hover creates micro-composition - user performs typographic design through interaction
- Mobile's dominant font approach mirrors typographic convention of limiting font count per design
- Transition duration (0.3s) balances snappiness with smoothness - fast enough to feel responsive, slow enough to see morphing
