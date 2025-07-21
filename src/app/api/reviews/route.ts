import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const recipeId = searchParams.get('recipeId');
  const client = await clientPromise;
  const db = client.db();

  let reviews;
  if (recipeId) {
    reviews = await db.collection('reviews').find({ recipeId }).toArray();
  } else {
    // Fetch all reviews if no recipeId is provided
    reviews = await db.collection('reviews').find().toArray();
  }

  const transformedReviews = reviews.map((review) => ({
    ...review,
    _id: review._id.toString(),
  }));
  return NextResponse.json(transformedReviews);
}