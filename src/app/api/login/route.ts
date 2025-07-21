import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';
// ...existing code...
import { signToken } from '@/utils/jwt';
// ...existing code...
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  const user = await db.collection('users').findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ id: user._id, role: user.role });
  const response = NextResponse.json({ message: 'Login successful', user });
  response.cookies.set('token', token, { httpOnly: true, path: '/' });
  return response;
}