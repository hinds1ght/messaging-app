'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './(auth)/AuthContext';
import { useRouter } from 'next/navigation';
import LayoutWrapper from './LayoutWrapper';

export default function HomePage() {
  const { accessToken, user, loading } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDisplayName = async () => {
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

    fetchDisplayName();
  }, [accessToken]);

  const handleStart = () => {
    router.push(user ? '/chat' : '/login');
  };

  return (
    <LayoutWrapper>
      <main className="flex flex-col items-center justify-center text-center px-6 py-20 space-y-8">
        <h1 className="text-4xl font-bold">Welcome to ChimeUwu 👋</h1>

        <p className="max-w-xl text-gray-700 text-lg">
          A simple, fun, and private way to stay connected. Just register, find your friends, and
          start chatting instantly — no complicated setup required!
        </p>

        {loading ? (
          <p className="text-sm text-gray-500">Checking login status...</p>
        ) : user ? (
          <>
            <p className="text-lg">Welcome back{displayName ? `, ${displayName}` : ''}!</p>
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              Go to Chat
            </button>
          </>
        ) : (
          <>
            <p className="text-lg">Get started by registering or logging in.</p>
            <button
              onClick={handleStart}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Register / Login
            </button>
          </>
        )}
      </main>
    </LayoutWrapper>
  );
}
