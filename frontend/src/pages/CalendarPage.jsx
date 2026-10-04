import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, ChevronLeft, ChevronRight, Filter, Search,
  TrendingUp, TrendingDown, Clock, CheckCircle2, AlertTriangle,
  Wallet, DollarSign, HandCoins, RefreshCw, Eye, X, ChevronDown,
  ArrowUpRight, ArrowDownLeft,
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import { calendarService } from '../services/budgetCalendarService';
import { SlidePanel } from '../components/common/Modals';
import { ErrorState, EmptyState } from '../components/dashboard/States';
import { Button } from '../components/common/Button';
import {
  CALENDAR_FILTERS,
  CALENDAR_EVENT_CONFIG,
} from '../constants/finance';

function fmt(v) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ═══════════════════════════════════════════════════════════════
   EVENT DETAIL PANEL
════════════════════════════════════════════════════════════════ */
function EventDetailPanel({ event, onClose }) {
  if (!event) return null;
  const cfg = CALENDAR_EVENT_CONFIG[event.type] || CALENDAR_EVENT_CONFIG.EXPENSE;
  const isPositive = event.type === 'INCOME' || event.type === 'SALARY';

  return (
    <div className="flex flex-col gap-6">
      {/* Header Badge & Amount */}
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/60 text-center gap-2">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold"
          style={{ background: cfg.bg, color: cfg.text }}
        >
          {cfg.label}
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center justify-center gap-1" style={{ color: cfg.color }}>
          {isPositive ? '+' : '-'} {fmt(event.amount)}
        </h2>
        <p className="text-sm font-medium text-primary-text dark:text-gray-200">{event.title}</p>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <p className="text-xs text-secondary-text mb-1">Date</p>
          <p className="text-sm font-semibold text-primary-text dark:text-white flex items-center gap-1.5">
            <Clock size={14} className="text-secondary-text" />
            {fmtDate(event.date)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <p className="text-xs text-secondary-text mb-1">Status</p>
          <p className="text-sm font-semibold text-primary-text dark:text-white flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            {event.status || 'Scheduled'}
          </p>
        </div>

        {event.category && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-secondary-text mb-1">Category / Source</p>
            <p className="text-sm font-semibold text-primary-text dark:text-white">{event.category}</p>
          </div>
        )}

        {event.referenceId && (
          <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <p className="text-xs text-secondary-text mb-1">Reference ID</p>
            <p className="text-sm font-mono text-secondary-text">#{event.referenceId}</p>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-secondary-text mb-1">Notes & Details</p>
          <p className="text-sm text-primary-text dark:text-gray-200 whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      {/* Close button */}
      <Button
        variant="secondary"
        onClick={onClose}
        fullWidth
        className="w-full mt-4"
      >
        Close Details
      </Button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FINANCIAL CALENDAR PAGE
════════════════════════════════════════════════════════════════ */
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month' | 'week' | 'day'
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(() => new Date().toISOString().split('T')[0]);

  // Query events from GET /api/calendar
  const fetchEvents = useCallback(() => {
    return calendarService.getEvents();
  }, []);

  const { data: rawEvents, isLoading, error, refetch } = useFetch(fetchEvents);

  const events = useMemo(() => rawEvents || [], [rawEvents]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    if (selectedFilter === 'ALL') return events;
    return events.filter((e) => e.type === selectedFilter);
  }, [events, selectedFilter]);

  // Events keyed by YYYY-MM-DD
  const eventsByDate = useMemo(() => {
    const map = {};
    for (const ev of filteredEvents) {
      if (!ev.date) continue;
      const dStr = typeof ev.date === 'string' ? ev.date.split('T')[0] : ev.date;
      if (!map[dStr]) map[dStr] = [];
      map[dStr].push(ev);
    }
    return map;
  }, [filteredEvents]);

  /* ─── Navigation helpers ─── */
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDay(today.toISOString().split('T')[0]);
  };

  /* ─── Month Matrix Generation ─── */
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const days = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDate - i;
      const prevDate = new Date(year, month - 1, dayNum);
      days.push({
        date: prevDate.toISOString().split('T')[0],
        dayNumber: dayNum,
        isCurrentMonth: false,
      });
    }

    // Days of current month
    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayNumber: i,
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({
        date: nextDate.toISOString().split('T')[0],
        dayNumber: i,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentDate]);

  /* ─── Week Days Generation ─── */
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day; // Sunday start
    const days = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(curr);
      d.setDate(diff + i);
      days.push({
        date: d.toISOString().split('T')[0],
        dayNumber: d.getDate(),
        dayName: WEEKDAYS[i],
        isCurrentMonth: d.getMonth() === currentDate.getMonth(),
      });
    }
    return days;
  }, [currentDate]);

  /* ─── Period Title ─── */
  const periodTitle = useMemo(() => {
    const year = currentDate.getFullYear();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    if (viewMode === 'month') {
      return `${monthName} ${year}`;
    }
    if (viewMode === 'week') {
      if (weekDays.length < 7) return `${monthName} ${year}`;
      const start = new Date(weekDays[0].date);
      const end = new Date(weekDays[6].date);
      const startStr = start.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      const endStr = end.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
      return `${startStr} – ${endStr}`;
    }
    return currentDate.toLocaleDateString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }, [currentDate, viewMode, weekDays]);

  const todayStr = new Date().toISOString().split('T')[0];

  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden">
      {/* ─── Top Control Bar ─── */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button
              id="calendar-prev-btn"
              onClick={handlePrev}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-primary-text hover:bg-white dark:hover:bg-gray-700 transition-all"
              title="Previous"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              id="calendar-today-btn"
              onClick={handleToday}
              className="px-3 h-8 rounded-lg text-xs font-semibold text-primary-text dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all"
            >
              Today
            </button>
            <button
              id="calendar-next-btn"
              onClick={handleNext}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-secondary-text hover:text-primary-text hover:bg-white dark:hover:bg-gray-700 transition-all"
              title="Next"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-primary-text dark:text-white truncate">
            {periodTitle}
          </h2>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 p-1 sm:p-1.5 rounded-2xl bg-[#090d16]/90 border border-white/10 shadow-2xl backdrop-blur-md self-stretch sm:self-auto justify-center">
          {['month', 'week', 'day'].map((mode) => (
            <button
              key={mode}
              id={`calendar-view-${mode}`}
              onClick={() => setViewMode(mode)}
              className={`flex-1 sm:flex-initial px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all duration-300 cursor-pointer text-center ${
                viewMode === mode
                  ? 'bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Filter Pills Bar ─── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none touch-scroll">
        {CALENDAR_FILTERS.map((f) => {
          const isSelected = selectedFilter === f.key;
          return (
            <button
              key={f.key}
              id={`filter-${f.key.toLowerCase()}`}
              onClick={() => setSelectedFilter(f.key)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 flex-shrink-0 ${
                isSelected
                  ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-secondary-text hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {f.color && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: isSelected ? '#FFFFFF' : f.color }}
                />
              )}
              {f.label}
            </button>
          );
        })}
      </div>

      {/* ─── Calendar Views Container ─── */}
      {isLoading ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 min-h-[420px] flex flex-col justify-center items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
          <p className="text-sm font-medium text-secondary-text">Loading financial calendar…</p>
        </div>
      ) : (
        <>
          {/* ═════════════════════════════════════════════════════════════
             1. MONTH VIEW
             ═════════════════════════════════════════════════════════════ */}
          {viewMode === 'month' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
              {/* Day names header: abbreviated on mobile */}
              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 text-center py-2 sm:py-2.5 bg-gray-50 dark:bg-gray-800/40">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="text-[11px] sm:text-xs font-bold text-secondary-text uppercase tracking-wider">
                    <span className="hidden sm:inline">{w}</span>
                    <span className="inline sm:hidden">{w[0]}</span>
                  </div>
                ))}
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-gray-100 dark:divide-gray-800">
                {monthDays.map((day) => {
                  const dayEvents = eventsByDate[day.date] || [];
                  const isToday = day.date === todayStr;
                  const isSelected = day.date === selectedDay;

                  return (
                    <div
                      key={day.date}
                      onClick={() => setSelectedDay(day.date)}
                      className={`min-h-[58px] sm:min-h-[110px] p-1 sm:p-2 flex flex-col justify-between transition-colors cursor-pointer group ${
                        !day.isCurrentMonth ? 'bg-gray-50/50 dark:bg-gray-950/30 opacity-60' : 'bg-white dark:bg-gray-900'
                      } ${isSelected ? 'ring-2 ring-violet-500 ring-inset' : 'hover:bg-violet-50/30 dark:hover:bg-violet-950/20'}`}
                    >
                      {/* Cell header: day number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[11px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ${
                            isToday
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'text-primary-text dark:text-gray-300'
                          }`}
                        >
                          {day.dayNumber}
                        </span>

                        {dayEvents.length > 0 && (
                          <span className="text-[9px] sm:text-[10px] font-bold text-secondary-text hidden sm:inline">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>

                      {/* Event chips */}
                      <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const cfg = CALENDAR_EVENT_CONFIG[ev.type] || CALENDAR_EVENT_CONFIG.EXPENSE;
                          return (
                            <button
                              key={ev.id}
                              onClick={(e) => { e.stopPropagation(); setSelectedEvent(ev); }}
                              className="text-left w-full px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold truncate flex items-center gap-1 hover:brightness-95 transition-all shadow-2xs"
                              style={{ background: cfg.bg, color: cfg.text }}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                              <span className="truncate flex-1">{ev.title}</span>
                              <span className="font-bold flex-shrink-0 hidden sm:inline">{fmt(ev.amount)}</span>
                            </button>
                          );
                        })}

                        {dayEvents.length > 2 && (
                          <span className="text-[10px] font-semibold text-secondary-text px-1">
                            +{dayEvents.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selected Day breakdown on Month view (Mobile & Quick inspect) */}
          {viewMode === 'month' && selectedDay && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-violet-600" />
                  <h3 className="text-base font-bold text-primary-text dark:text-white">
                    Events on {fmtDate(selectedDay)}
                  </h3>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-secondary-text">
                  {(eventsByDate[selectedDay] || []).length} events
                </span>
              </div>

              {(eventsByDate[selectedDay] || []).length === 0 ? (
                <p className="text-sm text-secondary-text py-3 text-center">
                  No scheduled financial events on this day.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(eventsByDate[selectedDay] || []).map((ev) => {
                    const cfg = CALENDAR_EVENT_CONFIG[ev.type] || CALENDAR_EVENT_CONFIG.EXPENSE;
                    const isPositive = ev.type === 'INCOME' || ev.type === 'SALARY';
                    return (
                      <motion.div
                        key={ev.id}
                        whileHover={{ y: -2 }}
                        onClick={() => setSelectedEvent(ev)}
                        className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-violet-300 transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: cfg.bg }}
                          >
                            {isPositive ? (
                              <ArrowDownLeft size={16} style={{ color: cfg.color }} />
                            ) : (
                              <ArrowUpRight size={16} style={{ color: cfg.color }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-primary-text dark:text-white truncate">{ev.title}</p>
                            <p className="text-[11px] text-secondary-text truncate">{ev.category || cfg.label}</p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-extrabold" style={{ color: cfg.color }}>
                            {isPositive ? '+' : '-'} {fmt(ev.amount)}
                          </p>
                          <span className="text-[10px] text-secondary-text">{ev.status || 'Active'}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
             2. WEEK VIEW
             ═════════════════════════════════════════════════════════════ */}
          {viewMode === 'week' && (
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {weekDays.map((day) => {
                const dayEvents = eventsByDate[day.date] || [];
                const isToday = day.date === todayStr;

                return (
                  <div
                    key={day.date}
                    className={`bg-white dark:bg-gray-900 rounded-2xl border p-3 flex flex-col gap-3 min-h-[350px] ${
                      isToday ? 'border-violet-500 ring-1 ring-violet-200 dark:ring-violet-900/40' : 'border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    {/* Day Column Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <div>
                        <p className="text-xs font-bold text-secondary-text">{day.dayName}</p>
                        <p className={`text-base font-extrabold ${isToday ? 'text-violet-600' : 'text-primary-text dark:text-white'}`}>
                          {day.dayNumber}
                        </p>
                      </div>
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-secondary-text">
                        {dayEvents.length}
                      </span>
                    </div>

                    {/* Day Events List */}
                    <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-[300px]">
                      {dayEvents.length === 0 ? (
                        <p className="text-xs text-secondary-text text-center my-auto py-6">No events</p>
                      ) : (
                        dayEvents.map((ev) => {
                          const cfg = CALENDAR_EVENT_CONFIG[ev.type] || CALENDAR_EVENT_CONFIG.EXPENSE;
                          const isPositive = ev.type === 'INCOME' || ev.type === 'SALARY';
                          return (
                            <button
                              key={ev.id}
                              onClick={() => setSelectedEvent(ev)}
                              className="text-left p-2 rounded-xl transition-all hover:scale-[1.02] border border-transparent flex flex-col gap-1 shadow-2xs"
                              style={{ background: cfg.bg }}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: cfg.text }}>
                                  {cfg.label}
                                </span>
                                <span className="text-xs font-bold" style={{ color: cfg.color }}>
                                  {isPositive ? '+' : '-'} {fmt(ev.amount)}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-primary-text dark:text-gray-900 truncate">
                                {ev.title}
                              </p>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════
             3. DAY VIEW
             ═════════════════════════════════════════════════════════════ */}
          {viewMode === 'day' && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-6">
              {/* Day Header Stats */}
              {(() => {
                const dayDateStr = currentDate.toISOString().split('T')[0];
                const dayEvents = eventsByDate[dayDateStr] || [];
                const dayIncome = dayEvents
                  .filter((e) => e.type === 'INCOME' || e.type === 'SALARY')
                  .reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
                const dayExpense = dayEvents
                  .filter((e) => e.type === 'EXPENSE' || e.type === 'BILL')
                  .reduce((acc, e) => acc + parseFloat(e.amount || 0), 0);
                const net = dayIncome - dayExpense;

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 dark:border-gray-800 pb-5">
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">Total Inflow</p>
                      <p className="text-xl font-bold text-emerald-600">+{fmt(dayIncome)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                      <p className="text-xs text-red-700 dark:text-red-400 font-semibold mb-1">Total Outflow</p>
                      <p className="text-xl font-bold text-red-600">-{fmt(dayExpense)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/30">
                      <p className="text-xs text-violet-700 dark:text-violet-400 font-semibold mb-1">Net Day Balance</p>
                      <p className={`text-xl font-bold ${net >= 0 ? 'text-violet-600' : 'text-red-500'}`}>
                        {net >= 0 ? '+' : ''}{fmt(net)}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Day Chronological List */}
              {(() => {
                const dayDateStr = currentDate.toISOString().split('T')[0];
                const dayEvents = eventsByDate[dayDateStr] || [];

                if (dayEvents.length === 0) {
                  return (
                    <EmptyState
                      icon={CalendarDays}
                      title="No transactions or events for this date"
                      description="You have no income, expenses, loan due dates, bills, or salaries scheduled on this day."
                    />
                  );
                }

                return (
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-bold text-primary-text dark:text-white">
                      All Scheduled Events ({dayEvents.length})
                    </h3>

                    <div className="grid grid-cols-1 gap-3">
                      {dayEvents.map((ev) => {
                        const cfg = CALENDAR_EVENT_CONFIG[ev.type] || CALENDAR_EVENT_CONFIG.EXPENSE;
                        const isPositive = ev.type === 'INCOME' || ev.type === 'SALARY';

                        return (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40 hover:border-violet-300 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: cfg.bg }}
                              >
                                {isPositive ? (
                                  <TrendingUp size={20} style={{ color: cfg.color }} />
                                ) : (
                                  <TrendingDown size={20} style={{ color: cfg.color }} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <span
                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    style={{ background: cfg.bg, color: cfg.text }}
                                  >
                                    {cfg.label}
                                  </span>
                                  {ev.category && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200/60 dark:bg-gray-700 text-secondary-text font-medium">
                                      {ev.category}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-primary-text dark:text-white">{ev.title}</h4>
                                {ev.description && (
                                  <p className="text-xs text-secondary-text mt-0.5">{ev.description}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-200 dark:border-gray-700">
                              <p className="text-base sm:text-lg font-extrabold" style={{ color: cfg.color }}>
                                {isPositive ? '+' : '-'} {fmt(ev.amount)}
                              </p>
                              <span className="text-xs text-secondary-text font-medium flex items-center gap-1">
                                <Clock size={12} /> {ev.status || 'Active'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}

      {/* ─── Detail SlidePanel for clicked event ─── */}
      <SlidePanel
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        <EventDetailPanel
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      </SlidePanel>
    </div>
  );
}
