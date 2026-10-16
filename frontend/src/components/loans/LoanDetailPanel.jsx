import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Calendar, DollarSign, Clock, Pencil, Plus,
  ChevronRight, CreditCard, AlertCircle, CalendarDays, CheckCircle,
} from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { loanService } from '../../services/loanRecurringService';
import { getLoanStatusConfig, PAYMENT_METHODS, getPaymentLabel } from '../../constants/finance';
import { InputField } from '../forms/InputField';
import { Button } from '../common/Button';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
const today = () => new Date().toISOString().split('T')[0];

/* ─── Progress bar (uses backend remainingAmount, not computed) ─── */
function RepaymentBar({ originalAmount, remainingAmount }) {
  const orig = parseFloat(originalAmount || 0);
  const rem = parseFloat(remainingAmount ?? orig);
  const paid = Math.max(0, orig - rem);
  const pct = orig > 0 ? Math.min(100, Math.max(0, (paid / orig) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-secondary-text mb-1.5">
        <span>Paid: {fmt(paid)}</span>
        <span>Remaining: {fmt(rem)}</span>
      </div>
      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: pct >= 100 ? '#10B981' : 'linear-gradient(90deg, #7C5CFC, #10B981)' }}
        />
      </div>
      <p className="text-xs text-secondary-text mt-1 text-right">{pct.toFixed(0)}% paid</p>
    </div>
  );
}

