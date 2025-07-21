import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find().toArray();
  return NextResponse.json(users);
}

export async function PUT(req: Request) {
  const { id, role } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: { role } });
  return NextResponse.json({ message: 'User role updated' });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const client = await clientPromise;
  const db = client.db();
  await db.collection('users').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ message: 'User deleted' });
}