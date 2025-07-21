'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string;
  steps: string;
  category?: string;
  image?: string;
}

export default function EditRecipePage() {
  const [form, setForm] = useState<Recipe | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [animateForm, setAnimateForm] = useState(false);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`/api/recipes/${id}`);
      const data = await res.json();
      setForm(data);
      setAnimateForm(true);
    };
    fetchRecipe();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('ingredients', form.ingredients);
    formData.append('steps', form.steps);
    formData.append('category', form.category || '');
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const res = await fetch(`/api/recipes/${form._id}`, {
      method: 'PUT',
      body: formData,
    });
    if (res.ok) {
      router.push('/my-recipes');
    } else {
      alert('Failed to update recipe.');
    }
  };

 if (!form)
    return <p className="text-center mt-20 text-gray-500">Loading recipe...</p>;

  return (
    <main
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-6 relative"
      style={{ backgroundImage: "url('/images/editrecipe.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0"></div>
      <div
        className={`relative z-10 transition-all duration-700 ${
          animateForm ? 'opacity-80 translate-y-0' : 'opacity-100 translate-y-8'
        } max-w-xl w-full`}
      >
        <div className="h-2 w-24 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full mx-auto mb-4"></div>
        <h1 className="text-4xl font-extrabold text-center mb-8 text-white drop-shadow-lg tracking-tight">
          <span className="bg-gradient-to-r from-yellow-300 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Edit Recipe
          </span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/40 space-y-6"
          encType="multipart/form-data"
        >
          <input
            name="title"
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="w-full border-none p-4 mb-2 rounded-xl bg-white/70 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-lg"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full border-none p-4 mb-2 rounded-xl bg-white/70 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-lg"
            required
            rows={2}
          />
          <textarea
            name="ingredients"
            placeholder="Ingredients (comma separated)"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border-none p-4 mb-2 rounded-xl bg-white/70 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-lg"
            required
            rows={2}
          />
          <textarea
            name="steps"
            placeholder="Steps (comma separated)"
            value={form.steps}
            onChange={handleChange}
            className="w-full border-none p-4 mb-2 rounded-xl bg-white/70 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-lg"
            required
            rows={2}
          />
          <select
    name="category"
    value={form.category || ''}
    onChange={handleChange}
    required
    className="w-full border-none p-4 mb-2 rounded-xl bg-white/70 shadow focus:outline-none focus:ring-2 focus:ring-pink-400 transition text-lg"
  >
    <option value="">Select category</option>
    <option value="Drink">Drink</option>
    <option value="Breakfast">Breakfast</option>
    <option value="Lunch">Lunch</option>
    <option value="Snack">Snack</option>
    <option value="Dessert">Dessert</option>
  </select>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">Current Image:</label>
            {form.image ? (
              <img
                src={form.image}
                alt="Current"
                className="w-32 h-32 object-cover rounded-lg border-2 border-pink-200 shadow"
              />
            ) : (
              <p className="text-gray-500">No image available.</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-gray-700">Change Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 file:py-2 file:px-4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-yellow-400 text-white py-3 rounded-xl shadow-lg font-bold text-lg hover:scale-105 hover:from-yellow-400 hover:to-pink-500 transition"
          >
            Update Recipe
          </button>
        </form>
      </div>
    </main>
  );
}