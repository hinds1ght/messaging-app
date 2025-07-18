import { useEffect } from 'react';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  sender: {
    id: number;
    displayName: string;
  };
  createdAt: string;
}

export function useSSE(conversationId: string, onMessage: (msg: any) => void) {
  useEffect(() => {
    if (!conversationId) return;

    const eventSource = new EventSource(`https://sse-backend-uov5.onrender.com/stream/${conversationId}`);

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (err) {
        console.error('Invalid SSE message:', err);
      }
    };

    eventSource.onerror = err => {
      console.warn('SSE error:', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [conversationId]);
}
