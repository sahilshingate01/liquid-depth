import { FaceMeshResults } from '../types';

// Lerp helper for smoothing movement
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export class HeadTracker {
  private faceMesh: any;
  private camera: any;
  private videoElement: HTMLVideoElement;
  private onCoordinatesUpdate: (x: number, y: number) => void;
  private onReady: () => void;
  
  // Current smoothed coordinates
  private currentX: number = 0;
  private currentY: number = 0;
  
  // Target coordinates from the latest frame
  private targetX: number = 0;
  private targetY: number = 0;

  // Track last processed raw inputs to calculate delta for deadzone
  private lastRawX: number = 0.5;
  private lastRawY: number = 0.5;

  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  private smoothing: number;
  private inertia: number;
  private sensitivity: number;
  private jitterThreshold: number;
  private attack: number;
  
  private velocityX: number = 0;
  private velocityY: number = 0;
  
  private calibrationOffsetX: number = 0;
  private calibrationOffsetY: number = 0;
  private centerStartTime: number | null = null;
  private readonly CALIBRATION_THRESHOLD: number = 0.08;
  private readonly CALIBRATION_DELAY: number = 5000;

  constructor(
    videoElement: HTMLVideoElement, 
    onCoordinatesUpdate: (x: number, y: number) => void,
    onReady: () => void,
    settings: { smoothing: number; inertia: number; sensitivity: number; jitterThreshold: number; attack: number }
  ) {
    this.videoElement = videoElement;
    this.onCoordinatesUpdate = onCoordinatesUpdate;
    this.onReady = onReady;
    this.smoothing = settings.smoothing;
    this.inertia = settings.inertia;
    this.sensitivity = settings.sensitivity;
    this.jitterThreshold = settings.jitterThreshold;
    this.attack = settings.attack;
  }

  public async start() {
    if (this.isRunning) return;

    if (!window.FaceMesh || !window.Camera) {
      console.error("MediaPipe scripts not loaded");
      return;
    }

    // Initialize FaceMesh
    this.faceMesh = new window.FaceMesh({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    this.faceMesh.onResults(this.handleResults);

    // Initialize Camera
    this.camera = new window.Camera(this.videoElement, {
      onFrame: async () => {
        if (this.faceMesh) {
          await this.faceMesh.send({ image: this.videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    await this.camera.start();
    this.isRunning = true;
    this.onReady();
    
    // Start the smoothing loop
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.camera) this.camera.stop();
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  public updateSettings(settings: { smoothing: number; inertia: number; sensitivity: number; jitterThreshold: number; attack: number }) {
    this.smoothing = settings.smoothing;
    this.inertia = settings.inertia;
    this.sensitivity = settings.sensitivity;
    this.jitterThreshold = settings.jitterThreshold;
    this.attack = settings.attack;
  }

  private handleResults = (results: FaceMeshResults) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      
      const nose = landmarks[4]; // Tip of nose
      
      // DEADZONE LOGIC:
      // Calculate distance from last processed raw input.
      // If movement is very subtle (jitter), ignore it to keep UI stable.
      const dist = Math.sqrt(
        Math.pow(nose.x - this.lastRawX, 2) + 
        Math.pow(nose.y - this.lastRawY, 2)
      );

      // Only update target if movement exceeds threshold
      if (dist > this.jitterThreshold) {
        this.lastRawX = nose.x;
        this.lastRawY = nose.y;
        
        const rawX = (nose.x - 0.5) - this.calibrationOffsetX;
        const rawY = (nose.y - 0.5) - this.calibrationOffsetY;
        
        this.targetX = rawX * this.sensitivity; 
        this.targetY = rawY * this.sensitivity;
        
        const distFromCenter = Math.sqrt(rawX * rawX + rawY * rawY);
        
        if (distFromCenter < this.CALIBRATION_THRESHOLD) {
          if (!this.centerStartTime) {
            this.centerStartTime = Date.now();
          } else if (Date.now() - this.centerStartTime > this.CALIBRATION_DELAY) {
            this.calibrationOffsetX = nose.x - 0.5;
            this.calibrationOffsetY = nose.y - 0.5;
            this.centerStartTime = null;
            this.targetX = 0;
            this.targetY = 0;
          }
        } else {
          this.centerStartTime = null;
        }
      }
    }
  };

  private loop = () => {
    if (!this.isRunning) return;

    const baseFactor = 1 - this.smoothing;
    
    if (baseFactor >= 0.99) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
      this.velocityX = 0;
      this.velocityY = 0;
    } else {
      const deltaX = Math.abs(this.targetX - this.currentX);
      const deltaY = Math.abs(this.targetY - this.currentY);
      const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const curvedFactor = Math.pow(Math.min(delta * 2, 1), this.attack);
      const factor = Math.max(0.02, baseFactor * (0.5 + curvedFactor * 0.5));
      
      this.currentX = lerp(this.currentX, this.targetX, factor);
      this.currentY = lerp(this.currentY, this.targetY, factor);
    }

    if (this.inertia > 0) {
      const springForce = 0.3 * this.inertia;
      const damping = 0.85 - (this.inertia * 0.15);
      
      this.velocityX += (this.targetX - this.currentX) * springForce;
      this.velocityY += (this.targetY - this.currentY) * springForce;
      
      this.velocityX *= damping;
      this.velocityY *= damping;
      
      this.currentX += this.velocityX;
      this.currentY += this.velocityY;
    }

    this.onCoordinatesUpdate(this.currentX, this.currentY);

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}