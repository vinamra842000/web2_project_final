'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

interface Recipe {
  _id: string;
  title: string;
  image?: string;
}

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch(`/api/recipes?userId=${user._id}`, { cache: 'no-store' });
      const data = await res.json();
      setRecipes(data);
    }
    if (user) {
      fetchRecipes();
    }
  }, [user]);

return (
  <main className="relative min-h-screen p-8 overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/videos/myrecipe.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className="relative z-10 flex justify-between items-center mb-10">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">My Recipes</h1>
      <Link href="/my-recipes/create">
        <button className="bg-blue-600 bg-opacity-80 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition font-semibold">
          Create Recipe
        </button>
      </Link>
    </div>
    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.length === 0 ? (
  <p className="text-center text-white col-span-full text-lg">No recipes available.</p>
) : (
  recipes.map((recipe) => (
    <Link key={recipe._id} href={`/my-recipes/${recipe._id}`}>
      <div className="group cursor-pointer rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 relative">
        <div className="relative">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-70 object-cover transition-transform duration-300 group-hover:scale-105 rounded-t-2xl"
            />
          ) : (
            <div className="w-full h-56 bg-gray-200 flex items-center justify-center rounded-t-2xl">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
            <h3 className="text-lg font-bold text-white text-center drop-shadow transition-colors duration-300 group-hover:text-yellow-300">
              {recipe.title}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  ))
)}
    </div>
  </main>
);
}