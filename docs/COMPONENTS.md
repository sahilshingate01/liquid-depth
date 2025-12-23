# Components

## ParallaxCard

A card component with dynamic shadows and specular highlights that respond to head movement.

### Props

```typescript
interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  depthScale?: number;  // default: 1.0
}
```

### Usage

```tsx
import { ParallaxCard } from './components/ParallaxCard';

<ParallaxCard depthScale={1.5}>
  <h2>Widget Title</h2>
  <p>Content goes here</p>
</ParallaxCard>

// With custom styles
<ParallaxCard className="!p-4 h-[300px]" depthScale={2.0}>
  <div>Full height card</div>
</ParallaxCard>
```

### Notes

- Reads settings internally via `useParallaxSettings()`
- Uses CSS variables for shadow calculations
- Includes specular highlight and noise texture overlays

---

## ParallaxContainer

A wrapper that sets up the 3D perspective space.

### Props

```typescript
interface ParallaxContainerProps {
  children: React.ReactNode;
  perspective?: number;   // default: 1200
  className?: string;
}
```

### Usage

```tsx
import { ParallaxContainer } from './components/ParallaxContainer';

<ParallaxContainer perspective={1000}>
  <ParallaxItem depth={0.3}>
    <div>3D content</div>
  </ParallaxItem>
</ParallaxContainer>
```

---

## ParallaxItem

Positions children at a specific depth layer with parallax movement.

### Props

```typescript
interface ParallaxItemProps {
  children: React.ReactNode;
  depth: number;          // -1 to 1
  className?: string;
  rotate?: boolean;       // default: false
}
```

### Depth Values

| Value | Behavior |
|-------|----------|
| Negative | Background layer, moves opposite to head |
| `0` | No parallax effect |
| Positive | Foreground layer, moves with head |

### Usage

```tsx
import { ParallaxItem } from './components/ParallaxItem';

// Background
<ParallaxItem depth={-0.6} className="z-0">
  <BackgroundPattern />
</ParallaxItem>

// Foreground with rotation
<ParallaxItem depth={0.3} rotate={true} className="z-30">
  <MainCard />
</ParallaxItem>
```

---

## Hooks

### useHeadPosition

Returns the current head position.

```typescript
const { x, y } = useHeadPosition();
// x: -1 to 1 (left to right)
// y: -1 to 1 (up to down)
```

Use when you need JS access to position (canvas, Three.js, etc).

### useHeadTracking

Returns full tracking context.

```typescript
const { position, isReady, error } = useHeadTracking();

// position: { x: number, y: number }
// isReady: boolean - true when tracking initialized
// error: string | null - error message if failed
```

Use for loading states and error handling.

### useParallaxSettings

Returns settings context.

```typescript
const { settings, updateSettings, resetSettings } = useParallaxSettings();

// Update a setting
updateSettings({ sensitivity: 2.0 });

// Reset all to defaults
resetSettings();
```

---

## Creating Custom Components

To create a component that responds to head tracking:

### Option 1: CSS Variables (Preferred)

```tsx
const MyComponent = () => {
  return (
    <div style={{
      transform: `translate(
        calc(var(--head-x) * 20px),
        calc(var(--head-y) * 20px)
      )`
    }}>
      Content
    </div>
  );
};
```

### Option 2: Hook (When JS Access Needed)

```tsx
const MyComponent = () => {
  const { x, y } = useHeadPosition();
  
  return (
    <canvas ref={canvasRef} />
  );
  
  // Use x, y in canvas/WebGL rendering
};
```
