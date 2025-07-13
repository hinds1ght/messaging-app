'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../(auth)/AuthContext';

interface User {
  id: number;
  displayName: string;
}

export default function Sidebar() {
  const { accessToken } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    };

    if (accessToken) fetchUsers();
  }, [accessToken]);

  const filteredUsers = users.filter((user) =>
    user.displayName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-64 h-full border-r p-4 bg-white shadow-md overflow-y-auto">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-xl focus:outline-none"
      />

      <ul className="space-y-2">
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="px-3 py-2 rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            {user.displayName}
          </li>
        ))}
      </ul>
    </div>
  );
}