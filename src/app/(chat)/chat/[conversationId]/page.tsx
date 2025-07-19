'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/app/(auth)/AuthContext';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { useSSE, Message } from '@/hooks/useSSE';
import LoadingDots from '../LoadingDots';
import { useChatMessages } from '@/hooks/useChatMessages';

export default function ConversationPage() {
  const { accessToken, user } = useAuth();
  const { conversationId: rawId } = useParams() as { conversationId?: string };
  const conversationId = Array.isArray(rawId) ? rawId[0] : rawId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useChatMessages(Number(conversationId));

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldScrollToBottomRef = useRef(false);
  const isFirstLoadRef = useRef(true);
  const isPaginatingRef = useRef(false);  
  const prevScrollHeightRef = useRef(0);

  const paginatedMessages = data?.pages.flatMap((page) => page.messages) || [];

 const allMessages = [
  ...paginatedMessages,
  ...liveMessages.filter((m) => !paginatedMessages.some((p) => p.id === m.id)),
].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  useSSE(conversationId, (newMessage) => {
    setLiveMessages((prev) => {
      if (prev.find((m) => m.id === newMessage.id)) return prev;
      shouldScrollToBottomRef.current = true;
      return [...prev, newMessage];
    });
  });

  useLayoutEffect(() => {
     const container = messagesContainerRef.current;
  if (!container || !allMessages.length) return;

  if (isFirstLoadRef.current) {
    // Initial load or refresh scroll to bottom
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
      isFirstLoadRef.current = false;
    });
  } else if (isPaginatingRef.current) {
    // Maintain scroll position after loading older messages
    const newScrollHeight = container.scrollHeight;
    const diff = newScrollHeight - prevScrollHeightRef.current;
    container.scrollTop = diff;
    isPaginatingRef.current = false;
  }
  }, [allMessages]);

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

    if (!res.ok) {
      setInput(messageToSend); 
    } else {
    shouldScrollToBottomRef.current = true; 
  }

    setSending(false);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleScroll = () => {
 const container = messagesContainerRef.current;
  if (!container || !hasNextPage || isFetchingNextPage) return;

  if (container.scrollTop < 100) {
    isPaginatingRef.current = true;
    prevScrollHeightRef.current = container.scrollHeight;
    fetchNextPage();
  }
};

  if (isLoading) return <div className="p-4">Loading conversation...</div>;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {hasNextPage && isFetchingNextPage && (
          <div className="text-center text-sm text-gray-500">Loading more...</div>
        )}

        {allMessages.map((msg) => (
          <div
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
            onClick={() => setShowEmojiPicker((prev) => !prev)}
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
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
