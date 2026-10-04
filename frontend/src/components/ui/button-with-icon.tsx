import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ═══════════════════════════════════════════════════════════════
   1. IMAGE 1: Pill & Badge Filter Buttons
   - All (3) / Unread with Red Badge (3)
   - All Types / System with Info Icon (1)
════════════════════════════════════════════════════════════════ */

export interface PillFilterProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function NotificationPillFilter({
  activeTab: controlledTab,
  onTabChange,
  className,
}: PillFilterProps) {
  const [internalTab, setInternalTab] = useState<string>("all");
  const activeTab = controlledTab ?? internalTab;

  const handleSelect = (tab: string) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 p-1 rounded-full bg-[#070f0e]/90 border border-[#13231e] shadow-xl backdrop-blur-md select-none",
        className
      )}
    >
      {/* All (3) Button */}
      <button
        type="button"
        onClick={() => handleSelect("all")}
        className={cn(
          "relative text-sm font-bold rounded-full h-10 px-5 py-2 transition-all duration-300 cursor-pointer flex items-center justify-center",
          activeTab === "all"
            ? "bg-[#6b00ff] text-white shadow-lg shadow-purple-600/40"
            : "text-zinc-300 hover:text-white hover:bg-white/5"
        )}
      >
        <span>All (3)</span>
      </button>

      {/* Unread Button with Red Badge */}
      <button
        type="button"
        onClick={() => handleSelect("unread")}
        className={cn(
          "relative text-sm font-semibold rounded-full h-10 px-4 py-2 transition-all duration-300 cursor-pointer flex items-center gap-2",
          activeTab === "unread"
            ? "bg-[#6b00ff] text-white shadow-lg shadow-purple-600/40"
            : "text-zinc-300 hover:text-white hover:bg-white/5"
        )}
      >
        <span>Unread</span>
        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#ff0033] text-white text-xs font-bold shadow-md shadow-red-500/30">
          3
        </span>
      </button>
    </div>
  );
}

