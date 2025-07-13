'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/(auth)/AuthContext';

interface User {
  id: number;
  displayName: string;
  email?: string;
}

export default function RecipientPanel() {
  const { accessToken, user } = useAuth();
  const params = useParams();
  const conversationId = Array.isArray(params?.conversationId)
    ? params.conversationId[0]
    : params?.conversationId;

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
          const data: User[] = await res.json();
          const otherUser = data.find((u) => u.id !== user?.userId);
          setRecipient(otherUser ?? null);
        } else {
          console.error('Failed to fetch participants', res.status);
        }
      } catch (err) {
        console.error('Error fetching recipient:', err);
      }
    };

    fetchRecipient();
  }, [accessToken, conversationId]);

  return (
    <div className="w-64 border-l p-4 bg-white">
      <h2 className="text-lg font-semibold mb-3"></h2>
      {recipient ? (
        <div className="flex flex-col items-center text-sm space-y-2">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
            {recipient.displayName.charAt(0).toUpperCase()}
          </div>
          <p className="text-center font-medium">{recipient.displayName}</p>
          <p className="text-gray-500 text-xs">ID: {recipient.id}</p>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No recipient found</p>
      )}
    </div>
  );
}
