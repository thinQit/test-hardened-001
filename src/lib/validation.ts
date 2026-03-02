import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message is required').max(2000)
});

export function sanitizeContactInput(input: z.infer<typeof contactSchema>) {
  return {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    message: input.message.trim()
  };
}
