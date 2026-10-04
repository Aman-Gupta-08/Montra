/**
 * KineticGrid.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Interactive kinetic grid background for Montra.
 *
 * Features:
 *  - Canvas-based grid with cursor-driven warp distortion
 *  - Click / touch ripple effects
 *  - Glowing animated nodes at grid intersections
 *  - Configurable intensity: 'high' | 'medium' | 'low' | 'very-low'
 *  - Light & dark mode colour schemes matched to Montra's design system
 *  - Mobile-safe: disables cursor distortion on touch devices
 *  - Respects prefers-reduced-motion
 *  - Proper RAF cancellation and event-listener cleanup on unmount
 *  - aria-hidden + pointer-events-none — purely decorative
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useCallback } from 'react';

/* ─── Intensity presets ──────────────────────────────────────────────────── */
const INTENSITY_PRESETS = {
  high: {
    cellSize: 55,
    lineOpacity: 0.32,
    nodeOpacity: 0.55,
    nodeRadius: 2.2,
    warpRadius: 200,
    warpStrength: 22,
    nodeGlowRadius: 10,
    nodeCount: 1.0,    // fraction of intersections that glow
    rippleMaxRadius: 160,
    rippleDuration: 1000,
    animSpeed: 1.0,
  },
  medium: {
    cellSize: 60,
    lineOpacity: 0.20,
    nodeOpacity: 0.38,
    nodeRadius: 1.8,
    warpRadius: 160,
    warpStrength: 14,
    nodeGlowRadius: 8,
    nodeCount: 0.6,
    rippleMaxRadius: 120,
    rippleDuration: 900,
    animSpeed: 0.75,
  },
  low: {
    cellSize: 70,
    lineOpacity: 0.11,
    nodeOpacity: 0.22,
    nodeRadius: 1.4,
    warpRadius: 120,
    warpStrength: 8,
    nodeGlowRadius: 6,
    nodeCount: 0.35,
    rippleMaxRadius: 90,
    rippleDuration: 800,
    animSpeed: 0.5,
  },
  'very-low': {
    cellSize: 80,
    lineOpacity: 0.06,
    nodeOpacity: 0.12,
    nodeRadius: 1.1,
    warpRadius: 0,
    warpStrength: 0,
    nodeGlowRadius: 4,
    nodeCount: 0.20,
    rippleMaxRadius: 60,
    rippleDuration: 700,
    animSpeed: 0.3,
  },
};

