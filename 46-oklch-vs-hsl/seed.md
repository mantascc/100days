# OKLCH vs HSL Gradient Comparison

## Concept
Side-by-side gradient comparison tool showing perceptual differences between HSL and OKLCH color spaces through static and animated states.

## Visual Structure
```
┌─────────────────────────────────────────┐
│ OKLCH vs HSL                 [randomize]│
├─────────────────────────────────────────┤
│                                          │
│  HSL                                     │
│  ████████████████████████████████████   │
│                                          │
│  OKLCH                                   │
│  ████████████████████████████████████   │
│                                          │
│              [play / pause]              │
│                                          │
└─────────────────────────────────────────┘
```

## Aesthetic
- **Background**: #0a0a0a (near black)
- **Text**: #f5f5f5 (off white)
- **UI elements**: 1px stroke, monospace typography
- **Gradients**: Full width bars, 80px height each
- **Spacing**: Generous vertical rhythm

## Behavior

### Randomize
- Generate two random endpoints in OKLCH space
- Convert to HSL for comparison
- Display both gradients with same logical endpoints
- Label each space above gradient

### Animation
- 3 second loop, ease-in-out
- Shift gradient endpoints smoothly
- HSL: uneven perceptual steps, brightness wobbles
- OKLCH: uniform perceptual transition
- Play/pause toggle

## Technical Notes
- Use `oklch()` CSS for direct browser support
- Convert OKLCH → RGB → HSL for HSL gradient
- Linear interpolation in both spaces
- 50-step granularity for smooth rendering

## Typography
- Monospace: Space Mono or system monospace
- Labels: 11px, uppercase, tracked
- Button: 13px, regular weight

## States
- Static: Show gradient at rest
- Animated: Continuous loop between randomized endpoints
- Preserve same color endpoints conceptually across both spaces