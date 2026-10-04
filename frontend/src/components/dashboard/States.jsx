import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '../common/Button';

/**
 * ErrorState — shown when an API call fails
 */
export function ErrorState({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-14 h-14 rounded-2xl glass-1 border border-red-500/20 bg-red-500/10 flex items-center justify-center mb-4 shadow-sm shadow-red-500/10">
        <AlertCircle size={28} className="text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-primary-text dark:text-white mb-2">
        Failed to load data
      </h3>
      <p className="text-sm text-secondary-text mb-6 max-w-xs leading-relaxed">
        {message || 'Something went wrong. Please check your connection and try again.'}
      </p>
      {onRetry && (
        <Button
          id="retry-btn"
          action="retry"
          onClick={onRetry}
          size="md"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  );
}

/**
 * EmptyState — shown when an API returns empty data
 */
export function EmptyState({ title = 'No data yet', description, icon: Icon = BarChart3 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-14 h-14 rounded-2xl glass-1 border border-violet-500/20 bg-violet-500/10 flex items-center justify-center mb-4 shadow-sm shadow-violet-500/10">
        <Icon size={28} className="text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="text-base font-semibold text-primary-text dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-secondary-text max-w-xs leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

/**
 * DashboardCard — Premium Glass generic chart / section card wrapper
 */
export function DashboardCard({ title, subtitle, children, className = '', action }) {
  return (
    <div className={`glass-card rounded-2xl sm:rounded-3xl overflow-hidden relative ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-white/60 dark:border-white/10 relative z-10 gap-2">
          <div className="min-w-0">
            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white tracking-tight truncate">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-3.5 sm:p-6 relative z-10">
        {children}
      </div>
    </div>
  );
}

export default DashboardCard;