/* ─── Add Payment Form ─── */
function AddPaymentForm({ loan, onSuccess, onCancel }) {
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(today());
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isLent = loan.type === 'LENT';
  const person = loan.personName || loan.borrowerName || loan.lenderName || 'Contact';
  const remaining = parseFloat(loan.remainingAmount ?? loan.amount ?? loan.originalAmount ?? 0);

  const handleFull = () => setAmount(String(remaining));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) { setError('Enter a valid positive amount.'); return; }
    if (amt > remaining + 0.001) { setError(`Amount exceeds remaining balance of ${fmt(remaining)}.`); return; }

    setSubmitting(true);
    setError('');
    try {
      await loanService.addPayment(loan.id, {
        amount,
        paymentDate,
        paymentMethod: paymentMethod || null,
        description: description.trim() || null,
      });
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Payment failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-primary-text dark:text-gray-200">
            {isLent ? 'Repayment Amount (₹)' : 'Payment Amount (₹)'} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            id="pay-full-btn"
            onClick={handleFull}
            className="text-xs text-violet-600 dark:text-violet-400 hover:underline font-medium transition-colors"
          >
            {isLent ? `Collect in full (${fmt(remaining)})` : `Pay in full (${fmt(remaining)})`}
          </button>
        </div>
        <input
          id="payment-amount"
          type="number"
          step="0.01"
          min="0.01"
          max={remaining}
          placeholder="0.00"
          value={amount}
          onChange={(e) => { setAmount(e.target.value); setError(''); }}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all text-right font-semibold text-lg"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-text dark:text-gray-200">Date</label>
          <input
            id="payment-date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-text dark:text-gray-200">Payment Method</label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all"
          >
            <option value="">— Select Method —</option>
            {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">Note (optional)</label>
        <input
          id="payment-note"
          type="text"
          placeholder={isLent ? `e.g. Received via GPay from ${person}` : `e.g. Sent instalment to ${person}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 transition-all"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          id="submit-payment-btn"
          type="submit"
          isLoading={submitting}
          size="sm"
          className="flex-1"
        >
          {isLent ? 'Record Repayment' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Extend Due Date Form ─── */
function ExtendDueDateForm({ loan, onSuccess, onCancel }) {
  const [mode, setMode] = useState('');        // '+5' | '+10' | '+15' | 'custom'
  const [customDate, setCustomDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addDays = (dateStr, days) => {
    const base = new Date(dateStr || new Date());
    const now = new Date();
    // If base date is in the past, add days from today so the new due date is guaranteed to be in the future
    const start = base > now ? base : now;
    start.setDate(start.getDate() + days);
    return start.toISOString().split('T')[0];
  };

  const resolvedDate = () => {
    if (mode === '+5') return addDays(loan.dueDate, 5);
    if (mode === '+10') return addDays(loan.dueDate, 10);
    if (mode === '+15') return addDays(loan.dueDate, 15);
    if (mode === 'custom') return customDate;
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDueDate = resolvedDate();
    if (!newDueDate) { setError('Select an option.'); return; }
    if (newDueDate <= today()) { setError('New due date must be in the future.'); return; }

    setSubmitting(true);
    setError('');
    try {
      await loanService.extendDueDate(loan.id, newDueDate);
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Extension failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const presets = [
    { label: '+5 Days', val: '+5' },
    { label: '+10 Days', val: '+10' },
    { label: '+15 Days', val: '+15' },
    { label: 'Custom', val: 'custom' },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-sm text-secondary-text">Current due date: <strong className="text-primary-text dark:text-white">{fmtDate(loan.dueDate)}</strong></p>

      <div className="grid grid-cols-2 gap-2">
        {presets.map((p) => (
          <button
            key={p.val}
            type="button"
            id={`extend-${p.val}`}
            onClick={() => setMode(p.val)}
            className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
              mode === p.val
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                : 'border-gray-100 dark:border-gray-800 text-secondary-text hover:border-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {mode === 'custom' && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <label className="text-sm font-medium text-primary-text dark:text-gray-200 mb-1.5 block">New Due Date</label>
            <input
              id="extend-custom-date"
              type="date"
              value={customDate}
              min={today()}
              onChange={(e) => setCustomDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {resolvedDate() && (
        <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5">
          <CheckCircle size={16} />
          New due date: {fmtDate(resolvedDate())}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          id="extend-submit-btn"
          action="extendDate"
          type="submit"
          disabled={!resolvedDate()}
          isLoading={submitting}
          size="sm"
          className="flex-1"
        >
          Extend Due Date
        </Button>
      </div>
    </form>
  );
}

/* ─── Payment History ─── */
function PaymentHistory({ loanId }) {
  const { data: payments, isLoading } = useFetch(() => loanService.getPayments(loanId), [loanId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-14 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!payments?.length) {
    return <p className="text-sm text-secondary-text text-center py-4">No payments recorded yet.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {payments.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl"
        >
          <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
            <DollarSign size={15} className="text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-primary-text dark:text-white">{fmt(p.amount)}</p>
            <p className="text-xs text-secondary-text">
              {fmtDate(p.paymentDate)}
              {p.paymentMethod && ` · ${getPaymentLabel(p.paymentMethod)}`}
              {p.description && ` · ${p.description}`}
            </p>
          </div>
          <CheckCircle size={15} className="text-green-500 flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOAN DETAIL PANEL — shown inside a SlidePanel
════════════════════════════════════════════════════════════════ */
export function LoanDetailPanel({ loan, onClose, onUpdate, onEdit }) {
  const [subPanel, setSubPanel] = useState(null); // null | 'payment' | 'extend'
  const isLent = loan.type === 'LENT';
  const person = loan.personName || loan.borrowerName || loan.lenderName || 'Contact';
  const origAmount = parseFloat(loan.originalAmount ?? loan.amount ?? 0);
  const remAmount = parseFloat(loan.remainingAmount ?? loan.amount ?? origAmount);
  const paidAmount = Math.max(0, origAmount - remAmount);
  const statusCfg = getLoanStatusConfig(loan.status);
  const isFullyPaid = loan.status === 'PAID' || remAmount <= 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Status badge & Loan Type */}
      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: statusCfg.bg, color: statusCfg.text }}
        >
          {statusCfg.label}
        </span>
        <span className={`text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full ${
          isLent ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
        }`}>
          {isLent ? '💸 Money Lent (Owed to you)' : '🤝 Money Borrowed (You owe)'}
        </span>
      </div>

      {/* Person info */}
      <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 flex flex-col gap-2.5 border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-text">
            {isLent ? 'Borrower Contact' : 'Lender Contact'}
          </span>
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(loan)}
              className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-medium"
            >
              <Pencil size={12} /> Edit Details
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <User size={15} className="text-secondary-text flex-shrink-0" />
          <span className="text-sm font-semibold text-primary-text dark:text-white">{person}</span>
        </div>
        {loan.personPhone && (
          <div className="flex items-center gap-2">
            <Phone size={15} className="text-secondary-text flex-shrink-0" />
            <span className="text-sm text-secondary-text">{loan.personPhone}</span>
          </div>
        )}
        {(loan.description || loan.notes) && (
          <p className="text-xs text-secondary-text mt-0.5 border-t border-gray-200 dark:border-gray-700 pt-2">{loan.description || loan.notes}</p>
        )}
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {[
          { label: 'Original', value: origAmount, color: '#7C5CFC' },
          { label: 'Paid', value: paidAmount, color: '#10B981' },
          { label: 'Remaining', value: remAmount, color: '#EF4444' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[11px] sm:text-xs text-secondary-text mb-1">{s.label}</p>
            <p className="text-xs sm:text-sm md:text-base font-bold truncate" style={{ color: s.color }}>{fmt(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <RepaymentBar originalAmount={origAmount} remainingAmount={remAmount} />

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
          <Calendar size={15} className="text-secondary-text flex-shrink-0" />
          <div>
            <p className="text-xs text-secondary-text">Start Date</p>
            <p className="text-sm font-medium text-primary-text dark:text-white">{fmtDate(loan.startDate)}</p>
          </div>
        </div>
        <div className={`flex items-center gap-2 p-3 rounded-xl ${!loan.dueDate ? 'bg-gray-50 dark:bg-gray-800/60' : new Date(loan.dueDate) < new Date() && !isFullyPaid ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-800/60'}`}>
          <CalendarDays size={15} className={!loan.dueDate ? 'text-secondary-text' : new Date(loan.dueDate) < new Date() && !isFullyPaid ? 'text-red-500' : 'text-secondary-text'} />
          <div>
            <p className="text-xs text-secondary-text">Due Date</p>
            <p className={`text-sm font-medium ${!loan.dueDate ? 'text-secondary-text' : new Date(loan.dueDate) < new Date() && !isFullyPaid ? 'text-red-500 font-semibold' : 'text-primary-text dark:text-white'}`}>
              {fmtDate(loan.dueDate)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!isFullyPaid && (
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            id="add-payment-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubPanel(subPanel === 'payment' ? null : 'payment')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              subPanel === 'payment' ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700' : 'text-white'
            }`}
            style={subPanel !== 'payment' ? { background: 'linear-gradient(135deg, #7C5CFC, #10B981)' } : {}}
          >
            <Plus size={15} />
            {isLent ? 'Collect Repayment' : 'Record Payment'}
          </motion.button>

          <motion.button
            id="extend-due-date-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSubPanel(subPanel === 'extend' ? null : 'extend')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all cursor-pointer ${
              subPanel === 'extend'
                ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700'
                : 'border-gray-200 dark:border-gray-700 text-primary-text dark:text-gray-200 hover:border-violet-300'
            }`}
          >
            <Clock size={15} />
            Extend Date
          </motion.button>
        </div>
      )}

      {/* Sub-panels */}
      <AnimatePresence>
        {subPanel === 'payment' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-primary-text dark:text-white mb-4">Record Payment</h4>
              <AddPaymentForm
                loan={loan}
                onSuccess={() => { setSubPanel(null); onUpdate?.(); }}
                onCancel={() => setSubPanel(null)}
              />
            </div>
          </motion.div>
        )}

        {subPanel === 'extend' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-800 rounded-2xl p-4">
              <h4 className="text-sm font-semibold text-primary-text dark:text-white mb-4">Extend Due Date</h4>
              <ExtendDueDateForm
                loan={loan}
                onSuccess={() => { setSubPanel(null); onUpdate?.(); }}
                onCancel={() => setSubPanel(null)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment History */}
      <div>
        <h4 className="text-sm font-semibold text-primary-text dark:text-white mb-3">Payment History</h4>
        <PaymentHistory loanId={loan.id} />
      </div>
    </div>
  );
}
