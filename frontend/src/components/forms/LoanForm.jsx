import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { InputField } from './InputField';
import { loanService } from '../../services/loanRecurringService';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY = {
  personName: '',
  personPhone: '',
  type: '',           // 'LENT' | 'BORROWED'
  originalAmount: '',
  startDate: today(),
  dueDate: '',
  description: '',
};

function validate(form) {
  const e = {};
  if (!form.personName.trim()) e.personName = 'Person name is required.';
  if (!form.type) e.type = 'Select a loan type.';
  if (!form.originalAmount || isNaN(parseFloat(form.originalAmount)) || parseFloat(form.originalAmount) <= 0)
    e.originalAmount = 'Enter a valid positive amount.';
  if (!form.startDate) e.startDate = 'Start date is required.';
  return e;
}

export function LoanForm({ existing, onSuccess, onCancel }) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          personName: existing.personName || '',
          personPhone: existing.personPhone || '',
          type: existing.type || '',
          originalAmount: String(existing.originalAmount ?? ''),
          startDate: existing.startDate || today(),
          dueDate: existing.dueDate || '',
          description: existing.description || '',
        }
      : { ...EMPTY }
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = useCallback((field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
    if (submitError) setSubmitError('');
  }, [errors, submitError]);

  const handleChange = (e) => set(e.target.name, e.target.value);
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    const errs = validate(form);
    if (errs[name]) setErrors((p) => ({ ...p, [name]: errs[name] }));
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
      personName: form.personName.trim(),
      personPhone: form.personPhone.trim() || null,
      type: form.type,
      originalAmount: form.originalAmount,
      startDate: form.startDate,
      dueDate: form.dueDate || null,
      description: form.description.trim() || null,
    };

    try {
      if (existing) {
        await loanService.update(existing.id, payload);
      } else {
        await loanService.create(payload);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="loan-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Type selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Loan Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'LENT', label: '💸 I Lent Money', desc: 'Someone owes you', color: '#10B981', bg: '#E6F7E4' },
            { value: 'BORROWED', label: '🤝 I Borrowed', desc: 'You owe someone', color: '#7C5CFC', bg: '#EDEBF7' },
          ].map((t) => (
            <button
              key={t.value}
              type="button"
              id={`loan-type-${t.value}`}
              onClick={() => set('type', t.value)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                form.type === t.value
                  ? 'border-violet-400 shadow-sm'
                  : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
              }`}
              style={form.type === t.value ? { background: t.bg } : {}}
            >
              <p className="text-sm font-semibold text-primary-text dark:text-white">{t.label}</p>
              <p className="text-xs text-secondary-text mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
        {touched.type && errors.type && (
          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.type}</p>
        )}
      </div>

      {/* Person name */}
      <InputField
        id="personName"
        label="Person Name"
        type="text"
        placeholder="Full name"
        value={form.personName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.personName ? errors.personName : ''}
        required
      />

      {/* Phone (optional) */}
      <InputField
        id="personPhone"
        label="Phone Number"
        type="tel"
        placeholder="+91 9876543210"
        value={form.personPhone}
        onChange={handleChange}
        hint="Optional — for reference"
      />

      {/* Amount */}
      <InputField
        id="originalAmount"
        label="Amount (₹)"
        type="number"
        placeholder="0.00"
        value={form.originalAmount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.originalAmount ? errors.originalAmount : ''}
        required
        inputClassName="text-right font-semibold text-lg"
        hint="Original loan amount — remaining is tracked by backend"
      />

      {/* Start Date */}
      <InputField
        id="startDate"
        label="Start Date"
        type="date"
        value={form.startDate}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.startDate ? errors.startDate : ''}
        required
      />

      {/* Due Date */}
      <InputField
        id="dueDate"
        label="Due Date"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
        hint="Optional — leave empty if no fixed date"
      />

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-primary-text dark:text-gray-200">
          Description <span className="text-xs text-secondary-text font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Purpose of loan…"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-primary-text dark:text-gray-100 placeholder:text-gray-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all resize-none"
        />
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-primary-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
          Cancel
        </button>
        <motion.button id="loan-submit-btn" type="submit" disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.01 }} whileTap={{ scale: submitting ? 1 : 0.99 }}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7C5CFC, #10B981)' }}>
          {submitting ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
          ) : (existing ? 'Update Loan' : 'Create Loan')}
        </motion.button>
      </div>
    </form>
  );
}
