import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, HandCoins, Pencil, Trash2, Search, AlertTriangle,
  TrendingUp, TrendingDown, Clock, ChevronRight,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { loanService } from '../services/loanRecurringService';
import { LoanForm } from '../components/forms/LoanForm';
import { LoanDetailPanel } from '../components/loans/LoanDetailPanel';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { getLoanStatusConfig } from '../constants/finance';
import { Button } from '../components/common/Button';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TAB_LABELS = [
  { key: 'all', label: 'All Loans' },
  { key: 'lent', label: 'Lent' },
  { key: 'borrowed', label: 'Borrowed' },
  { key: 'overdue', label: 'Overdue' },
];

/* ─── Summary Cards ─── */
function SummaryCards({ loans }) {
  const totalLent = useMemo(
    () => loans.filter((l) => l.type === 'LENT').reduce((s, l) => s + parseFloat(l.remainingAmount || 0), 0),
    [loans]
  );
  const totalBorrowed = useMemo(
    () => loans.filter((l) => l.type === 'BORROWED').reduce((s, l) => s + parseFloat(l.remainingAmount || 0), 0),
    [loans]
  );
  const overdueCount = useMemo(() => loans.filter((l) => l.status === 'OVERDUE').length, [loans]);

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4">
      {[
        { label: 'Total Lent', value: fmt(totalLent), color: '#10B981', bg: '#E6F7E4', icon: TrendingUp },
        { label: 'Total Borrowed', value: fmt(totalBorrowed), color: '#7C5CFC', bg: '#EDEBF7', icon: TrendingDown },
        { label: 'Overdue', value: overdueCount, isCurrency: false, color: '#DC2626', bg: '#FEE2E2', icon: AlertTriangle },
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
            <p className="text-xs sm:text-base md:text-lg font-bold truncate" style={{ color: c.color }}>{c.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Loan Card ─── */
function LoanCard({ loan, onView, onEdit, onDelete, index }) {
  const statusCfg = getLoanStatusConfig(loan.status);
  const isLent = loan.type === 'LENT';
  const remaining = parseFloat(loan.remainingAmount || 0);
  const original = parseFloat(loan.originalAmount || 0);
  const pct = original > 0 ? Math.min(100, ((original - remaining) / original) * 100) : 0;
  const isOverdue = loan.status === 'OVERDUE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white/70 dark:bg-black/35 backdrop-blur-xl rounded-2xl border p-3.5 sm:p-4 hover:shadow-md transition-all group cursor-pointer ${
        isOverdue ? 'border-red-300 dark:border-red-900/60' : 'border-gray-200/60 dark:border-white/10'
      }`}
      onClick={() => onView(loan)}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Avatar */}
        <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold ${
          isLent ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600'
        }`}>
          {loan.personName?.[0]?.toUpperCase() || '?'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
            <span className="text-sm font-semibold text-primary-text dark:text-white truncate">{loan.personName}</span>
            <span
              className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
              style={{ background: statusCfg.bg, color: statusCfg.text }}
            >
              {statusCfg.label}
            </span>
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${
              isLent ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600'
            }`}>
              {isLent ? 'Lent' : 'Borrowed'}
            </span>
          </div>

          {/* Mini progress */}
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background: pct >= 100 ? '#10B981' : 'linear-gradient(90deg, #7C5CFC, #10B981)',
              }}
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-secondary-text flex-wrap">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              Due {fmtDate(loan.dueDate)}
            </span>
            {loan.description && <span className="truncate max-w-[120px] sm:max-w-[160px]">{loan.description}</span>}
          </div>
        </div>

        {/* Amount + actions */}
        <div className="flex flex-col items-end gap-1 sm:gap-1.5 flex-shrink-0">
          <p className={`text-xs sm:text-sm font-bold whitespace-nowrap ${isLent ? 'text-green-600' : 'text-violet-600'}`}>
            {fmt(loan.remainingAmount)}
          </p>
          <p className="text-[10px] sm:text-xs text-secondary-text whitespace-nowrap">of {fmt(loan.originalAmount)}</p>
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-1" onClick={(e) => e.stopPropagation()}>
            <button
              id={`edit-loan-${loan.id}`}
              onClick={(e) => { e.stopPropagation(); onEdit(loan); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-secondary-text hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 active:bg-violet-100 transition-all"
              title="Edit"
            >
              <Pencil size={12} />
            </button>
            <button
              id={`delete-loan-${loan.id}`}
              onClick={(e) => { e.stopPropagation(); onDelete(loan); }}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 transition-all"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeletons ─── */
function LoanSkeletons() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0" />
            <div className="flex-1">
              <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
              <div className="w-24 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
            <div className="w-20 h-5 bg-gray-100 dark:bg-gray-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOANS PAGE
════════════════════════════════════════════════════════════════ */
export default function LoansPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTabLoans = useCallback(() => {
    if (activeTab === 'lent') return loanService.getLent();
    if (activeTab === 'borrowed') return loanService.getBorrowed();
    if (activeTab === 'overdue') return loanService.getOverdue();
    return loanService.getAll();
  }, [activeTab]);

  const { data: tabLoans, isLoading, error, refetch: refetchTab } = useFetch(fetchTabLoans, [activeTab]);
  const { data: allLoans, refetch: refetchAll } = useFetch(loanService.getAll);

  const refetch = useCallback(() => {
    refetchTab();
    refetchAll();
  }, [refetchTab, refetchAll]);

  // Panels
  const [formOpen, setFormOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [viewingLoan, setViewingLoan] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  /* ─── Filtered ─── */
  const filtered = useMemo(() => {
    if (!tabLoans) return [];
    let list = tabLoans;

    if (search) {
      const s = search.toLowerCase();
      list = list.filter((l) =>
        l.personName?.toLowerCase().includes(s) || l.description?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [tabLoans, search]);

  const tabCounts = useMemo(() => ({
    all: allLoans?.length || 0,
    lent: allLoans?.filter((l) => l.type === 'LENT').length || 0,
    borrowed: allLoans?.filter((l) => l.type === 'BORROWED').length || 0,
    overdue: allLoans?.filter((l) => l.status === 'OVERDUE').length || 0,
  }), [allLoans]);

  const handleFormSuccess = () => {
    setFormOpen(false);
    setEditingLoan(null);
    refetch();
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await loanService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch { /* keep open */ }
    finally { setDeleting(false); }
  };

  // When viewing a loan, refresh loan data after payment/extend
  const handleLoanUpdate = () => {
    refetch();
    if (viewingLoan) {
      // Re-fetch updated loan to refresh detail panel
      loanService.getById(viewingLoan.id).then((updated) => setViewingLoan(updated)).catch(() => {});
    }
  };

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      {!isLoading && allLoans && <SummaryCards loans={allLoans} />}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          <input
            id="loan-search"
            type="text"
            placeholder="Search by person or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all"
          />
        </div>
        <Button
          id="add-loan-btn"
          action="lend"
          size="md"
          onClick={() => { setEditingLoan(null); setFormOpen(true); }}
        >
          Add Loan
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800/60 p-1 rounded-xl overflow-x-auto scrollbar-hide">
        {TAB_LABELS.map((tab) => (
          <button
            key={tab.key}
            id={`tab-${tab.key}`}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-900 text-primary-text dark:text-white shadow-sm'
                : 'text-secondary-text hover:text-primary-text dark:hover:text-white'
            }`}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold min-w-[20px] text-center ${
                tab.key === 'overdue' && tabCounts.overdue > 0
                  ? 'bg-red-100 text-red-600'
                  : activeTab === tab.key
                  ? 'bg-violet-100 text-violet-700'
                  : 'bg-gray-200 dark:bg-gray-700 text-secondary-text'
              }`}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading && <LoanSkeletons />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={HandCoins}
          title={allLoans?.length === 0 ? 'No loans yet' : 'No results found'}
          description={
            allLoans?.length === 0
              ? 'Track money you\'ve lent or borrowed by clicking "Add Loan".'
              : 'Try switching tabs or adjusting your search.'
          }
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-secondary-text">{filtered.length} {filtered.length === 1 ? 'loan' : 'loans'}</p>
          <AnimatePresence mode="popLayout">
            {filtered.map((loan, i) => (
              <LoanCard
                key={loan.id}
                loan={loan}
                index={i}
                onView={setViewingLoan}
                onEdit={(l) => { setEditingLoan(l); setFormOpen(true); }}
                onDelete={setDeleteTarget}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create / Edit form panel */}
      <SlidePanel
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingLoan(null); }}
        title={editingLoan ? 'Edit Loan' : 'New Loan'}
      >
        <LoanForm
          existing={editingLoan}
          onSuccess={handleFormSuccess}
          onCancel={() => { setFormOpen(false); setEditingLoan(null); }}
        />
      </SlidePanel>

      {/* Loan Detail panel */}
      <SlidePanel
        isOpen={!!viewingLoan}
        onClose={() => setViewingLoan(null)}
        title={viewingLoan ? `${viewingLoan.personName}'s Loan` : ''}
        width="max-w-xl"
      >
        {viewingLoan && (
          <LoanDetailPanel
            loan={viewingLoan}
            onClose={() => setViewingLoan(null)}
            onUpdate={handleLoanUpdate}
          />
        )}
      </SlidePanel>

      {/* Delete confirm */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleting}
        title="Delete this loan?"
        description={`This will permanently remove the loan for ${deleteTarget?.personName}. All payment history will also be deleted.`}
      />
    </div>
  );
}