export function TypeFilterPills({
  activeType: controlledType,
  onTypeChange,
  className,
}: {
  activeType?: string;
  onTypeChange?: (type: string) => void;
  className?: string;
}) {
  const [internalType, setInternalType] = useState<string>("all");
  const activeType = controlledType ?? internalType;

  const handleSelect = (type: string) => {
    setInternalType(type);
    onTypeChange?.(type);
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* All Types Pill Button */}
      <button
        type="button"
        onClick={() => handleSelect("all")}
        className={cn(
          "relative text-sm font-bold rounded-full h-10 px-6 py-2 transition-all duration-300 cursor-pointer flex items-center justify-center",
          activeType === "all"
            ? "bg-[#6b00ff] text-white shadow-lg shadow-purple-600/40"
            : "text-zinc-300 hover:text-white bg-[#070f0e]/90 border border-[#13231e]"
        )}
      >
        <span>All Types</span>
      </button>

      {/* System (1) Pill Button with Info Icon */}
      <button
        type="button"
        onClick={() => handleSelect("system")}
        className={cn(
          "relative text-sm font-semibold rounded-full h-10 px-4 py-2 transition-all duration-300 cursor-pointer flex items-center gap-2 border",
          activeType === "system"
            ? "bg-[#6b00ff] border-[#6b00ff] text-white shadow-lg shadow-purple-600/40"
            : "bg-[#091312]/90 border-[#142621] text-zinc-300 hover:text-white hover:border-[#1e3a33]"
        )}
      >
        <Info size={15} className="text-zinc-400" />
        <span className="font-semibold text-zinc-200">System</span>
        <span className="text-zinc-400 font-normal text-xs">(1)</span>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. IMAGE 2: Period Segmented Tabs
   - Weekly | Monthly (Active) | Yearly | Custom
════════════════════════════════════════════════════════════════ */

export function PeriodSegmentedTabs({
  value: controlledValue,
  onChange,
  className,
}: {
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState<string>("monthly");
  const value = controlledValue ?? internalValue;

  const tabs = [
    { id: "weekly", label: "Weekly" },
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
    { id: "custom", label: "Custom" },
  ];

  const handleSelect = (id: string) => {
    setInternalValue(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#090d16]/90 border border-white/5 shadow-2xl backdrop-blur-md select-none",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            className={cn(
              "relative text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer",
              isActive
                ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. IMAGE 3: Timeframe View Switcher
   - Month (Active) | Week | Day
════════════════════════════════════════════════════════════════ */

export function TimeframeSegmentedTabs({
  value: controlledValue,
  onChange,
  className,
}: {
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState<string>("month");
  const value = controlledValue ?? internalValue;

  const views = [
    { id: "month", label: "Month" },
    { id: "week", label: "Week" },
    { id: "day", label: "Day" },
  ];

  const handleSelect = (id: string) => {
    setInternalValue(id);
    onChange?.(id);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090d16]/90 border border-white/5 shadow-2xl backdrop-blur-md select-none",
        className
      )}
    >
      {views.map((v) => {
        const isActive = value === v.id;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => handleSelect(v.id)}
            className={cn(
              "relative text-sm font-semibold px-5 py-2 rounded-xl transition-all duration-300 cursor-pointer",
              isActive
                ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
            )}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. INTERACTIVE HOVER BUTTON (from user code pattern)
   - Styled with Image aesthetics and dynamic button names
═══════════════════════════════════════════════════════════════ */

export interface ButtonWithIconProps {
  label?: string;
  badge?: string | number;
  icon?: React.ReactNode;
  variant?: "purple" | "dark" | "pill";
  onClick?: () => void;
  className?: string;
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  label = "Monthly",
  badge,
  icon = <ArrowUpRight size={16} />,
  variant = "purple",
  onClick,
  className,
}) => {
  const isPurple = variant === "purple" || variant === "pill";

  return (
    <Button
      onClick={onClick}
      className={cn(
        "relative text-sm font-semibold rounded-full h-11 p-1 ps-5 pe-12 group transition-all duration-500 hover:ps-12 hover:pe-5 w-fit overflow-hidden cursor-pointer border select-none",
        isPurple
          ? "bg-[#6b00ff] hover:bg-[#5b00dc] text-white border-purple-500/30 shadow-lg shadow-purple-600/30"
          : "bg-[#1b2536] hover:bg-[#233045] text-[#b8a6f8] border-[#27354d]/70 shadow-md",
        className
      )}
    >
      <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
        {label}
      </span>

      <div
        className={cn(
          "absolute right-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-40px)] group-hover:rotate-45 shadow-sm",
          badge
            ? "bg-[#ff0033] text-white text-xs font-bold"
            : isPurple
            ? "bg-white text-[#6b00ff]"
            : "bg-[#25334a] text-[#c4b5fd]"
        )}
      >
        {badge ? <span>{badge}</span> : icon}
      </div>
    </Button>
  );
};

/* ═══════════════════════════════════════════════════════════════
   5. COMPLETE DEMO COMPONENT
   Renders all button styles from the 3 user images
═══════════════════════════════════════════════════════════════ */

export const ButtonWithIconDemo = () => {
  return (
    <div className="flex flex-col gap-8 p-6 max-w-2xl mx-auto rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
          Component Showcase
        </span>
        <h2 className="text-xl font-bold text-white mt-2">
          Montra Button & Filter Design System
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Exact pixel-accurate reproduction of the buttons shown in the images.
        </p>
      </div>

      {/* Image 1 Demo: Pill & Badge Filter Buttons */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Image 1 — Pill Filters with Badges & Icons
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <NotificationPillFilter />
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-1">
          <TypeFilterPills />
        </div>
      </div>

      {/* Image 2 Demo: Period Segmented Tabs */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Image 2 — Period Segmented Control (Weekly / Monthly / Yearly / Custom)
        </span>
        <div>
          <PeriodSegmentedTabs />
        </div>
      </div>

      {/* Image 3 Demo: Timeframe View Switcher */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Image 3 — Timeframe Switcher (Month / Week / Day)
        </span>
        <div>
          <TimeframeSegmentedTabs />
        </div>
      </div>

      {/* Dynamic Interactive Hover Buttons with the names from the images */}
      <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Interactive Hover Slide Buttons (Using Image Labels)
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <ButtonWithIcon label="All (3)" badge="3" variant="purple" />
          <ButtonWithIcon label="Unread" badge="3" variant="purple" />
          <ButtonWithIcon label="System" icon={<Info size={15} />} variant="dark" />
          <ButtonWithIcon label="Monthly" icon={<ArrowUpRight size={16} />} variant="dark" />
          <ButtonWithIcon label="Month" icon={<ArrowUpRight size={16} />} variant="dark" />
        </div>
      </div>
    </div>
  );
};

export default ButtonWithIconDemo;

export function DemoOne() {
  return <ButtonWithIconDemo />;
}
