import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { SkeletonCard } from './components/dashboard/Skeleton';

// Public pages (eager)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Authenticated pages (lazy)
const DashboardPage    = lazy(() => import('./pages/DashboardPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const MessagesPage      = lazy(() => import('./pages/MessagesPage'));
const IncomePage       = lazy(() => import('./pages/IncomePage'));
const ExpensesPage     = lazy(() => import('./pages/ExpensesPage'));
const RecurringPage    = lazy(() => import('./pages/RecurringPage'));
const LoansPage        = lazy(() => import('./pages/LoansPage'));
const BudgetsPage      = lazy(() => import('./pages/BudgetsPage'));
const CalendarPage     = lazy(() => import('./pages/CalendarPage'));
const ReportsPage      = lazy(() => import('./pages/ReportsPage'));
const BusinessPage     = lazy(() => import('./pages/BusinessPage'));
const StaffPage        = lazy(() => import('./pages/StaffPage'));
const SalaryPage       = lazy(() => import('./pages/SalaryPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));
const ProfilePage      = lazy(() => import('./pages/ProfilePage'));
const SettingsPage     = lazy(() => import('./pages/SettingsPage'));
const DemoPage         = lazy(() => import('./components/ui/demo'));

/* ─── Route guards ─── */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function BusinessRoute({ children }) {
  const { user } = useAuth();
  const accountType = user?.accountType || user?.userType;
  if (accountType !== 'BUSINESS_OWNER') {
    return <UnauthorizedPage />;
  }
  return children;
}

/* ─── Suspense fallback ─── */
function PageLoader() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-64 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/* ─── Authenticated layout wrapper ─── */
function AuthLayout({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </AppLayout>
    </ProtectedRoute>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROUTES
════════════════════════════════════════════════════════════════ */
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Suspense fallback={null}><DemoPage /></Suspense>} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />

      {/* Authenticated: dashboard */}
      <Route path="/dashboard" element={<AuthLayout><DashboardPage /></AuthLayout>} />

      {/* Authenticated: notifications */}
      <Route path="/notifications" element={<AuthLayout><NotificationsPage /></AuthLayout>} />

      {/* Authenticated: client messages */}
      <Route path="/messages" element={<AuthLayout><MessagesPage /></AuthLayout>} />

      {/* Authenticated: income */}
      <Route path="/income" element={<AuthLayout><IncomePage /></AuthLayout>} />

      {/* Authenticated: expenses */}
      <Route path="/expenses" element={<AuthLayout><ExpensesPage /></AuthLayout>} />

      {/* Authenticated: recurring */}
      <Route path="/recurring" element={<AuthLayout><RecurringPage /></AuthLayout>} />

      {/* Authenticated: loans */}
      <Route path="/loans" element={<AuthLayout><LoansPage /></AuthLayout>} />

      {/* Authenticated: budgets */}
      <Route path="/budgets" element={<AuthLayout><BudgetsPage /></AuthLayout>} />

      {/* Authenticated: calendar */}
      <Route path="/calendar" element={<AuthLayout><CalendarPage /></AuthLayout>} />

      {/* Authenticated: reports */}
      <Route path="/reports" element={<AuthLayout><ReportsPage /></AuthLayout>} />

      {/* Authenticated: profile */}
      <Route path="/profile" element={<AuthLayout><ProfilePage /></AuthLayout>} />

      {/* Authenticated: settings */}
      <Route path="/settings" element={<AuthLayout><SettingsPage /></AuthLayout>} />

      {/* Business Owner Exclusive: /business */}
      <Route
        path="/business"
        element={
          <AuthLayout>
            <BusinessRoute>
              <BusinessPage />
            </BusinessRoute>
          </AuthLayout>
        }
      />

      {/* Business Owner Exclusive: /staff */}
      <Route
        path="/staff"
        element={
          <AuthLayout>
            <BusinessRoute>
              <StaffPage />
            </BusinessRoute>
          </AuthLayout>
        }
      />

      {/* Business Owner Exclusive: /salary */}
      <Route
        path="/salary"
        element={
          <AuthLayout>
            <BusinessRoute>
              <SalaryPage />
            </BusinessRoute>
          </AuthLayout>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP ROOT
════════════════════════════════════════════════════════════════ */
function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
