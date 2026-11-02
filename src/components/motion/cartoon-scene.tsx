"use client";

import { useGSAP } from "@gsap/react";
import { clsx } from "clsx";
import gsap from "gsap";
import { type CSSProperties, useRef } from "react";
import { claySurface, ClayGiftBox, ClayOrnament, ClayRibbonStreak, ClayShadow, ClayStar } from "@/components/motion/clay-shapes";

gsap.registerPlugin(useGSAP);

/** The chibi Santa bust: hat, fur, beard and belly built entirely from shaded div shapes. */
function SantaCharacter({ style }: { style: CSSProperties }) {
  return (
    <div data-float className="absolute" style={style}>
      <ClayShadow className="bottom-[-6%] left-[8%] h-[10%] w-[84%]" />

      {/* belly */}
      <div className="absolute inset-x-[6%] bottom-0 h-[52%] rounded-[46%_46%_38%_38%]" style={claySurface("#e38aa9", "var(--color-crimson)", "#6e2748", 150)} />
      {/* belt */}
      <div className="absolute inset-x-[2%] bottom-[22%] h-[11%] rounded-full" style={claySurface("#f3dca0", "var(--color-gold)", "#8f6f2e", 90)} />
      <div className="absolute left-1/2 bottom-[22%] h-[11%] w-[13%] -translate-x-1/2 rounded-[22%]" style={claySurface("#f6e6b8", "#e9c468", "#8f6f2e", 150)} />
      {/* fur hem under the coat */}
      <div className="absolute inset-x-[4%] bottom-[-2%] h-[12%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#d9bdbb", 150)} />

      {/* mittens */}
      <div className="absolute bottom-[26%] left-[-6%] size-[20%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#d9bdbb", 150)} />
      <div className="absolute bottom-[26%] right-[-6%] size-[20%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#d9bdbb", 150)} />

      {/* head */}
      <div className="absolute left-1/2 top-[20%] size-[46%] -translate-x-1/2 rounded-full" style={claySurface("#f6d8bd", "#edc5a4", "#c99a74", 150)} />

      {/* ears / cheeks blush */}
      <div className="absolute left-1/2 top-[44%] size-[9%] -translate-x-[150%] rounded-full opacity-70" style={{ background: "radial-gradient(circle, #f3a0a0 0%, rgba(243,160,160,0) 72%)" }} />
      <div className="absolute left-1/2 top-[44%] size-[9%] translate-x-[50%] rounded-full opacity-70" style={{ background: "radial-gradient(circle, #f3a0a0 0%, rgba(243,160,160,0) 72%)" }} />

      {/* eyes */}
      <div className="absolute left-1/2 top-[34%] size-[4.5%] -translate-x-[260%] rounded-full bg-[#2a1210]" />
      <div className="absolute left-1/2 top-[34%] size-[4.5%] translate-x-[160%] rounded-full bg-[#2a1210]" />

      {/* beard cluster */}
      <div className="absolute left-1/2 top-[38%] size-[40%] -translate-x-1/2 rounded-full" style={claySurface("#ffffff", "#fbeeec", "#e2cfcd", 160)} />
      <div className="absolute left-1/2 top-[46%] size-[30%] -translate-x-[82%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#e2cfcd", 160)} />
      <div className="absolute left-1/2 top-[46%] size-[30%] translate-x-[-18%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#e2cfcd", 160)} />
      {/* mustache */}
      <div className="absolute left-1/2 top-[38%] size-[14%] -translate-x-[180%] rounded-full" style={claySurface("#ffffff", "#fdf5f4", "#e2cfcd", 160)} />
      <div className="absolute left-1/2 top-[38%] size-[14%] translate-x-[80%] rounded-full" style={claySurface("#ffffff", "#fdf5f4", "#e2cfcd", 160)} />

      {/* hat */}
      <div
        className="absolute left-1/2 top-[-18%] h-[46%] w-[58%] -translate-x-1/2"
        style={{
          clipPath: "polygon(40% 0%, 100% 62%, 86% 92%, 10% 100%, 0% 70%)",
          ...claySurface("#e38aa9", "var(--color-crimson)", "#6e2748", 150),
        }}
      />
      <div className="absolute left-1/2 top-[18%] size-[15%] -translate-x-[10%] rounded-full" style={claySurface("#ffffff", "#fbeeec", "#d9bdbb", 150)} />
      <div className="absolute left-1/2 top-[6%] h-[14%] w-[62%] -translate-x-1/2 rounded-full" style={claySurface("#ffffff", "#fbeeec", "#d9bdbb", 90)} />
    </div>
  );
}

/**
 * An illustrated "claymorphism" scene — a chibi Santa, gift boxes and an
 * ornament, each built from shaded div shapes (no stock photos, no SVG
 * icons). On mount it plays a staged reveal — ribbon streaks swirl in,
 * Santa pops into place, the gifts/ornament/star follow — mirroring the
 * brand reference video's product-assembly motion, then settles into a
 * gentle idle bob with pointer-tilt.
 */
