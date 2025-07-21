import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/utils/jwt';

export const config = {
  matcher: [
    '/((?!login|register|api|_next|favicon.ico).*)'
  ],
};

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const valid = token ? Boolean(verifyToken(token)) : false;
  const url = req.nextUrl.clone();
  if (!valid) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}