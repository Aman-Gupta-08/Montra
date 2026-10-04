/* ═══════════════════════════════════════════════════════════════
   INCOME SOURCES
════════════════════════════════════════════════════════════════ */
export const INCOME_SOURCES_STUDENT = [
  { value: 'POCKET_MONEY', label: 'Pocket Money' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'FREELANCING', label: 'Freelancing' },
  { value: 'PART_TIME_JOB', label: 'Part-time Job' },
  { value: 'GIFT', label: 'Gift' },
  { value: 'OTHER', label: 'Other' },
];

export const INCOME_SOURCES_EMPLOYEE = [
  { value: 'SALARY', label: 'Salary' },
  { value: 'FREELANCING', label: 'Freelancing' },
  { value: 'BONUS', label: 'Bonus' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'GIFT', label: 'Gift' },
  { value: 'OTHER', label: 'Other' },
];

export const INCOME_SOURCES_BUSINESS = [
  { value: 'FREELANCING', label: 'Freelancing' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'BONUS', label: 'Bonus' },
  { value: 'GIFT', label: 'Gift' },
  { value: 'OTHER', label: 'Other' },
];

export const ALL_INCOME_SOURCES = [
  { value: 'POCKET_MONEY', label: 'Pocket Money' },
  { value: 'SCHOLARSHIP', label: 'Scholarship' },
  { value: 'FREELANCING', label: 'Freelancing' },
  { value: 'PART_TIME_JOB', label: 'Part-time Job' },
  { value: 'SALARY', label: 'Salary' },
  { value: 'BONUS', label: 'Bonus' },
  { value: 'INVESTMENT', label: 'Investment' },
  { value: 'GIFT', label: 'Gift' },
  { value: 'OTHER', label: 'Other' },
];

/* ═══════════════════════════════════════════════════════════════
   EXPENSE CATEGORIES
════════════════════════════════════════════════════════════════ */
export const EXPENSE_CATEGORIES = [
  { value: 'RENT', label: 'Rent' },
  { value: 'ELECTRICITY', label: 'Electricity' },
  { value: 'WATER', label: 'Water' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'MOBILE', label: 'Mobile' },
  { value: 'FOOD', label: 'Food' },
  { value: 'TRANSPORT', label: 'Transport' },
  { value: 'PETROL', label: 'Petrol' },
  { value: 'BUS', label: 'Bus' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'BILLS', label: 'Bills' },
  { value: 'OTHER', label: 'Other' },
];

/* ═══════════════════════════════════════════════════════════════
   PAYMENT METHODS
════════════════════════════════════════════════════════════════ */
export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'OTHER', label: 'Other' },
];

/* ═══════════════════════════════════════════════════════════════
   DISPLAY LABEL HELPERS
════════════════════════════════════════════════════════════════ */
export function getSourceLabel(source) {
  return ALL_INCOME_SOURCES.find((s) => s.value === source)?.label || source || '—';
}

export function getCategoryLabel(category) {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label || category || '—';
}

export function getPaymentLabel(method) {
  return PAYMENT_METHODS.find((m) => m.value === method)?.label || method || '—';
}

/* ─── Source / Category color chips ─── */
export const SOURCE_COLORS = {
  POCKET_MONEY:  { bg: '#EDEBF7', text: '#7C5CFC' },
  SCHOLARSHIP:   { bg: '#E6F7F6', text: '#0EA5E9' },
  FREELANCING:   { bg: '#FAF8EB', text: '#D97706' },
  PART_TIME_JOB: { bg: '#F6FCE4', text: '#65A30D' },
  SALARY:        { bg: '#E6F7E4', text: '#059669' },
  BONUS:         { bg: '#D7F2E6', text: '#10B981' },
  INVESTMENT:    { bg: '#EDEBF7', text: '#8B5CF6' },
  GIFT:          { bg: '#FFF1F2', text: '#E11D48' },
  OTHER:         { bg: '#F3F4F6', text: '#6B7280' },
};

export const CATEGORY_COLORS = {
  RENT:          { bg: '#EDEBF7', text: '#7C5CFC' },
  ELECTRICITY:   { bg: '#FAF8EB', text: '#D97706' },
  WATER:         { bg: '#E6F7F6', text: '#0EA5E9' },
  INTERNET:      { bg: '#E6F7F6', text: '#0284C7' },
  MOBILE:        { bg: '#E6F7F6', text: '#0369A1' },
  FOOD:          { bg: '#FEF9C3', text: '#A16207' },
  TRANSPORT:     { bg: '#E6F7E4', text: '#059669' },
  PETROL:        { bg: '#F6FCE4', text: '#65A30D' },
  BUS:           { bg: '#E6F7E4', text: '#10B981' },
  SHOPPING:      { bg: '#FFF1F2', text: '#E11D48' },
  EDUCATION:     { bg: '#D7F2E6', text: '#10B981' },
  HEALTHCARE:    { bg: '#FEE2E2', text: '#DC2626' },
  ENTERTAINMENT: { bg: '#EDEBF7', text: '#8B5CF6' },
  TRAVEL:        { bg: '#E6F7F6', text: '#0EA5E9' },
  BILLS:         { bg: '#FAF8EB', text: '#92400E' },
  OTHER:         { bg: '#F3F4F6', text: '#6B7280' },
};

