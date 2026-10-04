import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, CheckCircle2, Clock, AlertCircle, Search,
  Calendar, CreditCard, DollarSign, Upload, FileText,
  User, ArrowRight, Filter, RefreshCw, Plus, ChevronRight,
  Sparkles, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { salaryService, staffService } from '../services/businessService';
import { SlidePanel } from '../components/common/Modals';
import { InputField } from '../components/forms/InputField';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { PAYMENT_METHODS, getPaymentLabel } from '../constants/finance';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Formats salary month into explicit calendar month e.g. "September 2026" or "March"
 * Strictly avoids rolling 30-day periods.
 */
function formatCalendarMonth(salaryMonthStr, includeYear = true) {
  if (!salaryMonthStr) return '—';
  const parts = String(salaryMonthStr).trim().split(/[-/]/);
  if (parts.length >= 2) {
    const year = parts[0].length === 4 ? parts[0] : parts[1];
    const monthNum = parts[0].length === 4 ? parts[1] : parts[0];
    const idx = parseInt(monthNum, 10) - 1;
    if (idx >= 0 && idx < 12) {
      return includeYear ? `${MONTH_NAMES[idx]} ${year}` : MONTH_NAMES[idx];
    }
  }
  const d = new Date(salaryMonthStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-IN', { month: 'long', year: includeYear ? 'numeric' : undefined });
  }
  return salaryMonthStr;
}

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─── Mark Salary Paid Modal ─── */
function MarkSalaryPaidModal({ payment, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'BANK_TRANSFER',
    comment: '',
    screenshot: null,
    screenshotName: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({
        ...prev,
        screenshot: file,
        screenshotName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.paymentDate) {
      setError('Payment date is required.');
      return;
    }
    if (!form.paymentMethod) {
      setError('Payment method is required.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        amount: payment.amount,
        paymentDate: form.paymentDate,
        paymentMethod: form.paymentMethod,
        comment: form.comment.trim() || null,
        attachmentId: form.screenshotName ? 999 : null,
      };

      await salaryService.paySalary(payment.id, payload);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to record salary payout.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recipient summary banner */}
      <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/30 flex items-center justify-between">
        <div>
          <span className="text-xs text-secondary-text font-medium block">Paying Salary To</span>
          <span className="text-base font-bold text-primary-text dark:text-white">
            {payment.staffName || `Staff #${payment.staffId}`}
          </span>
          <span className="text-xs text-violet-700 dark:text-violet-300 font-semibold block mt-0.5">
            For Calendar Month: {formatCalendarMonth(payment.salaryMonth)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-secondary-text font-medium block">Amount Due</span>
          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {fmt(payment.amount)}
          </span>
        </div>
      </div>

      <InputField
        id="paymentDate"
        name="paymentDate"
        type="date"
        label="Payment Date"
        value={form.paymentDate}
        onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Payment Method <span className="text-red-500">*</span>
        </label>
        <select
          id="paymentMethod"
          value={form.paymentMethod}
          onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all cursor-pointer"
        >
          {PAYMENT_METHODS.map((pm) => (
            <option key={pm.value} value={pm.value}>
              {pm.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Comment / Reference Notes
        </label>
        <textarea
          id="salary-comment"
          rows={2}
          placeholder="e.g. Disbursed via HDFC NetBanking, UTR #4592019…"
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 transition-all resize-none"
        />
      </div>

      {/* Screenshot / Payment Receipt Upload */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200 flex items-center justify-between">
          <span>Screenshot / Payment Receipt</span>
          <span className="text-xs text-secondary-text">Optional</span>
        </label>
        <label
          htmlFor="salary-screenshot"
          className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-violet-400 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-gray-50/50 dark:bg-gray-800/30 transition-all group"
        >
          <Upload size={20} className="text-gray-400 group-hover:text-violet-500 transition-colors" />
          <span className="text-xs text-secondary-text group-hover:text-primary-text transition-colors">
            {form.screenshotName ? form.screenshotName : 'Click to attach payment proof or screenshot'}
          </span>
          <input
            id="salary-screenshot"
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          action="markAsPaid"
          isLoading={submitting}
          size="sm"
        >
          Mark Salary Paid
        </Button>
      </div>
    </form>
  );
}

/* ─── Generate Payroll Record Drawer ─── */
function GeneratePayrollDrawer({ staffList, onSuccess, onCancel }) {
  const [selectedStaffId, setSelectedStaffId] = useState(staffList?.[0]?.id || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const currentMonthName = formatCalendarMonth(new Date().toISOString().slice(0, 7));

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) {
      setError('Please select an employee.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await salaryService.initSalary(selectedStaffId);
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to initialize salary record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleGenerate} className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/30">
        <span className="text-xs text-violet-700 dark:text-violet-300 font-medium block">Current Payroll Cycle</span>
        <span className="text-base font-bold text-violet-950 dark:text-white block mt-0.5">
          Calendar Month: {currentMonthName}
        </span>
        <span className="text-xs text-secondary-text block mt-1">
          Initializes a pending salary record matching the employee's base compensation.
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Select Employee <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedStaffId}
          onChange={(e) => setSelectedStaffId(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all cursor-pointer"
        >
          {staffList.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.position} ({fmt(s.salary)})
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          action="generate"
          isLoading={submitting}
          size="sm"
        >
          Generate Record
        </Button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SALARY PAGE
════════════════════════════════════════════════════════════════ */
export default function SalaryPage() {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'paid'
  const [search, setSearch] = useState('');
  const [payingTarget, setPayingTarget] = useState(null);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  // Fetch pending salaries
  const {
    data: pendingSalaries,
    loading: pendingLoading,
    error: pendingError,
    reload: reloadPending,
  } = useFetch(salaryService.getPending, []);

  // Fetch paid salaries
  const {
    data: paidSalaries,
    loading: paidLoading,
    error: paidError,
    reload: reloadPaid,
  } = useFetch(salaryService.getPaid, []);

  // Fetch staff list for payroll generation
  const { data: staffList } = useFetch(staffService.getAll, []);

  const pendingList = pendingSalaries || [];
  const paidList = paidSalaries || [];

  /* ─── Metric Calculations ─── */
  const metrics = useMemo(() => {
    const totalPendingAmount = pendingList.reduce((s, p) => s + Number(p.amount || 0), 0);
    const totalPaidAmount = paidList.reduce((s, p) => s + Number(p.amount || 0), 0);
    const pendingCount = pendingList.length;
    const paidCount = paidList.length;

    return { totalPendingAmount, totalPaidAmount, pendingCount, paidCount };
  }, [pendingList, paidList]);

  /* ─── Filtered Active List ─── */
  const currentList = activeTab === 'pending' ? pendingList : paidList;
  const filteredList = useMemo(() => {
    return currentList.filter((item) => {
      const q = search.toLowerCase();
      const monthFormatted = formatCalendarMonth(item.salaryMonth).toLowerCase();
      const name = (item.staffName || '').toLowerCase();
      const comment = (item.comment || '').toLowerCase();
      const method = (item.paymentMethod || '').toLowerCase();

      return (
        name.includes(q) ||
        monthFormatted.includes(q) ||
        comment.includes(q) ||
        method.includes(q)
      );
    });
  }, [currentList, search]);

  const handleRefreshAll = () => {
    reloadPending();
    reloadPaid();
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <CheckCircle2 size={16} />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary-text dark:text-white">Staff Salary Payouts</h1>
            <span className="px-2.5 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold rounded-full">
              Business
            </span>
          </div>
          <p className="text-sm text-secondary-text mt-0.5">
            Disburse payroll by explicit calendar month with proof records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/staff"
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-medium text-primary-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2"
          >
            <User size={16} className="text-violet-500" />
            <span>Staff Directory</span>
          </Link>

          <Button
            action="generate"
            size="md"
            onClick={() => setGenerateOpen(true)}
          >
            Generate Salary Slip
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-secondary-text block mb-0.5 truncate">Pending Salaries</span>
            <span className="text-base sm:text-xl font-bold text-amber-600 dark:text-amber-400 truncate block">
              {metrics.pendingCount}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-secondary-text block mb-0.5 truncate">Pending Obligation</span>
            <span className="text-sm sm:text-xl font-bold text-rose-600 dark:text-rose-400 truncate block">
              {fmt(metrics.totalPendingAmount)}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-secondary-text block mb-0.5 truncate">Paid Records</span>
            <span className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 truncate block">
              {metrics.paidCount}
            </span>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl glass-card flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] sm:text-xs font-medium text-secondary-text block mb-0.5 truncate">Total Paid</span>
            <span className="text-sm sm:text-xl font-bold text-primary-text dark:text-white truncate block">
              {fmt(metrics.totalPaidAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Pending vs Paid Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 glass-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'pending'
                ? 'glass-4 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <Clock size={15} />
            <span className="truncate">Pending ({metrics.pendingCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('paid')}
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 ${
              activeTab === 'paid'
                ? 'glass-4 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-secondary-text hover:text-primary-text'
            }`}
          >
            <CheckCircle2 size={15} />
            <span className="truncate">Paid ({metrics.paidCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employee, month…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-sm text-primary-text dark:text-white outline-none focus:border-violet-400 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Salary List Table / Cards */}
      {(activeTab === 'pending' ? pendingLoading : paidLoading) ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : (activeTab === 'pending' ? pendingError : paidError) ? (
        <ErrorState
          title="Error loading salaries"
          message={activeTab === 'pending' ? pendingError : paidError}
          onRetry={handleRefreshAll}
        />
      ) : filteredList.length === 0 ? (
        <EmptyState
          title={activeTab === 'pending' ? 'No pending salaries' : 'No salary payment history'}
          message={
            activeTab === 'pending'
              ? 'All staff salary obligations have been settled for the current calendar period.'
              : 'No recorded salary payments found for the search query.'
          }
          actionLabel={activeTab === 'pending' ? '+ Generate Salary Slip' : null}
          onAction={activeTab === 'pending' ? () => setGenerateOpen(true) : null}
        />
      ) : (
        <>
          {/* Mobile Card List (sm:hidden) */}
          <div className="space-y-3 sm:hidden">
            {filteredList.map((record) => {
              const isPaid = record.status === 'PAID';
              const calendarMonthName = formatCalendarMonth(record.salaryMonth);

              return (
                <div key={record.id} className="p-4 rounded-2xl glass-card glossy-panel space-y-3 border border-gray-200/60 dark:border-white/10">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                        {(record.staffName?.[0] || 'S').toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-sm text-primary-text dark:text-white block truncate">
                          {record.staffName || `Staff ID: ${record.staffId}`}
                        </span>
                        <span className="text-xs text-secondary-text truncate block">
                          {record.staffPosition || 'Employee'}
                        </span>
                      </div>
                    </div>
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                        <CheckCircle2 size={12} />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex-shrink-0">
                        <Clock size={12} />
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-secondary-text pt-1 border-t border-gray-100 dark:border-white/5">
                    <span className="inline-flex items-center gap-1 font-medium text-primary-text dark:text-gray-200">
                      <Calendar size={13} className="text-violet-500" />
                      {calendarMonthName}
                    </span>
                    <span className="text-base font-bold text-primary-text dark:text-white">
                      {fmt(record.amount)}
                    </span>
                  </div>

                  {isPaid ? (
                    <div className="flex items-center justify-between text-xs text-secondary-text pt-1">
                      <span>Paid: {fmtDate(record.paymentDate)}</span>
                      {record.paymentMethod && (
                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[11px] font-medium text-primary-text dark:text-gray-300">
                          {getPaymentLabel(record.paymentMethod)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setPayingTarget(record)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 size={14} />
                      <span>Mark as Paid</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (hidden sm:block) */}
          <div className="hidden sm:block glass-table-container rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="glass-table-header border-b border-gray-100 dark:border-white/10 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Calendar Month</th>
                    <th className="px-5 py-3.5">Amount</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Payment Date</th>
                    <th className="px-5 py-3.5">Payment Method</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-white/5 text-sm">
                  {filteredList.map((record) => {
                    const isPaid = record.status === 'PAID';
                    const calendarMonthName = formatCalendarMonth(record.salaryMonth);

                    return (
                      <tr
                        key={record.id}
                        className="glass-table-row transition-colors"
                      >
                        {/* Employee */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                              {(record.staffName?.[0] || 'S').toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-primary-text dark:text-white block">
                                {record.staffName || `Staff ID: ${record.staffId}`}
                              </span>
                              <span className="text-xs text-secondary-text">
                                {record.staffPosition || 'Employee'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Explicit Calendar Month */}
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 font-medium text-primary-text dark:text-gray-200">
                            <Calendar size={14} className="text-violet-500 flex-shrink-0" />
                            <span className="font-semibold">{calendarMonthName}</span>
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-5 py-4">
                          <span className="font-bold text-primary-text dark:text-white">
                            {fmt(record.amount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 size={13} />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <Clock size={13} />
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Payment Date */}
                        <td className="px-5 py-4 text-secondary-text text-xs">
                          {isPaid ? fmtDate(record.paymentDate) : 'Not paid yet'}
                        </td>

                        {/* Payment Method */}
                        <td className="px-5 py-4">
                          {isPaid && record.paymentMethod ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs font-medium text-primary-text dark:text-gray-300">
                              <CreditCard size={12} className="text-violet-500" />
                              {getPaymentLabel(record.paymentMethod)}
                            </span>
                          ) : (
                            <span className="text-xs text-secondary-text">—</span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4 text-right">
                          {isPaid ? (
                            <span className="text-xs text-secondary-text">
                              {record.comment || 'Disbursed'}
                            </span>
                          ) : (
                            <button
                              onClick={() => setPayingTarget(record)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded-xl shadow-xs transition-all inline-flex items-center gap-1.5"
                            >
                              <CheckCircle2 size={14} />
                              <span>Mark Paid</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Mark Salary Paid Modal */}
      <SlidePanel
        open={Boolean(payingTarget)}
        onClose={() => setPayingTarget(null)}
        title="Mark Salary Paid"
      >
        {payingTarget && (
          <MarkSalaryPaidModal
            payment={payingTarget}
            onSuccess={() => {
              setPayingTarget(null);
              showToast('Salary payout recorded successfully!');
              handleRefreshAll();
            }}
            onCancel={() => setPayingTarget(null)}
          />
        )}
      </SlidePanel>

      {/* Generate Salary Record Modal */}
      <SlidePanel
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        title="Generate Monthly Salary Slip"
      >
        <GeneratePayrollDrawer
          staffList={staffList || []}
          onSuccess={() => {
            setGenerateOpen(false);
            showToast('Monthly salary record generated.');
            handleRefreshAll();
          }}
          onCancel={() => setGenerateOpen(false)}
        />
      </SlidePanel>
    </div>
  );
}
