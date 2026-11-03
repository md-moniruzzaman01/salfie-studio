import { clsx } from "clsx";
import type { CSSProperties } from "react";
import { claySurface, ClayShadow } from "@/components/motion/clay-shapes";

/**
 * A chunky instant camera in the same claymorphic language as the Santa
 * scene. Animation hooks: `data-cam-flash` (the flash window), `data-cam-lens`
 * (the lens barrel) and `data-cam-shutter` (the button).
 */
export function ClayCamera({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={clsx("relative aspect-[5/4]", className)} style={style} aria-hidden>
      <ClayShadow className="bottom-[-9%] left-[6%] h-[14%] w-[88%]" />

      {/* viewfinder hump + shutter */}
      <div className="absolute left-[10%] top-[-7%] h-[16%] w-[26%] rounded-[30%_30%_10%_10%]" style={claySurface("#ffffff", "#f3e6d3", "#d9bdbb", 160)} />
      <div
        data-cam-shutter
        className="absolute right-[14%] top-[-6%] h-[12%] w-[16%] rounded-full"
        style={claySurface("#f6a9c5", "var(--color-crimson)", "#4a0b10", 160)}
      />

      {/* body */}
      <div className="absolute inset-0 rounded-[18%]" style={claySurface("#ffffff", "#e9dcc8", "#cfa9a7", 150)} />
      {/* crimson band */}
      <div className="absolute inset-x-0 bottom-[16%] h-[18%]" style={claySurface("#e0343c", "var(--color-crimson)", "#4a0b10", 90)} />

      {/* flash window */}
      <div
        data-cam-flash
        className="absolute left-[9%] top-[12%] h-[17%] w-[24%] rounded-[24%]"
        style={{
          background: "linear-gradient(160deg, #ffffff 0%, #f7f0e4 40%, #e7cfcd 100%)",
          boxShadow: "inset 0 0 0 3px rgba(201,162,74,0.55), inset -4px -6px 10px rgba(40,10,20,0.15)",
        }}
      />
      {/* viewfinder glass */}
      <div className="absolute right-[11%] top-[12%] size-[13%] rounded-[30%] bg-[#2a1018] shadow-[inset_2px_3px_4px_rgba(255,255,255,0.35)]" />

      {/* lens */}
      <div data-cam-lens className="absolute left-1/2 top-[52%] size-[58%] -translate-x-1/2 -translate-y-1/2">
        <div className="absolute inset-0 rounded-full" style={claySurface("#fbe8ad", "var(--color-gold)", "#8f6f2e", 150)} />
        <div className="absolute inset-[11%] rounded-full" style={claySurface("#ffffff", "#f3e6d3", "#bf9a98", 330)} />
        <div className="absolute inset-[22%] rounded-full" style={claySurface("#7a3a52", "var(--color-velvet)", "#1c0a12", 150)} />
        <div
          className="absolute inset-[31%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 34% 30%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 22%), radial-gradient(circle at 60% 66%, rgba(176,21,29,0.55) 0%, rgba(176,21,29,0) 40%), radial-gradient(circle, #3a1626 0%, #12060b 80%)",
          }}
        />
      </div>

      {/* film slot */}
      <div className="absolute bottom-[6%] left-1/2 h-[3.5%] w-[52%] -translate-x-1/2 rounded-full bg-[#5a2a3a]/70 shadow-[inset_0_2px_3px_rgba(0,0,0,0.45)]" />
    </div>
  );
}
