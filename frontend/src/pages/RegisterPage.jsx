import { useState, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, KeyRound,
  TrendingUp, ArrowRight, Check, Sparkles, Sun, Moon,
  CheckCircle2, GraduationCap, Briefcase, Building2,
} from 'lucide-react';
import { MontraLogo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FluidMeshShader from '../components/ui/fluid-mesh-shader';
import { FinanceHeroAnimation } from '../components/common/FinanceHeroAnimation';
import { AnimatedButton } from '../components/common/Button';

/* ─── Account Types Config ─── */
const ACCOUNT_TYPES = [
  {
    value: 'STUDENT',
    label: 'Student',
    icon: GraduationCap,
    desc: 'Campus & allowance',
  },
  {
    value: 'EMPLOYEE',
    label: 'Employee',
    icon: Briefcase,
    desc: 'Salary & growth',
  },
  {
    value: 'BUSINESS_OWNER',
    label: 'Business',
    icon: Building2,
    desc: 'Treasury & ops',
  },
];

/* ─── Form Validation ─── */
function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = 'Full name is required.';
  } else if (form.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!form.password) {
    errors.password = 'Password is required.';
  } else if (form.password.length < 8) {
    errors.password = 'At least 8 characters required.';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
    errors.password = 'Include uppercase, lowercase & number.';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirm your password.';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  if (!form.accountType) {
    errors.accountType = 'Please select an account type.';
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = 'You must accept the terms.';
  }

  return errors;
}

