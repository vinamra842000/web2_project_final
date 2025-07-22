'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'registered' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/login');
    } else {
      alert('Registration failed.');
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('/images/food-background.jpg')" }}
    >
      <div className="max-w-md w-full bg-orange-50 pt-22 pb-10 px-8 rounded-xl shadow-xl min-h-[500px]">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ color: '#A9746E' }}>
          Recipe Manager
        </h1>
        <h2 className="text-xl font-semibold text-center mb-4" style={{ color: '#A9746E' }}>
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded text-black placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
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
           <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded text-black focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="registered">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}