'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-secondary">Please try again or refresh the page.</p>
      <div className="mt-6 flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
