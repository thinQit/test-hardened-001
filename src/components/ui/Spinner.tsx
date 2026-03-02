import type { HTMLAttributes } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {}

export function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={`inline-flex h-5 w-5 animate-spin items-center justify-center rounded-full border-2 border-muted-foreground border-t-transparent ${
        className ?? ''
      }`}
      {...props}
    />
  );
}
