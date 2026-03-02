import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(2000)
});

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const MAX_PER_HOUR = 5;

function sanitize(value: string): string {
  return value.trim().replace(/[<>]/g, '');
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  if (!record || record.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }
  if (record.count >= MAX_PER_HOUR) return true;
  record.count += 1;
  rateLimitStore.set(ip, record);
  return false;
}

function isAdminAuthorized(request: NextRequest): boolean {
  const token = getTokenFromHeader(request.headers.get('authorization'));
  if (!token) return false;
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return true;
  try {
    const payload = verifyToken(token);
    return typeof payload.role === 'string' && payload.role === 'admin';
  } catch (_error) {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    const message = await db.contactMessage.create({
      data: {
        name: sanitize(parsed.data.name),
        email: sanitize(parsed.data.email).toLowerCase(),
        message: sanitize(parsed.data.message),
        ipAddress: ip,
        status: 'new'
      }
    });

    console.log(
      JSON.stringify({ level: 'info', event: 'contact_submission', id: message.id, ip, createdAt: message.createdAt.toISOString() })
    );

    return NextResponse.json({
      success: true,
      data: { id: message.id, received: true, createdAt: message.createdAt.toISOString() }
    }, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const params = request.nextUrl.searchParams;
    const page = Math.max(1, Number(params.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, Number(params.get('limit') || '20')));
    const search = params.get('search') || '';

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
            { message: { contains: search } }
          ]
        }
      : {};

    const [items, total] = await Promise.all([
      db.contactMessage.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      db.contactMessage.count({ where })
    ]);

    const formatted = items.map(item => ({
      id: item.id,
      name: item.name,
      email: item.email,
      message: item.message,
      createdAt: item.createdAt.toISOString(),
      status: item.status
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: formatted,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
