import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { HeadTracker } from './headTracking';
import { useParallaxSettings } from './parallaxSettings';

export interface HeadPosition {
  x: number;
  y: number;
}

interface HeadTrackingContextValue {
  position: HeadPosition;
  isReady: boolean;
  error: string | null;
}

const HeadTrackingContext = createContext<HeadTrackingContextValue | undefined>(undefined);

export interface HeadTrackingProviderProps {
  children: ReactNode;
}

export const HeadTrackingProvider: React.FC<HeadTrackingProviderProps> = ({ children }) => {
  const { settings } = useParallaxSettings();
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackerRef = useRef<HeadTracker | null>(null);
  const [position, setPosition] = useState<HeadPosition>({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const baselineWindowPos = useRef<{ x: number; y: number }>({ x: window.screenX, y: window.screenY });
  const windowDelta = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const headCoords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const updateCSSVariables = (): void => {
    const finalX = headCoords.current.x + (settings.windowTracking ? windowDelta.current.x : 0);
    const finalY = headCoords.current.y + (settings.windowTracking ? windowDelta.current.y : 0);
    
    const root = document.documentElement;
    root.style.setProperty('--head-x', finalX.toString());
    root.style.setProperty('--head-y', finalY.toString());
    
    setPosition({ x: finalX, y: finalY });
  };

  useEffect(() => {
    const startTracking = async (): Promise<void> => {
      try {
        if (!videoRef.current) return;

        trackerRef.current = new HeadTracker(
          videoRef.current,
          (x: number, y: number) => {
            headCoords.current = { x, y };
            updateCSSVariables();
          },
          () => {
            setIsReady(true);
          },
          {
            smoothing: settings.smoothing,
            inertia: settings.inertia,
            sensitivity: settings.sensitivity,
            jitterThreshold: settings.jitterThreshold,
            attack: settings.attack,
          }
        );

        await trackerRef.current.start();
      } catch (err) {
        console.error(err);
        setError("Camera access denied or WebGL not supported.");
      }
    };

    startTracking();

    return () => {
      if (trackerRef.current) {
        trackerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (trackerRef.current) {
      trackerRef.current.updateSettings({
        smoothing: settings.smoothing,
        inertia: settings.inertia,
        sensitivity: settings.sensitivity,
        jitterThreshold: settings.jitterThreshold,
        attack: settings.attack,
      });
    }
  }, [settings.smoothing, settings.inertia, settings.sensitivity, settings.jitterThreshold, settings.attack]);

  useEffect(() => {
    if (!settings.windowTracking) {
      windowDelta.current = { x: 0, y: 0 };
      updateCSSVariables();
      return;
    }

    baselineWindowPos.current = { x: window.screenX, y: window.screenY };

    const handleWindowMove = (): void => {
      const deltaX = -(window.screenX - baselineWindowPos.current.x) / 500;
      const deltaY = -(window.screenY - baselineWindowPos.current.y) / 500;
      
      windowDelta.current = {
        x: deltaX * settings.windowSensitivity,
        y: deltaY * settings.windowSensitivity
      };
      
      updateCSSVariables();
    };

    window.addEventListener('resize', handleWindowMove);
    
    const pollInterval = setInterval(handleWindowMove, 250);

    return () => {
      window.removeEventListener('resize', handleWindowMove);
      clearInterval(pollInterval);
    };
  }, [settings.windowTracking, settings.windowSensitivity]);

  return (
    <HeadTrackingContext.Provider value={{ position, isReady, error }}>
      {/* Hidden Video Element for MediaPipe */}
      <video
        ref={videoRef}
        className="absolute opacity-0 pointer-events-none"
        style={{ width: 640, height: 480 }}
        playsInline
      />
      {children}
    </HeadTrackingContext.Provider>
  );
};

export const useHeadPosition = (): HeadPosition => {
  const context = useContext(HeadTrackingContext);
  if (!context) {
    throw new Error('useHeadPosition must be used within HeadTrackingProvider');
  }
  return context.position;
};

export const useHeadTracking = (): HeadTrackingContextValue => {
  const context = useContext(HeadTrackingContext);
  if (!context) {
    throw new Error('useHeadTracking must be used within HeadTrackingProvider');
  }
  return context;
};
