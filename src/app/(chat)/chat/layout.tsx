import React from 'react';
import Sidebar from './Sidebar';
import ConversationHeader from './ConversationHeader';
import RecipientPanel from './RecipientPanel';
import Header from '@/app/Header';
import Footer from '@/app/Footer';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex flex-col h-screen">

      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <ConversationHeader />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
        <RecipientPanel />
      </div>

      <Footer />
    </div>
  );
}
