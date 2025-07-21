import Link from 'next/link';

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <img src={recipe.image || '/placeholder.jpg'} alt={recipe.title} className="w-full h-40 object-cover rounded mb-2" />
      <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{recipe.description?.slice(0, 100)}...</p>
      <Link href={`/recipe/${recipe._id}`} className="text-blue-600 hover:underline">View Recipe</Link>
    </div>
  );
}