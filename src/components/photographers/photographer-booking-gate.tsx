"use client";

import Link from "next/link";
import { useState } from "react";
import { PhotographerBookingPanel } from "@/components/photographers/photographer-booking-panel";
import { ApiError, checkPhotographerAccess } from "@/lib/api";

type State =
  | { step: "verify" }
  | { step: "checking" }
  | { step: "denied"; email: string }
  | { step: "approved"; email: string };

/**
 * Approved photographers confirm their email before the booking calendar
 * appears. Anyone not on the approved list is pointed to the application
 * instead — and the server refuses their booking regardless.
 */
export function PhotographerBookingGate() {
  const [state, setState] = useState<State>({ step: "verify" });
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("Enter the email address you applied with.");
      return;
    }
    setError(null);
    setState({ step: "checking" });
    try {
      const approved = await checkPhotographerAccess(value);
      setState(approved ? { step: "approved", email: value } : { step: "denied", email: value });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "We couldn't check your access. Please try again.");
      setState({ step: "verify" });
    }
  };

  if (state.step === "approved") {
    return (
      <div className="flex flex-col gap-4">
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-bark">
          <span className="inline-flex items-center gap-2 rounded-full bg-sand px-3 py-1 font-medium text-crimson">
            <span aria-hidden className="size-1.5 rounded-full bg-crimson" />
            Approved photographer
          </span>
          Booking as {state.email}
          <button
            type="button"
            onClick={() => setState({ step: "verify" })}
            className="font-semibold text-crimson underline underline-offset-4 hover:text-ink"
          >
            Use a different email
          </button>
        </p>
        <PhotographerBookingPanel approvedEmail={state.email} />
      </div>
    );
  }

  if (state.step === "denied") {
    return (
      <div role="status" className="rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(74,31,46,0.45)] sm:p-10">
        <h2 className="m-0 font-display text-[28px] leading-tight text-ink">This email isn&apos;t approved yet</h2>
        <p className="m-0 mt-3 text-[16px] leading-relaxed text-muted">
          {state.email} isn&apos;t on our approved photographer list. The $75 studio rate requires prior approval. If you&apos;ve already applied, we&apos;ll email you once
          you&apos;re approved.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/photographers#apply"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-crimson px-7 text-[15px] font-semibold text-cream transition-colors hover:bg-velvet"
          >
            Apply to Become a Partner
          </Link>
          <button
            type="button"
            onClick={() => setState({ step: "verify" })}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-line2 px-7 text-[15px] font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  const checking = state.step === "checking";
  return (
    <form
      onSubmit={onVerify}
      noValidate
      className="rounded-[28px] border border-line bg-white p-6 shadow-[0_30px_80px_-50px_rgba(74,31,46,0.45)] sm:p-10"
    >
      <h2 className="m-0 font-display text-[28px] leading-tight text-ink">Confirm your approval</h2>
      <p className="m-0 mt-3 text-[16px] leading-relaxed text-muted">Enter the email address you were approved with to see open studio hours.</p>
      <label htmlFor="gate-email" className="mb-2 mt-7 block text-[14px] font-medium text-bark">
        Approved email address
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="gate-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@studio.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "gate-email-error" : undefined}
          className={`h-[54px] w-full flex-1 rounded-full border bg-white px-5 text-base outline-none transition-colors focus:border-crimson focus:ring-2 focus:ring-crimson/15 ${error ? "border-crimson" : "border-line"}`}
        />
        <button
          type="submit"
          disabled={checking}
          className="inline-flex min-h-[54px] shrink-0 items-center justify-center gap-2 rounded-full bg-crimson px-8 text-[15px] font-semibold text-cream transition-colors hover:bg-velvet disabled:opacity-60"
        >
          {checking ? (
            <>
              <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
              Checking…
            </>
          ) : (
            "Continue to booking"
          )}
        </button>
      </div>
      {error ? (
        <p id="gate-email-error" role="alert" className="m-0 mt-2 text-[13px] text-crimson">
          {error}
        </p>
      ) : null}
      <p className="m-0 mt-6 border-t border-line pt-5 text-[14px] text-muted">
        Not approved yet?{" "}
        <Link href="/photographers#apply" className="font-semibold text-crimson underline underline-offset-4 hover:text-ink">
          Apply to become a partner
        </Link>
      </p>
    </form>
  );
}
