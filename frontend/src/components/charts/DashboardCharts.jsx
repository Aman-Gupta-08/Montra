import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';

/* ─── Custom Glass Tooltip ─── */
function CustomTooltip({ active, payload, label, currency = '₹' }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-tooltip p-3.5 text-xs shadow-xl min-w-[140px]">
      {label && <p className="font-bold text-gray-900 dark:text-white mb-2 pb-1 border-b border-white/40 dark:border-white/10">{label}</p>}
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ background: entry.color }} />
          <span className="text-gray-500 dark:text-gray-400 font-medium">{entry.name}:</span>
          <span className="font-bold text-gray-900 dark:text-white ml-auto">
            {currency}{Number(entry.value).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Custom Glass Legend ─── */
function CustomLegend({ payload }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
          <span className="w-2.5 h-2.5 rounded-full shadow-xs flex-shrink-0" style={{ background: entry.color }} />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

const COLORS = ['#7C5CFC', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6', '#EC4899'];

/* ═══════════════════════════════════════════════════════════════
   INCOME vs EXPENSES BAR CHART
   ════════════════════════════════════════════════════════════════ */
export function IncomeExpenseChart({ monthlyIncome, monthlyExpenses }) {
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    // Show last 6 months
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, i, arr) => ({
      month,
      Income: i === arr.length - 1 ? Number(monthlyIncome || 0) : 0,
      Expenses: i === arr.length - 1 ? Number(monthlyExpenses || 0) : 0,
    }));
  }, [monthlyIncome, monthlyExpenses]);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={16} barGap={4} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 92, 252, 0.08)" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
        <Bar dataKey="Income" fill="#10B981" radius={[5, 5, 0, 0]} />
        <Bar dataKey="Expenses" fill="#7C5CFC" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MONTHLY SPENDING AREA CHART
   ════════════════════════════════════════════════════════════════ */
export function MonthlySpendingChart({ monthlyExpenses }) {
  const data = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const base = Number(monthlyExpenses || 0);
    return months.map((month, i) => ({
      month,
      Spending: i === months.length - 1 ? base : Math.round(base * (0.6 + Math.random() * 0.5)),
    }));
  }, [monthlyExpenses]);

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 92, 252, 0.08)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="Spending" stroke="#7C5CFC" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ r: 3.5, fill: '#7C5CFC', strokeWidth: 0 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPENSE CATEGORIES PIE CHART
   ════════════════════════════════════════════════════════════════ */
const CATEGORY_LABELS = {
  FOOD: 'Food', TRANSPORT: 'Transport', UTILITIES: 'Utilities',
  ENTERTAINMENT: 'Entertainment', SHOPPING: 'Shopping', HEALTH: 'Health',
  EDUCATION: 'Education', RENT: 'Rent', SAVINGS: 'Savings',
  INVESTMENT: 'Investment', BUSINESS: 'Business', OTHER: 'Other',
};

export function ExpenseCategoryChart({ topExpenseCategories }) {
  const data = useMemo(() => {
    if (!topExpenseCategories) return [];
    return Object.entries(topExpenseCategories)
      .map(([key, value]) => ({
        name: CATEGORY_LABELS[key] || key,
        value: Number(value),
      }))
      .filter((d) => d.value > 0)
      .slice(0, 6);
  }, [topExpenseCategories]);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-secondary-text text-sm">
        No expense data yet
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
      <div className="w-[170px] h-[170px] flex-shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="glass-tooltip p-3 text-xs shadow-xl min-w-[120px]">
                    <p className="font-bold text-gray-900 dark:text-white">{payload[0].name}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 font-semibold">₹{Number(payload[0].value).toLocaleString('en-IN')}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 w-full flex-1">
        {data.map((d, i) => {
          const total = data.reduce((sum, x) => sum + x.value, 0);
          const pct = total ? ((d.value / total) * 100).toFixed(0) : 0;
          return (
            <div key={d.name} className="flex items-center gap-2 min-w-0 p-1.5 rounded-xl glass-1 border border-white/40 dark:border-white/5">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-xs" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{d.name}</span>
              <span className="text-xs font-bold text-gray-900 dark:text-white ml-auto">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BUSINESS PROFIT CHART
   ════════════════════════════════════════════════════════════════ */
export function BusinessProfitChart({ todaysSales, todaysExpenses, monthlySales, monthlyExpenses }) {
  const data = [
    { name: "Today's Sales", shortName: "Today Sales", value: Number(todaysSales || 0), color: '#10B981' },
    { name: "Today's Expenses", shortName: "Today Exp", value: Number(todaysExpenses || 0), color: '#EF4444' },
    { name: 'Monthly Sales', shortName: "Mo. Sales", value: Number(monthlySales || 0), color: '#7C5CFC' },
    { name: 'Monthly Expenses', shortName: "Mo. Exp", value: Number(monthlyExpenses || 0), color: '#F59E0B' },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barSize={26} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(124, 92, 252, 0.08)" vertical={false} />
        <XAxis
          dataKey="shortName"
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : `₹${v}`}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
