import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { InputField } from './InputField';
import { recurringService } from '../../services/loanRecurringService';
import { EXPENSE_CATEGORIES, FREQUENCIES, CATEGORY_COLORS } from '../../constants/finance';

const today = () => new Date().toISOString().split('T')[0];

const EMPTY = {
  name: '',
  category: '',
  amount: '',
  frequency: '',
  startDate: today(),
  endDate: '',
};

function validate(form) {
  const e = {};
  if (!form.name.trim()) e.name = 'Name is required.';
  if (!form.category) e.category = 'Select a category.';
  if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
    e.amount = 'Enter a valid positive amount.';
  if (!form.frequency) e.frequency = 'Select a frequency.';
  if (!form.startDate) e.startDate = 'Start date is required.';
  return e;
}

export function RecurringExpenseForm({ existing, onSuccess, onCancel }) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          name: existing.name || '',
          category: existing.category || '',
          amount: String(existing.amount ?? ''),
          frequency: existing.frequency || '',
          startDate: existing.startDate || today(),
          endDate: existing.endDate || '',
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
      name: form.name.trim(),
      category: form.category,
      amount: form.amount,
      frequency: form.frequency,
      startDate: form.startDate,
      endDate: form.endDate || null,
    };

    try {
      if (existing) {
        await recurringService.update(existing.id, payload);
      } else {
        await recurringService.create(payload);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to save. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="recurring-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Name */}
      <InputField
        id="name"
        label="Name"
        type="text"
        placeholder="e.g. Netflix, Rent, EMI"
        value={form.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name : ''}
        required
      />

      {/* Category grid */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {EXPENSE_CATEGORIES.map((c) => {
            const colors = CATEGORY_COLORS[c.value] || { bg: '#F3F4F6', text: '#6B7280' };
            const selected = form.category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                id={`rcat-${c.value}`}
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
        placeholder="0.00"
        value={form.amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.amount ? errors.amount : ''}
        required
        inputClassName="text-right font-semibold text-lg"
        hint="Amount charged each cycle"
      />

      {/* Frequency */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Frequency <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              type="button"
              id={`freq-${f.value}`}
              onClick={() => set('frequency', f.value)}
              className={`py-2.5 rounded-xl text-xs font-medium border-2 transition-all duration-200 text-center ${
                form.frequency === f.value
                  ? 'border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
                  : 'border-gray-100 dark:border-gray-800 text-secondary-text hover:border-gray-200 dark:hover:border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {touched.frequency && errors.frequency && (
          <p className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12} />{errors.frequency}</p>
        )}
      </div>

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

      {/* End Date (optional) */}
      <InputField
        id="endDate"
        label="End Date"
        type="date"
        value={form.endDate}
        onChange={handleChange}
        hint="Optional — leave empty for indefinite recurrence"
      />

      {/* API error */}
      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-700 text-primary-text dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>
        <motion.button
          id="recurring-submit-btn"
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.01 }}
          whileTap={{ scale: submitting ? 1 : 0.99 }}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #7C5CFC, #10B981)' }}
        >
          {submitting ? (
            <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving…</>
          ) : (
            existing ? 'Update' : 'Create'
          )}
        </motion.button>
      </div>
    </form>
  );
}
