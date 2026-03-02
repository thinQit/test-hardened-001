'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <section className="bg-muted py-12">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-2xl font-semibold">Get in touch</h2>
        <form className="mt-6 space-y-4">
          <Input label="Name" value={form.name} onChange={update('name')} placeholder="Your name" />
          <Input label="Email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          <label className="block text-sm font-medium">
            Message
            <textarea
              className="mt-1 w-full rounded-md border border-border bg-background p-3 text-sm"
              value={form.message}
              onChange={update('message')}
              rows={4}
              placeholder="How can we help?"
            />
          </label>
          <Button type="submit">Send message</Button>
        </form>
      </div>
    </section>
  );
}
