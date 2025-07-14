'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserHeader() {
  const { accessToken, setAccessToken } = useAuth();
  const [displayName, setDisplayName] = useState<string>('User');
  const router = useRouter();

  useEffect(() => {
    const fetchDisplayName = async () => {
      if (!accessToken) return;

      try {
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setDisplayName(data.displayName);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchDisplayName();
  }, [accessToken]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setAccessToken(null);
    router.push('/login');
  };

  return (
    <div className="p-4 flex items-center justify-between border-b bg-white">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-400 text-white font-bold flex items-center justify-center">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="font-medium">{displayName}</span>
      </div>
      <button
        onClick={handleLogout}
        className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}
