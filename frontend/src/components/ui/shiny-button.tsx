"use client";

import type React from "react";
import { useId, useSyncExternalStore } from "react";
import { GraduationCap, Briefcase, Building2 } from "lucide-react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    getServerReducedMotionSnapshot,
  );
}

export type ShinyButtonSize = "default" | "md" | "lg" | "xl";

export interface ShinyButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  fillColor?: string;
  labelColor?: string;
  accentColor?: string;
  accentSoftColor?: string;
  sweepDuration?: number;
  easeDuration?: number;
  arcWidth?: number;
  cornerRadius?: number;
  showSpeckle?: boolean;
  showSheen?: boolean;
  speckleOpacity?: number;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  size?: ShinyButtonSize;
  fullWidth?: boolean;
}

export function ShinyButton({
  label = "Get Started",
  onClick,
  className = "",
  fillColor = "#000000",
  labelColor = "#ffffff",
  accentColor = "#ff5f00",
  accentSoftColor = "#ff9253",
  sweepDuration = 3,
  easeDuration = 0.8,
  arcWidth = 5,
  cornerRadius = 36,
  showSpeckle = true,
  showSheen = true,
  speckleOpacity = 0.4,
  children,
  icon,
  size = "lg",
  fullWidth = false,
}: ShinyButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const scope = `gleam-edge-${instanceId}`;

  // Dynamic responsive sizing
  const sizeMap: Record<ShinyButtonSize, { padding: string; fontSize: string }> = {
    default: { padding: "0.95rem 1.8rem", fontSize: "1rem" },
    sm: { padding: "0.75rem 1.35rem", fontSize: "0.875rem" },
    md: { padding: "1.1rem 2rem", fontSize: "1.05rem" },
    lg: { padding: "1.25rem 2.25rem", fontSize: "1.1rem" },
    xl: { padding: "1.4rem 2.75rem", fontSize: "1.2rem" },
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  const css = `
    @property --gradient-angle-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-angle-offset-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-percent-${instanceId} {
      syntax: "<percentage>";
      initial-value: ${arcWidth}%;
      inherits: false;
    }
    @property --gradient-shine-${instanceId} {
      syntax: "<color>";
      initial-value: white;
      inherits: false;
    }

    .${scope} {
      --gleam-base: ${fillColor};
      --gleam-inset: #1a1818;
      --gleam-label: ${labelColor};
      --gleam-accent: ${accentColor};
      --gleam-accent-soft: ${accentSoftColor};
      --animation: gradient-angle-${instanceId} linear infinite;
      --duration: ${sweepDuration}s;
      --shadow-size: 2px;
      --transition: ${easeDuration}s cubic-bezier(0.25, 1, 0.5, 1);

      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: ${fullWidth ? "100%" : "auto"};
      max-width: 100%;
      min-height: 44px;
      touch-action: manipulation;
      padding: ${currentSize.padding};
      font-size: ${currentSize.fontSize};
      line-height: 1.25;
      font-weight: 600;
      border: 1px solid transparent;
      border-radius: ${cornerRadius}px;
      color: var(--gleam-label);
      background:
        linear-gradient(var(--gleam-base), var(--gleam-base)) padding-box,
        conic-gradient(
          from calc(var(--gradient-angle-${instanceId}) - var(--gradient-angle-offset-${instanceId})),
          transparent,
          var(--gleam-accent) var(--gradient-percent-${instanceId}),
          var(--gradient-shine-${instanceId}) calc(var(--gradient-percent-${instanceId}) * 2),
          var(--gleam-accent) calc(var(--gradient-percent-${instanceId}) * 3),
          transparent calc(var(--gradient-percent-${instanceId}) * 4)
        ) border-box;
      box-shadow: inset 0 0 0 1px var(--gleam-inset);
      transition: var(--transition);
      transition-property:
        --gradient-angle-offset-${instanceId},
        --gradient-percent-${instanceId},
        --gradient-shine-${instanceId};
    }

    @media (max-width: 640px) {
      .${scope} {
        padding: 0.85rem 1.4rem;
        font-size: 0.95rem;
      }
    }
    @media (max-width: 360px) {
      .${scope} {
        padding: 0.75rem 1.1rem;
        font-size: 0.875rem;
      }
    }

    .${scope}::before,
    .${scope}::after,
    .${scope} span::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;
      z-index: -1;
    }

    .${scope}:active {
      translate: 0 1px;
    }

    .${scope}::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --position: 2px;
      --space: calc(var(--position) * 2);
      width: var(--size);
      height: var(--size);
      background: radial-gradient(
        circle at var(--position) var(--position),
        white calc(var(--position) / 4),
        transparent 0
      ) padding-box;
      background-size: var(--space) var(--space);
      background-repeat: space;
      mask-image: conic-gradient(
        from calc(var(--gradient-angle-${instanceId}) + 45deg),
        black,
        transparent 10% 90%,
        black
      );
      border-radius: inherit;
      opacity: ${showSpeckle ? speckleOpacity : 0};
      z-index: -1;
    }

    .${scope}::after {
      --animation: shimmer-${instanceId} linear infinite;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(
        -50deg,
        transparent,
        var(--gleam-accent),
        transparent
      );
      mask-image: radial-gradient(circle at bottom, transparent 40%, black);
      opacity: ${showSheen ? 0.6 : 0};
    }

    .${scope} span {
      z-index: 1;
    }

    .${scope} span::before {
      --size: calc(100% + 1rem);
      width: var(--size);
      height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--gleam-accent);
      opacity: 0;
      transition: opacity var(--transition);
      animation: calc(var(--duration) * 1.5) breathe-${instanceId} linear infinite;
    }

    .${scope},
    .${scope}::before,
    .${scope}::after {
      animation:
        var(--animation) var(--duration),
        var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }

    .${scope}:is(:hover, :focus-visible) {
      --gradient-percent-${instanceId}: 20%;
      --gradient-angle-offset-${instanceId}: 95deg;
      --gradient-shine-${instanceId}: var(--gleam-accent-soft);
    }

    .${scope}:is(:hover, :focus-visible),
    .${scope}:is(:hover, :focus-visible)::before,
    .${scope}:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }

    .${scope}:is(:hover, :focus-visible) span::before {
      opacity: 1;
    }

    @keyframes gradient-angle-${instanceId} {
      to {
        --gradient-angle-${instanceId}: 360deg;
      }
    }

    @keyframes shimmer-${instanceId} {
      to {
        rotate: 360deg;
      }
    }

    @keyframes breathe-${instanceId} {
      from,
      to {
        scale: 1;
      }
      50% {
        scale: 1.2;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${scope},
      .${scope}::before,
      .${scope}::after,
      .${scope} span::before {
        animation: none !important;
      }

      .${scope}:is(:hover, :focus-visible),
      .${scope}:is(:hover, :focus-visible)::before,
      .${scope}:is(:hover, :focus-visible)::after {
        animation-play-state: paused !important;
      }

      .${scope}:is(:hover, :focus-visible) span::before {
        opacity: 0;
      }

      .${scope} {
        transition: none;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <button
        type="button"
        className={`${scope} ${className}`}
        onClick={onClick}
        aria-label={typeof label === "string" ? label : "Button"}
        data-reduced-motion={reducedMotion ? "true" : undefined}
      >
        <span className="inline-flex items-center justify-center gap-3 whitespace-nowrap text-inherit">
          {icon}
          {children || label}
        </span>
      </button>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACCOUNT TYPES CONFIGURATION & PRESETS
   - Student: Electric Violet / Purple
   - Employee: Sky Blue / Cyan
   - Business: Sunset Amber / Flame Orange
════════════════════════════════════════════════════════════════ */

export type AccountType = "STUDENT" | "EMPLOYEE" | "BUSINESS_OWNER" | "student" | "employee" | "business";

export interface AccountTypeConfig {
  type: AccountType;
  label: string;
  fillColor: string;
  accentColor: string;
  accentSoftColor: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const ACCOUNT_TYPE_PRESETS: Record<string, AccountTypeConfig> = {
  student: {
    type: "STUDENT",
    label: "Get Started as Student",
    fillColor: "#080611",
    accentColor: "#7c3aed",
    accentSoftColor: "#c4b5fd",
    icon: GraduationCap,
  },
  employee: {
    type: "EMPLOYEE",
    label: "Get Started as Employee",
    fillColor: "#050c14",
    accentColor: "#0284c7",
    accentSoftColor: "#7dd3fc",
    icon: Briefcase,
  },
  business: {
    type: "BUSINESS_OWNER",
    label: "Get Started as Business",
    fillColor: "#120803",
    accentColor: "#ea580c",
    accentSoftColor: "#fdba74",
    icon: Building2,
  },
};

export interface AccountTypeShinyButtonProps extends Partial<ShinyButtonProps> {
  accountType: AccountType;
}

export function AccountTypeShinyButton({
  accountType,
  label,
  icon,
  onClick,
  className = "",
  size = "lg",
  ...restProps
}: AccountTypeShinyButtonProps) {
  const normalizedKey =
    accountType.toLowerCase().includes("student")
      ? "student"
      : accountType.toLowerCase().includes("employee")
      ? "employee"
      : "business";

  const config = ACCOUNT_TYPE_PRESETS[normalizedKey];
  const IconComponent = config.icon;

  return (
    <ShinyButton
      label={label || config.label}
      fillColor={config.fillColor}
      accentColor={config.accentColor}
      accentSoftColor={config.accentSoftColor}
      icon={icon !== undefined ? icon : <IconComponent size={22} />}
      onClick={onClick}
      className={className}
      size={size}
      {...restProps}
    />
  );
}

/** Convenience wrappers for individual Account Types */
export const StudentShinyButton = (props: Partial<ShinyButtonProps>) => (
  <AccountTypeShinyButton accountType="student" {...props} />
);

export const EmployeeShinyButton = (props: Partial<ShinyButtonProps>) => (
  <AccountTypeShinyButton accountType="employee" {...props} />
);

export const BusinessShinyButton = (props: Partial<ShinyButtonProps>) => (
  <AccountTypeShinyButton accountType="business" {...props} />
);

export default ShinyButton;
