"use client";

/**
 * Last-resort fallback for an error in the root layout itself. It replaces the whole document,
 * so it carries its own minimal styles and contact details instead of relying on the site CSS.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Georgia, serif", background: "#faf7f2", color: "#1a1212" }}>
        <main id="main" style={{ maxWidth: 640, margin: "0 auto", padding: "96px 24px" }}>
          <p style={{ margin: 0, fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: "#cf1a21" }}>Something went wrong</p>
          <h1 style={{ margin: "16px 0", fontSize: 40, lineHeight: 1.1 }}>We hit a snag on set.</h1>
          <p style={{ fontSize: 19, lineHeight: 1.6 }}>
            The page did not load as expected. Please try again, or contact The Selfie Studio Experience at{" "}
            <a href="tel:9736958381" style={{ color: "#cf1a21" }}>
              973-695-8381
            </a>{" "}
            or{" "}
            <a href="mailto:info@theselfiestudioexperience.com" style={{ color: "#cf1a21" }}>
              info@theselfiestudioexperience.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: 16, padding: "16px 32px", background: "#cf1a21", color: "#fff", border: 0, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
