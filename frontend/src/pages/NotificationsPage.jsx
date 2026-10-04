import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Check, CheckCheck, HandCoins, AlertTriangle,
  CalendarDays, Wallet, PiggyBank, ArrowDownLeft, ArrowUpRight,
  Filter, Search, Clock, Info,
} from 'lucide-react';
import { notificationService } from '../services/dashboardService';
import { useFetch } from '../hooks/useFetch';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { Button } from '../components/common/Button';

const NOTIFICATION_TYPE_CONFIG = {
  LOAN_DUE: {
    label: 'Loan Due',
    icon: HandCoins,
    color: '#D97706',
    bg: '#FAF8EB',
    text: '#B45309',
    badge: 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300',
  },
  LOAN_OVERDUE: {
    label: 'Loan Overdue',
    icon: AlertTriangle,
    color: '#DC2626',
    bg: '#FEE2E2',
    text: '#B91C1C',
    badge: 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300',
  },
  BILL_DUE: {
    label: 'Bill Due',
    icon: CalendarDays,
    color: '#7C5CFC',
    bg: '#EDEBF7',
    text: '#6D28D9',
    badge: 'bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300',
  },
  SALARY_DUE: {
    label: 'Salary Due',
    icon: Wallet,
    color: '#0284C7',
    bg: '#E6F7F6',
    text: '#0369A1',
    badge: 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300',
  },
  BUDGET_WARNING: {
    label: 'Budget Warning',
    icon: PiggyBank,
    color: '#EA580C',
    bg: '#FFF7ED',
    text: '#C2410C',
    badge: 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300',
  },
  PAYMENT_RECEIVED: {
    label: 'Payment Received',
    icon: ArrowDownLeft,
    color: '#059669',
    bg: '#E6F7E4',
    text: '#047857',
    badge: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300',
  },
  PAYMENT_MADE: {
    label: 'Payment Made',
    icon: ArrowUpRight,
    color: '#4F46E5',
    bg: '#EEF2FF',
    text: '#4338CA',
    badge: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300',
  },
  SYSTEM: {
    label: 'System',
    icon: Info,
    color: '#6B7280',
    bg: '#F3F4F6',
    text: '#4B5563',
    badge: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  },
};

