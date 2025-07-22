'use client'

import { FaUsers, FaUtensils } from 'react-icons/fa'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  _id?: string
  fullName: string
  email: string
  role: 'admin' | 'registered' | 'general'
}

interface Recipe {
  _id?: string
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  userId: string
  createdAt?: Date
}

export default function AdminDashboardPage() {
  const router = useRouter()

  const [userCount, setUserCount] = useState<number | null>(null)
  const [recipeCount, setRecipeCount] = useState<number | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [showUsers, setShowUsers] = useState<boolean>(false)
  const [showRecipes, setShowRecipes] = useState<boolean>(false)

  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editForm, setEditForm] = useState({ fullName: '', email: '', role: 'general' })

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.user || data.user.role !== 'admin') {
          router.replace('/')
        }
      })

    fetch('/api/users/count')
      .then(res => res.json())
      .then(data => setUserCount(data.count))

    fetch('/api/recipes/count')
      .then(res => res.json())
      .then(data => setRecipeCount(data.count))
  }, [router])

  const handleUsersClick = async () => {
    if (!showUsers) {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data)
    }
    setShowUsers(prev => !prev)
    setShowRecipes(false)
  }

  const handleRecipesClick = async () => {
    if (!showRecipes) {
      const res = await fetch('/api/recipes')
      const data = await res.json()
      setRecipes(data)
    }
    setShowRecipes(prev => !prev)
    setShowUsers(false)
  }

  return (
    <main className="bg-white min-h-screen px-4 py-6 text-black">
      <h1 className="text-4xl font-bold text-center mb-10 drop-shadow-md">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <button onClick={handleUsersClick}>
          <DashboardCard
            icon={<FaUsers size={28} className="text-green-600" />}
            title="Total Users"
            value={userCount !== null ? userCount.toString() : '...'}
          />
        </button>
        <button onClick={handleRecipesClick}>
          <DashboardCard
            icon={<FaUtensils size={28} className="text-green-600" />}
            title="Total Recipes"
            value={recipeCount !== null ? recipeCount.toString() : '...'}
          />
        </button>
      </div>

      {/* Users Table */}
      {showUsers && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4">👥 User List</h2>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded text-black">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">Full Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{user.fullName}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b capitalize">{user.role}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-600 hover:underline mr-4"
                      onClick={() => {
                        if (!user._id) return
                        setEditingUser(user)
                        setEditForm({
                          fullName: user.fullName,
                          email: user.email,
                          role: user.role,
                        })
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600 hover:underline"
                      onClick={async () => {
                        if (!user._id) return
                        const confirmDelete = window.confirm("Are you sure you want to delete this user?")
                        if (!confirmDelete) return

                        const res = await fetch('/api/users', {
                          method: 'DELETE',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: user._id }),
                        })

                        if (res.ok) {
                          setUsers(users.filter(u => u._id !== user._id))
                          setUserCount(prev => (prev !== null ? prev - 1 : null))
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recipes Table */}
      {showRecipes && (
        <div className="overflow-x-auto mt-6">
          <h2 className="text-2xl font-semibold mb-4">📋 Recipe List</h2>
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded text-black">
            <thead className="bg-green-100 text-left">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Ingredients</th>
                <th className="py-2 px-4 border-b">Steps</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map(recipe => (
                <tr key={recipe._id}>
                  <td className="py-2 px-4 border-b">{recipe.title}</td>
                  <td className="py-2 px-4 border-b">{recipe.description}</td>
                  <td className="py-2 px-4 border-b">{recipe.ingredients.join(', ')}</td>
                  <td className="py-2 px-4 border-b">{recipe.steps.join(', ')}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={async () => {
                        if (!recipe._id) return
                        const confirmDelete = window.confirm("Are you sure you want to delete this recipe?")
                        if (!confirmDelete) return

                        const res = await fetch(`/api/recipes/${recipe._id}`, {
                          method: 'DELETE',
                        })

                        if (res.ok) {
                          setRecipes(recipes.filter(r => r._id !== recipe._id))
                          setRecipeCount(prev => (prev !== null ? prev - 1 : null))
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <label className="block mb-2">
              Full Name:
              <input
                type="text"
                value={editForm.fullName}
                onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-2">
              Email:
              <input
                type="email"
                value={editForm.email}
                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                className="border p-2 w-full"
              />
            </label>
            <label className="block mb-4">
              Role:
              <select
                value={editForm.role}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    role: e.target.value as 'admin' | 'registered' | 'general',
                  })
                }
                className="border p-2 w-full"
              >
                <option value="admin">Admin</option>
                <option value="registered">User</option>
              </select>
            </label>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  if (!editingUser?._id) return
                  const res = await fetch('/api/users', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: editingUser._id,
                      ...editForm,
                    }),
                  })

                  if (res.ok) {
                    const updated = users.map(u =>
                      u._id === editingUser._id
                        ? { ...u, ...editForm, role: editForm.role as 'admin' | 'registered' | 'general' }
                        : u
                    )
                    setUsers(updated)
                    setEditingUser(null)
                  } else {
                    alert('Failed to update user.')
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-green-50 border border-green-200 shadow rounded-xl p-6 flex items-center justify-between hover:shadow-md transition w-full text-left text-black">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold mt-2">{value}</p>
      </div>
      <div>{icon}</div>
    </div>
  )
}
