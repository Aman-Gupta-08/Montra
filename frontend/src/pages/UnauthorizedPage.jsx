import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UnauthorizedPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl text-center flex flex-col items-center gap-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 flex items-center justify-center text-red-500 shadow-sm">
          <ShieldAlert size={32} />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-2 inline-block">
            Access Restricted
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-primary-text dark:text-white mt-1">
            Business Owner Only
          </h1>
          <p className="text-sm text-secondary-text mt-2 leading-relaxed">
            This module is reserved exclusively for verified <strong>Business Owner</strong> accounts. Your current profile role is{' '}
            <span className="font-semibold text-violet-600 capitalize">
              {user?.accountType?.toLowerCase() || 'student'}
            </span>.
          </p>
        </div>

        <div className="w-full p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 text-xs text-secondary-text text-left flex items-start gap-2.5">
          <Building2 size={16} className="text-violet-600 flex-shrink-0 mt-0.5" />
          <span>
            Business operations include commercial ledger tracking, staff directory, payroll processing, and net profit analytics.
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-sm flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #10B981)' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
