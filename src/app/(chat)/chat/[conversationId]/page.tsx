'use client';

import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/(auth)/AuthContext';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useSSE, Message } from '@/hooks/useSSE';
import LoadingDots from  '../LoadingDots';

export default function ConversationPage() {
  const { accessToken, user } = useAuth();
  const { conversationId: rawId } = useParams() as { conversationId?: string };
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken || !conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${conversationId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 403) {
          console.warn('Access denied. You’re not a participant in this conversation.');
          alert('You don’t have access to this conversation.');
          return;
        }

        if (res.ok) {
          const data: Message[] = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [accessToken, conversationId]);

  useLayoutEffect(() => {
    if (messages.length === 0) return;

    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  useSSE(conversationId, newMessage => {
    setMessages(prev => [...prev, newMessage]);
  });

  const sendMessage = async () => {
    if (!input.trim() || !conversationId) return;

    const messageToSend = input;
    setInput('');
    setShowEmojiPicker(false);
    setSending(true);

    const res = await fetch(`/api/messages/${conversationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ content: messageToSend }),
    });

    if (res.ok) {
      const newMessage: Message = await res.json();
    } else {
      setInput(messageToSend);
    }

    setSending(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput(prev => prev + emojiData.emoji);
  };

  if (loading) return <div className="p-4">Loading conversation...</div>;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map(msg =>( <div
    key={msg.id}
    className={`flex ${msg.senderId === user?.userId ? 'justify-end' : 'justify-start'}`}
  >
    <div
      className={`break-words px-4 py-2 rounded-xl text-sm max-w-[75%] ${
        msg.senderId === user?.userId
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      <div className="font-semibold">
        {msg.senderId === user?.userId ? 'You' : msg.sender.displayName}
      </div>
      <div>{msg.content}</div>
      <div className="text-xs text-right opacity-70">
        {new Date(msg.createdAt).toLocaleTimeString()}
      </div>
    </div>
  </div>
))}

      {sending && (
        <div className="max-w-md px-4 py-2 rounded-xl text-sm bg-blue-400 text-white self-end ml-auto">
          <div className="font-semibold">You</div>
            <LoadingDots />
          <div className="text-xs text-right opacity-70">Sending...</div>
        </div>
      )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t">
        <div className="flex space-x-2 items-center justify-center relative">
          {/* Emoji toggle button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(prev => !prev)}
            className="flex items-center justify-center p-0"
          >
            <span className="text-2xl">😊</span>
          </button>

          {/* Emoji picker dropdown */}
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}

          {/* Text input */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
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
    </div>
  );
}

