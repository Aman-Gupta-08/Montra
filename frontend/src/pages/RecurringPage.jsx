import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, RefreshCw, Pencil, Trash2, Calendar, Zap, ZapOff,
  CheckCircle, Clock, Search, Filter, ChevronDown, X,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { recurringService } from '../services/loanRecurringService';
import { RecurringExpenseForm } from '../components/forms/RecurringExpenseForm';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import {
  EXPENSE_CATEGORIES, FREQUENCIES,
  getCategoryLabel, getFrequencyLabel, CATEGORY_COLORS,
} from '../constants/finance';
import { Button } from '../components/common/Button';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function isDueSoon(dateStr) {
  if (!dateStr) return false;
  const diff = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}

function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

/* ─── Summary ─── */
function SummaryCards({ items }) {
  const active = items.filter((i) => i.isActive);
  const monthly = useMemo(() => {
    const MULT = { DAILY: 30, WEEKLY: 4.33, MONTHLY: 1, YEARLY: 1 / 12 };
    return active.reduce((s, i) => s + parseFloat(i.amount || 0) * (MULT[i.frequency] || 1), 0);
  }, [active]);
  const dueSoon = active.filter((i) => isDueSoon(i.nextDueDate)).length;

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {[
        { label: 'Subscriptions', value: active.length, isCurrency: false, color: '#7C5CFC', bg: '#EDEBF7' },
        { label: 'Est. Monthly', value: formatAmount(monthly), color: '#EF4444', bg: '#FEE2E2' },
        { label: 'Due This Week', value: dueSoon, isCurrency: false, color: '#D97706', bg: '#FAF8EB' },
      ].map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-gray-200/60 dark:border-white/10 shadow-lg hover:border-violet-500/30 transition-all min-w-0"
        >
          <p className="text-[10px] sm:text-xs font-medium text-secondary-text mb-0.5 sm:mb-1 truncate">{c.label}</p>
          <p className="text-sm sm:text-xl font-bold truncate" style={{ color: c.color }}>{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Recurring Card ─── */
function RecurringCard({ item, onEdit, onDelete, onToggle, index }) {
  const colors = CATEGORY_COLORS[item.category] || { bg: '#F3F4F6', text: '#6B7280' };
  const dueSoon = item.isActive && isDueSoon(item.nextDueDate);
  const overdue = item.isActive && isOverdue(item.nextDueDate);
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(item);
    setToggling(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white/70 dark:bg-black/35 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/10 p-3 sm:p-4 hover:shadow-md hover:bg-black/50 transition-all group ${
        !item.isActive
          ? 'opacity-60'
          : overdue
          ? 'border-red-400/80 shadow-red-500/10'
          : dueSoon
          ? 'border-amber-400/80 shadow-amber-500/10'
          : 'hover:border-violet-500/40'
      }`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Icon */}
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: colors.bg }}>
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.text }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-primary-text dark:text-white truncate">{item.name}</span>
            {!item.isActive && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary-text font-medium">Paused</span>
            )}
            {overdue && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 font-medium">Overdue</span>
            )}
            {dueSoon && !overdue && (
              <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 font-medium">Due Soon</span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-[11px] sm:text-xs text-secondary-text">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full font-medium" style={{ background: colors.bg, color: colors.text }}>
              {getCategoryLabel(item.category)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {getFrequencyLabel(item.frequency)}
            </span>
            {item.nextDueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : dueSoon ? 'text-amber-600' : ''}`}>
                <Calendar size={11} />
                Due {formatDate(item.nextDueDate)}
              </span>
            )}
            {item.endDate && (
              <span className="flex items-center gap-1">
                Ends {formatDate(item.endDate)}
              </span>
            )}
          </div>
        </div>

        {/* Right: amount + actions */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          <p className="text-sm sm:text-base font-bold text-primary-text dark:text-white whitespace-nowrap">{formatAmount(item.amount)}</p>
          <div className="flex items-center gap-1">
            {/* Toggle */}
            <button
              id={`toggle-recurring-${item.id}`}
              onClick={handleToggle}
              disabled={toggling}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                item.isActive
                  ? 'text-green-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                  : 'text-secondary-text hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
              }`}
              title={item.isActive ? 'Pause' : 'Activate'}
            >
              {toggling
                ? <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : item.isActive ? <Zap size={14} /> : <ZapOff size={14} />
              }
            </button>
            <button
              id={`edit-recurring-${item.id}`}
              onClick={() => onEdit(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 active:bg-violet-100 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              id={`delete-recurring-${item.id}`}
              onClick={() => onDelete(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */
function RecurringSkeletons() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
              <div className="w-48 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
            <div className="w-20 h-5 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RECURRING EXPENSES PAGE
════════════════════════════════════════════════════════════════ */
export default function RecurringPage() {
  const { data: items, isLoading, error, refetch } = useFetch(recurringService.getAll);

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');   // 'active' | 'paused' | ''
  const [showFilters, setShowFilters] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    if (!items) return [];
    return items.filter((i) => {
      const matchSearch =
        !search ||
        i.name?.toLowerCase().includes(search.toLowerCase()) ||
        getCategoryLabel(i.category).toLowerCase().includes(search.toLowerCase());
      const matchCat = !catFilter || i.category === catFilter;
      const matchStatus =
        !statusFilter ||
        (statusFilter === 'active' && i.isActive) ||
        (statusFilter === 'paused' && !i.isActive);
      return matchSearch && matchCat && matchStatus;
    });
  }, [items, search, catFilter, statusFilter]);

  const activeFilters = [catFilter, statusFilter].filter(Boolean).length;
  const clearFilters = () => { setCatFilter(''); setStatusFilter(''); };

  const handleToggle = async (item) => {
    await recurringService.toggle(item.id);
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await recurringService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch { /* keep open */ }
    finally { setDeleting(false); }
  };

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      {!isLoading && items && <SummaryCards items={items} />}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          <input
            id="recurring-search"
            type="text"
            placeholder="Search by name or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-black/35 backdrop-blur-md text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>

        <Button
          id="recurring-filter-btn"
          action="filter"
          variant={activeFilters > 0 ? 'secondary' : undefined}
          size="md"
          onClick={() => setShowFilters((v) => !v)}
          rightIcon={
            activeFilters > 0 ? (
              <span className="w-5 h-5 rounded-full bg-violet-500 text-white text-xs font-bold flex items-center justify-center">{activeFilters}</span>
            ) : (
              <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            )
          }
        >
          Filters
        </Button>

        <Button
          id="add-recurring-btn"
          action="addExpense"
          size="md"
          onClick={() => { setEditing(null); setPanelOpen(true); }}
        >
          Add Recurring
        </Button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row gap-4 overflow-hidden"
          >
            <div className="flex-1">
              <label className="text-xs font-medium text-secondary-text mb-1.5 block">Category</label>
              <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all">
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-secondary-text mb-1.5 block">Status</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all self-end">
                <X size={13} /> Clear
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {isLoading && <RecurringSkeletons />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={RefreshCw}
          title={items?.length === 0 ? 'No recurring expenses yet' : 'No results found'}
          description={items?.length === 0 ? 'Add recurring bills like rent, subscriptions, and EMIs to track them automatically.' : 'Try adjusting your filters.'}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <RecurringCard
                key={item.id}
                item={item}
                index={i}
                onEdit={(item) => { setEditing(item); setPanelOpen(true); }}
                onDelete={setDeleteTarget}
                onToggle={handleToggle}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <SlidePanel
        isOpen={panelOpen}
        onClose={() => { setPanelOpen(false); setEditing(null); }}
        title={editing ? 'Edit Recurring Expense' : 'Add Recurring Expense'}
      >
        <RecurringExpenseForm
          existing={editing}
          onSuccess={() => { setPanelOpen(false); setEditing(null); refetch(); }}
          onCancel={() => { setPanelOpen(false); setEditing(null); }}
        />
      </SlidePanel>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete recurring expense?"
        description={`"${deleteTarget?.name}" will be permanently removed. Future auto-charges will stop.`}
      />
    </div>
  );
}
