import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, DollarSign, Users, Clock, Banknote,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { SkeletonCard } from './Skeleton';
import { ErrorState, EmptyState, DashboardCard } from './States';
import { BusinessProfitChart } from '../charts/DashboardCharts';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

/* ═══════════════════════════════════════════════════════════════
   BUSINESS OWNER DASHBOARD
════════════════════════════════════════════════════════════════ */
export function BusinessDashboard() {
  const { data, isLoading, error, refetch } = useFetch(dashboardService.getBusinessDashboard);

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const stats = [
    {
      label: "Today's Sales",
      value: data?.todaysSales,
      icon: TrendingUp,
      iconColor: '#10B981',
      iconBg: '#E6F7E4',
    },
    {
      label: 'Monthly Sales',
      value: data?.monthlySales,
      icon: Banknote,
      iconColor: '#7C5CFC',
      iconBg: '#EDEBF7',
    },
    {
      label: "Today's Expenses",
      value: data?.todaysExpenses,
      icon: TrendingDown,
      iconColor: '#EF4444',
      iconBg: '#FEE2E2',
    },
    {
      label: 'Monthly Expenses',
      value: data?.monthlyExpenses,
      icon: DollarSign,
      iconColor: '#F59E0B',
      iconBg: '#FAF8EB',
    },
    {
      label: "Today's Profit",
      value: data?.todaysProfit,
      icon: TrendingUp,
      iconColor: data?.todaysProfit >= 0 ? '#10B981' : '#EF4444',
      iconBg: data?.todaysProfit >= 0 ? '#E6F7E4' : '#FEE2E2',
      trend: data?.todaysProfit >= 0 ? 'up' : 'down',
    },
    {
      label: 'Monthly Profit',
      value: data?.monthlyProfit,
      icon: TrendingUp,
      iconColor: data?.monthlyProfit >= 0 ? '#10B981' : '#EF4444',
      iconBg: data?.monthlyProfit >= 0 ? '#E6F7E4' : '#FEE2E2',
      trend: data?.monthlyProfit >= 0 ? 'up' : 'down',
    },
    {
      label: 'Pending Salaries',
      value: data?.pendingSalaries,
      icon: Clock,
      iconColor: '#F59E0B',
      iconBg: '#FAF8EB',
    },
    {
      label: 'Active Staff',
      value: data?.activeStaffCount,
      isCurrency: false,
      icon: Users,
      iconColor: '#0EA5E9',
      iconBg: '#E6F7F6',
    },
  ];

  return (
    <motion.div variants={stagger} initial="visible" animate="visible" className="flex flex-col gap-6">
      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : stats.map((s, i) => (
              <StatCard
                key={s.label}
                {...s}
                index={i}
                isCurrency={s.isCurrency !== false}
              />
            ))}
      </div>

      {/* Business profit chart */}
      <DashboardCard
        title="Business Performance"
        subtitle="Today vs this month — sales, expenses, profit"
      >
        {isLoading ? (
          <div className="h-56 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
        ) : !data ? (
          <EmptyState
            title="No business data"
            description="Start recording sales and expenses to see your performance."
          />
        ) : (
          <BusinessProfitChart
            todaysSales={data?.todaysSales}
            todaysExpenses={data?.todaysExpenses}
            monthlySales={data?.monthlySales}
            monthlyExpenses={data?.monthlyExpenses}
          />
        )}
      </DashboardCard>

      {/* Profit summary cards */}
      {!isLoading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DashboardCard title="Today's Summary" subtitle="Sales, expenses & profit for today">
            <div className="flex flex-col gap-2.5 mt-1">
              {[
                { label: 'Sales', value: data.todaysSales, color: '#10B981' },
                { label: 'Expenses', value: data.todaysExpenses, color: '#EF4444' },
                { label: 'Profit', value: data.todaysProfit, color: data.todaysProfit >= 0 ? '#7C5CFC' : '#EF4444' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 px-3.5 rounded-2xl glass-1 border border-white/60 dark:border-white/10 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.label}</span>
                  <span className="text-sm font-bold tracking-tight" style={{ color: row.color }}>
                    ₹{Number(row.value || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard title="Monthly Summary" subtitle="Aggregated this month">
            <div className="flex flex-col gap-2.5 mt-1">
              {[
                { label: 'Sales', value: data.monthlySales, color: '#10B981' },
                { label: 'Expenses', value: data.monthlyExpenses, color: '#EF4444' },
                { label: 'Profit', value: data.monthlyProfit, color: data.monthlyProfit >= 0 ? '#7C5CFC' : '#EF4444' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between py-2.5 px-3.5 rounded-2xl glass-1 border border-white/60 dark:border-white/10 transition-all hover:bg-white/80 dark:hover:bg-white/10">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{row.label}</span>
                  <span className="text-sm font-bold tracking-tight" style={{ color: row.color }}>
                    ₹{Number(row.value || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>
      )}
    </motion.div>
  );
}
