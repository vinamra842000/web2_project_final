'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const toggleCategoryDropdown = () => setShowCategoryDropdown((prev) => !prev);

  useEffect(() => {
    setShowNavbar(!(pathname === '/login' || pathname === '/register'));
  }, [pathname]);

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => res.json())
      .then(data => setRole(data.user?.role ?? null));
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
  };

  if (!showNavbar) return null;

  return (
    <nav className="w-full bg-white shadow-md border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="w-8 h-8"
          />
          <span className="text-gray-800 text-2xl font-bold tracking-tight">
            RecipeBook
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <NavLink href="/" label="Home" />
          {/* Categories Dropdown */}
          <div className="relative">
            <button onClick={toggleCategoryDropdown} className="text-gray-600 hover:text-gray-900">
              Categories
            </button>
            {showCategoryDropdown && (
              <div className="absolute mt-2 bg-white shadow rounded z-20">
                <Link
                  href="/category/Drink"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  Drink
                </Link>
                <Link
                  href="/category/Breakfast"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  Breakfast
                </Link>
                <Link
                  href="/category/Lunch"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  Lunch
                </Link>
                <Link
                  href="/category/Snack"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  Snack
                </Link>
                <Link
                  href="/category/Dessert"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setShowCategoryDropdown(false)}
                >
                  Dessert
                </Link>
              </div>
            )}
          </div>
          <NavLink href="/search" label="Search" />
          <NavLink href="/my-recipes" label="My Recipes" />
          {role === 'admin' && <NavLink href="/admin/dashboard" label="Dashboard" />}
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-4 py-1.5 rounded-full transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative text-sm font-medium transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-600'
        } hover:text-gray-900`}
    >
      <span
        className="after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-gray-800 
        after:w-0 hover:after:w-full after:transition-all after:duration-300 inline-block relative"
      >
        {label}
      </span>
    </Link>
  );
}
