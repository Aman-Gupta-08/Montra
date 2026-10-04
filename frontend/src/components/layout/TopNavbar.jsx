import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, Menu, PanelLeftClose, PanelLeft, Check, CheckCheck, MessageSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/dashboardService';
import { useFetch } from '../../hooks/useFetch';

const ACCOUNT_TYPE_LABELS = {
  STUDENT: 'Student',
  EMPLOYEE: 'Employee',
  BUSINESS_OWNER: 'Business Owner',
};

const ACCOUNT_TYPE_COLORS = {
  STUDENT: { bg: '#EDEBF7', text: '#7C5CFC' },
  EMPLOYEE: { bg: '#E6F7F6', text: '#0EA5E9' },
  BUSINESS_OWNER: { bg: '#E6F7E4', text: '#10B981' },
};

function NotificationPanel({ onClose }) {
  const { data: notifications, isLoading, refetch } = useFetch(notificationService.getAll, []);

  const markAllRead = async () => {
    await notificationService.markAllRead();
    refetch();
  };

  const markOneRead = async (id) => {
    await notificationService.markRead(id);
    refetch();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute -right-6 sm:right-0 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm glass-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/90 dark:border-white/20 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/60 dark:border-white/10">
        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
        <button
          onClick={markAllRead}
          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
          title="Mark all as read"
        >
          <CheckCheck size={14} />
          Mark all read
        </button>
      </div>

      {/* List */}
      <div className="max-h-72 sm:max-h-80 overflow-y-auto scrollbar-hide">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <svg className="animate-spin w-5 h-5 text-violet-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
        {!isLoading && (!notifications || notifications.length === 0) && (
          <div className="flex flex-col items-center justify-center py-10 text-secondary-text">
            <Bell size={28} className="mb-2 opacity-40" />
            <p className="text-sm">All caught up!</p>
          </div>
        )}
        {!isLoading && notifications?.map((n) => (
          <div
            key={n.id}
            className={`px-3 sm:px-4 py-3 border-b border-gray-50 dark:border-gray-800/60 last:border-0 flex items-start gap-2.5 sm:gap-3 transition-colors ${
              !n.isRead ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''
            }`}
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-violet-500' : 'bg-transparent'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary-text dark:text-white truncate">{n.title}</p>
              <p className="text-xs text-secondary-text leading-relaxed mt-0.5 line-clamp-2">{n.message}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!n.isRead && (
              <button
                onClick={() => markOneRead(n.id)}
                className="flex-shrink-0 text-violet-500 hover:text-violet-700 transition-colors p-1"
                title="Mark as read"
              >
                <Check size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block text-center text-xs font-medium text-violet-600 hover:text-violet-700 py-1 transition-colors"
        >
          View all notifications
        </Link>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TOP NAVBAR
════════════════════════════════════════════════════════════════ */
export function TopNavbar({ pageTitle, onMenuToggle, sidebarCollapsed, onSidebarToggle }) {
  const { user } = useAuth();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { data: unreadNotifs, refetch: refetchUnread } = useFetch(notificationService.getUnread, []);
  const unreadCount = unreadNotifs?.length || 0;

  // Sync unread notification count on update events
  useEffect(() => {
    const handleNotifUpdate = () => {
      refetchUnread();
    };
    window.addEventListener('montra:notifications-changed', handleNotifUpdate);
    return () => window.removeEventListener('montra:notifications-changed', handleNotifUpdate);
  }, [refetchUnread]);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const effectiveAccountType = user?.accountType || user?.userType;
  const avatarColor = ACCOUNT_TYPE_COLORS[effectiveAccountType] || { bg: '#EDEBF7', text: '#7C5CFC' };

  return (
    <header className="min-h-16 pt-[max(env(safe-area-inset-top),0px)] glass-2 border-b border-white/70 dark:border-white/10 flex items-center justify-between px-3 sm:px-4 md:px-6 flex-shrink-0 sticky top-0 z-30 transition-all">
      {/* Left: hamburger + logo + sidebar toggle + page title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          id="mobile-menu-toggle"
          onClick={onMenuToggle}
          className="md:hidden glass-1 w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={19} />
        </button>

        {/* Mobile Montra Logo Symbol */}
        <div className="md:hidden w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-xs">
          <span className="text-white font-black text-xs">M</span>
        </div>

        {/* Desktop sidebar collapse toggle */}
        <button
          id="sidebar-collapse-btn"
          onClick={onSidebarToggle}
          className="hidden md:flex glass-1 w-9 h-9 rounded-xl items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-105 transition-all cursor-pointer flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <h1 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 dark:text-white tracking-tight truncate max-w-[110px] xs:max-w-[170px] sm:max-w-none">
          {pageTitle}
        </h1>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Theme toggle */}
        <button
          id="top-theme-toggle"
          onClick={toggleTheme}
          className="glass-1 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Toggle theme"
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-violet-600" />}
        </button>

        {/* Messages quick launcher */}
        <Link
          to="/messages"
          id="top-messages-btn"
          className="hidden xs:flex glass-1 relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Client Messages"
          title="Client Messages"
        >
          <MessageSquare size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
        </Link>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            id="notifications-btn"
            onClick={() => setNotifOpen((v) => !v)}
            className="glass-1 relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ''}`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-600 text-[10px] font-bold text-white flex items-center justify-center shadow-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* User avatar + info + Role Switcher */}
        <UserMenuDropdown user={user} avatarColor={avatarColor} />
      </div>
    </header>
  );
}

function UserMenuDropdown({ user, avatarColor }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();
  const effectiveAccountType = user?.accountType || user?.userType;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        id="user-profile-menu-btn"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 ml-1 pl-3 border-l border-gray-200/80 dark:border-white/10 text-left hover:opacity-90 transition-opacity cursor-pointer"
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 cursor-pointer shadow-xs"
          style={{ background: avatarColor.bg, color: avatarColor.text }}
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block cursor-pointer">
          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight truncate max-w-[120px]">
            {user?.name || 'User'}
          </p>
          <p className="text-xs font-medium" style={{ color: avatarColor.text }}>
            {ACCOUNT_TYPE_LABELS[effectiveAccountType] || 'Member'}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-1.5rem)] glass-3 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/90 dark:border-white/20 z-50 p-2 overflow-hidden"
          >
            <div className="px-3 py-2 border-b border-white/60 dark:border-white/10 mb-1">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Signed in as</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: avatarColor.bg, color: avatarColor.text }}>
                {ACCOUNT_TYPE_LABELS[effectiveAccountType] || 'Member'}
              </span>
            </div>

            <div className="py-1">
              <Link
                to="/profile"
                id="menu-profile-link"
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                Profile
              </Link>
              <Link
                to="/messages"
                id="menu-messages-link"
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                Messages
              </Link>
              <Link
                to="/settings"
                id="menu-settings-link"
                onClick={() => setOpen(false)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
              >
                Settings
              </Link>
            </div>

            <div className="border-t border-white/10 mt-1 pt-1">
              <button
                id="menu-logout-btn"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/15 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TopNavbar;

