import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hoverable?: boolean;
}

export const Card = ({ className, children, hoverable = false }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-soft overflow-hidden',
        hoverable && 'transition-shadow hover:shadow-medium',
        className
      )}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader = ({ className, children }: CardHeaderProps) => {
  return <div className={cn('p-5 border-b border-gray-100', className)}>{children}</div>;
};

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

export const CardTitle = ({ className, children }: CardTitleProps) => {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
};

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardDescription = ({ className, children }: CardDescriptionProps) => {
  return <p className={cn('text-sm text-gray-500 mt-1', className)}>{children}</p>;
};

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

export const CardContent = ({ className, children }: CardContentProps) => {
  return <div className={cn('p-5', className)}>{children}</div>;
};

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export const CardFooter = ({ className, children }: CardFooterProps) => {
  return <div className={cn('p-5 border-t border-gray-100', className)}>{children}</div>;
};