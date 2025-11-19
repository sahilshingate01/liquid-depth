import React, { useMemo } from 'react';
import { useParallaxSettings } from '../services/parallaxSettings';

export interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  depthScale?: number;
}

export const ParallaxCard: React.FC<ParallaxCardProps> = React.memo(({ children, className, depthScale = 1.0 }) => {
  const { settings } = useParallaxSettings();
  const globalDepth = settings.depthMultiplier;
  
  const lightDir = useMemo(() => {
    const posMap: Record<string, {x: number, y: number}> = {
      'top-left': {x: -1, y: -1}, 'top-center': {x: 0, y: -1}, 'top-right': {x: 1, y: -1},
      'center-left': {x: -1, y: 0}, 'center': {x: 0, y: 0}, 'center-right': {x: 1, y: 0},
      'bottom-left': {x: -1, y: 1}, 'bottom-center': {x: 0, y: 1}, 'bottom-right': {x: 1, y: 1}
    };
    return posMap[settings.lightPosition] || {x: -1, y: -1};
  }, [settings.lightPosition]);
  
  const intensity = settings.lightIntensity;
  
  const scale = depthScale * globalDepth;
  
  const style = useMemo(() => ({
    willChange: 'box-shadow',
    transform: 'translate3d(0,0,0)',
        boxShadow: `
      calc((var(--head-x) + ${lightDir.x * 0.3}) * ${4 * scale * intensity}px) 
      calc((var(--head-y) + ${lightDir.y * 0.3}) * ${4 * scale * intensity}px) 
      0 0 rgba(255,255,255,${0.35 * intensity}),
      calc((var(--head-x) + ${lightDir.x * 0.3}) * ${8 * scale * intensity}px) 
      calc((var(--head-y) + ${lightDir.y * 0.3}) * ${8 * scale * intensity}px) 
      0 0 rgba(0,0,0,${0.5 * intensity}),
      calc((var(--head-x) - ${lightDir.x * 0.5}) * ${-50 * scale}px) 
      calc((var(--head-y) - ${lightDir.y * 0.5}) * ${-50 * scale}px) 
      ${60 * scale}px rgba(0,0,0,${0.8 * intensity}),
      inset 0 0 20px rgba(255,255,255,0.03)
    `
  }), [scale, lightDir.x, lightDir.y, intensity, globalDepth]);

  const specularStyle = useMemo(() => ({
    background: `radial-gradient(
      circle at calc(${50 + lightDir.x * 20}% + var(--head-x) * ${60 * globalDepth}px) calc(${50 + lightDir.y * 20}% + var(--head-y) * ${60 * globalDepth}px), 
      rgba(255,255,255,${0.25 * intensity}) 0%, 
      transparent 50%
    )`,
    willChange: 'background'
  }), [lightDir.x, lightDir.y, globalDepth, intensity]);
  
  return (
    <div 
      className={`bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-white overflow-hidden relative ${className}`}
      style={style}
    >
      {children}
      <div 
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={specularStyle}
      />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
});

ParallaxCard.displayName = 'ParallaxCard';
