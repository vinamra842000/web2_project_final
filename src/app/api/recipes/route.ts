import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import clientPromise from '@/app/lib/mongodb';

type Recipe = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  userId: string;
  category: string;
  image?: string;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const ingredientsRaw = formData.get('ingredients') as string;
    const stepsRaw = formData.get('steps') as string;
    const userId = formData.get('userId') as string;
    const category = formData.get('category') as string;

    const ingredients = ingredientsRaw.split(',').map((i) => i.trim());
    const steps = stepsRaw.split(',').map((s) => s.trim());

    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;

    if (imageFile && imageFile.name) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      const filename = `${Date.now()}-${imageFile.name}`;
      const filePath = path.join(uploadsDir, filename);
      await fs.writeFile(filePath, buffer);
      imageUrl = '/uploads/' + filename;
    }

    const recipe: Recipe = { title, description, ingredients, steps, userId, category, image: imageUrl };

    const client = await clientPromise;
    const db = client.db();
    await db.collection('recipes').insertOne(recipe);

    return NextResponse.json({ message: 'Recipe created' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating recipe' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    const q = searchParams.get('q');

    const query: Record<string, unknown> = {};
    if (userId) query.userId = userId;
    if (category) query.category = category;
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    const client = await clientPromise;
    const db = client.db();
    const recipes = await db.collection('recipes').aggregate([
      { $match: query },
      { $addFields: { userIdObj: { $toObjectId: '$userId' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userIdObj',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      { $addFields: { author: { $arrayElemAt: ['$authorInfo.fullName', 0] } } },
      { $project: { authorInfo: 0, userIdObj: 0 } }
    ]).toArray();

    const recipesWithId = recipes.map((r) => ({
      ...r,
      _id: r._id.toString(),
    }));

    return NextResponse.json(recipesWithId);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error fetching recipes' }, { status: 500 });
  }
}
