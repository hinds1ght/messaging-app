'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../(auth)/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ChatLandingPage() {
  const { accessToken, user, loading, setAccessToken } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchMe = async () => {
      if (!accessToken) return;

      const res = await fetch('/api/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setDisplayName(data.displayName);
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
    router.push('/login');
  };

  if (loading || !user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold">
          Hello, {displayName ?? 'User'}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
