'use client';

import { useState } from 'react';
import UserHeader from './UserHeader';
import UserSearchInput from './UserSearchInput';
import ConversationList from './ConversationList';

export default function Sidebar() {
  const [refreshFlag, setRefreshFlag] = useState(0);

  const triggerRefresh = () => setRefreshFlag((prev) => prev + 1);

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <UserHeader />
      <div className="p-4 font-bold text-xl">Messages</div>

      <UserSearchInput onNewChat={triggerRefresh} />
      <ConversationList refreshFlag={refreshFlag} />
    </div>
  );
}
