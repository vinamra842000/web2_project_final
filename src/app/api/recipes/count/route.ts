import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const count = await db.collection('recipes').countDocuments();
  return NextResponse.json({ count });
}
