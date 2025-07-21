import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('image');
  // Mock: normally save to cloud storage or local path
  return NextResponse.json({ url: `/uploads/${file.name}` });
}
