import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Plus, Pencil, Trash2, Search, Filter,
  TrendingUp, TrendingDown, DollarSign, MapPin, Briefcase,
  Calendar, CheckCircle2, FileText, ArrowDownLeft, ArrowUpRight,
  AlertCircle,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { businessService } from '../services/businessService';
import { SlidePanel, DeleteConfirmModal } from '../components/common/Modals';
import { InputField } from '../components/forms/InputField';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { PAYMENT_METHODS, getPaymentLabel } from '../constants/finance';
import { Button } from '../components/common/Button';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ─── Business Profile Form ─── */
function BusinessProfileForm({ business, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    businessName: business?.businessName || '',
    businessType: business?.businessType || '',
    location: business?.location || '',
    description: business?.description || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.businessName.trim()) {
      setError('Business name is required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (business?.id) {
        await businessService.update(form);
      } else {
        await businessService.create(form);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save business profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        id="businessName"
        name="businessName"
        label="Business Name"
        placeholder="e.g. Acme Innovations Pvt Ltd"
        value={form.businessName}
        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
        required
      />

      <InputField
        id="businessType"
        name="businessType"
        label="Business Type / Industry"
        placeholder="e.g. Retail, Software Consulting, Manufacturing"
        value={form.businessType}
        onChange={(e) => setForm({ ...form, businessType: e.target.value })}
      />

      <InputField
        id="location"
        name="location"
        label="Location / Registered Address"
        placeholder="e.g. Mumbai, Maharashtra"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Description
        </label>
        <textarea
          id="business-desc"
          rows={3}
          placeholder="Brief description of operations…"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 transition-all resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
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
          type="submit"
          action="save"
          isLoading={submitting}
          size="sm"
          className="flex-1"
        >
          {business?.id ? 'Update Profile' : 'Create Profile'}
        </Button>
      </div>
    </form>
  );
}

/* ─── Transaction Form (Sale or Expense) ─── */
function TransactionForm({ type, existing, onSuccess, onCancel }) {
  const isSale = type === 'SALE' || existing?.type === 'SALE';
  const [amount, setAmount] = useState(existing ? String(existing.amount) : '');
  const [transactionDate, setTransactionDate] = useState(
    existing?.transactionDate || new Date().toISOString().split('T')[0]
  );
  const [description, setDescription] = useState(existing?.description || '');
  const [paymentMethod, setPaymentMethod] = useState(existing?.paymentMethod || 'UPI');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      setError('Enter a valid positive amount.');
      return;
    }
    setSubmitting(true);
    setError('');

    const payload = {
      amount: num,
      transactionDate,
      description: description.trim() || null,
      paymentMethod,
    };

    try {
      if (existing?.id) {
        await businessService.updateTransaction(existing.id, payload);
      } else if (isSale) {
        await businessService.addSale(payload);
      } else {
        await businessService.addExpense(payload);
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save transaction.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
        <span
          className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider"
          style={{
            background: isSale ? '#E6F7E4' : '#FEE2E2',
            color: isSale ? '#059669' : '#DC2626',
          }}
        >
          {isSale ? 'Commercial Sale / Revenue' : 'Business Operating Expense'}
        </span>
      </div>

      <InputField
        id="txAmount"
        label="Amount (₹)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        inputClassName="text-right font-bold text-lg"
      />

      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="txDate"
          label="Transaction Date"
          type="date"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary-text dark:text-gray-200">Payment Method</label>
          <select
            id="txPaymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full h-11 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400"
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">Description / Note</label>
        <textarea
          id="txDescription"
          rows={2}
          placeholder="Client name, invoice details, project code…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 transition-all resize-none"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex gap-3 pt-2">
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
          id="tx-submit-btn"
          action={isSale ? 'addIncome' : 'addExpense'}
          type="submit"
          isLoading={submitting}
          size="sm"
          className="flex-1"
        >
          {existing ? 'Update Transaction' : isSale ? 'Record Sale' : 'Record Expense'}
        </Button>
      </div>
    </form>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN BUSINESS PAGE
════════════════════════════════════════════════════════════════ */
export default function BusinessPage() {
  const { data: business, refetch: refetchBusiness } = useFetch(businessService.get);
  const { data: dashboard, refetch: refetchDashboard } = useFetch(businessService.getDashboard);
  const { data: transactions, isLoading, error, refetch: refetchTx } = useFetch(businessService.getTransactions);

  const [txTab, setTxTab] = useState('ALL'); // 'ALL' | 'SALE' | 'EXPENSE'
  const [search, setSearch] = useState('');

  // Modals
  const [profileModal, setProfileModal] = useState(false);
  const [txModal, setTxModal] = useState(false);
  const [txModalType, setTxModalType] = useState('SALE'); // 'SALE' | 'EXPENSE'
  const [editingTx, setEditingTx] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const refetchAll = () => {
    refetchBusiness();
    refetchDashboard();
    refetchTx();
  };

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    let list = transactions;

    if (txTab !== 'ALL') {
      list = list.filter((t) => t.type === txTab);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.paymentMethod?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [transactions, txTab, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await businessService.deleteTransaction(deleteTarget.id);
      setDeleteTarget(null);
      refetchAll();
    } catch {
      /* keep modal */
    } finally {
      setDeleting(false);
    }
  };

  if (error) return <ErrorState message={error} onRetry={refetchAll} />;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {/* ─── Business Info Header Card ─── */}
      <div className="glass-card glossy-panel rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-sm">
            <Building2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-primary-text dark:text-white">
                {business?.businessName || 'Your Business Name'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20">
                {business?.businessType || 'General Business'}
              </span>
            </div>
            {business?.location && (
              <p className="text-xs text-secondary-text mt-1 flex items-center gap-1">
                <MapPin size={12} />
                {business.location}
              </p>
            )}
            {business?.description && (
              <p className="text-xs text-secondary-text mt-1.5 line-clamp-2 max-w-2xl">
                {business.description}
              </p>
            )}
          </div>
        </div>

        <button
          id="edit-business-profile-btn"
          onClick={() => setProfileModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold glass-1 text-primary-text dark:text-gray-200 hover:border-violet-300 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <Pencil size={13} />
          <span>{business?.id ? 'Edit Profile' : 'Setup Profile'}</span>
        </button>
      </div>

      {/* ─── Business Profit Dashboard (Backend Calculation) ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monthly Sales */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-5 shadow-sm flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-secondary-text mb-1">Monthly Sales / Revenue</p>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {fmt(dashboard?.monthlySales)}
            </p>
            <p className="text-xs text-secondary-text mt-1">
              Today: <strong className="text-emerald-600 dark:text-emerald-400">{fmt(dashboard?.todaysSales)}</strong>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
            <TrendingUp size={20} />
          </div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-2xl p-5 shadow-sm flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-secondary-text mb-1">Business Operating Expenses</p>
            <p className="text-2xl font-extrabold text-rose-500 dark:text-rose-400">
              {fmt(dashboard?.monthlyExpenses)}
            </p>
            <p className="text-xs text-secondary-text mt-1">
              Today: <strong className="text-rose-500 dark:text-rose-400">{fmt(dashboard?.todaysExpenses)}</strong>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
            <TrendingDown size={20} />
          </div>
        </motion.div>

        {/* Net Business Profit (Backend calculated) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-5 shadow-sm flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold text-secondary-text mb-1">Net Commercial Profit</p>
            <p className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">
              {fmt(dashboard?.monthlyProfit)}
            </p>
            <p className="text-xs text-secondary-text mt-1">
              Today: <strong className="text-violet-600 dark:text-violet-400">{fmt(dashboard?.todaysProfit)}</strong>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 border border-violet-500/20">
            <DollarSign size={20} />
          </div>
        </motion.div>
      </div>

      {/* ─── Business Transactions Management ─── */}
      <div className="flex flex-col gap-4">
        {/* Toolbar: Tabs, Search, Add Sale & Add Expense */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 glass-1 p-1 rounded-xl shadow-2xs">
            {['ALL', 'SALE', 'EXPENSE'].map((tab) => (
              <button
                key={tab}
                id={`tx-tab-${tab.toLowerCase()}`}
                onClick={() => setTxTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                  txTab === tab
                    ? 'glass-4 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-secondary-text hover:text-primary-text'
                }`}
              >
                {tab === 'ALL' ? 'All Ledger' : tab === 'SALE' ? 'Sales' : 'Expenses'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text" />
            <input
              id="business-search"
              type="text"
              placeholder="Search description or method…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl glass-input text-xs text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400"
            />
          </div>

          {/* Action Buttons: Record Sale & Record Expense */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              id="record-sale-btn"
              action="addIncome"
              size="sm"
              onClick={() => {
                setEditingTx(null);
                setTxModalType('SALE');
                setTxModal(true);
              }}
            >
              Record Sale
            </Button>

            <Button
              id="record-expense-btn"
              action="addExpense"
              size="sm"
              onClick={() => {
                setEditingTx(null);
                setTxModalType('EXPENSE');
                setTxModal(true);
              }}
            >
              Record Expense
            </Button>
          </div>
        </div>

        {/* Transactions Table / List */}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 glass-card rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={transactions?.length === 0 ? 'No transactions recorded yet' : 'No transactions match filters'}
            description={
              transactions?.length === 0
                ? 'Record your business sales revenues and commercial operational expenses here.'
                : 'Try adjusting your search query or tab filters.'
            }
          />
        ) : (
          <div className="glass-table-container rounded-2xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100/50 dark:divide-white/5">
              {filteredTransactions.map((tx) => {
                const isSale = tx.type === 'SALE';
                return (
                  <div
                    key={tx.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass-table-row transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: isSale ? '#E6F7E4' : '#FEE2E2' }}
                      >
                        {isSale ? (
                          <ArrowDownLeft size={18} className="text-emerald-600" />
                        ) : (
                          <ArrowUpRight size={18} className="text-red-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider"
                            style={{
                              background: isSale ? '#E6F7E4' : '#FEE2E2',
                              color: isSale ? '#059669' : '#DC2626',
                            }}
                          >
                            {isSale ? 'Sale' : 'Expense'}
                          </span>
                          <span className="text-xs font-semibold text-secondary-text">
                            {fmtDate(tx.transactionDate)}
                          </span>
                          {tx.paymentMethod && (
                            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-secondary-text">
                              {getPaymentLabel(tx.paymentMethod)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-primary-text dark:text-white mt-1">
                          {tx.description || (isSale ? 'Commercial Sale' : 'Business Expense')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <p
                        className="text-base font-bold text-right"
                        style={{ color: isSale ? '#059669' : '#DC2626' }}
                      >
                        {isSale ? '+' : '-'} {fmt(tx.amount)}
                      </p>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingTx(tx);
                            setTxModalType(tx.type);
                            setTxModal(true);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tx)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ─── Profile SlidePanel ─── */}
      <SlidePanel
        isOpen={profileModal}
        onClose={() => setProfileModal(false)}
        title={business?.id ? 'Edit Business Profile' : 'Setup Business Profile'}
      >
        <BusinessProfileForm
          business={business}
          onSuccess={() => {
            setProfileModal(false);
            refetchAll();
          }}
          onCancel={() => setProfileModal(false)}
        />
      </SlidePanel>

      {/* ─── Transaction SlidePanel ─── */}
      <SlidePanel
        isOpen={txModal}
        onClose={() => {
          setTxModal(false);
          setEditingTx(null);
        }}
        title={
          editingTx
            ? 'Edit Transaction'
            : txModalType === 'SALE'
            ? 'Record Commercial Sale'
            : 'Record Business Expense'
        }
      >
        <TransactionForm
          type={txModalType}
          existing={editingTx}
          onSuccess={() => {
            setTxModal(false);
            setEditingTx(null);
            refetchAll();
          }}
          onCancel={() => {
            setTxModal(false);
            setEditingTx(null);
          }}
        />
      </SlidePanel>

      {/* ─── Delete Transaction Confirm Modal ─── */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Transaction?"
        message={`Are you sure you want to delete this ${deleteTarget?.type?.toLowerCase()} transaction of ${fmt(deleteTarget?.amount)}?`}
        confirmText="Delete"
        isLoading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