export function CartoonScene({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const root = rootRef.current;
      const stage = root?.querySelector<HTMLElement>("[data-stage]");
      if (!root || !stage || !contextSafe) return;
      const floats = gsap.utils.toArray<HTMLElement>("[data-float]", stage);
      const ribbons = gsap.utils.toArray<HTMLElement>("[data-ribbon]", stage);
      // Each prop sits at its own depth so the pointer tilt reveals real parallax.
      floats.forEach((el) => gsap.set(el, { z: Number(el.dataset.z ?? 0) }));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(ribbons, { opacity: 0 });
        return;
      }

      let cleanupPointer = () => {};
      const startAmbient = contextSafe(() => {
        floats.forEach((el, i) => {
          gsap.to(el, {
            y: `+=${12 + i * 5}`,
            rotate: `+=${i % 2 === 0 ? 1.6 : -1.6}`,
            duration: 3.2 + i * 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });

        if (window.matchMedia("(pointer: coarse)").matches) return;
        const rx = gsap.quickTo(stage, "rotateX", { duration: 0.9, ease: "power2.out" });
        const ry = gsap.quickTo(stage, "rotateY", { duration: 0.9, ease: "power2.out" });
        const onMove = contextSafe((e: PointerEvent) => {
          const rect = root.getBoundingClientRect();
          ry(((e.clientX - rect.left) / rect.width - 0.5) * 22);
          rx(((e.clientY - rect.top) / rect.height - 0.5) * -16);
        });
        const onLeave = contextSafe(() => {
          ry(0);
          rx(0);
        });
        root.addEventListener("pointermove", onMove);
        root.addEventListener("pointerleave", onLeave);
        cleanupPointer = () => {
          root.removeEventListener("pointermove", onMove);
          root.removeEventListener("pointerleave", onLeave);
        };
      });

      gsap.set(floats, { scale: 0, opacity: 0, transformOrigin: "50% 85%" });
      gsap.set(ribbons, { opacity: 0, scale: 0.7 });

      gsap
        .timeline({ delay: 0.15, onComplete: startAmbient })
        .to(ribbons, { opacity: 0.85, scale: 1, rotate: "+=120", duration: 1, ease: "power2.out", stagger: 0.1 })
        .to(floats[0], { scale: 1, opacity: 1, duration: 0.9, ease: "back.out(1.6)" }, "-=0.7")
        .to(floats.slice(1), { scale: 1, opacity: 1, duration: 0.65, ease: "back.out(1.8)", stagger: 0.12 }, "-=0.55")
        .to(ribbons, { opacity: 0, scale: 1.3, duration: 0.7, ease: "power1.in" }, "-=0.15");

      return () => cleanupPointer();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} style={{ perspective: "1100px" }} className={clsx("relative mx-auto", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[16%] opacity-90 blur-3xl"
        style={{
          background:
            "radial-gradient(42% 42% at 50% 46%, rgba(178,61,110,0.22) 0%, rgba(201,162,74,0.16) 46%, rgba(178,61,110,0) 78%)",
        }}
      />
      <div data-stage className="absolute inset-0 [transform-style:preserve-3d]">
        <ClayRibbonStreak style={{ left: "4%", top: "36%", width: "92%", height: "7%" }} rotate={-22} from="var(--color-crimson)" to="var(--color-gold)" />
        <ClayRibbonStreak style={{ left: "8%", top: "54%", width: "84%", height: "6%" }} rotate={14} from="var(--color-gold)" to="var(--color-crimson)" />
        <ClayRibbonStreak style={{ left: "16%", top: "16%", width: "68%", height: "5%" }} rotate={48} from="var(--color-velvet)" to="var(--color-gold)" />

        <SantaCharacter style={{ left: "26%", top: "6%", width: "48%", height: "72%" }} />

        <ClayGiftBox
          box="var(--color-gold)"
          boxLight="#f3dca0"
          boxDark="#8f6f2e"
          ribbon="#fefaf9"
          ribbonLight="#ffffff"
          ribbonDark="#d9bdbb"
          rotate={-9}
          z={90}
          style={{ left: "0%", bottom: "2%", width: "28%" }}
        />
        <ClayGiftBox
          box="var(--color-velvet)"
          boxLight="#7a3a52"
          boxDark="#2e1220"
          ribbon="var(--color-gold)"
          ribbonLight="#f3dca0"
          ribbonDark="#8f6f2e"
          rotate={8}
          z={140}
          style={{ right: "2%", bottom: "-2%", width: "24%" }}
        />
        <ClayOrnament style={{ right: "6%", top: "4%", width: "13%" }} rotate={-6} z={-90} />
        <ClayStar style={{ left: "2%", top: "0%", width: "11%", height: "11%" }} z={-140} />
      </div>
    </div>
  );
}
