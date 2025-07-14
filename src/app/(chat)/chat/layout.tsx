import React from 'react';
import Sidebar from './Sidebar';
import ConversationHeader from './ConversationHeader';
import RecipientPanel from './RecipientPanel';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main chat area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <ConversationHeader />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      <RecipientPanel />
    </div>
  );
}
