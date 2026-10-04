import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck, KeyRound,
  TrendingUp, ArrowRight, Check, Sparkles, Sun, Moon,
} from 'lucide-react';
import { MontraLogo } from '../components/common/Logo';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import FluidMeshShader from '../components/ui/fluid-mesh-shader';
import { FinanceHeroAnimation } from '../components/common/FinanceHeroAnimation';
import { AnimatedButton } from '../components/common/Button';
import { ButtonShowcaseModal } from '../components/common/ButtonShowcaseModal';

/* ─── Validation ─── */
function validate({ emailOrPhone, password }) {
  const errors = {};
  if (!emailOrPhone.trim()) {
    errors.emailOrPhone = 'Email address is required.';
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone) &&
    !/^\+?[\d\s\-]{7,15}$/.test(emailOrPhone)
  ) {
    errors.emailOrPhone = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

export default function LoginPage() {
  const { login, demoLogin, isLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [showcaseOpen, setShowcaseOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [form, setForm] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: true,
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allTouched = Object.fromEntries(Object.keys(form).map((k) => [k, true]));
    setTouched(allTouched);

    const fieldErrors = validate(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitStatus(null);
    setApiError('');

    const result = await login(form.emailOrPhone, form.password);

    if (result.success) {
      setSubmitStatus('success');
      setTimeout(() => navigate('/dashboard'), 750);
    } else {
      setSubmitStatus('error');
      const msg = result.message || '';
      if (msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('password') || msg.toLowerCase().includes('user')) {
        setApiError('Invalid credentials. Use Quick Demo Login.');
      } else if (msg.toLowerCase().includes('network') || msg.toLowerCase().includes('connect')) {
        setApiError('Backend offline. Use Quick Demo Login below.');
      } else {
        setApiError(msg || 'Authentication failed. Use Quick Demo Login.');
      }
    }
  };

  return (
    <FluidMeshShader isDark={isDark} className="min-h-screen flex flex-col justify-between select-none">
      {/* ── TOP HEADER (Light & Dark Theme Switchable) ───────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" aria-label="Back to home" className="flex items-center">
            <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <span className="px-3.5 py-1.5 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold border border-violet-500/25 shadow-xs">
              Log In
            </span>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Create Account
            </Link>
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

          {/* Showcase Button */}
          <button
            type="button"
            id="open-showcase-btn"
            onClick={() => setShowcaseOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-xs font-semibold text-violet-700 dark:text-violet-300 shadow-xs backdrop-blur-md transition-all cursor-pointer"
          >
            <Sparkles size={13} className="text-amber-500" />
            <span className="hidden xs:inline">19 Motion Buttons</span>
            <span className="xs:hidden">Buttons</span>
          </button>

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
          
          {/* ── LEFT HERO COLUMN (Image 1 Showcase) ────────────────────────── */}
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

          {/* ── RIGHT LOGIN CARD COLUMN (Image 1 & Image 2) ────────────────── */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end order-1 lg:order-2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="w-full max-w-[460px] p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] glass-3 glossy-panel border border-white/90 dark:border-white/20 shadow-2xl shadow-violet-500/10 dark:shadow-black/60 relative overflow-hidden"
            >
              {/* Top Violet Wallet Squircle Badge */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 mx-auto transform -rotate-1 hover:rotate-0 transition-transform">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-[28px] font-bold text-center tracking-tight text-gray-900 dark:text-white mt-4">
                Welcome back to Montra
              </h2>
              <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                Smart money management, automated savings, and personal wealth tracking.
              </p>

              {/* Savings Grow Banner */}
              <div className="mt-4 py-1.5 px-3.5 rounded-full glass-1 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 mx-auto w-fit">
                <span>🌱</span>
                <span>Total user savings grew +18.4% this quarter</span>
              </div>

              {/* Tab Switcher (Sign In / Create Account) */}
              <div className="mt-6 p-1 rounded-2xl glass-1 border border-white/70 dark:border-white/10 flex gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'glass-2 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    activeTab === 'signup'
                      ? 'glass-2 text-gray-900 dark:text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

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
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <Mail size={17} />
                    </div>
                    <input
                      type="text"
                      name="emailOrPhone"
                      value={form.emailOrPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      inputMode="email"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      placeholder="name@example.com"
                      className={`w-full pl-10 pr-4 py-3 rounded-2xl glass-input text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                        errors.emailOrPhone && touched.emailOrPhone
                          ? 'glass-input-error'
                          : ''
                      }`}
                    />
                  </div>
                  {errors.emailOrPhone && touched.emailOrPhone && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.emailOrPhone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <Lock size={17} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-11 py-3 rounded-2xl glass-input text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all outline-none ${
                        errors.password && touched.password
                          ? 'glass-input-error'
                          : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {errors.password && touched.password && (
                    <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me + Passkey */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={form.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded text-violet-600 focus:ring-violet-500 border-gray-300 dark:border-gray-700"
                    />
                    <span>Remember for 30 days</span>
                  </label>

                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40">
                    <KeyRound size={11} />
                    Passkey
                  </span>
                </div>

                {/* Primary Submit Button */}
                <AnimatedButton
                  id="login-submit-btn"
                  action="login"
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className="w-full mt-2"
                >
                  Sign in to Montra
                </AnimatedButton>

                {/* Instant Demo Preview Login */}
                <AnimatedButton
                  id="demo-login-btn"
                  action="generate"
                  variant="secondary"
                  type="button"
                  size="md"
                  fullWidth
                  onClick={() => {
                    demoLogin('STUDENT');
                    navigate('/dashboard');
                  }}
                  className="w-full mt-2"
                >
                  Quick Demo Login
                </AnimatedButton>
              </form>

              {/* OR CONTINUE WITH Divider */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/60 dark:border-white/10" />
                </div>
                <span className="relative px-3 bg-white/90 dark:bg-[#1a1b1e] text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => { demoLogin('STUDENT'); navigate('/dashboard'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-xs"
                >
                  <span className="text-sm font-bold text-red-500">G</span>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => { demoLogin('STUDENT'); navigate('/dashboard'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-xs"
                >
                  <span className="text-sm font-bold text-gray-900 dark:text-white"></span>
                  <span>Apple</span>
                </button>

                <button
                  type="button"
                  onClick={() => { demoLogin('STUDENT'); navigate('/dashboard'); }}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-white/5 text-xs font-semibold text-gray-700 dark:text-gray-200 transition-all shadow-xs"
                >
                  <KeyRound size={13} className="text-violet-500" />
                  <span>Passkey</span>
                </button>
              </div>

              {/* Bottom Card Security Notice */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 text-center">
                <ShieldCheck size={13} className="text-emerald-500 flex-shrink-0" />
                <span>FDIC-Insured Partner Banks • 256-bit Bank Grade Security</span>
              </div>
            </motion.div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/40 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All systems operational</span>
        </div>

        <div className="flex items-center gap-5">
          <a href="#privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#security" className="hover:text-gray-900 dark:hover:text-white transition-colors">Security Whitepaper</a>
        </div>

        <div>
          <span>© 2025 Montra Financial OS. All rights reserved.</span>
        </div>
      </footer>

      {/* Button Design System Interactive Showcase */}
      <ButtonShowcaseModal
        isOpen={showcaseOpen}
        onClose={() => setShowcaseOpen(false)}
      />
    </FluidMeshShader>
  );
}
