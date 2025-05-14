
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIconProps {
  className?: string;
  size?: number;
}

const LoadingIcon: React.FC<LoadingIconProps> = ({ className, size = 16 }) => {
  return (
    <Loader 
      className={cn('animate-spin text-primary', className)} 
      size={size}
    />
  );
};

export { LoadingIcon };
