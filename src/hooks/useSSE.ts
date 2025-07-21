import { useEffect } from 'react';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  sender: {
    id: number;
    displayName: string;
  };
  createdAt: string;
}

export function useSSE(userId: number | undefined, onMessage: (msg: Message) => void) {
  useEffect(() => {
    if (!userId) return;

    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_SSE_URL}/stream/${userId}`);

    eventSource.onmessage = event => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    eventSource.onerror = () => {
      console.error('SSE connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);
}
