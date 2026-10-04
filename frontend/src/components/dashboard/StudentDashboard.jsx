import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, Wallet, HandCoins, AlertTriangle,
} from 'lucide-react';
import { StatCard } from './StatCard';
import { SkeletonCard, SkeletonChart } from './Skeleton';
import { ErrorState, EmptyState, DashboardCard } from './States';
import {
  IncomeExpenseChart, MonthlySpendingChart, ExpenseCategoryChart,
} from '../charts/DashboardCharts';
import { useFetch } from '../../hooks/useFetch';
import { dashboardService } from '../../services/dashboardService';
import { loanService } from '../../services/loanRecurringService';


const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ═══════════════════════════════════════════════════════════════
   STUDENT DASHBOARD
════════════════════════════════════════════════════════════════ */
export function StudentDashboard() {
  const { data, isLoading, error, refetch } = useFetch(dashboardService.getDashboard);
  const { data: lentLoans, isLoading: lentLoading } = useFetch(loanService.getLent);
  const { data: borrowedLoans, isLoading: borrowedLoading } = useFetch(loanService.getBorrowed);
  const { data: overdueLoans, isLoading: overdueLoading } = useFetch(loanService.getOverdue);

  const totalLent = lentLoans?.reduce((s, l) => s + parseFloat(l.remainingAmount || 0), 0) || 0;
  const totalBorrowed = borrowedLoans?.reduce((s, l) => s + parseFloat(l.remainingAmount || 0), 0) || 0;
  const overdueCount = overdueLoans?.length || 0;

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <motion.div variants={stagger} initial="visible" animate="visible" className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5 sm:gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Income"
              value={data?.totalIncome}
              icon={TrendingUp}
              iconColor="#10B981"
              iconBg="#E6F7E4"
              index={0}
              className="xl:col-span-1"
            />
            <StatCard
              label="Total Expenses"
              value={data?.totalExpenses}
              icon={TrendingDown}
              iconColor="#EF4444"
              iconBg="#FEE2E2"
              index={1}
              className="xl:col-span-1"
            />
            <StatCard
              label="Available Balance"
              value={data?.availableBalance}
              icon={Wallet}
              iconColor="#7C5CFC"
              iconBg="#EDEBF7"
              index={2}
              className="xl:col-span-1"
            />
            <StatCard
              label="Money Lent"
              value={lentLoading ? 0 : totalLent}
              icon={HandCoins}
              iconColor="#0EA5E9"
              iconBg="#E6F7F6"
              index={3}
              className="xl:col-span-1"
            />
            <StatCard
              label="Money Borrowed"
              value={borrowedLoading ? 0 : totalBorrowed}
              icon={HandCoins}
              iconColor="#F59E0B"
              iconBg="#FAF8EB"
              index={4}
              className="xl:col-span-1"
            />
            <StatCard
              label="Overdue Loans"
              value={overdueLoading ? 0 : overdueCount}
              isCurrency={false}
              icon={AlertTriangle}
              iconColor={overdueCount > 0 ? '#EF4444' : '#10B981'}
              iconBg={overdueCount > 0 ? '#FEE2E2' : '#E6F7E4'}
              index={5}
              className="xl:col-span-1"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Income vs Expenses" subtitle="Current month overview">
          {isLoading ? (
            <div className="h-56 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
          ) : (
            <IncomeExpenseChart
              monthlyIncome={data?.monthlyIncome}
              monthlyExpenses={data?.monthlyExpenses}
            />
          )}
        </DashboardCard>

        <DashboardCard title="Monthly Spending" subtitle="Last 6 months trend">
          {isLoading ? (
            <div className="h-44 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
          ) : (
            <MonthlySpendingChart monthlyExpenses={data?.monthlyExpenses} />
          )}
        </DashboardCard>
      </div>

      {/* Category chart */}
      <DashboardCard title="Expense Categories" subtitle="Top spending areas">
        {isLoading ? (
          <div className="h-48 bg-gray-50 dark:bg-gray-800/40 rounded-xl animate-pulse" />
        ) : !data?.topExpenseCategories || Object.keys(data.topExpenseCategories).length === 0 ? (
          <EmptyState
            title="No expenses yet"
            description="Start tracking your expenses to see category breakdowns here."
          />
        ) : (
          <ExpenseCategoryChart topExpenseCategories={data.topExpenseCategories} />
        )}
      </DashboardCard>
    </motion.div>
  );
}
