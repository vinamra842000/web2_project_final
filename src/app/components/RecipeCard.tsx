import Link from 'next/link';
import Image from 'next/image';

export default function RecipeCard({ recipe }: { recipe: any }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
        <Image
          src={recipe.image || '/placeholder.jpg'}
          alt={recipe.title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded"
        />
      </div>
      <h3 className="text-lg font-semibold mb-1">{recipe.title}</h3>
      <p className="text-sm text-gray-600 mb-2">{recipe.description?.slice(0, 100)}...</p>
      <Link href={`/recipe/${recipe._id}`} className="text-blue-600 hover:underline">View Recipe</Link>
    </div>
  );
}
