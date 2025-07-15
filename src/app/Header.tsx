'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const { accessToken, setAccessToken } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/register') return null;

  useEffect(() => {
    const fetchMe = async () => {
      if (!accessToken) return;

      try {
        const res = await fetch('/api/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setDisplayName(data.displayName);
        }
      } catch (err) {
        console.error('Failed to fetch user info:', err);
      }
    };

    fetchMe();
  }, [accessToken]);

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setAccessToken(null);
    router.push('/');
  };

  return (
    <header className="w-full bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-bold"><Link href="/">ChimeUwu</Link></h1>
      {accessToken && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
              {displayName?.[0].toUpperCase() || '?'}
            </div>
            <span>{displayName ?? 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
