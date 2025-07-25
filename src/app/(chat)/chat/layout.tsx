'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Sidebar from './Sidebar';
import ConversationHeader from './ConversationHeader';
import RecipientPanel from './RecipientPanel';
import Header from '@/app/Header';
import Footer from '@/app/Footer';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { conversationId } = useParams();

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          {conversationId && <ConversationHeader />}
          <div className="flex-1 flex overflow-hidden">{children}</div>
        </div>

        <RecipientPanel />
      </div>
      <Footer />
    </div>
  );
}
