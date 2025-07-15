'use client';

import { useEffect } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChatLandingPage() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!accessToken || !user) return;

      const res = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const mostRecent = data[0];
        if (mostRecent) {
          router.replace(`/chat/${mostRecent.id}`);
        }
      }
    };

    if (!loading && user && accessToken) {
      fetchAndRedirect();
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [accessToken, user, loading, router]);

  return <div className="p-4">Loading chat...</div>;
}
