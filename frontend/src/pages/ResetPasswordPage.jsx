import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { MontraLogo } from '../components/common/Logo';
import KineticGrid from '../components/ui/kinetic-grid';
import { useTheme } from '../context/ThemeContext';

export default function ResetPasswordPage() {
  const { isDark } = useTheme();

  return (
    <KineticGrid
      className="min-h-screen flex flex-col justify-between"
      globalColor={isDark ? "default" : "monochrome"}
    >
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 pt-[max(env(safe-area-inset-top),1.25rem)] pb-4">
        <Link to="/" aria-label="Back to home">
          <MontraLogo size="sm" textColor={isDark ? "text-white" : "text-gray-900"} />
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-sm font-medium text-secondary-text hover:text-primary-text dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="glass-3 glossy-panel rounded-[32px] shadow-2xl border border-white/90 dark:border-white/20 p-8 sm:p-10 text-center">
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
                className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #EDEBF7, #E6F7E4)' }}
              >
                <Lock size={24} style={{ color: '#7C5CFC' }} />
              </motion.div>
              <h1 className="text-2xl font-bold text-primary-text dark:text-white">Reset Password</h1>
            </div>

            <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-6">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Password reset is not yet available. Please contact support to reset your password.
              </p>
            </div>

            <p className="text-center text-sm text-secondary-text">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </KineticGrid>
  );
}
