import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  res.cookies.set('token', '', { maxAge: 0, path: '/' });
  return res;
}