import { clsx } from "clsx";
import { type CSSProperties } from "react";

/** Soft inner shading shared by every clay shape: a specular highlight + ambient-occlusion rim. */
export function claySurface(light: string, base: string, dark: string, angle = 145): CSSProperties {
  return {
    backgroundImage: `radial-gradient(circle at 30% 24%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 38%), linear-gradient(${angle}deg, ${light} 0%, ${base} 55%, ${dark} 100%)`,
    boxShadow: "inset -6px -9px 16px rgba(40,10,20,0.24), inset 5px 7px 12px rgba(255,255,255,0.35)",
  };
}

export function ClayShadow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx("pointer-events-none absolute rounded-full blur-md", className)}
      style={{ background: "radial-gradient(ellipse, rgba(74,31,46,0.32) 0%, rgba(74,31,46,0) 72%)" }}
    />
  );
}

export function ClayBow({ color, light, dark, style }: { color: string; light: string; dark: string; style?: CSSProperties }) {
  const wingSurface = claySurface(light, color, dark, 150);
  return (
    <div aria-hidden className="absolute" style={style}>
      <div className="absolute h-[52%] w-[62%] rounded-[50%] -translate-x-[78%] -translate-y-1/2 rotate-[-28deg]" style={wingSurface} />
      <div className="absolute h-[52%] w-[62%] rounded-[50%] translate-x-[16%] -translate-y-1/2 rotate-[28deg]" style={wingSurface} />
      <div className="absolute size-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={claySurface(light, dark, "#5a1a2e", 160)} />
    </div>
  );
}

interface ClayGiftBoxProps {
  box: string;
  boxLight: string;
  boxDark: string;
  ribbon: string;
  ribbonLight: string;
  ribbonDark: string;
  style: CSSProperties;
  rotate: number;
  /** Set false to render without the floating-stage hook-up (e.g. a static decorative accent). */
  floating?: boolean;
  /** Depth inside a preserve-3d stage, in px (toward the viewer is positive). */
  z?: number;
}

export function ClayGiftBox({ box, boxLight, boxDark, ribbon, ribbonLight, ribbonDark, style, rotate, floating = true, z }: ClayGiftBoxProps) {
  return (
    <div data-float={floating || undefined} data-z={z} className="absolute aspect-square" style={{ ...style, transform: `rotate(${rotate}deg)` }}>
      <ClayShadow className="bottom-[-10%] left-[6%] h-[18%] w-[88%]" />
      {/* lid */}
      <div className="absolute left-[-4%] top-0 h-[22%] w-[108%] rounded-[22%]" style={claySurface(boxLight, box, boxDark, 150)} />
      {/* body */}
      <div className="absolute inset-x-0 bottom-0 h-[82%] rounded-[16%]" style={claySurface(boxLight, box, boxDark, 150)} />
      {/* ribbon */}
      <div className="absolute inset-y-0 left-1/2 w-[16%] -translate-x-1/2" style={claySurface(ribbonLight, ribbon, ribbonDark, 180)} />
      <div className="absolute inset-x-0 top-[26%] h-[16%]" style={claySurface(ribbonLight, ribbon, ribbonDark, 90)} />
      <ClayBow color={ribbon} light={ribbonLight} dark={ribbonDark} style={{ top: "-20%", left: "50%", width: "46%", height: "32%" }} />
    </div>
  );
}

export function ClayOrnament({ style, rotate = 0, floating = true, z }: { style: CSSProperties; rotate?: number; floating?: boolean; z?: number }) {
  return (
    <div data-float={floating || undefined} data-z={z} className="absolute aspect-square" style={{ ...style, transform: `rotate(${rotate}deg)` }}>
      <ClayShadow className="bottom-[-14%] left-[8%] h-[16%] w-[84%]" />
      <div className="absolute left-1/2 top-[-6%] h-[14%] w-[10%] -translate-x-1/2 rounded-full" style={claySurface("#f3dca0", "var(--color-gold)", "#8f6f2e", 180)} />
      <div className="absolute inset-0 rounded-full" style={claySurface("#f6a9c5", "var(--color-crimson)", "#6e2748", 150)} />
    </div>
  );
}

export function ClayStar({ style, floating = true, z }: { style: CSSProperties; floating?: boolean; z?: number }) {
  return (
    <div
      data-float={floating || undefined}
      data-z={z}
      aria-hidden
      className="absolute"
      style={{
        ...style,
        clipPath: "polygon(50% 0%, 64% 36%, 100% 38%, 72% 60%, 82% 96%, 50% 75%, 18% 96%, 28% 60%, 0% 38%, 36% 36%)",
        ...claySurface("#fbe8ad", "var(--color-gold)", "#9c7a35", 150),
      }}
    />
  );
}

export function ClayRibbonStreak({ style, rotate, from, to }: { style: CSSProperties; rotate: number; from: string; to: string }) {
  return (
    <div
      data-ribbon
      aria-hidden
      className="pointer-events-none absolute rounded-full blur-[3px]"
      style={{
        ...style,
        transform: `rotate(${rotate}deg)`,
        backgroundImage: `linear-gradient(90deg, transparent 0%, ${from} 32%, ${to} 58%, transparent 100%)`,
      }}
    />
  );
}
