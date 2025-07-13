import React from 'react';
import Sidebar from './Sidebar';
import RecipientPanel from './RecipientPanel';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <RecipientPanel />
    </div>
  );
}
