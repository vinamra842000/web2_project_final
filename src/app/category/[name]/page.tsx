'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type Recipe = {
  _id: string;
  title: string;
  author: string;
  image?: string;
};

type Review = {
  recipeId: string;
  rating: number;
};

export default function CategoryPage() {
  const { name } = useParams();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch(`/api/recipes?category=${name}`, { cache: 'no-store' });
      const data = await res.json();
      setRecipes(data);
    }
    async function fetchReviews() {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    }
    fetchRecipes();
    fetchReviews();
  }, [name]);

  // Helper to get average rating for a recipe
  const getAverageRating = (recipeId: string) => {
    const recipeReviews = reviews.filter(r => String(r.recipeId) === String(recipeId));
    if (recipeReviews.length === 0) return 0;
    const avg =
      recipeReviews.reduce((sum, r) => sum + r.rating, 0) / recipeReviews.length;
    return avg;
  };

  return (
    <main
      className="min-h-screen bg-cover bg-center px-4 py-10"
      style={{ backgroundImage: "url('/images/food-background.jpg')" }}
    >
      <div
        className="max-w-5xl mx-auto p-8 rounded-xl shadow-xl"
        style={{ backgroundColor: 'rgba(255, 247, 237, 0.7)' }}
      >
        <h1 className="text-4xl font-bold text-center mb-10" style={{ color: '#A9746E' }}>
          {name} Recipes
        </h1>
        {recipes.length === 0 ? (
          <p className="text-center text-gray-700">No recipes available in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => {
              const avgRating = getAverageRating(recipe._id);
              return (
                <Link
                  key={recipe._id}
                  href={`/recipe/${recipe._id}`}
                  className="block"
                >
                  <div className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full flex flex-col items-center">
                    {recipe.image && (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    )}
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-2">{recipe.title}</h2>
                    <div className="flex items-center justify-center mb-2">
                      <span style={{ color: '#FFD700', fontSize: '1.2em' }}>
                        {Array.from({ length: 5 }, (_, i) =>
                          i < Math.round(avgRating) ? '★' : '☆'
                        ).join('')}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}