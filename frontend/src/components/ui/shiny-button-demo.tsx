"use client";

import React, { useState } from "react";
import {
  StudentShinyButton,
  EmployeeShinyButton,
  BusinessShinyButton,
} from "@/components/ui/shiny-button";
import { GraduationCap, Briefcase, Building2, Sparkles, CheckCircle2 } from "lucide-react";

export default function ShinyButtonDemo() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);
  };

  return (
    <main className="flex min-h-[85vh] w-full flex-col items-center justify-center bg-[#05070a] p-6 sm:p-12 text-white relative overflow-hidden">
      {/* Background ambient glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-violet-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[350px] bg-orange-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold text-violet-300">
            <Sparkles size={15} />
            <span>Interactive Gleam Shader Button</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Account Types Shiny Buttons
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Dynamic conic-gradient borders with real-time breathing sheens and speckle textures tailored for each account persona.
          </p>
        </div>

        {/* Selected notification banner */}
        {selectedRole && (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-sm font-semibold animate-in fade-in zoom-in-95 duration-200 shadow-lg">
            <CheckCircle2 size={18} className="text-emerald-400" />
            <span>Selected: <strong className="text-white">{selectedRole}</strong> onboarding flow</span>
          </div>
        )}

        {/* The 3 Account Types Shiny Buttons (Spacious Horizontal Card Layout) */}
        <div className="flex flex-col gap-5 w-full">
          {/* 1. Student Account Type */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#090b13]/90 border border-violet-500/20 shadow-2xl backdrop-blur-md hover:border-violet-500/50 hover:shadow-violet-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0 shadow-inner">
                <GraduationCap size={28} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Student Account</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Campus allowances, textbook budgets & scholarships
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center">
              <StudentShinyButton
                label="Get Started as Student"
                onClick={() => handleRoleSelect("Student")}
                size="lg"
                className="w-full md:w-auto shadow-xl"
              />
            </div>
          </div>

          {/* 2. Employee Account Type */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#070e17]/90 border border-sky-500/20 shadow-2xl backdrop-blur-md hover:border-sky-500/50 hover:shadow-sky-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-inner">
                <Briefcase size={28} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Employee Account</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Automated paycheck savings & recurring bill tracking
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center">
              <EmployeeShinyButton
                label="Get Started as Employee"
                onClick={() => handleRoleSelect("Employee")}
                size="lg"
                className="w-full md:w-auto shadow-xl"
              />
            </div>
          </div>

          {/* 3. Business Account Type */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#140a05]/90 border border-orange-500/20 shadow-2xl backdrop-blur-md hover:border-orange-500/50 hover:shadow-orange-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-inner">
                <Building2 size={28} />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Business Account</h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Business sales, staff records & monthly payroll salaries
                </p>
              </div>
            </div>
            <div className="shrink-0 w-full md:w-auto flex justify-center">
              <BusinessShinyButton
                label="Get Started as Business"
                onClick={() => handleRoleSelect("Business Owner")}
                size="lg"
                className="w-full md:w-auto shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
