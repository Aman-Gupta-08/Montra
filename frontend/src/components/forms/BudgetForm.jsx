import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { InputField } from './InputField';
import { budgetService } from '../../services/budgetCalendarService';
import { EXPENSE_CATEGORIES, BUDGET_PERIODS, CATEGORY_COLORS } from '../../constants/finance';
import { Button } from '../common/Button';

const getInitialDates = (period) => {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  if (period === 'MONTHLY') {
    const start = new Date(y, m, 1).toISOString().split('T')[0];
    const end = new Date(y, m + 1, 0).toISOString().split('T')[0];
    return { start, end };
  }
  if (period === 'WEEKLY') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(now.setDate(monday.getDate() + 6));
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0],
    };
  }
  if (period === 'YEARLY') {
    return {
      start: `${y}-01-01`,
      end: `${y}-12-31`,
    };
  }
  const today = new Date().toISOString().split('T')[0];
  const nextMonth = new Date(now.setDate(now.getDate() + 30)).toISOString().split('T')[0];
  return { start: today, end: nextMonth };
};

const EMPTY = () => {
  const { start, end } = getInitialDates('MONTHLY');
  return {
    category: '',
    amount: '',
    period: 'MONTHLY',
    startDate: start,
    endDate: end,
  };
};

function validate(form) {
  const e = {};
  if (!form.category) e.category = 'Select a category.';
  if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0)
    e.amount = 'Enter a valid positive amount.';
  if (!form.period) e.period = 'Select a budget period.';
  if (!form.startDate) e.startDate = 'Start date is required.';
  if (!form.endDate) e.endDate = 'End date is required.';
  if (form.startDate && form.endDate && form.endDate < form.startDate)
    e.endDate = 'End date cannot be before start date.';
  return e;
}

export function BudgetForm({ existing, onSuccess, onCancel }) {
  const [form, setForm] = useState(() =>
    existing
      ? {
          category: existing.category || '',
          amount: String(existing.amount ?? ''),
          period: existing.period || 'MONTHLY',
          startDate: existing.startDate || '',
          endDate: existing.endDate || '',
        }
      : EMPTY()
  );

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const set = useCallback((field, value) => {
    setForm((p) => {
      const updated = { ...p, [field]: value };
      if (field === 'period' && !existing && value !== 'CUSTOM') {
        const { start, end } = getInitialDates(value);
        updated.startDate = start;
        updated.endDate = end;
      }
      return updated;
    });
    if (errors[field]) setErrors((p) => ({ ...p, [field]: '' }));
    if (submitError) setSubmitError('');
  }, [errors, submitError, existing]);

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
      category: form.category,
      amount: parseFloat(form.amount),
      period: form.period,
      startDate: form.startDate,
      endDate: form.endDate,
    };

    try {
      if (existing) {
        await budgetService.update(existing.id, payload);
      } else {
        await budgetService.create(payload);
      }
      onSuccess?.();
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err?.message || 'Failed to save budget.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form id="budget-form" onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Category Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {EXPENSE_CATEGORIES.map((cat) => {
            const isSelected = form.category === cat.value;
            const colors = CATEGORY_COLORS[cat.value] || { bg: '#F3F4F6', text: '#6B7280' };
            return (
              <button
                key={cat.value}
                type="button"
                id={`budget-cat-${cat.value.toLowerCase()}`}
                onClick={() => set('category', cat.value)}
                className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border-2 transition-all flex flex-col items-center gap-1 ${
                  isSelected
                    ? 'border-violet-500 shadow-sm ring-1 ring-violet-200 dark:ring-violet-900'
                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
                style={{
                  background: isSelected ? colors.bg : 'var(--card-bg, #F9FAFB)',
                  color: isSelected ? colors.text : 'inherit',
                }}
              >
                <span className="truncate w-full">{cat.label}</span>
              </button>
            );
          })}
        </div>
        {touched.category && errors.category && (
          <p className="text-xs text-red-500 mt-1">{errors.category}</p>
        )}
      </div>

      {/* Amount */}
      <InputField
        id="amount"
        name="amount"
        label="Budget Amount (₹)"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="e.g. 5000"
        value={form.amount}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.amount ? errors.amount : ''}
        required
        inputClassName="text-right font-semibold text-lg"
      />

      {/* Period Selection */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-primary-text dark:text-gray-200">
          Period <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BUDGET_PERIODS.map((p) => {
            const isSelected = form.period === p.value;
            return (
              <button
                key={p.value}
                type="button"
                id={`budget-period-${p.value.toLowerCase()}`}
                onClick={() => set('period', p.value)}
                className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 text-secondary-text hover:border-gray-300'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          id="startDate"
          name="startDate"
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.startDate ? errors.startDate : ''}
          required
        />
        <InputField
          id="endDate"
          name="endDate"
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.endDate ? errors.endDate : ''}
          required
        />
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          id="budget-submit-btn"
          action="save"
          type="submit"
          isLoading={submitting}
          className="flex-1"
        >
          {existing ? 'Update Budget' : 'Set Budget'}
        </Button>
      </div>
    </form>
  );
}
