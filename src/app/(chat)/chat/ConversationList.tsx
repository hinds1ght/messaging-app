'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';

export default function ConversationList({ refreshFlag }: { refreshFlag: number }) {
  const { accessToken, user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      const res = await fetch('/api/conversations', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setConversations(data);
    };

    if (accessToken) fetchConvos();
  }, [accessToken, refreshFlag]);

  return (
    <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 text-sm">
      {conversations.map((convo: any) => {
        const names = convo.participants
          .filter((p: any) => p.user.id !== user?.userId)
          .map((p: any) => p.user.displayName)
          .join(', ');

        return (
          <div key={convo.id} className="p-3 bg-white rounded-xl shadow hover:bg-gray-100">
            <div className="font-semibold">{convo.name || names}</div>
            <div className="text-xs text-gray-500">
              {convo.messages[0]?.content || 'No messages yet'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
