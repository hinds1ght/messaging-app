'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/(auth)/AuthContext';
import Link from 'next/link';
import { useSSE, Message } from '@/hooks/useSSE';

type Conversation = {
  id: number;
  name?: string;
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export default function ConversationList() {
  const { accessToken, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConvos = async () => {
    const res = await fetch('/api/conversations', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    setConversations(data);
  };

  useEffect(() => {
    if (accessToken) fetchConvos();
  }, [accessToken]);

  useSSE(user?.userId, newMessage => {
    setConversations(prev => {
      const index = prev.findIndex(c => c.id === newMessage.conversationId);
      if (index !== -1) {
        const updated = [...prev];
        const convo = updated.splice(index, 1)[0];
        updated.unshift({
          ...convo,
          messages: [newMessage],
        });
        return updated;
      }

      fetchConvos();
      return prev;
    });
  });

  return (
    <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2 text-sm">
      {conversations.map((convo: any) => {
        const names = convo.participants
          .filter((p: any) => p.user.id !== user?.userId)
          .map((p: any) => p.user.displayName)
          .join(', ');

        return (
          <Link href={`/chat/${convo.id}`} key={convo.id}>
            <div className="p-3 bg-white rounded-xl shadow hover:bg-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
                {(convo.name || names)[0]?.toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold truncate">{convo.name || names}</div>
                <div className="text-xs text-gray-500 truncate whitespace-nowrap overflow-hidden">
                  {convo.messages[0]?.content || 'No messages yet'}
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
