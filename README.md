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

## Settings

| Setting | Description |
|---------|-------------|
| Smoothing | Movement lag/delay (0-1) |
| Inertia | Spring bounce effect (0-1) |
| Sensitivity | Head movement multiplier (0.5-3.0) |
| Movement Range | Max parallax distance in px |
| Rotation Strength | 3D tilt angle (0-60°) |
| Depth Multiplier | Z-axis scaling |
| Attack | Response curve (<1 ease-in, >1 ease-out) |
| Light Position | Virtual light direction (9 positions) |
| Light Intensity | Shadow/highlight brightness (0-1) |
| Window Tracking | Browser window movement parallax |
| Child Edges | Depth shadows on nested elements |

## Technologies

- React 19
- TypeScript
- MediaPipe Face Mesh
- Tailwind CSS
- Vite

## Author

Built by [Sahil Shingate](https://github.com/sahilshingate01)

## License

MIT - see [LICENSE](LICENSE)

