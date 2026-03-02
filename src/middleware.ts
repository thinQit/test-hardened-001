import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

function getAuthToken(request: NextRequest): string | null {
  const headerToken = getTokenFromHeader(request.headers.get('authorization'));
  const cookieToken = request.cookies.get('admin_token')?.value ?? null;
  return headerToken || cookieToken;
}

function isAdminAuthorized(request: NextRequest): boolean {
  const token = getAuthToken(request);
  if (!token) return false;
  if (process.env.ADMIN_TOKEN && token === process.env.ADMIN_TOKEN) return true;
  try {
    const payload = verifyToken(token);
    return typeof payload.role === 'string' && payload.role === 'admin';
  } catch (_error) {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/contact') && request.method !== 'POST') {
    if (!isAdminAuthorized(request)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/contact/:path*']
};
