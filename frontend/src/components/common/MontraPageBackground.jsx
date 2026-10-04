import { useTheme } from '../../context/ThemeContext';
import KineticGrid from '../ui/kinetic-grid';

/**
 * MontraPageBackground — Environmental soft ambient lighting with liquid glass refraction
 */
export function MontraPageBackground({
  globalColor,
  className = '',
  children,
}) {
  const { isDark } = useTheme();

  return (
    <KineticGrid
      className={`relative overflow-hidden ${className}`}
      globalColor={globalColor || (isDark ? 'default' : 'light')}
    >
      {/* Environmental Ambient Blobs: Lavender, Cyan, Mint, Warm Cream */}
      <div
        aria-hidden="true"
        className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-60 dark:opacity-30 transition-all duration-1000 animate-ambient-pulse"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(124, 92, 252, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(237, 235, 247, 0.85) 0%, rgba(230, 247, 246, 0.5) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-[35%] right-[5%] w-[520px] h-[520px] rounded-full blur-[150px] pointer-events-none opacity-50 dark:opacity-25 transition-all duration-1000 animate-ambient-pulse"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(230, 247, 228, 0.8) 0%, rgba(250, 248, 235, 0.5) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[5%] left-[25%] w-[460px] h-[460px] rounded-full blur-[130px] pointer-events-none opacity-55 dark:opacity-20 transition-all duration-1000"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(14, 165, 233, 0.12) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(246, 252, 228, 0.75) 0%, rgba(215, 242, 230, 0.5) 100%)',
        }}
      />

      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </KineticGrid>
  );
}

export default MontraPageBackground;
