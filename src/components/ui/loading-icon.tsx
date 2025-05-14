
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingIconProps {
  className?: string;
  size?: number;
}

const LoadingIcon: React.FC<LoadingIconProps> = ({ className, size = 16 }) => {
  return (
    <Loader2 
      className={cn('animate-spin', className)} 
      size={size}
    />
  );
};

export { LoadingIcon };
