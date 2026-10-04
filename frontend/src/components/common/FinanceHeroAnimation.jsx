import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { TrendingUp, ShieldCheck, Sparkles } from 'lucide-react';

const LOTTIE_REMOTE_URL = 'https://lottie.host/6a370af0-838c-4c86-bad5-f251d90745a6/8JI09G4VHP.lottie';
const LOTTIE_LOCAL_URL = '/hero-animation.lottie';

/**
 * FinanceHeroAnimation
 * Renders the Montra Revenue & Wealth Lottie animation in pure Liquid Glass
 * styled to match the white theme with translucent specular reflections,
 * ambient glowing backlights, and liquid glass pills.
 *
 * @param {'showcase' | 'compact' | 'minimal'} variant
 * @param {string} className
 */
export function FinanceHeroAnimation({
  variant = 'showcase',
  className = '',
  showBadges = true,
}) {
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  const activeSrc = useLocalFallback ? LOTTIE_LOCAL_URL : LOTTIE_REMOTE_URL;

  if (variant === 'compact') {
    return (
      <div
        className={`liquid-glass-banner relative w-full md:w-80 lg:w-96 h-48 sm:h-52 rounded-3xl overflow-hidden p-3 flex items-center justify-center group ${className}`}
      >
        {/* Liquid ambient backlights */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-400/25 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-violet-500/25 dark:bg-violet-600/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

        {/* Lottie Animation */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <DotLottieReact
            src={activeSrc}
            loop
            autoplay
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(16,185,129,0.2)]"
            onError={() => {
              if (!useLocalFallback) setUseLocalFallback(true);
            }}
          />
        </div>

        {/* Specular rim */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/60 dark:ring-white/10 pointer-events-none" />
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        <DotLottieReact
          src={activeSrc}
          loop
          autoplay
          className="w-full h-full object-contain"
          onError={() => {
            if (!useLocalFallback) setUseLocalFallback(true);
          }}
        />
      </div>
    );
  }

  // Default: 'showcase' (for Auth Pages: Login & Register)
  return (
    <div
      className={`liquid-glass-banner relative rounded-3xl overflow-hidden p-5 sm:p-7 group transition-all duration-500 max-w-lg w-full ${className}`}
    >
      {/* Liquid ambient radial lighting */}
      <div className="absolute -top-16 -left-16 w-60 h-60 bg-emerald-400/25 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none group-hover:scale-115 transition-transform duration-700" />
      <div className="absolute -bottom-16 -right-16 w-60 h-60 bg-violet-500/20 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none group-hover:scale-115 transition-transform duration-700" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-300/15 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Header Pills: Liquid Frosted Glass */}
      {showBadges && (
        <div className="relative z-20 flex items-center justify-between gap-3 mb-3 px-1">
          <div className="liquid-glass-pill inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-bold tracking-wide uppercase">
              Autonomous Tracking
            </span>
          </div>

          <div className="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50/80 dark:bg-violet-950/30 border border-violet-500/30 text-[11px] font-semibold text-violet-800 dark:text-violet-300 shadow-xs">
            <Sparkles size={13} className="text-violet-500" />
            <span>AI Powered</span>
          </div>
        </div>
      )}

      {/* Lottie Animation Display Area */}
      <div className="relative z-10 w-full aspect-square max-h-[360px] sm:max-h-[380px] flex items-center justify-center p-2">
        <DotLottieReact
          src={activeSrc}
          loop
          autoplay
          className="w-full h-full object-contain filter drop-shadow-[0_16px_32px_rgba(16,185,129,0.22)] transform group-hover:scale-[1.02] transition-transform duration-500"
          onError={() => {
            if (!useLocalFallback) setUseLocalFallback(true);
          }}
        />
      </div>

      {/* Floating Bottom Stats Cards: Liquid Glass Tiles */}
      {showBadges && (
        <div className="relative z-20 grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-white/60 dark:border-white/10">
          <div className="liquid-glass-pill flex items-center gap-3 p-3 rounded-2xl hover:scale-[1.02] transition-transform">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xs">
              <TrendingUp size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Smart Growth</span>
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white leading-tight">+34.8% APR</span>
            </div>
          </div>

          <div className="liquid-glass-pill flex items-center gap-3 p-3 rounded-2xl hover:scale-[1.02] transition-transform">
            <div className="p-2.5 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-xs">
              <ShieldCheck size={16} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Vault Protocol</span>
              <span className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white leading-tight">256-Bit TLS</span>
            </div>
          </div>
        </div>
      )}

      {/* Decorative specular glass highlight */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/70 dark:ring-white/10 pointer-events-none" />
    </div>
  );
}

export default FinanceHeroAnimation;
