"use client";

import { createContext, useContext } from "react";

export type ModalKind = "santa" | "studio";

interface BookingModalValue {
  /** Opens the booking sheet. Returns false (and does nothing) on screens wider than a phone. */
  open: (kind: ModalKind) => boolean;
  close: () => void;
}

export const BookingModalContext = createContext<BookingModalValue>({ open: () => false, close: () => {} });
export const useBookingModal = () => useContext(BookingModalContext);

export const PHONE_QUERY = "(max-width: 767px)";
