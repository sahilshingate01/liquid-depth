export interface FaceMeshResults {
  multiFaceLandmarks: Array<Array<{ x: number; y: number; z: number }>>;
  image: any;
}

export interface FaceMeshConfig {
  locateFile: (file: string) => string;
}

export type LightPosition = 
  | 'top-left' | 'top-center' | 'top-right'
  | 'center-left' | 'center' | 'center-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface ParallaxSettings {
  smoothing: number;
  inertia: number;
  sensitivity: number;
  movementRange: number;
  rotationStrength: number;
  depthMultiplier: number;
  jitterThreshold: number;
  attack: number;
  childEdges: boolean;
  lightPosition: LightPosition;
  lightIntensity: number;
  windowTracking: boolean;
  windowSensitivity: number;
}

// Minimal type definition for the global MediaPipe objects loaded via CDN
declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}