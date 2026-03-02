'use client';

import type { PropsWithChildren } from 'react';

interface ModalProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        <div className="text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}
