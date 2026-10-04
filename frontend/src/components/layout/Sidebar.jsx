import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, TrendingDown, RefreshCw,
  HandCoins, PiggyBank, CalendarDays, BarChart3,
  Bell, User, Settings, LogOut, Building2, Users, Wallet, X,
  MessageSquare,
} from 'lucide-react';
import { MontraLogo } from '../common/Logo';
import { AnimatedButton } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const BASE_NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Income', icon: TrendingUp, path: '/income' },
  { label: 'Expenses', icon: TrendingDown, path: '/expenses' },
  { label: 'Recurring', icon: RefreshCw, path: '/recurring' },
  { label: 'Borrow & Lend', icon: HandCoins, path: '/loans' },
  { label: 'Budgets', icon: PiggyBank, path: '/budgets' },
  { label: 'Calendar', icon: CalendarDays, path: '/calendar' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
  { label: 'Messages', icon: MessageSquare, path: '/messages', badge: '6' },
];

const BUSINESS_NAV = [
  { label: 'Business', icon: Building2, path: '/business' },
  { label: 'Staff', icon: Users, path: '/staff' },
  { label: 'Salary', icon: Wallet, path: '/salary' },
];

const BOTTOM_NAV = [
  { label: 'Profile', icon: User, path: '/profile' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

function NavItem({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-200 group relative
         ${isActive
           ? 'glass-4 bg-gradient-to-r from-violet-500/20 via-emerald-500/15 to-transparent text-violet-900 dark:text-white font-bold border border-violet-500/35 shadow-xs'
           : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 hover:backdrop-blur-md'
         }`
      }
      title={collapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="sidebar-active-pill"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-gradient-to-b from-violet-500 to-emerald-500 shadow-sm shadow-violet-500/50"
            />
          )}
          <item.icon size={18} className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-violet-600 dark:text-violet-400 drop-shadow-sm' : ''}`} />
          {!collapsed && (
            <span className="text-sm truncate flex-1">{item.label}</span>
          )}
          {!collapsed && item.badge && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-500/25">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarSection({ title, items, collapsed }) {
  return (
    <div>
      {!collapsed && title && (
        <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          {title}
        </p>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════════════════════════════ */
export function Sidebar({ collapsed = false, mobileOpen = false, onMobileClose }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const isBusinessOwner = (user?.accountType || user?.userType) === 'BUSINESS_OWNER';

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onMobileClose?.();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileOpen, onMobileClose]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/60 dark:border-white/10 flex-shrink-0">
        {!collapsed && <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />}
        {collapsed && (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xs">M</span>
          </div>
        )}
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all md:hidden"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 flex flex-col gap-6 scrollbar-hide">
        <SidebarSection items={BASE_NAV} collapsed={collapsed} />

        {isBusinessOwner && (
          <SidebarSection title="Business" items={BUSINESS_NAV} collapsed={collapsed} />
        )}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-white/60 dark:border-white/10 flex flex-col gap-0.5">
        {BOTTOM_NAV.map((item) => (
          <NavItem key={item.path} item={item} collapsed={collapsed} />
        ))}
        <div className="pt-1">
          <AnimatedButton
            id="sidebar-logout-btn"
            action="logout"
            variant="ghost"
            size="sm"
            iconOnly={collapsed}
            fullWidth={!collapsed}
            onClick={handleLogout}
            className={collapsed ? 'mx-auto text-red-500' : 'w-full justify-start text-red-500 hover:text-red-600'}
            title={collapsed ? 'Logout' : undefined}
          >
            {!collapsed ? 'Logout' : ''}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col glass-2 border-r border-white/70 dark:border-white/10 h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 max-w-[85vw] glass-3 border-r border-white/80 dark:border-white/15 md:hidden pt-[max(env(safe-area-inset-top),0px)] pb-[max(env(safe-area-inset-bottom),0px)] flex flex-col"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
