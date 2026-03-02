import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const detail = request.nextUrl.searchParams.get('detail') === 'true';
  const data = detail
    ? { status: 'ok', uptime: Math.floor(process.uptime()), version: '1.0.0' }
    : { status: 'ok' };

  return NextResponse.json({ success: true, data });
}
