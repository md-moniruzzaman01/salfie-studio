"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile site key (public). When unset the widget renders
// nothing and the backend only skips verification if it has no secret either.
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
export const turnstileConfigured = TURNSTILE_SITE_KEY !== "";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  remove: (id: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined" || window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      scriptPromise = null; // allow a retry on the next mount
      reject(new Error("Turnstile failed to load"));
    });
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Cloudflare Turnstile widget. Calls `onVerify(token)` when solved and
 * `onVerify("")` when the token expires or errors. Remount with a changing
 * `key` for a fresh challenge — tokens are single-use server-side.
 */
export function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onVerifyRef = useRef(onVerify);
  useEffect(() => {
    onVerifyRef.current = onVerify;
  }, [onVerify]);

  useEffect(() => {
    if (!turnstileConfigured) return;
    let cancelled = false;
    let widgetId: string | null = null;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          // The normal widget is a fixed 300px — wider than a form card on
          // small phones — so fall back to the compact one when it won't fit.
          size: containerRef.current.clientWidth < 300 ? "compact" : "normal",
          callback: (token) => onVerifyRef.current(token),
          "expired-callback": () => onVerifyRef.current(""),
          "error-callback": () => onVerifyRef.current(""),
        });
      })
      .catch(() => onVerifyRef.current(""));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch {
          /* widget already gone */
        }
      }
    };
  }, []);

  if (!turnstileConfigured) return null;
  return <div ref={containerRef} className="min-h-[65px] max-w-full overflow-hidden" />;
}
