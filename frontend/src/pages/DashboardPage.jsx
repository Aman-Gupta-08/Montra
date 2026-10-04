import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { EmployeeDashboard } from '../components/dashboard/EmployeeDashboard';
import { BusinessDashboard } from '../components/dashboard/BusinessDashboard';
import { SkeletonCard, SkeletonChart } from '../components/dashboard/Skeleton';
import { FinanceHeroAnimation } from '../components/common/FinanceHeroAnimation';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonChart />
    </div>
  );
}

const GREETING = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardPage() {
  const { user } = useAuth();

  const accountType = user?.accountType || user?.userType;

  const DashboardComponent = {
    STUDENT: StudentDashboard,
    EMPLOYEE: EmployeeDashboard,
    BUSINESS_OWNER: BusinessDashboard,
  }[accountType] || EmployeeDashboard;

  return (
    <div className="flex flex-col gap-6">
      {/* Featured 3D Transparent Hero Banner (Liquid Glass) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="liquid-glass-banner relative overflow-hidden rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all"
      >
        {/* Iridescent ambient light refractions */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 space-y-3 z-10">
          <div className="liquid-glass-pill inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Wealth Intelligence Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
            Take Control of Your Finances
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
            Save smart, track every cent, and manage your wealth with autonomous high-yield vaults and real-time net worth intelligence.
          </p>
          <div className="pt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="liquid-glass-pill px-3 py-1.5 rounded-full flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/25">
              <ShieldCheck size={14} className="text-emerald-500" />
              Bank Grade 256-Bit Security
            </span>
          </div>
        </div>

        <FinanceHeroAnimation variant="compact" />
      </motion.div>

      {/* Greeting header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-primary-text dark:text-white">
          {GREETING()}, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="text-sm text-secondary-text mt-0.5">
          Here's your financial overview for today
        </p>
      </motion.div>

      {/* Dashboard content by account type */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardComponent />
      </Suspense>
    </div>
  );
}
