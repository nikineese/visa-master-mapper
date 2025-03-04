
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  type?: 'fade' | 'slide' | 'zoom';
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({
  show,
  children,
  className,
  duration = 300,
  type = 'fade',
}) => {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
    else {
      const timer = setTimeout(() => {
        setRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!render) return null;

  const getAnimationClass = () => {
    switch (type) {
      case 'fade':
        return show ? 'animate-fade-in' : 'animate-fade-out';
      case 'slide':
        return show ? 'animate-slide-in-right' : 'animate-slide-out-right';
      case 'zoom':
        return show 
          ? 'scale-100 opacity-100' 
          : 'scale-95 opacity-0';
      default:
        return show ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div
      className={cn(
        getAnimationClass(),
        type === 'zoom' ? 'transition-all transform' : '',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        transitionProperty: 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
