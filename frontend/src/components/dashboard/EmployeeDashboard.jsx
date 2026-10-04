import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Banknote,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { SkeletonCard } from './Skeleton';
import { ErrorState, EmptyState, DashboardCard } from './States';
import {
  IncomeExpenseChart, MonthlySpendingChart, ExpenseCategoryChart,
} from '../charts/DashboardCharts';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

/* ═══════════════════════════════════════════════════════════════
   EMPLOYEE DASHBOARD
════════════════════════════════════════════════════════════════ */
export function EmployeeDashboard() {
  const { data, isLoading, error, refetch } = useFetch(dashboardService.getDashboard);

  const savings = data
    ? Math.max(0, parseFloat(data.totalIncome || 0) - parseFloat(data.totalExpenses || 0))
    : 0;

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <motion.div variants={stagger} initial="visible" animate="visible" className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Monthly Salary"
              value={data?.monthlyIncome}
              icon={Banknote}
              iconColor="#7C5CFC"
              iconBg="#EDEBF7"
              index={0}
            />
            <StatCard
              label="Total Income"
              value={data?.totalIncome}
              icon={TrendingUp}
              iconColor="#10B981"
              iconBg="#E6F7E4"
              index={1}
            />
            <StatCard
              label="Total Expenses"
              value={data?.totalExpenses}
              icon={TrendingDown}
              iconColor="#EF4444"
              iconBg="#FEE2E2"
              index={2}
            />
            <StatCard
              label="Available Balance"
              value={data?.availableBalance}
              icon={Wallet}
              iconColor="#0EA5E9"
              iconBg="#E6F7F6"
              index={3}
            />
            <StatCard
              label="Total Savings"
              value={savings}
              icon={PiggyBank}
              iconColor="#F59E0B"
              iconBg="#FAF8EB"
              index={4}
              trend={savings > 0 ? 'up' : 'neutral'}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Income vs Expenses" subtitle="Current month">
          {isLoading ? (
            <div className="h-56 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
          ) : (
            <IncomeExpenseChart
              monthlyIncome={data?.monthlyIncome}
              monthlyExpenses={data?.monthlyExpenses}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Monthly Spending" subtitle="6-month trend">
          {isLoading ? (
            <div className="h-44 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
          ) : (
            <MonthlySpendingChart monthlyExpenses={data?.monthlyExpenses} />
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Expense Categories" subtitle="Top spending areas">
        {isLoading ? (
          <div className="h-48 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
        ) : !data?.topExpenseCategories || Object.keys(data.topExpenseCategories).length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Track expenses to see category insights."
          />
        ) : (
          <ExpenseCategoryChart topExpenseCategories={data.topExpenseCategories} />
        )}
      </DashboardCard>
    </motion.div>
  );
}
