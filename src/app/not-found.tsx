import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-secondary">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-6 inline-block text-primary hover:underline">Go home</Link>
    </div>
  );
}
