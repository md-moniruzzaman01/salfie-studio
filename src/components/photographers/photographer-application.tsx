"use client";

import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { Turnstile, turnstileConfigured } from "@/components/photographers/turnstile";
import { ApiError, submitPhotographerApplication } from "@/lib/api";
import { PHOTOGRAPHER_FREQUENCIES } from "@/lib/content";

interface Values {
  name: string;
  email: string;
  phone: string;
  portfolio: string;
  frequency: string;
}

type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", phone: "", portfolio: "", frequency: "" };

const INPUT =
  "h-[52px] w-full rounded-xl border bg-white px-4 text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-crimson focus:ring-2 focus:ring-crimson/15";

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Enter your full name or photography business name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = "Enter a valid email address, like name@studio.com.";
  if (v.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a phone number with at least 10 digits.";
  if (v.portfolio.trim() && v.portfolio.trim().length < 3) e.portfolio = "Enter a full website link or Instagram handle.";
  if (!v.frequency) e.frequency = "Choose how often you plan to use the studio.";
  return e;
}

export function PhotographerApplication() {
  const [form, setForm] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  // State updates are async, so a fast double-click could slip past
  // `submitting`. The ref blocks a second request synchronously.
  const inFlight = useRef(false);

  // Anti-spam signals the backend's inquiry guard checks: a hidden honeypot,
  // how long the form was open, and a Cloudflare Turnstile token. The start
  // time is stamped on mount (not during render) to keep render pure.
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [company, setCompany] = useState("");
  const [token, setToken] = useState("");
  const [challengeKey, setChallengeKey] = useState(0);
  const freshChallenge = () => {
    setToken("");
    setChallengeKey((k) => k + 1); // remount the widget: tokens are single-use
  };

  const set = (key: keyof Values) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formEl = e.currentTarget; // currentTarget is null after an await
    if (inFlight.current || done) return;

    if (turnstileConfigured && !token) {
      setSubmitError("Please wait for the security check to finish, then submit again.");
      return;
    }

    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      formEl.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await submitPhotographerApplication({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        portfolio: form.portfolio.trim(),
        frequency: form.frequency,
        guard: { company, elapsedMs: Date.now() - startedAt.current, turnstileToken: token },
      });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        // The server couldn't verify the email — show it next to the field.
        setErrors((prev) => ({ ...prev, email: err.message }));
        formEl.querySelector<HTMLElement>('[name="email"]')?.focus();
      } else {
        setSubmitError(err instanceof ApiError ? err.message : "Your application wasn't sent. Check your connection and try again.");
      }
      inFlight.current = false;
      freshChallenge();
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center gap-4 rounded-[28px] border border-line bg-white px-5 py-12 text-center shadow-[0_30px_80px_-50px_rgba(74,31,46,0.45)] sm:px-10">
        <div aria-hidden className="flex size-16 animate-pop items-center justify-center rounded-full bg-crimson text-[28px] text-cream">
          ✓
        </div>
        <h3 className="m-0 font-display text-[30px] leading-tight text-ink">Application submitted</h3>
        <p className="m-0 max-w-sm text-[16px] leading-relaxed text-muted">
          Thank you, {form.name.trim().split(" ")[0]}. We&apos;ll review your application and email {form.email.trim()} about access to the photographer rate.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={submitting}
      className="flex flex-col gap-5 rounded-[28px] border border-line bg-white p-5 shadow-[0_30px_80px_-50px_rgba(74,31,46,0.45)] sm:p-9"
    >
      <Field id="app-name" label="Full name / photography business name" error={errors.name}>
        <input
          id="app-name"
          name="name"
          type="text"
          autoComplete="organization"
          required
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "app-name-error" : undefined}
          value={form.name}
          onChange={(e) => set("name")(e.target.value)}
          className={clsx(INPUT, errors.name ? "border-crimson" : "border-line")}
        />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field id="app-email" label="Email address" error={errors.email}>
          <input
            id="app-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="name@studio.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "app-email-error" : undefined}
            value={form.email}
            onChange={(e) => set("email")(e.target.value)}
            className={clsx(INPUT, errors.email ? "border-crimson" : "border-line")}
          />
        </Field>
        <Field id="app-phone" label="Phone number" error={errors.phone}>
          <input
            id="app-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="(973) 555-0123"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "app-phone-error" : undefined}
            value={form.phone}
            onChange={(e) => set("phone")(e.target.value)}
            className={clsx(INPUT, errors.phone ? "border-crimson" : "border-line")}
          />
        </Field>
      </div>

      <Field id="app-portfolio" label="Website, Instagram, or photography portfolio" optional error={errors.portfolio}>
        <input
          id="app-portfolio"
          name="portfolio"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourstudio.com or @handle"
          aria-invalid={!!errors.portfolio}
          aria-describedby={errors.portfolio ? "app-portfolio-error" : undefined}
          value={form.portfolio}
          onChange={(e) => set("portfolio")(e.target.value)}
          className={clsx(INPUT, errors.portfolio ? "border-crimson" : "border-line")}
        />
      </Field>

      <fieldset className="m-0 border-0 p-0" aria-describedby={errors.frequency ? "app-frequency-error" : undefined}>
        <legend className="mb-2 block text-[14px] font-medium text-bark">How frequently do you plan to use our holiday studio?</legend>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PHOTOGRAPHER_FREQUENCIES.map((option) => {
            const checked = form.frequency === option;
            return (
              <label
                key={option}
                className={clsx(
                  "flex min-h-[52px] cursor-pointer items-center gap-3 rounded-xl border px-4 text-[15px] transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-crimson/30",
                  checked ? "border-crimson bg-sand/60 text-ink" : errors.frequency ? "border-crimson/60 bg-white text-bark" : "border-line bg-white text-bark hover:border-crimson/50",
                )}
              >
                <input
                  type="radio"
                  name="frequency"
                  value={option}
                  checked={checked}
                  onChange={() => set("frequency")(option)}
                  className="size-4 accent-crimson"
                />
                {option}
              </label>
            );
          })}
        </div>
        {errors.frequency ? (
          <p id="app-frequency-error" className="m-0 mt-1.5 text-[13px] text-crimson">
            {errors.frequency}
          </p>
        ) : null}
      </fieldset>

      {/* Honeypot: off-screen, skipped by keyboard and autofill; bots fill it. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </label>
      </div>

      <Turnstile key={challengeKey} onVerify={setToken} />

      {submitError ? (
        <div role="alert" className="rounded-xl border border-crimson/40 bg-sand/50 px-4 py-3 text-[14px] text-crimson">
          {submitError}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting || (turnstileConfigured && !token)}
        className="mt-1 inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-full bg-crimson px-5 text-[15px] font-semibold text-cream transition-colors hover:bg-velvet disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
            Submitting application…
          </>
        ) : (
          "Submit Partner Application"
        )}
      </button>
      <p className="m-0 text-center text-[13px] text-muted">We review every application and reply by email.</p>
    </form>
  );
}

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[14px] font-medium text-bark">
        {label}
        {optional ? <span className="ml-1.5 font-normal text-muted">(optional)</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="m-0 mt-1.5 text-[13px] text-crimson">
          {error}
        </p>
      ) : null}
    </div>
  );
}
