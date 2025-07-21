'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  image?: string;
  author?: string;
}

export default function MyRecipeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    async function fetchRecipe() {
      const res = await fetch(`/api/recipes/${id}`, { cache: 'no-store' });
      const data = await res.json();
      setRecipe(data);
    }
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      await fetch(`/api/recipes/${id}`, { method: 'DELETE' });
      router.push('/my-recipes');
    }
  };

  if (!recipe) {
  return <p className="text-center mt-20 text-gray-500">Loading recipe...</p>;
}

return (
  <div
    className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
    style={{ backgroundImage: "url('/images/recipedetails.jpg')" }}
  >
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0"></div>
    <main className="relative p-4 sm:p-8 max-w-4xl w-full mx-auto rounded-lg shadow-2xl overflow-hidden animate-fadeIn bg-black/60 backdrop-blur-md z-10">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col items-center">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-84 object-cover rounded-lg shadow-lg transition-transform duration-500 hover:scale-105 mb-4"
            />
          ) : (
            <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center text-gray-300 text-xl mb-4">
              No Image
            </div>
          )}
          <div className="flex w-full justify-center space-x-4 mt-2">
            <button
              onClick={() => router.push(`/my-recipes/edit/${recipe._id}`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
            >
              Edit Recipe
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition shadow"
            >
              Delete Recipe
            </button>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold mb-2 text-white">{recipe.title}</h1>
          {recipe.author && <p className="text-gray-300 mb-4">By {recipe.author}</p>}

          <div className="border-t border-gray-500 my-4"></div>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Ingredients</h2>
            <ul className="list-disc ml-6">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="text-gray-200">{ing}</li>
              ))}
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2 text-yellow-300">Steps</h2>
            <ol className="list-decimal ml-6">
              {recipe.steps.map((step, idx) => (
                <li key={idx} className="mb-1 text-gray-200">{step}</li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </main>
  </div>
  );
}