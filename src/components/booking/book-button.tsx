"use client";

import type { ReactNode } from "react";
import type { ExperienceId } from "@/lib/types";
import { useBooking } from "./booking-provider";

interface BookButtonProps {
  preset?: ExperienceId;
  className?: string;
  children: ReactNode;
}

/** Any button that opens the booking panel, optionally with an experience already chosen. */
export function BookButton({ preset, className, children }: BookButtonProps) {
  const { open } = useBooking();
  return (
    <button type="button" onClick={() => open(preset)} className={className}>
      {children}
    </button>
  );
}
