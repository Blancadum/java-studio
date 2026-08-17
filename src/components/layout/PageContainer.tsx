import React from 'react';
import { cn } from '../../lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  size?: 'normal' | 'large';
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, size = 'normal', className }) => {
  const contentWidth = size === 'large' ? 'max-w-7xl' : 'max-w-4xl';
  
  return (
    <div className="w-full">
      <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', contentWidth, className)}>
        {children}
      </div>
    </div>
  );
};
