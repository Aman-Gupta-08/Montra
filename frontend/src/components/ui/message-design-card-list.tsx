'use client';

import React, { useState, useMemo } from 'react';
import { Search, Star, X, MessageSquare, Filter } from 'lucide-react';
import clsx from 'clsx';

export interface MessageProps {
  id: string;
  avatar: string;
  name: string;
  text: string;
  date: string;
  isFavorite?: boolean;
  isActive?: boolean;
}

export interface ClientMessagesSidebarProps {
  messages: MessageProps[];
  onMessageClick?: (id: string) => void;
  onFavoriteToggle?: (id: string) => void;
  title?: string;
  className?: string;
  showFilters?: boolean;
}

export const ClientMessagesSidebar: React.FC<ClientMessagesSidebarProps> = ({
  messages,
  onMessageClick,
  onFavoriteToggle,
  title = 'client messages',
  className,
  showFilters = true,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'favorites'>('all');

  // Filter messages based on search and favorite tab
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFavorite = filterType === 'all' ? true : !!msg.isFavorite;
      return matchesSearch && matchesFavorite;
    });
  }, [messages, searchTerm, filterType]);

  return (
    <div className={clsx('sidebar', className)}>
      <div className="sidebar-header">
        <h2>
          <MessageSquare className="size-5 text-violet-600 dark:text-violet-400" />
          {title}
        </h2>
        <div className="tools">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title="Search messages"
            aria-label="Search messages"
          >
            {searchOpen ? (
              <X className="size-5 text-gray-500" />
            ) : (
              <Search className="size-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Glass Search Field */}
      {searchOpen && (
        <div className="px-3 pt-2 pb-1 relative z-10 transition-all">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or message..."
              autoFocus
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl glass-input text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {showFilters && (
        <div className="flex items-center gap-1 px-3 pt-2 pb-1 z-10">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={clsx(
              'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all',
              filterType === 'all'
                ? 'bg-violet-600/15 text-violet-700 dark:text-violet-300 border border-violet-500/30'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            )}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('favorites')}
            className={clsx(
              'px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1',
              filterType === 'favorites'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
            )}
          >
            <Star className="size-3 fill-current text-amber-500" />
            Favorites ({messages.filter((m) => m.isFavorite).length})
          </button>
        </div>
      )}

      <div className="messages">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <MessageSquare className="size-8 text-gray-400/50 mb-2" />
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              No messages found
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {searchTerm ? 'Try adjusting your search' : 'No messages in this folder'}
            </p>
          </div>
        ) : (
          filteredMessages.map((message) => (
            <div
              key={message.id}
              className={clsx('message', { active: message.isActive })}
              onClick={() => onMessageClick?.(message.id)}
            >
              <div className="message-body">
                <div className="profile-img">
                  <img src={message.avatar} alt={message.name} />
                </div>
                <div className="profile">
                  <div className="profile-name">
                    <h3>{message.name}</h3>
                    <Star
                      className={clsx('size-5', { fav: message.isFavorite })}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent message click from firing
                        onFavoriteToggle?.(message.id);
                      }}
                    />
                  </div>
                  <div className="profile-text">
                    <p>{message.text}</p>
                  </div>
                </div>
              </div>
              <div className="message-footer">
                <div className="date">{message.date}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientMessagesSidebar;
