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
    reviews = await db.collection('reviews').find().toArray();
  }

  const transformedReviews = reviews.map((review) => ({
    ...review,
    _id: review._id.toString(),
  }));
  return NextResponse.json(transformedReviews);
}

// ✅ POST /api/reviews
export async function POST(request: Request) {
  try {
    const newReview = await request.json();

    // Basic validation (optional)
    if (!newReview.recipeId || !newReview.reviewer || !newReview.comment || newReview.rating == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('reviews').insertOne(newReview);

    return NextResponse.json(
      { message: 'Review submitted successfully', insertedId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
