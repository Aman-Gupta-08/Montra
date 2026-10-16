import React, { useState } from "react";
import KineticGrid from "@/components/ui/kinetic-grid";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import ShinyButtonDemo from "@/components/ui/shiny-button-demo";
import MotionFooterDemo from "@/components/ui/motion-footer-demo";

export default function Default() {
  const [activeTab, setActiveTab] = useState<"shiny" | "footer" | "buttons">("shiny");

  return (
    <KineticGrid>
      <div className="flex min-h-screen flex-col items-center justify-start p-6 sm:p-10 gap-8 z-10 relative max-w-6xl mx-auto w-full">
        {/* Navigation / Demo Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 pt-4 border-b border-white/10 pb-6">
          <div>
            <span className="inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-300">
              Montra Component Demos
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
              Interactive Component Showcase
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090d16]/90 border border-white/10 shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveTab("shiny")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "shiny"
                    ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                Shiny Buttons
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("footer")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "footer"
                    ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                Motion Footer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("buttons")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "buttons"
                    ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                Filter Pills
              </button>
            </div>

            <a
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 font-semibold text-xs border border-white/20 transition-all ml-2"
            >
              Dashboard →
            </a>
          </div>
        </div>

        {/* Tab 1: Shiny Account Buttons Showcase */}
        {activeTab === "shiny" && (
          <div className="w-full flex justify-center py-2">
            <div className="w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <ShinyButtonDemo />
            </div>
          </div>
        )}

        {/* Tab 2: Motion Footer Showcase */}
        {activeTab === "footer" && (
          <div className="w-full flex justify-center py-2">
            <div className="w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <MotionFooterDemo />
            </div>
          </div>
        )}

        {/* Tab 3: Button & Filter Showcase */}
        {activeTab === "buttons" && (
          <div className="w-full flex justify-center py-4">
            <ButtonWithIconDemo />
          </div>
        )}
      </div>
    </KineticGrid>
  );
}
