import { useState, useEffect } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, TrendingDown, HandCoins, MoreHorizontal,
  BarChart3, User, PiggyBank, RefreshCw, CalendarDays, Bell, MessageSquare,
  Building2, Users, Wallet, Settings, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PRIMARY_MOBILE_NAV = [
  { label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Income', icon: TrendingUp, path: '/income' },
  { label: 'Expenses', icon: TrendingDown, path: '/expenses' },
  { label: 'Loans', icon: HandCoins, path: '/loans' },
];

export function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const isBusinessOwner = (user?.accountType || user?.userType) === 'BUSINESS_OWNER';

  // Secondary routes covered by "More"
  const secondaryPaths = [
    '/reports', '/profile', '/budgets', '/recurring',
    '/calendar', '/notifications', '/messages', '/settings',
    '/business', '/staff', '/salary'
  ];
  const isMoreActive = secondaryPaths.some((p) => location.pathname.startsWith(p));

  // Close more sheet on route change
  useEffect(() => {
    setMoreOpen(false);
  }, [location.pathname]);

  // Lock body scroll when more sheet is open
  useEffect(() => {
    if (moreOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [moreOpen]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 dark:bg-[#161618]/92 backdrop-blur-xl border-t border-gray-200/60 dark:border-white/10 flex items-center justify-around px-1 pt-1.5 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-lg shadow-black/10">
        {PRIMARY_MOBILE_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-[56px] ${
                isActive
                  ? 'text-violet-600 dark:text-violet-400 font-semibold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-violet-100/80 dark:bg-violet-900/40 shadow-xs' : ''}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* "More" Sheet trigger button */}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-[56px] cursor-pointer ${
            isMoreActive || moreOpen
              ? 'text-violet-600 dark:text-violet-400 font-semibold'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
          aria-label="More destinations"
        >
          <div className={`p-1.5 rounded-xl transition-all ${isMoreActive || moreOpen ? 'bg-violet-100/80 dark:bg-violet-900/40 shadow-xs' : ''}`}>
            <MoreHorizontal size={20} />
          </div>
          <span className="text-[10px] tracking-tight">More</span>
        </button>
      </nav>

      {/* Slide-Up Navigation Sheet for Secondary Pages */}
      <AnimatePresence>
        {moreOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMoreOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-h-[82vh] bg-white/95 dark:bg-[#18181c]/95 backdrop-blur-2xl rounded-t-3xl border-t border-white/80 dark:border-white/10 flex flex-col pb-[max(env(safe-area-inset-bottom),1rem)] overflow-hidden shadow-2xl"
            >
              {/* Sheet Drag / Header */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">All Destinations</span>
                </div>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
                  aria-label="Close sheet"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Destinations List */}
              <div className="overflow-y-auto px-4 py-3 flex flex-col gap-4 text-sm">
                {/* Finance Utilities */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-1.5">
                    Finance Tools
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/reports"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300">
                        <BarChart3 size={18} />
                      </div>
                      <span className="font-medium text-xs">Reports</span>
                    </Link>

                    <Link
                      to="/budgets"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                        <PiggyBank size={18} />
                      </div>
                      <span className="font-medium text-xs">Budgets</span>
                    </Link>

                    <Link
                      to="/recurring"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300">
                        <RefreshCw size={18} />
                      </div>
                      <span className="font-medium text-xs">Recurring</span>
                    </Link>

                    <Link
                      to="/calendar"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 p-3 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-gray-800 dark:text-gray-200 transition-colors"
                    >
                      <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300">
                        <CalendarDays size={18} />
                      </div>
                      <span className="font-medium text-xs">Calendar</span>
                    </Link>
                  </div>
                </div>

                {/* Business Owner Section */}
                {isBusinessOwner && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 px-2 mb-1.5">
                      Business Suite
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <Link
                        to="/business"
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-center transition-colors"
                      >
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                          <Building2 size={18} />
                        </div>
                        <span className="font-medium text-[11px]">Business</span>
                      </Link>

                      <Link
                        to="/staff"
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-center transition-colors"
                      >
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                          <Users size={18} />
                        </div>
                        <span className="font-medium text-[11px]">Staff</span>
                      </Link>

                      <Link
                        to="/salary"
                        onClick={() => setMoreOpen(false)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-gray-50/80 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-center transition-colors"
                      >
                        <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300">
                          <Wallet size={18} />
                        </div>
                        <span className="font-medium text-[11px]">Salary</span>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Account & Communication */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-1.5">
                    Account & Connect
                  </p>
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/notifications"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-violet-500" />
                        <span className="font-medium">Notifications</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>

                    <Link
                      to="/messages"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare size={18} className="text-emerald-500" />
                        <span className="font-medium">Client Messages</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <User size={18} className="text-blue-500" />
                        <span className="font-medium">Profile</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings size={18} className="text-amber-500" />
                        <span className="font-medium">Settings</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileBottomNav;

