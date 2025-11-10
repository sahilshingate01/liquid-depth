import React from 'react'

interface ParallaxContainerProps {
  children: React.ReactNode
  perspective?: number
  className?: string
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  perspective = 1200,
  className = ''
}) => {
  return (
    <div 
      className={`w-full h-full overflow-hidden ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      {children}
    </div>
  )
}
