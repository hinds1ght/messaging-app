'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/(auth)/AuthContext';

interface User {
  id: number;
  displayName: string;
  email?: string;
}

export default function ConversationHeader() {
  const { accessToken, user } = useAuth();
  const { conversationId: rawId } = useParams() as { conversationId?: string };
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [recipient, setRecipient] = useState<User | null>(null);

  useEffect(() => {
    const fetchRecipient = async () => {
      if (!accessToken || !conversationId) return;

      try {
        const res = await fetch(`/api/conversations/${conversationId}/participants`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const participants: User[] = await res.json();
          const otherUser = participants.find((p) => p.id !== user?.userId);
          setRecipient(otherUser || null);
        }
      } catch (err) {
        console.error('Failed to fetch participants:', err);
      }
    };

    fetchRecipient();
  }, [accessToken, conversationId]);

  return (
    <div className="flex items-center gap-4 border-b p-4 bg-white shadow-sm">
      {recipient ? (
        <>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">
            {recipient.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm">
            <p className="font-medium">{recipient.displayName}</p>
            <p className="text-gray-500 text-xs">Online Status here</p>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500">Loading conversation...</p>
      )}
    </div>
  );
}