/* ═══════════════════════════════════════════════════════════════
   FREQUENCY
════════════════════════════════════════════════════════════════ */
export const FREQUENCIES = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function getFrequencyLabel(f) {
  return FREQUENCIES.find((x) => x.value === f)?.label || f || '—';
}

/* ═══════════════════════════════════════════════════════════════
   LOAN TYPES / STATUS
════════════════════════════════════════════════════════════════ */
export const LOAN_STATUS_CONFIG = {
  ACTIVE:         { label: 'Active',          bg: '#E6F7F6', text: '#0284C7' },
  PARTIALLY_PAID: { label: 'Partially Paid',  bg: '#FAF8EB', text: '#D97706' },
  PAID:           { label: 'Paid',             bg: '#E6F7E4', text: '#059669' },
  OVERDUE:        { label: 'Overdue',          bg: '#FEE2E2', text: '#DC2626' },
  CANCELLED:      { label: 'Cancelled',        bg: '#F3F4F6', text: '#6B7280' },
};

export function getLoanStatusConfig(status) {
  return LOAN_STATUS_CONFIG[status] || { label: status || '—', bg: '#F3F4F6', text: '#6B7280' };
}

/* ═══════════════════════════════════════════════════════════════
   BUDGET PERIODS & STATUS
════════════════════════════════════════════════════════════════ */
export const BUDGET_PERIODS = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'YEARLY', label: 'Yearly' },
  { value: 'CUSTOM', label: 'Custom' },
];

export const BUDGET_STATUS_CONFIG = {
  OK:       { label: 'On Track',       bg: '#E6F7E4', text: '#059669', bar: '#10B981', border: 'border-emerald-200 dark:border-emerald-900/40' },
  WARNING:  { label: '80% Warning',    bg: '#FAF8EB', text: '#D97706', bar: '#F59E0B', border: 'border-amber-200 dark:border-amber-900/40' },
  EXCEEDED: { label: '100% Exceeded',  bg: '#FEE2E2', text: '#DC2626', bar: '#EF4444', border: 'border-red-200 dark:border-red-900/40' },
};

export function getBudgetStatus(spent, total) {
  const s = parseFloat(spent || 0);
  const t = parseFloat(total || 0);
  if (t <= 0) return 'OK';
  const ratio = s / t;
  if (ratio >= 1.0) return 'EXCEEDED';
  if (ratio >= 0.8) return 'WARNING';
  return 'OK';
}

export function getBudgetStatusConfig(status, spent, total) {
  const resolvedStatus = status || getBudgetStatus(spent, total);
  return BUDGET_STATUS_CONFIG[resolvedStatus] || BUDGET_STATUS_CONFIG.OK;
}

/* ═══════════════════════════════════════════════════════════════
   CALENDAR EVENT TYPES & BADGES
════════════════════════════════════════════════════════════════ */
export const CALENDAR_FILTERS = [
  { key: 'ALL', label: 'All Events' },
  { key: 'INCOME', label: 'Income', color: '#10B981', bg: '#E6F7E4' },
  { key: 'EXPENSE', label: 'Expense', color: '#EF4444', bg: '#FEE2E2' },
  { key: 'LOAN', label: 'Loan', color: '#F59E0B', bg: '#FAF8EB' },
  { key: 'BILL', label: 'Bill', color: '#7C5CFC', bg: '#EDEBF7' },
  { key: 'SALARY', label: 'Salary', color: '#0284C7', bg: '#E6F7F6' },
];

export const CALENDAR_EVENT_CONFIG = {
  INCOME:  { label: 'Income',          color: '#10B981', bg: '#E6F7E4', text: '#059669', dot: 'bg-emerald-500' },
  EXPENSE: { label: 'Expense',         color: '#EF4444', bg: '#FEE2E2', text: '#DC2626', dot: 'bg-rose-500' },
  LOAN:    { label: 'Loan Due',        color: '#D97706', bg: '#FAF8EB', text: '#B45309', dot: 'bg-amber-500' },
  BILL:    { label: 'Bill / Recurring', color: '#7C5CFC', bg: '#EDEBF7', text: '#6D28D9', dot: 'bg-violet-500' },
  SALARY:  { label: 'Salary',          color: '#0284C7', bg: '#E6F7F6', text: '#0369A1', dot: 'bg-sky-500' },
};

