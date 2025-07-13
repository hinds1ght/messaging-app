'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/(auth)/AuthContext';

interface Message {
  id: number;
  content: string;
  senderId: number;
  sender: {
    displayName: string;
  };
  createdAt: string;
}

export default function ConversationPage() {
  const { accessToken, user } = useAuth();
  const rawParams = useParams();
  const conversationId = Array.isArray(rawParams?.conversationId)
    ? rawParams.conversationId[0]
    : rawParams?.conversationId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!accessToken || !conversationId) return;

      try {
        const res = await fetch(`/api/messages/${conversationId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [accessToken, conversationId]);

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const res = await fetch(`/api/messages/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content: input }),
    });

    if (res.ok) {
      const newMessage = await res.json();
      setMessages((prev) => [...prev, newMessage]);
      setInput('');
    }
  };

  if (loading) return <div className="p-4">Loading conversation...</div>;

  return (
    <div className="flex flex-col h-screen p-4 space-y-4">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-md px-4 py-2 rounded-xl text-sm ${
              msg.senderId === user?.userId
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <div className="font-semibold">{msg.sender.displayName}</div>
            <div>{msg.content}</div>
            <div className="text-xs text-right opacity-70">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-xl"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
