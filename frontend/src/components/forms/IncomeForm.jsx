import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { InputField } from '../forms/InputField';
import { AnimatedButton } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { incomeService, attachmentService } from '../../services/financeService';
import {
  INCOME_SOURCES_STUDENT, INCOME_SOURCES_EMPLOYEE, INCOME_SOURCES_BUSINESS,
  PAYMENT_METHODS,
} from '../../constants/finance';

const today = () => new Date().toISOString().split('T')[0];

function getSourcesForUser(accountType) {
  if (accountType === 'STUDENT') return INCOME_SOURCES_STUDENT;
  if (accountType === 'BUSINESS_OWNER') return INCOME_SOURCES_BUSINESS;
  return INCOME_SOURCES_EMPLOYEE;
}

const EMPTY_FORM = {
  source: '',
  customSource: '',
  amount: '',
  incomeDate: today(),
  description: '',
  paymentMethod: '',
  attachmentId: '',
};

function validate(form) {
  const e = {};
  if (!form.source) e.source = 'Please select a source.';
  if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
    e.amount = 'Enter a valid positive amount.';
  if (!form.incomeDate) e.incomeDate = 'Date is required.';
  return e;
}

/* ─── File Uploader ─── */
function AttachmentUpload({ attachmentId, onUploaded, onClear }) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File must be under 10 MB.');
      return;
    }
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
          <span className="text-sm text-green-700 dark:text-green-400 flex-1 truncate">
            {fileName || 'Attachment uploaded'}
          </span>
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          <button
            type="button"
            onClick={() => { onClear(); setFileName(''); }}
            className="text-secondary-text hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700 cursor-pointer transition-all bg-gray-50/50 dark:bg-gray-800/30 group">
          <input
            type="file"
            className="sr-only"
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={handleFile}
            disabled={uploading}
          />
          {uploading ? (
            <>
              <svg className="animate-spin w-6 h-6 text-violet-500" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs text-secondary-text">Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={20} className="text-secondary-text group-hover:text-violet-500 transition-colors" />
              <span className="text-xs text-secondary-text group-hover:text-violet-600 transition-colors text-center">
                Click to upload · Image, PDF, Doc · Max 10 MB
              </span>
            </>
          )}
        </label>
      )}

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {uploadError}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INCOME FORM
════════════════════════════════════════════════════════════════ */
export function IncomeForm({ existing, onSuccess, onCancel }) {
  const { user } = useAuth();
  const sources = getSourcesForUser(user?.accountType);

  const [form, setForm] = useState(() =>
    existing
      ? {
          source: existing.source || '',
          customSource: '',
          amount: String(existing.amount ?? ''),
          incomeDate: existing.incomeDate || today(),
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    set(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const errs = validate(form);
    if (errs[name]) setErrors((prev) => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      source: form.source,
      amount: form.amount,           // Send as string — Java BigDecimal parses it
      incomeDate: form.incomeDate,
      description: form.description || null,
      paymentMethod: form.paymentMethod || null,
      attachmentId: form.attachmentId || null,
    };

    try {
      if (existing) {
        await incomeService.update(existing.id, payload);
      } else {
        await incomeService.create(payload);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isOtherSource = form.source === 'OTHER';

  return (
    <form id="income-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Source select */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="source" className="text-sm font-medium text-primary-text dark:text-gray-200">
          Income Source <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sources.map((s) => (
            <button
              key={s.value}
              type="button"
              id={`source-${s.value}`}
              onClick={() => set('source', s.value)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border-2 text-left transition-all duration-200 ${
                form.source === s.value
                  ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'border-gray-100 dark:border-gray-800 text-secondary-text hover:border-gray-200 dark:hover:border-gray-700 bg-white dark:bg-gray-900'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        {touched.source && errors.source && (
          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.source}</p>
        )}
      </div>

      {/* Custom source for OTHER */}
      <AnimatePresence>
        {isOtherSource && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <InputField
              id="customSource"
              label="Describe your source"
              type="text"
              placeholder="e.g. YouTube ad revenue"
              value={form.customSource}
              onChange={handleChange}
              hint="Tell us more about this income source"
            />
          </motion.div>
        )}
      </AnimatePresence>

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
        hint="Enter exact amount — decimals are supported"
      />

      {/* Date */}
      <InputField
        id="incomeDate"
        label="Date"
        type="date"
        value={form.incomeDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.incomeDate ? errors.incomeDate : ''}
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
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
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
          placeholder="Add a note about this income…"
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

      {/* API error */}
      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-primary-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        <AnimatedButton
          id="income-submit-btn"
          action="save"
          type="submit"
          size="md"
          loading={submitting}
          className="flex-1"
        >
          {existing ? 'Update Income' : 'Add Income'}
        </AnimatedButton>
      </div>
    </form>
  );
}
