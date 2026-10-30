import { clsx } from "clsx";

interface SectionHeadingProps {
  script: string;
  title: string;
  /** "light" for dark backgrounds. */
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
}

/** Eyebrow label over a bold Playfair heading — no cursive script font. */
export function SectionHeading({ script, title, tone = "dark", align = "left", className }: SectionHeadingProps) {
  return (
    <div className={clsx("flex flex-col gap-2", align === "center" && "items-center text-center", className)}>
      <span className={clsx("eyebrow", tone === "dark" ? "text-crimson" : "text-gold")}>{script}</span>
      <h2 className={clsx("m-0 font-display text-[clamp(32px,5vw,52px)] font-bold leading-[1.02]", tone === "light" ? "text-cream" : "text-ink")}>
        {title}
      </h2>
    </div>
  );
}
