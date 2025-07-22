import { NextResponse, type NextRequest } from 'next/server';
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
  req: NextRequest,
  context: { params: { id: string } } // ✅ Keep this
) {
  const { id } = context.params;
  const contentType = req.headers.get('content-type') || '';
  let data: RecipeUpdatePayload = {};

  try {
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

      const imageFile = formData.get('image');
      if (imageFile instanceof File && imageFile.name) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadsDir, { recursive: true });
        const filename = `${Date.now()}-${imageFile.name}`;
        const filePath = path.join(uploadsDir, filename);
        await fs.writeFile(filePath, buffer);
        const imageUrl = '/uploads/' + filename;
        data.image = imageUrl;
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
  } catch (error) {
    console.error('Error updating recipe:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // ✅ Correct format
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
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Error fetching recipe' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } // ✅ Correct format
) {
  const { id } = context.params;

  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection('recipes').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Recipe deleted' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return NextResponse.json({ error: 'Error deleting recipe' }, { status: 500 });
  }
}
