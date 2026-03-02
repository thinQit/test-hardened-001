'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-bold">TestHardened</Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/#hero" className="text-sm text-secondary hover:text-foreground">Home</Link>
          <Link href="/#features" className="text-sm text-secondary hover:text-foreground">Features</Link>
          <Link href="/#contact" className="text-sm text-secondary hover:text-foreground">Contact</Link>
          <Link href="/admin/messages" className="text-sm text-secondary hover:text-foreground">Admin</Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">{user?.name}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <span className="text-sm text-secondary">Guest</span>
          )}
        </nav>
        <button
          className="md:hidden"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
          <span className="mt-1 block h-0.5 w-6 bg-foreground" />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 space-y-3">
          <Link href="/#hero" className="block text-sm" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/#features" className="block text-sm" onClick={() => setOpen(false)}>Features</Link>
          <Link href="/#contact" className="block text-sm" onClick={() => setOpen(false)}>Contact</Link>
          <Link href="/admin/messages" className="block text-sm" onClick={() => setOpen(false)}>Admin</Link>
        </div>
      )}
    </header>
  );
}

export default Navigation;