/* ─── Colour palettes ────────────────────────────────────────────────────── */
function getPalette(isDark) {
  if (isDark) {
    return {
      lineColor: '124, 92, 252',      // violet
      lineColorAlt: '16, 185, 129',   // mint
      nodeColor: '124, 92, 252',
      nodeGlow: '124, 92, 252',
      rippleColor: '16, 185, 129',
    };
  }
  return {
    lineColor: '124, 92, 252',        // soft violet (matches #7C5CFC)
    lineColorAlt: '14, 165, 233',     // soft cyan
    nodeColor: '124, 92, 252',
    nodeGlow: '124, 92, 252',
    rippleColor: '16, 185, 129',      // mint green
  };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const isMobile = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ═══════════════════════════════════════════════════════════════════════════
   KINETIC GRID COMPONENT
═══════════════════════════════════════════════════════════════════════════ */
export function KineticGrid({
  intensity = 'medium',
  isDark = false,
  disabled = false,
  className = '',
}) {
  const canvasRef = useRef(null);
  const stateRef  = useRef(null); // holds mutable animation state

  /* Stable callback so we can call it from event listeners */
  const addRipple = useCallback((x, y) => {
    if (!stateRef.current) return;
    stateRef.current.ripples.push({ x, y, startTime: performance.now(), alpha: 1 });
    // Keep ripple list small
    if (stateRef.current.ripples.length > 12) stateRef.current.ripples.shift();
  }, []);

  useEffect(() => {
    if (disabled) return;

    const canvas  = canvasRef.current;
    if (!canvas) return;

    const preset  = INTENSITY_PRESETS[intensity] || INTENSITY_PRESETS.medium;
    const palette  = getPalette(isDark);
    const mobile   = isMobile();
    const reduced  = prefersReducedMotion();

    /* ── DPR-aware sizing ── */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      // Re-seed nodes on resize
      if (stateRef.current) {
        stateRef.current.logicalW = w;
        stateRef.current.logicalH = h;
        seedNodes(w, h, preset, stateRef.current);
      }
    }

    /* ── Node seeding ── */
    function seedNodes(w, h, p, s) {
      const cols = Math.ceil(w / p.cellSize) + 1;
      const rows = Math.ceil(h / p.cellSize) + 1;
      s.cols = cols;
      s.rows = rows;

      // Seed glowing nodes at random intersections
      const all = [];
      for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
          all.push({ c, r });
        }
      }
      // Shuffle and take a fraction
      for (let i = all.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [all[i], all[j]] = [all[j], all[i]];
      }
      s.glowNodes = all
        .slice(0, Math.floor(all.length * p.nodeCount))
        .map(({ c, r }) => ({
          c, r,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.8,
        }));
    }

    /* ── Initialise state ── */
    const lw = canvas.offsetWidth;
    const lh = canvas.offsetHeight;

    stateRef.current = {
      logicalW: lw,
      logicalH: lh,
      cols: 0,
      rows: 0,
      glowNodes: [],
      ripples: [],
      mouse: { x: -9999, y: -9999 },
      rafId: null,
      startTime: performance.now(),
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── Mouse / touch tracking ── */
    function onMouseMove(e) {
      if (mobile || reduced) return;
      const rect = canvas.getBoundingClientRect();
      stateRef.current.mouse.x = e.clientX - rect.left;
      stateRef.current.mouse.y = e.clientY - rect.top;
    }

    function onMouseLeave() {
      stateRef.current.mouse.x = -9999;
      stateRef.current.mouse.y = -9999;
    }

    function onClick(e) {
      if (reduced) return;
      const rect = canvas.getBoundingClientRect();
      // canvas has pointer-events-none so clicks land on its parent
      addRipple(e.clientX - rect.left, e.clientY - rect.top);
    }

    function onTouchStart(e) {
      if (reduced) return;
      const rect = canvas.getBoundingClientRect();
      const t = e.touches[0];
      addRipple(t.clientX - rect.left, t.clientY - rect.top);
    }

    /* Attach to the parent so pointer-events-none doesn't block them */
    const parent = canvas.parentElement;
    parent.addEventListener('mousemove', onMouseMove);
    parent.addEventListener('mouseleave', onMouseLeave);
    parent.addEventListener('click', onClick);
    parent.addEventListener('touchstart', onTouchStart, { passive: true });

    /* ── Draw loop ── */
    function draw(ts) {
      const s   = stateRef.current;
      if (!s) return;

      const ctx = canvas.getContext('2d');
      const w   = s.logicalW;
      const h   = s.logicalH;
      const p   = preset;
      const now = ts - s.startTime;

      ctx.clearRect(0, 0, w, h);

      /* ─ Grid lines ─ */
      const mx = s.mouse.x;
      const my = s.mouse.y;
      const warpR = mobile || reduced ? 0 : p.warpRadius;
      const warpS = mobile || reduced ? 0 : p.warpStrength;

      /* Vertical lines */
      for (let ci = 0; ci <= s.cols; ci++) {
        const bx = ci * p.cellSize;

        ctx.beginPath();
        for (let ri = 0; ri <= s.rows; ri++) {
          const by = ri * p.cellSize;
          const { wx, wy } = warp(bx, by, mx, my, warpR, warpS);

          if (ri === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        // Alternate subtle colour
        const isAlt = ci % 5 === 0;
        ctx.strokeStyle = isAlt
          ? `rgba(${palette.lineColorAlt}, ${p.lineOpacity * 0.6})`
          : `rgba(${palette.lineColor}, ${p.lineOpacity})`;
        ctx.lineWidth = isAlt ? 1.2 : 0.75;
        ctx.stroke();
      }

      /* Horizontal lines */
      for (let ri = 0; ri <= s.rows; ri++) {
        const by = ri * p.cellSize;

        ctx.beginPath();
        for (let ci = 0; ci <= s.cols; ci++) {
          const bx = ci * p.cellSize;
          const { wx, wy } = warp(bx, by, mx, my, warpR, warpS);

          if (ci === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        const isAlt = ri % 5 === 0;
        ctx.strokeStyle = isAlt
          ? `rgba(${palette.lineColorAlt}, ${p.lineOpacity * 0.6})`
          : `rgba(${palette.lineColor}, ${p.lineOpacity})`;
        ctx.lineWidth = isAlt ? 1.2 : 0.75;
        ctx.stroke();
      }

      /* ─ Glowing nodes ─ */
      if (!reduced || intensity === 'high') {
        for (const node of s.glowNodes) {
          const bx = node.c * p.cellSize;
          const by = node.r * p.cellSize;
          const { wx, wy } = warp(bx, by, mx, my, warpR, warpS);

          const pulse = 0.5 + 0.5 * Math.sin(now * 0.001 * node.speed * p.animSpeed + node.phase);
          const alpha = p.nodeOpacity * (0.5 + 0.5 * pulse);

          /* Glow halo */
          const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, p.nodeGlowRadius);
          grad.addColorStop(0, `rgba(${palette.nodeGlow}, ${alpha * 0.6})`);
          grad.addColorStop(1, `rgba(${palette.nodeGlow}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(wx, wy, p.nodeGlowRadius, 0, Math.PI * 2);
          ctx.fill();

          /* Core dot */
          ctx.fillStyle = `rgba(${palette.nodeColor}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(wx, wy, p.nodeRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      /* ─ Ripples ─ */
      const aliveRipples = [];
      for (const rip of s.ripples) {
        const elapsed = ts - rip.startTime;
        if (elapsed > p.rippleDuration) continue;

        const t   = elapsed / p.rippleDuration;
        const r   = t * p.rippleMaxRadius;
        const a   = (1 - t) * p.nodeOpacity * 0.6;

        /* Outer ring */
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${palette.rippleColor}, ${a})`;
        ctx.lineWidth = 1.5 * (1 - t);
        ctx.stroke();

        /* Inner ring (offset) */
        if (r > 20) {
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, r * 0.55, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${palette.rippleColor}, ${a * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        aliveRipples.push(rip);
      }
      s.ripples = aliveRipples;

      s.rafId = requestAnimationFrame(draw);
    }

    stateRef.current.rafId = requestAnimationFrame(draw);

    /* ── Cleanup ── */
    return () => {
      if (stateRef.current?.rafId) cancelAnimationFrame(stateRef.current.rafId);
      ro.disconnect();
      parent.removeEventListener('mousemove', onMouseMove);
      parent.removeEventListener('mouseleave', onMouseLeave);
      parent.removeEventListener('click', onClick);
      parent.removeEventListener('touchstart', onTouchStart);
      stateRef.current = null;
    };
  }, [intensity, isDark, disabled, addRipple]);

  if (disabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
}

/* ─── Warp helper (inline for performance) ─────────────────────────────── */
function warp(bx, by, mx, my, radius, strength) {
  if (radius === 0) return { wx: bx, wy: by };
  const dx = bx - mx;
  const dy = by - my;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0 || dist > radius) return { wx: bx, wy: by };
  const factor = (1 - dist / radius);
  const pull   = factor * factor * strength;
  return {
    wx: bx - (dx / dist) * pull,
    wy: by - (dy / dist) * pull,
  };
}

export default KineticGrid;
