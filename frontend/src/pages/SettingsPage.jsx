import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Palette, Bell, Shield, User, Sun, Moon, Monitor,
  CheckCircle2, ChevronRight, BellOff, BellRing, Globe,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ─── Section wrapper ─── */
function Section({ title, description, icon: Icon, children }) {
  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl border border-white/80 dark:border-white/10 shadow-md p-4 sm:p-7 relative z-10">
      <div className="flex items-center gap-3.5 mb-4 sm:mb-5 pb-3 border-b border-white/60 dark:border-white/10">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl glass-1 bg-violet-500/15 border border-violet-500/25 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 shadow-xs">
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ─── Toggle Switch ─── */
function Toggle({ value, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/60 dark:border-white/10 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      <button
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
          value ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            value ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

/* ─── Theme Picker ─── */
function ThemeSection() {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean and bright glass',
      icon: Sun,
      preview: 'bg-white/80 border-gray-200',
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Deep obsidian glass',
      icon: Moon,
      preview: 'bg-black/60 border-white/10',
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follows OS preference',
      icon: Monitor,
      preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400',
    },
  ];

  return (
    <Section title="Appearance" description="Customize how Montra looks on your device" icon={Palette}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3.5">
        {themes.map((t) => {
          const ThemeIcon = t.icon;
          const isSelected = theme === t.value;

          return (
            <motion.button
              key={t.value}
              whileTap={{ scale: 0.97 }}
              onClick={() => setTheme(t.value)}
              className={`relative flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all text-center cursor-pointer ${
                isSelected
                  ? 'glass-4 border-violet-500/70 shadow-md shadow-violet-500/20 ring-1 ring-violet-500/50'
                  : 'glass-1 border-white/60 dark:border-white/10 hover:border-violet-400/40 hover:bg-white/60 dark:hover:bg-white/10'
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5">
                  <CheckCircle2 size={14} className="text-violet-600 dark:text-violet-400" />
                </span>
              )}

              {/* Mini preview */}
              <div
                className={`w-full h-8 sm:h-12 rounded-lg sm:rounded-xl border ${t.preview} flex items-center gap-1.5 px-2 sm:px-3`}
              >
                <div className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full flex-shrink-0 ${t.value === 'dark' ? 'bg-violet-400' : 'bg-violet-600'}`} />
                <div className={`flex-1 h-1 sm:h-1.5 rounded ${t.value === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`} />
              </div>

              <ThemeIcon
                size={16}
                className={isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400'}
              />
              <div className="min-w-0">
                <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-white'}`}>
                  {t.label}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 hidden sm:block truncate">{t.description}</p>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-4 p-3.5 glass-1 rounded-2xl border border-white/60 dark:border-white/10 flex items-center gap-2">
        <Globe size={15} className="text-violet-500 flex-shrink-0" />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Theme preference is saved locally and persists across sessions.
        </p>
      </div>
    </Section>
  );
}

/* ─── Notification Settings ─── */
function NotificationSection() {
  const [prefs, setPrefs] = useState({
    loanReminders: true,
    budgetAlerts: true,
    salaryDue: true,
    billReminders: true,
    paymentUpdates: true,
    systemAlerts: false,
  });

  const toggle = (key) => setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <Section
      title="Notifications"
      description="Control which alerts Montra sends you"
      icon={Bell}
    >
      <Toggle
        value={prefs.loanReminders}
        onChange={() => toggle('loanReminders')}
        label="Loan Reminders"
        description="Get notified when loans are due or overdue"
      />
      <Toggle
        value={prefs.budgetAlerts}
        onChange={() => toggle('budgetAlerts')}
        label="Budget Alerts"
        description="80% warning and 100% exceeded notifications"
      />
      <Toggle
        value={prefs.salaryDue}
        onChange={() => toggle('salaryDue')}
        label="Salary Due Dates"
        description="Remind staff salary disbursement dates"
      />
      <Toggle
        value={prefs.billReminders}
        onChange={() => toggle('billReminders')}
        label="Bill Reminders"
        description="Upcoming recurring expense alerts"
      />
      <Toggle
        value={prefs.paymentUpdates}
        onChange={() => toggle('paymentUpdates')}
        label="Payment Updates"
        description="Payment received and payment made confirmations"
      />
      <Toggle
        value={prefs.systemAlerts}
        onChange={() => toggle('systemAlerts')}
        label="System Alerts"
        description="Security and account-level notifications"
      />

      <div className="mt-4 p-3.5 glass-1 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-2">
        <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Notification preferences are saved locally. Full push notifications will be available in a future release.
        </p>
      </div>
    </Section>
  );
}

/* ─── Account Info Section ─── */
function AccountSection() {
  return (
    <Section title="Account" description="General account preferences" icon={User}>
      <div className="space-y-0">
        {[
          {
            label: 'Language & Region',
            value: 'English (India)',
            icon: Globe,
          },
          {
            label: 'Currency',
            value: 'INR (₹)',
            icon: CheckCircle2,
          },
        ].map((item) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center justify-between py-3.5 border-b border-white/60 dark:border-white/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <ItemIcon size={16} className="text-violet-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{item.value}</span>
                <ChevronRight size={15} className="text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3.5 glass-1 rounded-2xl border border-white/60 dark:border-white/10">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Montra uses the Indian Rupee (₹) as the default currency. Regional settings will be
          configurable in a future release.
        </p>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SETTINGS PAGE
   ════════════════════════════════════════════════════════════════ */
export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage your preferences, appearance, and notifications
        </p>
      </div>

      <ThemeSection />
      <NotificationSection />
      <AccountSection />
    </div>
  );
}
