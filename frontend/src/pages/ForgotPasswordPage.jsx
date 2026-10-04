import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ShieldCheck, KeyRound, Sun, Moon } from 'lucide-react';
import { MontraLogo } from '../components/common/Logo';
import { InputField } from '../components/forms/InputField';
import { useTheme } from '../context/ThemeContext';
import FluidMeshShader from '../components/ui/fluid-mesh-shader';
import { Button } from '../components/common/Button';

export default function ForgotPasswordPage() {
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <FluidMeshShader isDark={isDark} className="min-h-screen flex flex-col justify-between select-none">
      {/* ── TOP HEADER (Adaptive Light & Dark Theme) ───────────────────────── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link to="/" aria-label="Back to home" className="flex items-center">
            <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Create Account
            </Link>
            <span className="px-3.5 py-1.5 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold border border-violet-500/25 shadow-xs">
              Reset Key
            </span>
          </nav>
        </div>

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

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-6 py-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="p-5 sm:p-10 rounded-[28px] sm:rounded-[32px] glass-3 glossy-panel border border-white/90 dark:border-white/20 shadow-2xl shadow-violet-500/10 dark:shadow-black/60 text-center">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30 mx-auto mb-4">
              <KeyRound size={24} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Reset Montra Key</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Enter your verified email address to receive secure credentials instructions.
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-center mt-6"
              >
                <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 mb-5">
                  <ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    If an account exists for {email}, a recovery link has been dispatched.
                  </p>
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  <ArrowLeft size={14} />
                  Return to Sign In
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4 text-left">
                <InputField
                  id="forgot-email"
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  inputMode="email"
                  autoComplete="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  error={error}
                  required
                  leftIcon={<Mail size={16} />}
                />

                <Button
                  id="forgot-submit-btn"
                  type="submit"
                  size="lg"
                  fullWidth
                  className="w-full mt-2"
                >
                  Send Recovery Link
                </Button>
              </form>
            )}

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-[max(env(safe-area-inset-bottom),1.25rem)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/80 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>All systems operational</span>
        </div>
        <div className="text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Montra Wealth Inc.
        </div>
      </footer>
    </FluidMeshShader>
  );
}
