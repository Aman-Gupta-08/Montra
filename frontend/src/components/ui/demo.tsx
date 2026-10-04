import React, { useState } from "react";
import KineticGrid from "@/components/ui/kinetic-grid";
import DefaultDemo from "@/demos/default";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import ShinyButtonDemo from "@/components/ui/shiny-button-demo";
import MotionFooterDemo from "@/components/ui/motion-footer-demo";

export default function Default() {
  const [activeTab, setActiveTab] = useState<"shiny" | "footer" | "buttons" | "messages">("shiny");

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
              <button
                type="button"
                onClick={() => setActiveTab("messages")}
                className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === "messages"
                    ? "bg-[#1b2536] text-[#b8a6f8] shadow-md border border-[#27354d]/60"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                }`}
              >
                Messages
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

        {/* Tab 4: Messages Sidebar */}
        {activeTab === "messages" && (
          <div className="flex flex-col lg:flex-row items-center justify-center p-4 gap-8 w-full">
            <div className="max-w-md text-left text-white">
              <span className="mb-3 inline-block rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-violet-300">
                21st.dev Component
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Client Messages Sidebar
              </h2>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                A premium glassmorphic client messages sidebar with search, favorites filtering,
                active indicator glow, and avatar status.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="/messages"
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-lg shadow-violet-500/30 transition-all"
                >
                  Open Full Messages App →
                </a>
              </div>
            </div>

            <div className="w-full max-w-sm h-[560px]">
              <DefaultDemo />
            </div>
          </div>
        )}
      </div>
    </KineticGrid>
  );
}
