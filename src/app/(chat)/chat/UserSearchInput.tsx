'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';

interface User {
  id: number;
  displayName: string;
}

export default function UserSearchInput({ onNewChat }: { onNewChat: () => void }) {
  const { accessToken, user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const delay = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/users?search=${query}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.filter((u: User) => u.id !== user?.userId));
      }

      setLoading(false);
    }, 500); // debounce

    return () => clearTimeout(delay);
  }, [query, accessToken, user]);

  const handleClick = async (targetUserId: number) => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ targetUserId }),
    });

    if (res.ok) {
      onNewChat();
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div className="p-3 border-b">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-3 py-2 border rounded-xl text-sm"
      />
      {loading && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
      {results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((user) => (
            <li
              key={user.id}
              onClick={() => handleClick(user.id)}
              className="cursor-pointer px-3 py-1 hover:bg-gray-100 rounded text-sm"
            >
              {user.displayName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
