"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/luxe/button";
import { ApiError, confirmUnsubscribe, getUnsubscribeStatus, type UnsubscribeView } from "@/lib/api";
import { BRAND } from "@/lib/content";

type Phase = "loading" | "ready" | "working" | "error";

/**
 * Unsubscribe from marketing email. Reading the status never changes it; only
 * the button does. Booking confirmations and reminders are not affected.
 */
export function UnsubscribePanel({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [view, setView] = useState<UnsubscribeView | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getUnsubscribeStatus(token)
      .then((v) => {
        if (!alive) return;
        setView(v);
        setPhase("ready");
      })
      .catch((e: unknown) => {
        if (!alive) return;
        setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
        setPhase("error");
      });
    return () => {
      alive = false;
    };
  }, [token]);

  const unsubscribe = async () => {
    setPhase("working");
    setError(null);
    try {
      setView(await confirmUnsubscribe(token));
      setPhase("ready");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong. Please try again.");
      setPhase("ready");
    }
  };

  if (phase === "loading") {
    return (
      <>
        <p className="eyebrow m-0 text-crimson">Email preferences</p>
        <p className="m-0 text-[clamp(18px,1.8vw,22px)] text-bark" role="status">
          One moment&hellip;
        </p>
      </>
    );
  }

  if (phase === "error" || !view) {
    return (
      <>
        <p className="eyebrow m-0 text-crimson">Email preferences</p>
        <h1 className="m-0 font-heavy text-[clamp(36px,7vw,80px)] uppercase leading-[0.98] tracking-[-0.015em]">Please try again.</h1>
        <p className="m-0 max-w-[44ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark" role="alert">
          {error}
        </p>
        <Help />
      </>
    );
  }

  if (view.state === "invalid") {
    return (
      <>
        <p className="eyebrow m-0 text-crimson">Email preferences</p>
        <h1 className="m-0 font-heavy text-[clamp(36px,7vw,80px)] uppercase leading-[0.98] tracking-[-0.015em]">This link isn&rsquo;t valid.</h1>
        <p className="m-0 max-w-[46ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
          It may be incomplete or out of date. Please use the unsubscribe link from our most recent email, or let us know and we will take you off the list.
        </p>
        <Help />
      </>
    );
  }

  if (view.state === "unsubscribed") {
    return (
      <>
        <p className="eyebrow m-0 text-crimson">Email preferences</p>
        <h1 className="m-0 font-heavy text-[clamp(40px,9vw,104px)] uppercase leading-[0.95] tracking-[-0.015em]">
          You&rsquo;re
          <br />
          <span className="font-script text-[1.1em] normal-case leading-[0.95] tracking-normal text-evergreen">unsubscribed.</span>
        </h1>
        <p className="m-0 max-w-[46ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
          {view.maskedEmail ? (
            <>
              <strong className="text-onyx">{view.maskedEmail}</strong> won&rsquo;t receive our holiday and offer emails any more.
            </>
          ) : (
            <>You won&rsquo;t receive our holiday and offer emails any more.</>
          )}{" "}
          Confirmations and reminders for bookings you make still arrive as usual.
        </p>
        <p className="m-0 text-[16px] text-muted">Changed your mind? Just reply to any of our emails and we will add you back.</p>
        <Link href="/" className="link-grow text-[16px] text-crimson">
          Back to home
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="eyebrow m-0 text-crimson">Email preferences</p>
      <h1 className="m-0 font-heavy text-[clamp(36px,7vw,80px)] uppercase leading-[0.98] tracking-[-0.015em]">
        Unsubscribe from
        <br />
        <span className="font-script text-[1.1em] normal-case leading-[0.95] tracking-normal text-evergreen">our emails?</span>
      </h1>
      <p className="m-0 max-w-[46ch] text-[clamp(18px,1.8vw,22px)] leading-relaxed text-bark">
        {view.maskedEmail ? (
          <>
            We will stop sending holiday and offer emails to <strong className="text-onyx">{view.maskedEmail}</strong>.
          </>
        ) : (
          <>We will stop sending you holiday and offer emails.</>
        )}{" "}
        Confirmations and reminders for bookings you make will still arrive.
      </p>
      {error && (
        <p className="m-0 text-[16px] text-crimson" role="alert">
          {error}
        </p>
      )}
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button onClick={() => void unsubscribe()} disabled={phase === "working"} magnetic={false}>
          {phase === "working" ? "Unsubscribing…" : "Yes, unsubscribe me"}
        </Button>
        <Button href="/" variant="outline">
          Keep me on the list
        </Button>
      </div>
    </>
  );
}

function Help() {
  return (
    <p className="m-0 text-[16px] text-muted">
      Need help? Email{" "}
      <a href={`mailto:${BRAND.email}`} className="link-grow text-crimson">
        {BRAND.email}
      </a>{" "}
      or call {BRAND.phone}.
    </p>
  );
}
