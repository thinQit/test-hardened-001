import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken } from '@/lib/auth';
import { type User } from '@prisma/client';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100)
});

function sanitize(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}

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
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const email = sanitize(parsed.data.email).toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 409 });
    }

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await db.user.create({
      data: {
        name: sanitize(parsed.data.name),
        email,
        role: 'admin',
        passwordHash
      }
    });

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    return NextResponse.json({ success: true, data: { token, user: toSafeUser(user) } }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
