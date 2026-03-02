import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

const statusSchema = z.enum(['new', 'reviewed', 'spam']);
const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  message: z.string().min(10).max(2000).optional(),
  status: statusSchema.optional()
});

function sanitize(value: string): string {
  return value.trim().replace(/[<>]/g, '');
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const message = await db.contactMessage.findUnique({ where: { id: params.id } });
    if (!message) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        createdAt: message.createdAt.toISOString(),
        ipAddress: message.ipAddress,
        status: message.status
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid input' }, { status: 400 });
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ success: false, error: 'No fields provided' }, { status: 400 });
    }

    const data: { name?: string; email?: string; message?: string; status?: string } = {};
    if (parsed.data.name) data.name = sanitize(parsed.data.name);
    if (parsed.data.email) data.email = sanitize(parsed.data.email).toLowerCase();
    if (parsed.data.message) data.message = sanitize(parsed.data.message);
    if (parsed.data.status) data.status = parsed.data.status;

    const message = await db.contactMessage.update({ where: { id: params.id }, data });

    return NextResponse.json({
      success: true,
      data: {
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        createdAt: message.createdAt.toISOString(),
        ipAddress: message.ipAddress,
        status: message.status
      }
    });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await db.contactMessage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, data: { id: params.id, deleted: true } });
  } catch (_error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
