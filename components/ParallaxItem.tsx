import React, { ReactNode, useMemo } from 'react';
import { useParallaxSettings } from '../services/parallaxSettings';

interface ParallaxItemProps {
  children: ReactNode;
  depth: number;
  className?: string;
  rotate?: boolean;
}

export const ParallaxItem: React.FC<ParallaxItemProps> = React.memo(({ 
  children, 
  depth, 
  className = '',
  rotate = false 
}) => {
  const { settings } = useParallaxSettings();
  
  const style: React.CSSProperties = useMemo(() => {
    const movementRange = `${settings.movementRange}px`;
    const rotationStrength = `${settings.rotationStrength}deg`;
    
    return {
      transform: `
        translate3d(
          calc(var(--head-x) * ${-depth} * ${movementRange}),
          calc(var(--head-y) * ${-depth} * ${movementRange}),
          ${depth * 100 * settings.depthMultiplier}px
        )
        ${rotate ? `
          rotateY(calc(var(--head-x) * ${depth} * ${rotationStrength}))
          rotateX(calc(var(--head-y) * ${depth} * ${rotationStrength}))
        ` : ''}
      `,
      willChange: 'transform',
      backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d',
            position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
  }, [depth, rotate, settings.movementRange, settings.rotationStrength, settings.depthMultiplier]);

  return (
    <div className={`parallax-layer ${className}`} style={style}>
      <div className="pointer-events-auto relative w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
});