import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

type UserUpdatePayload = {
  fullName?: string;
  email?: string;
  role?: 'general' | 'registered' | 'admin';
};

export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find().toArray();
  return NextResponse.json(users);
}

export async function PUT(req: Request) {
  try {
    const { id, fullName, email, role }: { id: string } & UserUpdatePayload = await req.json();

    const client = await clientPromise;
    const db = client.db();

    const updateData: UserUpdatePayload = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    const result = await db
      .collection('users')
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    return NextResponse.json({ message: 'User updated', result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id }: { id: string } = await req.json();
    const client = await clientPromise;
    const db = client.db();
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
