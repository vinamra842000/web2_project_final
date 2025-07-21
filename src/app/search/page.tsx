'use client';
import { useState, useRef, useEffect } from 'react';
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

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Recipe[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all reviews once
  useEffect(() => {
    async function fetchReviews() {
      const res = await fetch('/api/reviews', { cache: 'no-store' });
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    }
    fetchReviews();
  }, []);

  const handleSearch = async (searchValue: string) => {
    setLoading(true);
    const res = await fetch(`/api/recipes?q=${encodeURIComponent(searchValue)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
    setShowSuggestions(false);
  };

  // Live suggestion handler
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setResults([]);
      return;
    }

    // Debounce API call
    timeoutRef.current = setTimeout(async () => {
      const res = await fetch(`/api/recipes?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setSuggestions(data.slice(0, 5)); // Show top 5 suggestions
      setShowSuggestions(true);
    }, 250);
  };

  // When a suggestion is clicked, search for that title
  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setShowSuggestions(false);
    handleSearch(title);
  };

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
          Search Recipes
        </h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="flex flex-col items-center mb-8 gap-2 relative"
        >
          <div className="w-full max-w-md relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Search by title or description..."
              className="w-full p-3 border border-gray-300 rounded text-black placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              autoComplete="off"
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow z-20 mt-1 max-h-56 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s._id}
                    className="px-4 py-2 cursor-pointer hover:bg-yellow-100 transition"
                    onMouseDown={() => handleSuggestionClick(s.title)}
                  >
                    {s.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-white px-6 py-2 rounded font-semibold hover:bg-yellow-500 transition mt-2"
          >
            Search
          </button>
        </form>
        {loading ? (
          <p className="text-center text-gray-700">Searching...</p>
        ) : results.length === 0 && query ? (
          <p className="text-center text-gray-700">No recipes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((recipe) => {
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