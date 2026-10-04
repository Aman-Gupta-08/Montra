'use client';

import React, { useState } from 'react';
import { ClientMessagesSidebar, MessageProps } from '@/components/ui/message-design-card-list';

export const initialMessages: MessageProps[] = [
  {
    id: '1',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    name: 'peter',
    text: 'I got your first assignment. It was quite good. You can start work on next assignment.',
    date: '21 July',
    isFavorite: false,
    isActive: false,
  },
  {
    id: '2',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    name: 'david',
    text: 'Hey tell me about progress of project? Waiting for your response',
    date: '19 July',
    isFavorite: true,
    isActive: true, // This message starts active
  },
  {
    id: '3',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    name: 'sophia',
    text: 'When you start redesign of app? Previous project was perfect!',
    date: '18 July',
    isFavorite: false,
    isActive: false,
  },
  {
    id: '4',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    name: 'andrea',
    text: 'Hey tell me about progress of project? Waiting for your response',
    date: '18 July',
    isFavorite: false,
    isActive: false,
  },
  {
    id: '5',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    name: 'john',
    text: 'I want some changes in previous work you sent me. Waiting for your reply...',
    date: '17 July',
    isFavorite: false,
    isActive: false,
  },
  {
    id: '6',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    name: 'martin',
    text: 'I am really impressed from your work :-). Keep doing great work.',
    date: '10 July',
    isFavorite: false,
    isActive: false,
  },
];

export const DefaultDemo: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages);

  const handleMessageClick = (clickedId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        isActive: msg.id === clickedId,
      }))
    );
  };

  const handleFavoriteToggle = (toggledId: string) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === toggledId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );
  };

  return (
    <ClientMessagesSidebar
      messages={messages}
      onMessageClick={handleMessageClick}
      onFavoriteToggle={handleFavoriteToggle}
    />
  );
};

export default DefaultDemo;
