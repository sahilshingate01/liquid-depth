# Liquid Depth

Real-time 3D parallax interface with head tracking and dynamic lighting.

https://github.com/user-attachments/assets/0cce6fe0-292d-40db-b3e0-3b9cbff0db4f


## Features

- **Head Tracking**: MediaPipe Face Mesh for precise head position detection
- **3D Parallax**: Multi-layered depth system with rotation and translation
- **Window Tracking**: Parallax follows browser window movement
- **Dynamic Lighting**: Configurable light sources with realistic shadows
- **Reusable Components**: ParallaxCard, ParallaxContainer, ParallaxItem
- **GPU Optimized**: Hardware acceleration with CSS containment
- **Customizable**: Live settings panel with tooltips

## Quick Start

```bash
npm install
npm run dev
```

Allow camera access when prompted.

## Architecture

```
ParallaxSettingsProvider     # Global settings context
└── HeadTrackingProvider     # Head position + CSS vars
    └── ParallaxContainer    # 3D perspective space
        └── ParallaxItem     # Depth layer wrapper
            └── ParallaxCard # Styled card with shadows
```

### Data Flow

1. **HeadTracker** detects face position via MediaPipe
2. Position written to CSS vars (`--head-x`, `--head-y`) and React context
3. Components consume via:
   - **CSS calc()**: For shadows, transforms (ParallaxCard, ParallaxItem)
   - **useHeadPosition()**: For JS access when needed

## Reusable Components

| Component | Purpose |
|-----------|---------|
| `ParallaxCard` | Card with dynamic shadows and specular highlights |
| `ParallaxContainer` | Sets up 3D perspective space |
| `ParallaxItem` | Positions children at a depth layer |

See [docs/COMPONENTS.md](docs/COMPONENTS.md) for full API.

