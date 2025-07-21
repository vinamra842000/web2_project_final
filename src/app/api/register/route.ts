import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { fullName, email, password, role = 'registered' } = await req.json();
  const hashed = await bcrypt.hash(password, 10);
  const client = await clientPromise;
  const db = client.db();
  const existing = await db.collection('users').findOne({ email });
  if (existing) return NextResponse.json({ error: 'User exists' }, { status: 400 });

  await db.collection('users').insertOne({ fullName, email, password: hashed, role });
  return NextResponse.json({ message: 'User created' });
}