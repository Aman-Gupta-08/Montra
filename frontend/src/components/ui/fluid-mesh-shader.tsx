"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FluidMeshShaderProps {
  isDark?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function FluidMeshShader({
  isDark = true,
  className,
  children,
}: FluidMeshShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let gl: WebGLRenderingContext | null = null;

    try {
      gl =
        canvas.getContext("webgl", { alpha: false, antialias: true }) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    } catch {
      return;
    }

    if (!gl) return;

    function syncSize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor((canvas.clientWidth || window.innerWidth) * dpr);
      const h = Math.floor((canvas.clientHeight || window.innerHeight) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    syncSize();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(syncSize);
      ro.observe(canvas);
    }

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_isDark;
      varying vec2 v_texCoord;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                             -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        float t = u_time * 0.2;
        vec2 mouse = u_mouse / u_resolution;
        vec2 mNorm = (mouse - 0.5) * 0.25;

        // Undulating noise layers
        float n1 = snoise(p * 0.85 + vec2(t * 0.3, -t * 0.2) + mNorm);
        float n2 = snoise(p * 1.5 - vec2(t * 0.25, t * 0.35) + vec2(n1 * 0.5));
        float n3 = snoise(p * 0.6 + vec2(-t * 0.15, t * 0.2) + vec2(n2 * 0.35));

        // Theme palette adaptation
        // Dark theme: deep #121314 base with soft luminous aurora
        vec3 darkBg = vec3(0.070, 0.075, 0.082);
        vec3 darkLavender = vec3(0.816, 0.737, 1.0);
        vec3 darkLilac = vec3(0.72, 0.75, 1.0);
        vec3 darkMint = vec3(0.65, 0.95, 0.85);
        vec3 darkPearl = vec3(0.92, 0.90, 0.98);

        // Light theme: soft luminous pearl-white (#F7F8FC) with tranquil pastel wash
        vec3 lightBg = vec3(0.968, 0.972, 0.990);
        vec3 lightLavender = vec3(0.88, 0.83, 1.0);
        vec3 lightLilac = vec3(0.80, 0.85, 1.0);
        vec3 lightMint = vec3(0.73, 0.96, 0.90);
        vec3 lightPearl = vec3(1.0, 0.99, 1.0);

        vec3 bg = mix(lightBg, darkBg, u_isDark);
        vec3 softLavender = mix(lightLavender, darkLavender, u_isDark);
        vec3 softLilac = mix(lightLilac, darkLilac, u_isDark);
        vec3 softMintGlow = mix(lightMint, darkMint, u_isDark);
        vec3 softPearl = mix(lightPearl, darkPearl, u_isDark);

        // Ultra smooth blending gradients
        float f1 = smoothstep(-0.35, 0.85, n1);
        float f2 = smoothstep(-0.5, 0.9, n2);
        float f3 = smoothstep(-0.2, 0.8, n3);

        // Soft radial falloff vignette
        float dist = length(uv - vec2(0.5, 0.45));
        float radialFade = smoothstep(0.98, 0.15, dist);

        // Build soft translucent luminous light color wash
        vec3 lightWash = mix(softLavender, softLilac, f1);
        lightWash = mix(lightWash, softMintGlow, f2 * 0.45);
        lightWash = mix(lightWash, softPearl, clamp(pow(f3, 2.5) * 0.35, 0.0, 0.5));

        // Light intensity calculation
        float darkLightFactor = (f1 * 0.45 + f2 * 0.35 + f3 * 0.2) * radialFade * 0.58;
        float lightLightFactor = (f1 * 0.55 + f2 * 0.45 + f3 * 0.3) * radialFade * 0.42;
        float lightIntensity = mix(lightLightFactor, darkLightFactor, u_isDark);

        // Blend wash into background
        vec3 col = mix(bg, lightWash, clamp(lightIntensity, 0.0, 0.85));

        // Microscopic silky sheen grain
        float grain = fract(sin(dot(uv * (u_time * 0.05 + 5.0), vec2(12.9898, 78.233))) * 43758.5453) * 0.012;
        col += (u_isDark > 0.5) ? grain : -grain * 0.5;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    function compileShader(type: number, source: string): WebGLShader | null {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vertShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertShader || !fragShader) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.deleteProgram(prog);
      return;
    }

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const pos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uIsDark = gl.getUniformLocation(prog, "u_isDark");

    const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const targetMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        targetMouse.x = (event.clientX - rect.left) * dpr;
        targetMouse.y = (rect.height - (event.clientY - rect.top)) * dpr;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    function render(t: number) {
      if (!gl || !canvas) return;

      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      if (uIsDark) gl.uniform1f(uIsDark, isDarkRef.current ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (ro) ro.disconnect();
      if (gl) {
        gl.deleteBuffer(buf);
        gl.deleteProgram(prog);
        gl.deleteShader(vertShader);
        gl.deleteShader(fragShader);
      }
    };
  }, []);

  return (
    <div
      className={cn(
        "relative w-full min-h-screen overflow-hidden transition-colors duration-500",
        isDark ? "bg-[#121314]" : "bg-[#F7F8FC]",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{ display: "block" }}
      />
      <div className="relative z-10 w-full min-h-screen">{children}</div>
    </div>
  );
}

export default FluidMeshShader;
