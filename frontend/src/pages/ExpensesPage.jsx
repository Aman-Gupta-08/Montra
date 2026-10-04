import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Pencil, Trash2, TrendingDown,
  Calendar, CreditCard, FileText, ChevronDown, X,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { expenseService } from '../services/financeService';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import {
  EXPENSE_CATEGORIES, PAYMENT_METHODS,
  getCategoryLabel, getPaymentLabel, CATEGORY_COLORS,
} from '../constants/finance';
import { Button } from '../components/common/Button';

/* ─── Helpers ─── */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatAmount(v) {
  if (v === null || v === undefined) return '₹0';
  return `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ─── Summary Cards ─── */
function SummaryCards({ items }) {
  const total = useMemo(() => items.reduce((s, i) => s + parseFloat(i.amount || 0), 0), [items]);
  const thisMonth = useMemo(() => {
    const now = new Date();
    return items
      .filter((i) => {
        const d = new Date(i.expenseDate);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, i) => s + parseFloat(i.amount || 0), 0);
  }, [items]);

  const topCategory = useMemo(() => {
    if (!items.length) return null;
    const map = {};
    items.forEach((i) => { map[i.category] = (map[i.category] || 0) + parseFloat(i.amount || 0); });
    return Object.entries(map).sort((a, b) => b[1] - a[1])[0]?.[0];
  }, [items]);

  const cards = [
    { label: 'Total Spent', value: formatAmount(total), color: '#EF4444', bg: '#FEE2E2' },
    { label: 'This Month', value: formatAmount(thisMonth), color: '#7C5CFC', bg: '#EDEBF7' },
    { label: 'Top Category', value: topCategory ? getCategoryLabel(topCategory) : '—', isCurrency: false, color: '#F59E0B', bg: '#FAF8EB' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white/70 dark:bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-gray-200/60 dark:border-white/10 shadow-lg hover:border-red-500/30 transition-all min-w-0"
        >
          <p className="text-[10px] sm:text-xs font-medium text-secondary-text mb-0.5 sm:mb-1 truncate">{c.label}</p>
          <p className="text-sm sm:text-xl font-bold truncate" style={{ color: c.color }}>{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Expense Row Card ─── */
function ExpenseCard({ item, onEdit, onDelete, index }) {
  const colors = CATEGORY_COLORS[item.category] || { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white/70 dark:bg-black/35 backdrop-blur-xl rounded-2xl border border-gray-200/60 dark:border-white/10 p-3 sm:p-4 hover:bg-black/50 hover:border-red-500/40 hover:shadow-red-500/5 transition-all shadow-md group"
    >
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        {/* Category icon */}
        <div
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: colors.bg }}
        >
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.text }} />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span
              className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: colors.bg, color: colors.text }}
            >
              {getCategoryLabel(item.category)}
            </span>
            {item.paymentMethod && (
              <span className="text-[11px] sm:text-xs text-secondary-text flex items-center gap-1">
                <CreditCard size={11} />
                {getPaymentLabel(item.paymentMethod)}
              </span>
            )}
            {item.attachmentId && (
              <span className="text-[11px] sm:text-xs text-secondary-text flex items-center gap-1">
                <FileText size={11} />
                Receipt
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-secondary-text mt-1 truncate">{item.description}</p>
          )}
          <p className="text-[11px] sm:text-xs text-secondary-text mt-1 flex items-center gap-1">
            <Calendar size={11} />
            {formatDate(item.expenseDate)}
          </p>
        </div>

        {/* Amount + actions */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 flex-shrink-0">
          <p className="text-sm sm:text-base font-bold text-red-500 dark:text-red-400 whitespace-nowrap">
            -{formatAmount(item.amount)}
          </p>
          {/* Actions - visible on mobile / hover on desktop */}
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              id={`edit-expense-${item.id}`}
              onClick={() => onEdit(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 active:bg-violet-100 transition-all"
              title="Edit"
            >
              <Pencil size={14} />
            </button>
            <button
              id={`delete-expense-${item.id}`}
              onClick={() => onDelete(item)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-all"
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

/* ─── Skeleton rows ─── */
function ExpenseSkeletons() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="w-24 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
              <div className="w-40 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
            <div className="w-20 h-5 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPENSES PAGE
════════════════════════════════════════════════════════════════ */
export default function ExpensesPage() {
  const { data: expenses, isLoading, error, refetch } = useFetch(expenseService.getAll);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ─── Filtered ─── */
  const filtered = useMemo(() => {
    if (!expenses) return [];
    return expenses.filter((item) => {
      const searchLow = search.toLowerCase();
      const matchSearch =
        !search ||
        getCategoryLabel(item.category).toLowerCase().includes(searchLow) ||
        (item.description || '').toLowerCase().includes(searchLow);
      const matchCat = !categoryFilter || item.category === categoryFilter;
      const date = new Date(item.expenseDate);
      const matchFrom = !dateFrom || date >= new Date(dateFrom);
      const matchTo = !dateTo || date <= new Date(dateTo);
      return matchSearch && matchCat && matchFrom && matchTo;
    });
  }, [expenses, search, categoryFilter, dateFrom, dateTo]);

  const activeFilters = [categoryFilter, dateFrom, dateTo].filter(Boolean).length;
  const clearFilters = () => { setCategoryFilter(''); setDateFrom(''); setDateTo(''); };

  const openAdd = () => { setEditing(null); setPanelOpen(true); };
  const openEdit = (item) => { setEditing(item); setPanelOpen(true); };
  const closePanel = () => { setPanelOpen(false); setEditing(null); };

  const handleFormSuccess = () => { closePanel(); refetch(); };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await expenseService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch { /* stay open */ }
    finally { setDeleting(false); }
  };

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      {!isLoading && expenses && <SummaryCards items={expenses} />}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          <input
            id="expense-search"
            type="text"
            placeholder="Search by category or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-black/35 backdrop-blur-md text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
        </div>

        <Button
          id="expense-filter-btn"
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
          id="add-expense-btn"
          action="addExpense"
          size="md"
          onClick={openAdd}
        >
          Add Expense
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
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all"
              >
                <option value="">All Categories</option>
                {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-secondary-text mb-1.5 block">From Date</label>
              <input id="exp-date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all" />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-secondary-text mb-1.5 block">To Date</label>
              <input id="exp-date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all" />
            </div>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="flex items-center gap-1 h-9 px-3 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all self-end">
                <X size={13} /> Clear
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-secondary-text">
            {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            {(search || activeFilters > 0) && ' (filtered)'}
          </p>
          {filtered.length !== expenses?.length && (
            <button onClick={() => { setSearch(''); clearFilters(); }} className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
              Clear all
            </button>
          )}
        </div>
      )}

      {/* List */}
      {isLoading && <ExpenseSkeletons />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={TrendingDown}
          title={expenses?.length === 0 ? 'No expenses recorded yet' : 'No results found'}
          description={expenses?.length === 0 ? 'Click "Add Expense" to record your first expense.' : 'Try adjusting your filters.'}
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <ExpenseCard key={item.id} item={item} index={i} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit panel */}
      <SlidePanel isOpen={panelOpen} onClose={closePanel} title={editing ? 'Edit Expense' : 'Add Expense'}>
        <ExpenseForm existing={editing} onSuccess={handleFormSuccess} onCancel={closePanel} />
      </SlidePanel>

      {/* Delete confirm */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete expense entry?"
        description={`This will permanently delete ₹${Number(deleteTarget?.amount || 0).toLocaleString('en-IN')} for ${getCategoryLabel(deleteTarget?.category)}.`}
      />
    </div>
  );
}
