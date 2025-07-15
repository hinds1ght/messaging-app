'use client';

import { useState } from 'react';
import UserSearchInput from './UserSearchInput';
import ConversationList from './ConversationList';

export default function Sidebar() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => setRefreshFlag(prev => prev + 1);

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 font-bold text-xl">Chat</div>

      <UserSearchInput onNewChat={triggerRefresh} />
      <ConversationList refreshFlag={refreshFlag} />
    </div>
  );
}
