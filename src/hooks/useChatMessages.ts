'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuth } from '@/app/(auth)/AuthContext';

export const useChatMessages = (conversationId: number) => {
  const { accessToken } = useAuth();

  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam = null }) => {
      const url = `/api/messages/${conversationId}${pageParam ? `?cursor=${pageParam}` : ''}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }

      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: !!accessToken && !!conversationId,
  });
};
