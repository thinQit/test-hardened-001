import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { signToken, verifyPassword } from '@/lib/auth';
import { type User } from '@prisma/client';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

function toSafeUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    return NextResponse.json({ success: true, data: { token, user: toSafeUser(user) } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
