import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Upload, X, FileText, CheckCircle } from 'lucide-react';
import { InputField } from '../forms/InputField';
import { expenseService, attachmentService } from '../../services/financeService';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS, CATEGORY_COLORS } from '../../constants/finance';
import { Button } from '../common/Button';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY_FORM = {
  category: '',
  amount: '',
  expenseDate: today(),
  description: '',
  paymentMethod: '',
  attachmentId: '',
};

function validate(form) {
  const e = {};
  if (!form.category) e.category = 'Please select a category.';
  if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
    e.amount = 'Enter a valid positive amount.';
  if (!form.expenseDate) e.expenseDate = 'Date is required.';
  return e;
}

/* ─── File Uploader (reused pattern) ─── */
function AttachmentUpload({ attachmentId, onUploaded, onClear }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setUploadError('File must be under 10 MB.'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const attachment = await attachmentService.upload(file);
      setFileName(file.name);
      onUploaded(String(attachment.id));
    } catch {
      setUploadError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-primary-text dark:text-gray-200">
        Attachment <span className="text-xs text-secondary-text font-normal">(optional)</span>
      </label>
      {attachmentId ? (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <FileText size={18} className="text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-700 dark:text-green-400 flex-1 truncate">{fileName || 'Attachment uploaded'}</span>
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          <button type="button" onClick={() => { onClear(); setFileName(''); }} className="text-secondary-text hover:text-red-500 transition-colors"><X size={16} /></button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 cursor-pointer transition-all bg-gray-50/50 dark:bg-gray-800/30 group">
          <input type="file" className="sr-only" accept="image/*,.pdf,.doc,.docx" onChange={handleFile} disabled={uploading} />
          {uploading ? (
            <><svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><span className="text-xs text-secondary-text">Uploading…</span></>
          ) : (
            <><Upload size={20} className="text-secondary-text group-hover:text-violet-500 transition-colors" /><span className="text-xs text-secondary-text group-hover:text-violet-600 transition-colors text-center">Click to upload · Image, PDF · Max 10 MB</span></>
          )}
        </label>
      )}
      {uploadError && <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{uploadError}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPENSE FORM
════════════════════════════════════════════════════════════════ */
export function ExpenseForm({ existing, onSuccess, onCancel }) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          category: existing.category || '',
          amount: String(existing.amount ?? ''),
          expenseDate: existing.expenseDate || today(),
          description: existing.description || '',
          paymentMethod: existing.paymentMethod || '',
          attachmentId: existing.attachmentId || '',
        }
      : { ...EMPTY_FORM }
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (submitError) setSubmitError('');
  }, [errors, submitError]);

  const handleChange = (e) => set(e.target.name, e.target.value);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(form);
    if (errs[name]) setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      category: form.category,
      amount: form.amount,
      expenseDate: form.expenseDate,
      description: form.description || null,
      paymentMethod: form.paymentMethod || null,
      attachmentId: form.attachmentId || null,
    };

    try {
      if (existing) {
        await expenseService.update(existing.id, payload);
      } else {
        await expenseService.create(payload);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="expense-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Category grid */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Category <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EXPENSE_CATEGORIES.map((c) => {
            const colors = CATEGORY_COLORS[c.value] || { bg: '#F3F4F6', text: '#6B7280' };
            const selected = form.category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                id={`cat-${c.value}`}
                onClick={() => set('category', c.value)}
                className={`px-2 py-2.5 rounded-xl text-xs font-medium border-2 transition-all duration-200 text-center ${
                  selected ? 'border-violet-400 shadow-sm' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                }`}
                style={selected ? { background: colors.bg, color: colors.text } : {}}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        {touched.category && errors.category && (
          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.category}</p>
        )}
      </div>

      {/* Amount */}
      <InputField
        id="amount"
        label="Amount (₹)"
        type="number"
        inputMode="decimal"
        step="0.01"
        placeholder="0.00"
        value={form.amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.amount ? errors.amount : ''}
        required
        inputClassName="text-right font-semibold text-lg"
        hint="Decimals are supported. Enter exact amount."
      />

      {/* Date */}
      <InputField
        id="expenseDate"
        label="Date"
        type="date"
        value={form.expenseDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.expenseDate ? errors.expenseDate : ''}
        required
      />

      {/* Payment Method */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="paymentMethod" className="text-sm font-medium text-primary-text dark:text-gray-200">
          Payment Method <span className="text-xs text-secondary-text font-normal">(optional)</span>
        </label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full h-11 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all"
        >
          <option value="">— Select method —</option>
          {PAYMENT_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-primary-text dark:text-gray-200">
          Description <span className="text-xs text-secondary-text font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Add a note…"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all resize-none"
        />
      </div>

      {/* Attachment */}
      <AttachmentUpload
        attachmentId={form.attachmentId}
        onUploaded={(id) => set('attachmentId', id)}
        onClear={() => set('attachmentId', '')}
      />

      {/* Error */}
      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          id="expense-submit-btn"
          action="addExpense"
          type="submit"
          isLoading={submitting}
          className="flex-1"
        >
          {existing ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
}
