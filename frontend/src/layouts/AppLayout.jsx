import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNavbar } from '../components/layout/TopNavbar';
import { MobileBottomNav } from '../components/layout/MobileNav';
import KineticGrid from '../components/ui/kinetic-grid';
import { useTheme } from '../context/ThemeContext';

const PAGE_TITLES = {
  '/dashboard':     'Dashboard',
  '/income':        'Income',
  '/expenses':      'Expenses',
  '/recurring':     'Recurring Expenses',
  '/loans':         'Borrow & Lend',
  '/budgets':       'Budgets',
  '/calendar':      'Calendar',
  '/reports':       'Reports',
  '/notifications': 'Notifications',
  '/business':      'Business',
  '/staff':         'Staff',
  '/salary':        'Salary',
  '/profile':       'Profile',
  '/settings':      'Settings',
};

export function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { isDark } = useTheme();

  const pageTitle = PAGE_TITLES[location.pathname] || 'Montra';

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <KineticGrid
      className="h-screen w-screen overflow-hidden"
      globalColor={isDark ? "default" : "light"}
    >
      <div className="flex h-screen overflow-hidden bg-transparent relative">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main column */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
          {/* Top Navbar */}
          <TopNavbar
            pageTitle={pageTitle}
            onMenuToggle={() => setMobileOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
            onSidebarToggle={() => setSidebarCollapsed((v) => !v)}
          />

          {/* Scrollable page content with safe-area spacing */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8 relative touch-scroll">
            {/* Iridescent background refraction glows for Liquid Glass */}
            <div className="absolute top-12 left-1/4 w-[420px] h-[420px] bg-emerald-400/15 dark:bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-violet-400/15 dark:bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-[360px] h-[360px] bg-teal-300/15 dark:bg-teal-500/10 rounded-full blur-[110px] pointer-events-none" />

            <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8 relative z-10">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile bottom nav */}
        <MobileBottomNav />
      </div>
    </KineticGrid>
  );
}

export default AppLayout;
