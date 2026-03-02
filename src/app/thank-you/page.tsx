import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h1 className="text-3xl font-bold">Thanks for reaching out!</h1>
      <p className="mt-4 text-secondary">We received your message and will be in touch soon.</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/" className="inline-block text-primary hover:underline">
          Return to home
        </Link>
        <Link href="/#contact" className="inline-block text-primary hover:underline">
          Send another message
        </Link>
      </div>
    </section>
  );
}
