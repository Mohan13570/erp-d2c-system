// src/app/ai/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchConversations, selectConversations, selectCurrentConversationId, selectMessages, selectLoading, selectTyping } from '@/features/ai/aiSlice';
import ChatSidebar from '@/components/ai/ChatSidebar';
import ChatWindow from '@/components/ai/ChatWindow';
import { useRouter } from 'next/navigation';

export default function AIHubPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const conversations = useAppSelector(selectConversations);
  const currentId = useAppSelector(selectCurrentConversationId);
  const loading = useAppSelector(selectLoading);
  const typing = useAppSelector(selectTyping);

  useEffect(() => {
    dispatch(fetchConversations({ page: 1 }));
    // If no conversation selected, create a new one
    if (!currentId && conversations.length > 0) {
      // select first
      // dispatch(selectConversation(conversations[0].id));
    }
  }, [dispatch]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <ChatSidebar />
      <ChatWindow />
    </div>
  );
}
