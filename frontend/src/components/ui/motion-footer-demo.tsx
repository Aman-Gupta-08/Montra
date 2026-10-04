"use client";

import { CinematicFooter } from "@/components/ui/motion-footer";

export default function MotionFooterDemo() {
  return (
    <div className="relative w-full bg-[#05070a] min-h-screen font-sans selection:bg-white/20 overflow-x-hidden">
      {/* 
        MAIN CONTENT AREA 
        We use a high z-index and minimum height to allow the user 
        to scroll down and reveal the footer securely underneath.
      */}
      <main className="relative z-10 w-full min-h-[110vh] bg-[#05070a] flex flex-col items-center justify-center text-white border-b border-white/10 shadow-2xl rounded-b-[40px] px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(124,92,252,0.08)_0%,transparent_60%)] pointer-events-none" />
        
        <div className="inline-block px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-xs font-semibold tracking-wider text-violet-300 uppercase mb-4">
          Cinematic Curtain Reveal
        </div>

        <h1 className="text-3xl md:text-6xl font-light tracking-[0.15em] text-neutral-300 mb-8 uppercase text-center max-w-3xl leading-tight">
          Scroll down to reveal
        </h1>
        
        <p className="text-zinc-500 text-sm md:text-base max-w-md text-center mb-8">
          The footer is fixed underneath the viewport and unveiled smoothly as this curtain section scrolls away.
        </p>

        <div className="w-[1px] h-32 bg-gradient-to-b from-violet-400 to-transparent animate-pulse" />
      </main>

      {/* The Cinematic Footer is injected here */}
      <CinematicFooter brandText="MONTRA" heading="Ready to elevate your finances?" />
    </div>
  );
}
