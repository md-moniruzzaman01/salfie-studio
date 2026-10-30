"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ExperienceId } from "@/lib/types";
import { BookingSheet } from "./booking-sheet";

interface BookingContextValue {
  open: (preset?: ExperienceId) => void;
  close: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preset, setPreset] = useState<ExperienceId | undefined>();
  const [session, setSession] = useState(0);

  const open = useCallback((next?: ExperienceId) => {
    setPreset(next);
    setSession((s) => s + 1);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  return (
    <BookingContext.Provider value={value}>
      {children}
      {isOpen ? <BookingSheet key={session} preset={preset} onClose={close} /> : null}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextValue {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
