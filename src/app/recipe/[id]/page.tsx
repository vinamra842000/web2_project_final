'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type Recipe = {
  _id: string;
  title: string;
  author: string;
  ingredients: string[];
  steps: string[];
  image?: string;
};

type Review = {
  _id?: string;
  recipeId: string;
  reviewer: string;
  comment: string;
  rating: number;
};

export default function SingleRecipePage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState<Partial<Review>>({
    reviewer: '',
    comment: '',
    rating: 0,
  });

  useEffect(() => {
    async function fetchData() {
      const recipeRes = await fetch(`/api/recipes/${id}`, { cache: 'no-store' });
      const recipeData = await recipeRes.json();
      setRecipe(recipeData);

      const reviewsRes = await fetch(`/api/reviews?recipeId=${id}`, { cache: 'no-store' });
      const reviewsData = await reviewsRes.json();
      setReviews(reviewsData);
    }
    fetchData();
  }, [id]);

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewReview((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewToSubmit = {
      ...newReview,
      recipeId: id,
      rating: Number(newReview.rating),
    } as Review;
    const res = await fetch('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewToSubmit),
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const updatedReviewsRes = await fetch(`/api/reviews?recipeId=${id}`, { cache: 'no-store' });
      const updatedReviews = await updatedReviewsRes.json();
      setReviews(updatedReviews);
      setNewReview({ reviewer: '', comment: '', rating: 0 });
    } else {
      alert('Error submitting review');
    }
  };

  if (!recipe) {
    return <p>Loading recipe...</p>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative p-4"
      style={{ backgroundImage: "url('/images/recipedetails.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0"></div>
      <main className="relative p-6 sm:p-8 max-w-4xl w-full mx-auto rounded-lg shadow-2xl overflow-hidden animate-fadeIn bg-black/60 backdrop-blur-md z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-8">
          <div>
            {recipe.image ? (
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
              />
            ) : (
              <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 text-xl">
                No Image
              </div>
            )}
          </div>
          <div className="text-white flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>
              <p className="mb-4">By {recipe.author}</p>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Ingredients</h2>
                <ul className="list-disc ml-6 space-y-1">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Steps</h2>
                <ol className="list-decimal ml-6 space-y-1">
                  {recipe.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-10 text-white">
          <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-300">No reviews yet. Be the first to review!</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="border border-gray-500 p-4 rounded">
                  <p className="font-bold flex items-center gap-2">
                    {review.reviewer}
                  <span style={{ color: '#FFD700', fontSize: '1.2em' }}>
                    {Array.from({ length: 5 }, (_, i) =>
                      i < review.rating ? '★' : '☆'
                    ).join('')}
                  </span>
                  </p>
                  <p>{review.comment}</p>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmitReview} className="mt-6 space-y-4">
            <h3 className="text-xl font-semibold">Add Your Review</h3>
            <input
              type="text"
              name="reviewer"
              placeholder="Your name"
              value={newReview.reviewer || ''}
              onChange={handleReviewChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating (0-5)"
              value={newReview.rating || 0}
              onChange={handleReviewChange}
              className="w-full border p-2 rounded"
              min="0"
              max="5"
              required
            />
            <textarea
              name="comment"
              placeholder="Your review"
              value={newReview.comment || ''}
              onChange={handleReviewChange}
              className="w-full border p-2 rounded"
              required
            ></textarea>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Submit Review
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}