function formatTimestamp(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NotificationsPage() {
  const { data: notifications, isLoading, error, refetch } = useFetch(notificationService.getAll);

  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'UNREAD'
  const [selectedType, setSelectedType] = useState('ALL');
  const [search, setSearch] = useState('');

  const unreadCount = useMemo(
    () => notifications?.filter((n) => !n.isRead).length || 0,
    [notifications]
  );

  const markAllRead = async () => {
    await notificationService.markAllRead();
    refetch();
  };

  const markRead = async (id) => {
    await notificationService.markRead(id);
    refetch();
  };

  // Filtered Notifications
  const filtered = useMemo(() => {
    if (!notifications) return [];
    let list = notifications;

    if (filterTab === 'UNREAD') {
      list = list.filter((n) => !n.isRead);
    }

    if (selectedType !== 'ALL') {
      list = list.filter((n) => n.type === selectedType);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q) ||
          n.type?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [notifications, filterTab, selectedType, search]);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* ─── Top Header & Mark All ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-primary-text dark:text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-secondary-text mt-1">
            Stay updated with your loans, bills, budgets, and payment alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            id="mark-all-read-btn"
            size="md"
            onClick={markAllRead}
            className="self-start sm:self-auto"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* ─── Tabs & Filters Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Unread vs All Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#070f0e]/90 border border-[#13231e] shadow-xl backdrop-blur-md">
          <button
            id="notif-tab-all"
            onClick={() => setFilterTab('ALL')}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterTab === 'ALL'
                ? 'bg-[#6b00ff] text-white shadow-lg shadow-purple-600/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            All ({notifications?.length || 0})
          </button>
          <button
            id="notif-tab-unread"
            onClick={() => setFilterTab('UNREAD')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              filterTab === 'UNREAD'
                ? 'bg-[#6b00ff] text-white shadow-lg shadow-purple-600/40'
                : 'text-zinc-300 hover:text-white'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#ff0033] text-white shadow-md shadow-red-500/30">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            id="notif-search"
            type="text"
            placeholder="Search alerts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-full bg-[#070f0e]/90 border border-[#13231e] text-xs text-gray-100 placeholder:text-gray-400 outline-none transition-all"
          />
        </div>
      </div>

      {/* ─── Type Filter Pills ─── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 max-w-full scrollbar-none touch-scroll">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border cursor-pointer ${
            selectedType === 'ALL'
              ? 'bg-[#6b00ff] border-[#6b00ff] text-white shadow-lg shadow-purple-600/40'
              : 'bg-[#070f0e]/90 border-[#13231e] text-zinc-300 hover:text-white'
          }`}
        >
          All Types
        </button>

        {Object.entries(NOTIFICATION_TYPE_CONFIG).map(([typeKey, cfg]) => {
          const isSelected = selectedType === typeKey;
          const count = notifications?.filter((n) => n.type === typeKey).length || 0;
          if (count === 0 && selectedType !== typeKey) return null;

          return (
            <button
              key={typeKey}
              onClick={() => setSelectedType(typeKey)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#6b00ff] border-[#6b00ff] text-white shadow-lg shadow-purple-600/40'
                  : 'bg-[#091312]/90 border-[#142621] text-zinc-300 hover:text-white hover:border-[#1e3a33]'
              }`}
            >
              <cfg.icon size={14} className={isSelected ? 'text-white' : 'text-zinc-400'} />
              <span>{cfg.label}</span>
              <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-zinc-400'}`}>({count})</span>
            </button>
          );
        })}
      </div>

      {/* ─── Notifications List ─── */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-4 border border-white/70 dark:border-white/10 animate-pulse h-24"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={filterTab === 'UNREAD' ? 'No unread notifications' : 'No notifications found'}
          description={
            filterTab === 'UNREAD'
              ? 'You have caught up with all financial reminders, loans, and budget updates.'
              : 'Try clearing your filters or search query.'
          }
          actionLabel={filterTab === 'UNREAD' ? 'View All Notifications' : undefined}
          onAction={filterTab === 'UNREAD' ? () => setFilterTab('ALL') : undefined}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((n, i) => {
              const cfg = NOTIFICATION_TYPE_CONFIG[n.type] || NOTIFICATION_TYPE_CONFIG.SYSTEM;
              const Icon = cfg.icon;

              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-card rounded-2xl p-4.5 border transition-all relative group flex items-start gap-3.5 shadow-xs ${
                    !n.isRead
                      ? 'border-violet-500/50 bg-gradient-to-r from-violet-500/10 via-transparent to-transparent'
                      : 'border-white/70 dark:border-white/10'
                  }`}
                >
                  {/* Unread indicator bar */}
                  {!n.isRead && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-violet-600 rounded-r-full shadow-sm shadow-violet-500/50" />
                  )}

                  {/* Icon Avatar */}
                  <div
                    className="w-10 h-10 rounded-2xl glass-1 flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: cfg.bg,
                      borderColor: `${cfg.color}33`,
                    }}
                  >
                    <Icon size={18} style={{ color: cfg.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {cfg.label}
                        </span>
                        <h4
                          className={`text-sm font-bold ${
                            !n.isRead ? 'text-primary-text dark:text-white' : 'text-secondary-text'
                          }`}
                        >
                          {n.title}
                        </h4>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!n.isRead ? (
                          <button
                            id={`mark-read-${n.id}`}
                            onClick={() => markRead(n.id)}
                            className="flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700 px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/30 transition-all"
                            title="Mark as read"
                          >
                            <Check size={14} />
                            <span className="hidden sm:inline">Mark read</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 flex items-center gap-1">
                            <CheckCheck size={13} />
                            <span className="hidden sm:inline">Read</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-secondary-text leading-relaxed mt-1">
                      {n.message}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {formatTimestamp(n.createdAt)}
                      </span>
                      {n.referenceId && (
                        <span>Ref #{n.referenceId}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
