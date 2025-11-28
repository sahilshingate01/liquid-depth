# Architecture

## Provider Hierarchy

```
ParallaxSettingsProvider        # Settings context (smoothing, sensitivity, etc.)
└── HeadTrackingProvider        # Head tracking + CSS variables
    └── AppContent              # Main app shell
        └── ParallaxContainer   # 3D perspective wrapper
            └── DesktopScene    # Scene with ParallaxItems
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  HeadTracker (MediaPipe Face Mesh)                          │
│  └─> Detects face position from camera                      │
└─────────────────────────────┬───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ CSS Variables    │   │ React Context    │   │ Window Delta     │
│ --head-x         │   │ position: {x,y}  │   │ (optional)       │
│ --head-y         │   │ isReady: bool    │   │                  │
└──────────────────┘   │ error: string    │   └──────────────────┘
        │              └──────────────────┘            │
        │                     │                        │
        └─────────────────────┼────────────────────────┘
                              │
                      Final Position
                      (head + window)
```

## CSS Variables vs Hooks

### Use CSS Variables (calc)

For components that only need position in CSS:

```tsx
// ParallaxCard uses calc() in box-shadow
boxShadow: `
  calc(var(--head-x) * 10px) 
  calc(var(--head-y) * 10px) 
  20px rgba(0,0,0,0.5)
`

// ParallaxItem uses calc() in transform
transform: `
  translate3d(
    calc(var(--head-x) * ${depth} * 50px),
    calc(var(--head-y) * ${depth} * 50px),
    0
  )
`
```

### Use useHeadPosition() Hook

For components that need JS access to position:

```tsx
const { x, y } = useHeadPosition();

// Canvas/Three.js rendering
useFrame(() => {
  mesh.rotation.y = x * 0.5;
  mesh.rotation.x = y * 0.5;
});
```

## Depth System

Depth values control parallax intensity and direction:

| Value | Effect | Use Case |
|-------|--------|----------|
| `-1.0` | Moves opposite to head, far background | Wallpaper, distant elements |
| `-0.5` | Subtle opposite movement | Mid-background decorations |
| `0` | No parallax | Static elements |
| `0.5` | Moves with head, mid-foreground | Cards, widgets |
| `1.0` | Strong forward movement | Notifications, tooltips |

### Layer Stacking

```
z-index 40: Notification chips (depth 0.45)
z-index 30: Main focus card (depth 0.3)
z-index 20: Widget cards (depth 0.1)
z-index 10: Floating decorations (depth -0.2)
z-index 0:  Background (depth -0.6)
```

## Settings Integration

Components access settings via `useParallaxSettings()`:

```tsx
const { settings } = useParallaxSettings();

// Available settings:
settings.smoothing          // 0-1, movement smoothing
settings.sensitivity        // 0.5-3, head movement multiplier
settings.movementRange      // px, max parallax distance
settings.rotationStrength   // deg, max rotation angle
settings.depthMultiplier    // multiplier for depth effects
settings.lightPosition      // 'top-left' | 'center' | etc.
settings.lightIntensity     // 0-1, shadow/highlight strength
settings.windowTracking     // boolean, track window position
settings.childEdges         // boolean, shadows on child elements
```
