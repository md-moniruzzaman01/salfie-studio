"use client";

import { clsx } from "clsx";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, type MouseEventHandler, type ReactNode } from "react";
import { useBookingModal, type ModalKind } from "@/components/luxe/booking-modal-context";

/** Pulls its child a few pixels toward the pointer. Desktop mouse only; off for reduced motion. */
export function Magnetic({ children, strength = 0.22, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.span
      ref={ref}
      className={clsx("inline-flex", className)}
      style={reduce ? undefined : { x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

type Variant = "primary" | "outline";
/** `light`: sits on ivory. `dark`: sits on onyx or a photograph. */
type Tone = "light" | "dark";

const BASE =
  "lux-btn relative inline-flex min-h-[52px] select-none items-center justify-center gap-3 px-8 text-[13px] font-bold uppercase tracking-[0.16em] transition-colors duration-500 disabled:pointer-events-none disabled:opacity-40";

function styles(variant: Variant, tone: Tone) {
  if (variant === "primary") {
    return tone === "dark"
      ? "bg-red text-onyx hover:bg-ivory" // black on red, as in the logo
      : "bg-crimson text-ivory hover:bg-onyx";
  }
  return tone === "dark"
    ? "border border-ivory/60 text-ivory hover:border-ivory hover:bg-ivory hover:text-onyx"
    : "border border-onyx text-onyx hover:bg-onyx hover:text-ivory";
}

interface ButtonProps {
  variant?: Variant;
  tone?: Tone;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
  /** Renders a link when set, a button otherwise. */
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit";
  /** On phones, open this booking sheet instead of following `href`. */
  modal?: ModalKind;
}

export function Button({ variant = "primary", tone = "light", magnetic = true, className, children, href, onClick, disabled, type = "button", modal }: ButtonProps) {
  const sheet = useBookingModal();
  const cls = clsx(BASE, styles(variant, tone), className);

  const inner = href !== undefined ? (
    href.startsWith("#") || href.startsWith("/") ? (
      <Link href={href} className={cls} onClick={modal ? (e) => sheet.open(modal) && e.preventDefault() : undefined}>
        {children}
      </Link>
    ) : (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );

  return magnetic ? <Magnetic>{inner}</Magnetic> : inner;
}
