import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/jwt';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value || '';
  const user = verifyToken(token) as { id: string } | null;
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const client = await clientPromise;
  const db = client.db();
  const userDetails = await db.collection('users').findOne({ _id: new ObjectId(user.id) });
  if (!userDetails) {
    return NextResponse.json({ user: null }, { status: 404 });
  }

  return NextResponse.json({ user: { ...userDetails, _id: userDetails._id.toString() } });
}