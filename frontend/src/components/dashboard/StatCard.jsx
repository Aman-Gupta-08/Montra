import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Formats a number as Indian currency
 */
export function formatCurrency(value, currency = '₹') {
  if (value === null || value === undefined) return `${currency}0`;
  const num = parseFloat(value);
  if (isNaN(num)) return `${currency}0`;
  if (num >= 10000000) return `${currency}${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${currency}${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${currency}${(num / 1000).toFixed(1)}K`;
  return `${currency}${num.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

const TREND_CONFIG = {
  up: { icon: TrendingUp, color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)', label: '+' },
  down: { icon: TrendingDown, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)', label: '-' },
  neutral: { icon: Minus, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.12)', border: 'rgba(107, 114, 128, 0.25)', label: '' },
};

/**
 * Metric Accent Light Palettes (Soft Lighting)
 */
function getAccentAtmosphere(label = '', iconColor = '#7C5CFC') {
  const l = label.toLowerCase();
  if (l.includes('income') || l.includes('sales') || l.includes('saving')) {
    // Soft Mint / Green
    return {
      glow: 'rgba(16, 185, 129, 0.12)',
      borderAccent: 'rgba(16, 185, 129, 0.25)',
      topLight: 'rgba(230, 247, 228, 0.4)',
    };
  }
  if (l.includes('expense')) {
    // Soft Coral
    return {
      glow: 'rgba(239, 68, 68, 0.10)',
      borderAccent: 'rgba(239, 68, 68, 0.22)',
      topLight: 'rgba(254, 226, 226, 0.35)',
    };
  }
  if (l.includes('balance') || l.includes('lent') || l.includes('salary')) {
    // Soft Lavender / Cyan
    return {
      glow: 'rgba(124, 92, 252, 0.12)',
      borderAccent: 'rgba(124, 92, 252, 0.25)',
      topLight: 'rgba(237, 235, 247, 0.45)',
    };
  }
  if (l.includes('warning') || l.includes('overdue') || l.includes('borrow')) {
    // Soft Amber
    return {
      glow: 'rgba(245, 158, 11, 0.12)',
      borderAccent: 'rgba(245, 158, 11, 0.25)',
      topLight: 'rgba(250, 248, 235, 0.45)',
    };
  }
  return {
    glow: `${iconColor}18`,
    borderAccent: `${iconColor}33`,
    topLight: 'rgba(255, 255, 255, 0.35)',
  };
}

/**
 * StatCard — Premium Liquid Glass metric card with customized metric accent lighting
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = '#7C5CFC',
  iconBg,
  trend,           // 'up' | 'down' | 'neutral'
  trendValue,      // e.g. "12.5%"
  currency = '₹',
  isCurrency = true,
  className = '',
  index = 0,
}) {
  const trendCfg = TREND_CONFIG[trend] || null;
  const atmosphere = getAccentAtmosphere(label, iconColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
      className={`glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 relative overflow-hidden group cursor-default ${className}`}
      style={{
        boxShadow: `0 14px 34px -4px rgba(31, 38, 135, 0.07), 0 0 0 1px ${atmosphere.borderAccent}`,
      }}
    >
      {/* Specular ambient glass glow & metric accent light inside card */}
      <div 
        className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-2xl pointer-events-none transition-transform duration-500 group-hover:scale-125"
        style={{ background: atmosphere.topLight }}
      />
      <div
        className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-90"
        style={{ background: atmosphere.glow }}
      />

      <div className="flex items-start justify-between mb-2.5 sm:mb-3.5 relative z-10 gap-1.5">
        <div
          className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 glass-1 transition-transform duration-300 group-hover:scale-105"
          style={{
            background: iconBg || 'rgba(255, 255, 255, 0.75)',
            boxShadow: `0 4px 12px ${atmosphere.glow}`,
          }}
        >
          {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: iconColor }} />}
        </div>
        {trendCfg && trendValue && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border backdrop-blur-md"
            style={{
              background: trendCfg.bg,
              borderColor: trendCfg.border,
              color: trendCfg.color,
            }}
          >
            <trendCfg.icon size={11} />
            {trendValue}
          </div>
        )}
      </div>

      <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 mb-0.5 sm:mb-1 truncate uppercase tracking-wider relative z-10">
        {label}
      </p>
      <p className="text-lg sm:text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight relative z-10 truncate">
        {isCurrency ? formatCurrency(value, currency) : value?.toLocaleString('en-IN') ?? '—'}
      </p>
    </motion.div>
  );
}

export default StatCard;
