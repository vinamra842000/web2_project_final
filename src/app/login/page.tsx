'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        // Save token if returned by API (optional)
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        router.push('/');
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Invalid login. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/food-background.jpg')" }}
    >
      <div className="max-w-md w-full bg-orange-50 pt-20 pb-10 px-8 rounded-xl shadow-xl min-h-[500px]">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#A9746E' }}>
          Recipe Manager
        </h1>
        <h2 className="text-xl font-semibold text-center mb-4" style={{ color: '#A9746E' }}>
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded text-black placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded text-black placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {error && <p className="text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
}
