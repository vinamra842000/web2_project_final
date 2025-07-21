import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import path from 'path';

type RecipeUpdatePayload = {
  title?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  category?: string;
  image?: string;
};

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const contentType = req.headers.get('content-type') || '';
  let data: RecipeUpdatePayload = {};

  if (contentType.includes('multipart/form-data')) {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const ingredientsRaw = formData.get('ingredients') as string;
    const stepsRaw = formData.get('steps') as string;
    const category = formData.get('category') as string;
    const ingredients = ingredientsRaw.split(',').map((i) => i.trim());
    const steps = stepsRaw.split(',').map((s) => s.trim());

    data = { title, description, ingredients, steps, category };

    const imageFile = formData.get('image') as File | null;
    if (imageFile && imageFile.name) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      const imageUrl = '/uploads/' + filename;
      data = { ...data, image: imageUrl };
    }
  } else {
    const body = await req.json();
    delete body._id;
    data = body;
  }

  const client = await clientPromise;
  const db = client.db();
  await db.collection('recipes').updateOne(
    { _id: new ObjectId(id) },
    { $set: data }
  );
  return NextResponse.json({ message: 'Recipe updated' });
}

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  try {
    const client = await clientPromise;
    const db = client.db();
    const recipe = await db
      .collection('recipes')
      .findOne({ _id: new ObjectId(id) });
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    const recipeWithStringId = { ...recipe, _id: recipe._id.toString() };
    return NextResponse.json(recipeWithStringId);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching recipe' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const client = await clientPromise;
  const db = client.db();
  await db.collection('recipes').deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ message: 'Recipe deleted' });
}
