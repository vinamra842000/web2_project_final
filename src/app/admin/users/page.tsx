'use client';
import { useEffect, useState } from 'react';

interface User {
  _id: string;
  fullName: string;
  role: 'general' | 'registered' | 'admin';
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    setUsers(data);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchUsers();
  };

  const handleRoleChange = async (id: string, role: string) => {
    await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify({ id, role }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchUsers();
  };

  return (
    <div>
      <h2>User Management</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.fullName} ({user.role})
            <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
              <option value="general">General</option>
              <option value="registered">Registered</option>
              <option value="admin">Admin</option>
            </select>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
