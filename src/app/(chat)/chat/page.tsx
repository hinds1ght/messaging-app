'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';
import { useRouter } from 'next/navigation';

export default function ChatLandingPage() {
  const { accessToken, user, loading } = useAuth();
  const router = useRouter();
  const [noConversations, setNoConversations] = useState(false);

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
        } else {
          setNoConversations(true);
        }
      }
    };

    if (!loading && user && accessToken) {
      fetchAndRedirect();
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [accessToken, user, loading, router]);

  if (noConversations) {
    return (
      <div className="flex h-full items-center justify-center text-center text-gray-600 p-4">
        You have no conversations yet. Start chatting by selecting a user from the sidebar!
      </div>
    );
  }

  return <div className="p-4">Loading chat...</div>;
}
