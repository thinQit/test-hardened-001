'use client';

import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

type ButtonVariant = 'default' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, PropsWithChildren {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export function Button({
  variant = 'default',
  fullWidth,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:pointer-events-none';
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-primary text-white hover:bg-primary/90',
    outline: 'border border-border text-foreground hover:bg-muted',
    ghost: 'text-foreground hover:bg-muted'
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${
        className ?? ''
      }`}
      {...props}
    >
      {children}
    </button>
  );
}
