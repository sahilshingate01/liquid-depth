import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ParallaxSettings } from '../types';

const defaultSettings: ParallaxSettings = {
  smoothing: 0.1,
  inertia: 0.1,
  sensitivity: 2.0,
  movementRange: 60,
  rotationStrength: 5,
  depthMultiplier: 0.5,
  jitterThreshold: 0.005,
  attack: 2.7,
  childEdges: true,
  lightPosition: 'top-left',
  lightIntensity: 0.25,
  windowTracking: true,
  windowSensitivity: 0.4,
};

interface ParallaxSettingsContextValue {
  settings: ParallaxSettings;
  updateSettings: (partial: Partial<ParallaxSettings>) => void;
  resetSettings: () => void;
}

const ParallaxSettingsContext = createContext<ParallaxSettingsContextValue | undefined>(undefined);

interface ParallaxSettingsProviderProps {
  children: ReactNode;
}

export const ParallaxSettingsProvider: React.FC<ParallaxSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<ParallaxSettings>(defaultSettings);

  const updateSettings = (partial: Partial<ParallaxSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <ParallaxSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ParallaxSettingsContext.Provider>
  );
};

export const useParallaxSettings = (): ParallaxSettingsContextValue => {
  const context = useContext(ParallaxSettingsContext);
  if (!context) {
    throw new Error('useParallaxSettings must be used within ParallaxSettingsProvider');
  }
  return context;
};
