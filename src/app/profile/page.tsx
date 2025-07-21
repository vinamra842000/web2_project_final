'use client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">My Profile</h1>
      <p>Welcome to your profile page.</p>
      <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
    </div>
  );
}