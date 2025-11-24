import React, { useState } from 'react';
import { Settings, Info } from 'lucide-react';
import { useParallaxSettings } from '../services/parallaxSettings';
import { LightPosition } from '../types';

const Tooltip: React.FC<{ text: string }> = ({ text }) => (
  <div className="group/tooltip relative inline-block ml-1">
    <Info size={12} className="text-white/30 cursor-help" />
    <div className="invisible group-hover/tooltip:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 border border-white/20 rounded-lg text-[10px] text-white/90 whitespace-nowrap z-50 pointer-events-none">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
    </div>
  </div>
);

export const SettingsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSettings, resetSettings } = useParallaxSettings();

  return (
    <div className="fixed bottom-2 left-2 z-50">
      {isOpen && (
        <div className="mb-2 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Parallax Settings</h3>
            <button
              onClick={resetSettings}
              className="text-xs px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg transition-colors text-white"
            >
              Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Smoothing</label>
                  <Tooltip text="Controls lag/delay in movement response" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.smoothing.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.smoothing}
                onChange={(e) => updateSettings({ smoothing: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Inertia</label>
                  <Tooltip text="Spring bounce effect on movement" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.inertia.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.inertia}
                onChange={(e) => updateSettings({ inertia: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Sensitivity</label>
                  <Tooltip text="Movement multiplier for head tracking" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.sensitivity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={settings.sensitivity}
                onChange={(e) => updateSettings({ sensitivity: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Movement Range</label>
                  <Tooltip text="Maximum distance elements can move" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.movementRange}px</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={settings.movementRange}
                onChange={(e) => updateSettings({ movementRange: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Rotation Strength</label>
                  <Tooltip text="3D tilt angle based on head position" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.rotationStrength}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={settings.rotationStrength}
                onChange={(e) => updateSettings({ rotationStrength: parseInt(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Depth Multiplier</label>
                  <Tooltip text="Z-axis depth scaling for 3D layers" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.depthMultiplier.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.0"
                step="0.1"
                value={settings.depthMultiplier}
                onChange={(e) => updateSettings({ depthMultiplier: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Attack</label>
                  <Tooltip text="Response curve: <1=ease-in, 1=linear, >1=ease-out" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.attack.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={settings.attack}
                onChange={(e) => updateSettings({ attack: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Light Position</label>
                  <Tooltip text="Direction of virtual light source for shadows" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.lightPosition}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['top-left', 'top-center', 'top-right', 'center-left', 'center', 'center-right', 'bottom-left', 'bottom-center', 'bottom-right'] as LightPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => updateSettings({ lightPosition: pos })}
                    className={`h-8 rounded-lg transition-colors ${settings.lightPosition === pos ? 'bg-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center">
                  <label className="text-xs text-white/70">Light Intensity</label>
                  <Tooltip text="Brightness of shadows and highlights" />
                </div>
                <span className="text-xs text-white/90 font-mono">{settings.lightIntensity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.lightIntensity}
                onChange={(e) => updateSettings({ lightIntensity: parseFloat(e.target.value) })}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <div className="flex items-center">
                <label className="text-xs text-white/70">Window Tracking</label>
                <Tooltip text="Parallax follows browser window movement" />
              </div>
              <button
                onClick={() => updateSettings({ windowTracking: !settings.windowTracking })}
                className={`w-10 h-5 rounded-full transition-colors ${settings.windowTracking ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.windowTracking ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {settings.windowTracking && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <label className="text-xs text-white/70">Window Sensitivity</label>
                    <Tooltip text="Multiplier for window movement effect" />
                  </div>
                  <span className="text-xs text-white/90 font-mono">{settings.windowSensitivity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={settings.windowSensitivity}
                  onChange={(e) => updateSettings({ windowSensitivity: parseFloat(e.target.value) })}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-white/10">
              <div className="flex items-center">
                <label className="text-xs text-white/70">Child Edges</label>
                <Tooltip text="Apply depth shadows to nested elements" />
              </div>
              <button
                onClick={() => updateSettings({ childEdges: !settings.childEdges })}
                className={`w-10 h-5 rounded-full transition-colors ${settings.childEdges ? 'bg-blue-500' : 'bg-white/10'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.childEdges ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center text-white hover:border-white/20 transition-all shadow-lg"
      >
        <Settings size={20} className={isOpen ? 'rotate-90 transition-transform' : 'transition-transform'} />
      </button>
    </div>
  );
};