/* ─── Password Strength Component ─── */
function PasswordStrength({ password, isDark }) {
  const checks = [
    { label: '8+ chars', ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Lowercase', ok: /[a-z]/.test(password) },
    { label: 'Number', ok: /\d/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#059669'];
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="flex gap-1 flex-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                background:
                  i < score
                    ? colors[score - 1]
                    : isDark
                    ? 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(0, 0, 0, 0.08)',
              }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold" style={{ color: colors[score - 1] || '#9CA3AF' }}>
          {score > 0 ? labels[score - 1] : 'Too weak'}
        </span>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   REGISTER PAGE COMPONENT (Adaptive Light & Dark Mode)
════════════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const { register, demoLogin, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    accountType: searchParams.get('type') || 'EMPLOYEE',
    agreeTerms: true,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiError, setApiError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  }, [errors, apiError]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate({ ...form, [name]: form[name] });
    if (fieldErrors[name]) setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  }, [form]);

  const selectAccountType = (type) => {
    setForm((prev) => ({ ...prev, accountType: type }));
    if (errors.accountType) setErrors((prev) => ({ ...prev, accountType: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitStatus(null);
    setApiError('');

    const result = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      accountType: form.accountType,
    });

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => navigate('/dashboard'), 750);
    } else {
      setSubmitStatus('error');
      const msg = result.message || '';
      if (
        msg.toLowerCase().includes('exists') ||
        msg.toLowerCase().includes('duplicate') ||
        msg.toLowerCase().includes('already')
      ) {
        setApiError('An account with this email already exists.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('connect') || msg.toLowerCase().includes('timeout')) {
        setApiError('Backend unreachable or waking up. Please retry shortly, or use Quick Demo Login.');
      } else {
        setApiError(msg || 'Registration failed. Use Quick Demo Login.');
      }
    }
  };

  return (
    <FluidMeshShader isDark={isDark} className="min-h-screen flex flex-col justify-between select-none">
      {/* ── TOP HEADER (Adaptive Light & Dark Theme) ───────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 flex items-center justify-between">
        {/* Brand Logo & Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" aria-label="Back to home" className="flex items-center">
            <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log In
            </Link>
            <span className="px-3.5 py-1.5 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold border border-violet-500/25 shadow-xs">
              Create Account
            </span>
            <Link
              to="/forgot-password"
              className="px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Reset Key
            </Link>
            <span className="px-3.5 py-1.5 rounded-full text-gray-400 dark:text-gray-500 cursor-default">
              Verification
            </span>
          </nav>
        </div>

        {/* Right Security Badges & Theme Switcher */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-medium text-emerald-600 dark:text-emerald-400 shadow-xs backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Systems Operational
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-xs font-medium text-gray-700 dark:text-gray-300 shadow-xs backdrop-blur-md">
            <ShieldCheck size={13} className="text-emerald-500" />
            256-bit
          </span>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/75 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all backdrop-blur-md shadow-xs flex items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-violet-600" />}
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT (Split View: Hero Showcase + Card) ────────────────── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ── LEFT HERO COLUMN (Wealth Intelligence & Vault) ───────────────── */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left order-2 lg:order-1 mt-6 lg:mt-0">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-500/20 text-xs font-semibold text-violet-700 dark:text-violet-300 w-fit backdrop-blur-md mb-4 sm:mb-6"
            >
              <TrendingUp size={14} className="text-emerald-500" />
              Smart Wealth Intelligence
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12]"
            >
              Clarity over chaos for your capital.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-3 sm:mt-4 text-sm sm:text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed"
            >
              Experience stress-free budgeting, autonomous high-yield vaults, and real-time net worth intelligence in a tranquil environment.
            </motion.p>

            {/* Lottie Wealth Illustration Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-6 sm:mt-8 max-w-lg"
            >
              <FinanceHeroAnimation variant="showcase" />
            </motion.div>
          </div>

          {/* ── RIGHT CREATE ACCOUNT CARD (Adaptive Light & Dark Parity) ──────── */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="w-full max-w-[480px] p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] glass-3 glossy-panel border border-white/90 dark:border-white/20 shadow-2xl shadow-violet-500/10 dark:shadow-black/60 relative overflow-hidden"
            >
              {/* Top Violet Sparkle Squircle Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 mx-auto transform -rotate-1 hover:rotate-0 transition-transform">
                <Sparkles size={24} />
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-[28px] font-bold text-center tracking-tight text-gray-900 dark:text-white mt-3.5">
                Create your Montra account
              </h2>
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                Smart money management, automated savings, and personal wealth tracking.
              </p>

              {/* Savings Grow Banner */}
              <div className="mt-3.5 py-1.5 px-3.5 rounded-full glass-1 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto w-fit">
                <span>🌱</span>
                <span>Total user savings grew +18.4% this quarter</span>
              </div>

              {/* Tab Switcher (Sign In / Create Account) */}
              <div className="mt-5 p-1 rounded-2xl glass-1 border border-white/70 dark:border-white/10 flex gap-1">
                <button
                  type="button"
                  id="tab-signin-btn"
                  onClick={() => navigate('/login')}
                  className="flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  id="tab-create-btn"
                  className="flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 glass-2 text-gray-900 dark:text-white shadow-xs cursor-pointer"
                >
                  Create Account
                </button>
              </div>

              {/* Success Notice */}
              <AnimatePresence>
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2"
                  >
                    <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Account created successfully! Preparing dashboard…</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Notice */}
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-600 dark:text-red-400 font-semibold text-center"
                  >
                    {apiError}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3.5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      id="register-name-input"
                      value={form.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Alex Morgan"
                      autoComplete="name"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                        errors.name && touched.name ? 'glass-input-error' : ''
                      }`}
                    />
                  </div>
                  {errors.name && touched.name && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email Address & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Mail size={15} />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="register-email-input"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="alex@example.com"
                        autoComplete="email"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                          errors.email && touched.email ? 'glass-input-error' : ''
                        }`}
                      />
                    </div>
                    {errors.email && touched.email && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Phone size={15} />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="register-phone-input"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="+1 555-0199"
                        autoComplete="tel"
                        inputMode="tel"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                          errors.phone && touched.phone ? 'glass-input-error' : ''
                        }`}
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Account Type Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Account Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ACCOUNT_TYPES.map((type) => {
                      const isSelected = form.accountType === type.value;
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          id={`account-type-btn-${type.value.toLowerCase()}`}
                          onClick={() => selectAccountType(type.value)}
                          className={`p-3 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center gap-1 relative cursor-pointer ${
                            isSelected
                              ? 'glass-4 border-violet-500/70 text-violet-900 dark:text-white shadow-md shadow-violet-500/15 ring-1 ring-violet-500/40'
                              : 'glass-1 border-white/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-violet-500/30 hover:bg-white/60 dark:hover:bg-white/10'
                          }`}
                        >
                          <Icon size={17} className={`transition-transform ${isSelected ? 'text-violet-600 dark:text-violet-400 scale-110 drop-shadow-xs' : 'text-gray-400 dark:text-gray-500'}`} />
                          <span className="text-[11px] font-bold tracking-tight">{type.label}</span>
                          <span className={`text-[9px] line-clamp-1 ${isSelected ? 'text-violet-600/80 dark:text-violet-300/80 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>{type.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.accountType && (
                    <p className="text-[11px] text-red-500 dark:text-red-400 mt-1">{errors.accountType}</p>
                  )}
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="register-password-input"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className={`w-full pl-9 pr-8 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                          errors.password && touched.password ? 'glass-input-error' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.password && touched.password && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">{errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Confirm
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                        <Lock size={15} />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        name="confirmPassword"
                        id="register-confirm-password-input"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="••••••••••••"
                        autoComplete="new-password"
                        className={`w-full pl-9 pr-8 py-2.5 rounded-2xl glass-input text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                          errors.confirmPassword && touched.confirmPassword ? 'glass-input-error' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-[10px] text-red-500 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Password Strength Meter */}
                <AnimatePresence>
                  {form.password && <PasswordStrength password={form.password} isDark={isDark} />}
                </AnimatePresence>

                {/* Terms Agreement Checkbox */}
                <div className="flex items-start gap-2.5 pt-0.5">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={form.agreeTerms}
                    onChange={handleChange}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-black/30 text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="agreeTerms" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer leading-tight">
                    I agree to the{' '}
                    <a href="#" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">
                      Privacy Policy
                    </a>.
                  </label>
                </div>
                {errors.agreeTerms && touched.agreeTerms && (
                  <p className="text-[11px] text-red-500 dark:text-red-400">{errors.agreeTerms}</p>
                )}

                {/* Primary Submit Button */}
                <AnimatedButton
                  id="submit-register-btn"
                  action="signup"
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  success={submitStatus === 'success'}
                  className="w-full mt-2"
                >
                  Create Account
                </AnimatedButton>

                {/* Quick Demo Access Button */}
                <AnimatedButton
                  id="register-demo-login-btn"
                  action="generate"
                  variant="secondary"
                  type="button"
                  size="md"
                  fullWidth
                  onClick={async () => {
                    const res = await demoLogin();
                    if (res?.success) navigate('/dashboard');
                  }}
                  className="w-full mt-2"
                >
                  Quick Demo Access
                </AnimatedButton>
              </form>

              {/* Social Logins */}
              <div className="mt-5">
                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-gray-200/60 dark:border-white/10" />
                  <span className="bg-white/90 dark:bg-[#1a1b1e] px-3 py-0.5 rounded-full border border-gray-200/60 dark:border-white/10 text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-400">
                    OR CONTINUE WITH
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={demoLogin}
                    className="py-2.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.42l4.04-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={demoLogin}
                    className="py-2.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current text-gray-900 dark:text-white" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.53-9.87-11.45-20.9-14.75-33.09-3.3-12.19-4.95-23.77-4.95-34.74 0-14.19 3.52-25.79 10.56-34.79 7.04-9 15.76-13.59 26.16-13.78 4.89 0 10.23 1.25 16.03 3.76 5.8 2.5 9.77 3.86 11.91 4.09 1.74-.23 5.86-1.63 12.35-4.22 6.5-2.58 11.91-3.76 16.24-3.54 12.01.54 21.65 4.97 28.92 13.29-10.45 6.32-15.58 15.11-15.38 26.36.21 8.81 3.58 16.14 10.12 21.99 6.54 5.85 14.3 9.17 23.29 9.97-2.17 6.42-4.8 12.44-7.88 18.08zM119.22 31.85c0-7.07 2.58-13.67 7.74-19.8 5.16-6.13 11.59-10.02 19.3-11.66.21 1.08.32 2.05.32 2.91 0 6.96-2.69 13.56-8.07 19.8-5.38 6.24-11.75 10.03-19.11 11.36-.11-.86-.18-1.73-.18-2.61z"/>
                    </svg>
                    <span>Apple</span>
                  </button>

                  <button
                    type="button"
                    onClick={demoLogin}
                    className="py-2.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200/70 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <KeyRound size={15} className="text-violet-500" />
                    <span>Passkey</span>
                  </button>
                </div>
              </div>

              {/* Trust Footnote */}
              <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>FDIC-Insured Partner Banks • 256-bit Bank Grade Security</span>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/80 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All systems operational</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5 font-medium">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security Whitepaper</a>
        </div>

        <div className="text-gray-400 dark:text-gray-500 text-center sm:text-right">
          © {new Date().getFullYear()} Montra Wealth Inc.
        </div>
      </footer>
    </FluidMeshShader>
  );
}
