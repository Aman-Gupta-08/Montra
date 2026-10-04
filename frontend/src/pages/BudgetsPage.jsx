import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, PiggyBank, Pencil, Trash2, Search, Filter, AlertTriangle,
  TrendingDown, CheckCircle2, Clock, ChevronDown, X, Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { budgetService } from '../services/budgetCalendarService';
import { BudgetForm } from '../components/forms/BudgetForm';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import {
  EXPENSE_CATEGORIES,
  CATEGORY_COLORS,
  BUDGET_PERIODS,
  getBudgetStatusConfig,
} from '../constants/finance';
import { Button } from '../components/common/Button';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/* ─── Summary Cards ─── */
function SummaryCards({ budgets }) {
  const totalBudget = useMemo(
    () => budgets.reduce((acc, b) => acc + parseFloat(b.amount || 0), 0),
    [budgets]
  );
  const totalSpent = useMemo(
    () => budgets.reduce((acc, b) => acc + parseFloat(b.currentSpent || 0), 0),
    [budgets]
  );
  const totalRemaining = Math.max(0, totalBudget - totalSpent);
  const warningOrExceeded = useMemo(
    () => budgets.filter((b) => {
      const s = parseFloat(b.currentSpent || 0);
      const a = parseFloat(b.amount || 0);
      return b.status === 'EXCEEDED' || b.status === 'WARNING' || (a > 0 && s / a >= 0.8);
    }).length,
    [budgets]
  );

  const overallRatio = totalBudget > 0 ? Math.min(100, (totalSpent / totalBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      {[
        {
          label: 'Total Budgeted',
          value: fmt(totalBudget),
          sub: `${budgets.length} active ${budgets.length === 1 ? 'budget' : 'budgets'}`,
          color: '#7C5CFC',
          bg: '#EDEBF7',
          icon: PiggyBank,
        },
        {
          label: 'Total Spent',
          value: fmt(totalSpent),
          sub: `${overallRatio.toFixed(0)}% of limit`,
          color: '#EF4444',
          bg: '#FEE2E2',
          icon: TrendingDown,
        },
        {
          label: 'Total Remaining',
          value: fmt(totalRemaining),
          sub: totalRemaining === 0 && totalSpent > totalBudget ? 'Budget exceeded' : 'Safe to spend',
          color: '#10B981',
          bg: '#E6F7E4',
          icon: CheckCircle2,
        },
        {
          label: 'Alerts',
          value: warningOrExceeded,
          sub: warningOrExceeded === 0 ? 'Healthy' : 'Near/exceeding',
          color: warningOrExceeded > 0 ? '#D97706' : '#6B7280',
          bg: warningOrExceeded > 0 ? '#FAF8EB' : '#F3F4F6',
          icon: AlertTriangle,
        },
      ].map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-gray-200/60 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start gap-2 sm:gap-3 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
            <c.icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: c.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-xs font-medium text-secondary-text mb-0.5 truncate">{c.label}</p>
            <p className="text-sm sm:text-lg font-bold truncate" style={{ color: c.color }}>{c.value}</p>
            <p className="text-[10px] sm:text-xs text-secondary-text mt-0.5 truncate">{c.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Budget Card ─── */
function BudgetCard({ budget, onEdit, onDelete, index }) {
  const amount = parseFloat(budget.amount || 0);
  const spent = parseFloat(budget.currentSpent || 0);
  const remaining = parseFloat(budget.remainingAmount !== undefined ? budget.remainingAmount : (amount - spent));
  const progressPct = amount > 0 ? (spent / amount) * 100 : 0;
  const clampedProgress = Math.min(100, Math.max(0, progressPct));

  // Determine status (use backend status if present, otherwise calculate)
  const statusCfg = getBudgetStatusConfig(budget.status, spent, amount);

  const colors = CATEGORY_COLORS[budget.category] || { bg: '#F3F4F6', text: '#6B7280' };
  const catLabel = EXPENSE_CATEGORIES.find((c) => c.value === budget.category)?.label || budget.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white dark:bg-gray-900 rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${statusCfg.border}`}
    >
      <div>
        {/* Card Header: Category badge + Status + Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{ background: colors.bg, color: colors.text }}
            >
              {catLabel}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-medium text-secondary-text bg-gray-100 dark:bg-gray-800">
              {budget.period}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id={`edit-budget-${budget.id}`}
              onClick={() => onEdit(budget)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all"
              title="Edit Budget"
            >
              <Pencil size={13} />
            </button>
            <button
              id={`delete-budget-${budget.id}`}
              onClick={() => onDelete(budget)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Delete Budget"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* State Banner */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
            style={{ background: statusCfg.bg, color: statusCfg.text }}
          >
            {statusCfg.label === '100% Exceeded' && <AlertTriangle size={11} />}
            {statusCfg.label === '80% Warning' && <AlertCircle size={11} />}
            {statusCfg.label === 'On Track' && <CheckCircle2 size={11} />}
            {statusCfg.label}
          </span>
          <span className="text-xs font-bold" style={{ color: statusCfg.bar }}>
            {progressPct.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${clampedProgress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: statusCfg.bar }}
          />
        </div>

        {/* Numbers Grid: Budget | Spent | Remaining */}
        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-gray-100 dark:border-gray-800 my-2">
          <div>
            <p className="text-[11px] text-secondary-text mb-0.5">Budget</p>
            <p className="text-sm font-bold text-primary-text dark:text-white truncate">{fmt(amount)}</p>
          </div>
          <div>
            <p className="text-[11px] text-secondary-text mb-0.5">Spent</p>
            <p className="text-sm font-bold truncate" style={{ color: statusCfg.bar }}>{fmt(spent)}</p>
          </div>
          <div>
            <p className="text-[11px] text-secondary-text mb-0.5">Remaining</p>
            <p className={`text-sm font-bold truncate ${remaining <= 0 ? 'text-red-500' : 'text-emerald-600'}`}>
              {fmt(remaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Date timeline footer */}
      <div className="flex items-center justify-between text-xs text-secondary-text pt-2">
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {fmtDate(budget.startDate)} – {fmtDate(budget.endDate)}
        </span>
        {remaining < 0 && (
          <span className="text-xs text-red-500 font-semibold">
            Over by {fmt(Math.abs(remaining))}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BUDGETS PAGE
════════════════════════════════════════════════════════════════ */
export default function BudgetsPage() {
  const { data: budgets, isLoading, error, refetch } = useFetch(budgetService.getAll);

  const [search, setSearch] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);

  // Panels
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!budgets) return [];
    let list = budgets;

    if (filterPeriod !== 'ALL') {
      list = list.filter((b) => b.period === filterPeriod);
    }

    if (filterStatus !== 'ALL') {
      list = list.filter((b) => {
        const spent = parseFloat(b.currentSpent || 0);
        const amt = parseFloat(b.amount || 0);
        const resolved = b.status || (amt > 0 && spent / amt >= 1.0 ? 'EXCEEDED' : spent / amt >= 0.8 ? 'WARNING' : 'OK');
        return resolved === filterStatus;
      });
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) => {
        const catLabel = EXPENSE_CATEGORIES.find((c) => c.value === b.category)?.label || b.category;
        return catLabel.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
      });
    }

    return list;
  }, [budgets, filterPeriod, filterStatus, search]);

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingBudget(null);
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await budgetService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      /* keep modal */
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      {!isLoading && budgets && <SummaryCards budgets={budgets} />}

      {/* Action & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text" />
          <input
            id="budget-search"
            type="text"
            placeholder="Search by category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 transition-all"
          />
        </div>

        <Button
          id="budget-filter-btn"
          action="filter"
          variant={showFilters || filterPeriod !== 'ALL' || filterStatus !== 'ALL' ? 'secondary' : undefined}
          size="md"
          onClick={() => setShowFilters(!showFilters)}
          rightIcon={
            (filterPeriod !== 'ALL' || filterStatus !== 'ALL') ? (
              <span className="w-2 h-2 rounded-full bg-violet-600" />
            ) : (
              <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            )
          }
        >
          Filters
        </Button>

        <Button
          id="add-budget-btn"
          action="save"
          size="md"
          onClick={() => { setEditingBudget(null); setFormOpen(true); }}
        >
          Create Budget
        </Button>
      </div>

      {/* Filter Options Drawer */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Period filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-secondary-text mr-1">Period:</span>
                {['ALL', ...BUDGET_PERIODS.map((p) => p.value)].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilterPeriod(p)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      filterPeriod === p
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-secondary-text hover:text-primary-text'
                    }`}
                  >
                    {p === 'ALL' ? 'All Periods' : p}
                  </button>
                ))}
              </div>

              {/* Status filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-secondary-text mr-1">Status:</span>
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'OK', label: 'On Track' },
                  { key: 'WARNING', label: '80% Warning' },
                  { key: 'EXCEEDED', label: 'Exceeded' },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setFilterStatus(s.key)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      filterStatus === s.key
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-gray-800 text-secondary-text hover:text-primary-text'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {(filterPeriod !== 'ALL' || filterStatus !== 'ALL') && (
                <button
                  onClick={() => { setFilterPeriod('ALL'); setFilterStatus('ALL'); }}
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
                >
                  <X size={12} /> Reset filters
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Budgets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PiggyBank}
          title={budgets?.length === 0 ? 'No budgets set yet' : 'No budgets match your filters'}
          description={
            budgets?.length === 0
              ? 'Create a category budget to control your spending and receive 80% & 100% threshold alerts.'
              : 'Try clearing your search or filters.'
          }
          actionLabel={budgets?.length === 0 ? 'Create Your First Budget' : undefined}
          onAction={budgets?.length === 0 ? () => setFormOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((b, i) => (
              <BudgetCard
                key={b.id}
                budget={b}
                index={i}
                onEdit={(item) => { setEditingBudget(item); setFormOpen(true); }}
                onDelete={(item) => setDeleteTarget(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* SlidePanel for Create / Edit Budget */}
      <SlidePanel
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingBudget(null); }}
        title={editingBudget ? 'Edit Category Budget' : 'Set Category Budget'}
      >
        <BudgetForm
          existing={editingBudget}
          onSuccess={handleFormSuccess}
          onCancel={() => { setFormOpen(false); setEditingBudget(null); }}
        />
      </SlidePanel>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Budget?"
        message={`Are you sure you want to delete the ${deleteTarget?.category} budget of ${fmt(deleteTarget?.amount)}? This action cannot be undone.`}
        confirmText="Delete Budget"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
