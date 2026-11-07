"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { CheckIcon } from "./icons";

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-[18px] border border-line bg-white p-[18px]", className)}>
      {children}
    </section>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("text-xs font-semibold uppercase tracking-[0.08em] text-muted", className)}>
      {children}
    </span>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="pt-1.5">
      <h1 className="font-serif text-[32px] leading-tight font-normal tracking-[-0.01em]">{title}</h1>
      {sub ? <p className="mt-1 text-[15px] text-muted">{sub}</p> : null}
    </header>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "danger-outline";
  size?: "md" | "lg";
};

export function Button({ variant = "primary", size = "md", className, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors",
        size === "lg" ? "min-h-[52px] px-6 text-base" : "min-h-11 px-4 text-[15px]",
        variant === "primary" && "bg-pine text-white hover:bg-pine-dark disabled:bg-[#B9B6AC]",
        variant === "outline" && "border-[1.5px] border-line-strong bg-white text-ink hover:border-pine",
        variant === "ghost" && "bg-transparent text-pine",
        variant === "danger-outline" && "border-[1.5px] border-alert bg-white text-alert",
        className,
      )}
    />
  );
}

/** A selectable pill. Use aria-pressed so screen readers announce the state. */
export function Pill({
  selected,
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { selected: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      {...rest}
      className={cx(
        "rounded-full border-[1.5px] font-semibold",
        selected ? "border-pine bg-pine text-white" : "border-line-strong bg-white text-ink",
        className,
      )}
    />
  );
}

export function CheckRow({
  checked,
  onToggle,
  label,
  sub,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  sub?: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex min-h-[52px] w-full items-center gap-3 text-left"
    >
      <span
        className={cx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border-2 border-pine",
          checked ? "bg-pine text-white" : "bg-white text-transparent",
        )}
      >
        <CheckIcon size={14} />
      </span>
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{label}</span>
        {sub ? <span className="text-[13px] text-muted">{sub}</span> : null}
      </span>
    </button>
  );
}

export function ShareToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-11 items-center gap-2.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-pine"
      />
      <span>{label}</span>
    </label>
  );
}

export function ProgressBar({ pct, track = "bg-mist", fill = "bg-pine", label }: { pct: number; track?: string; fill?: string; label: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx("h-2 w-full rounded", track)}
    >
      <div className={cx("h-2 rounded", fill)} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  );
}

export function Notice({ children, tone = "warn" }: { children: ReactNode; tone?: "warn" | "calm" }) {
  return (
    <div
      className={cx(
        "rounded-[14px] px-3.5 py-3 text-sm leading-relaxed",
        tone === "warn" ? "bg-warn-bg text-warn-ink" : "bg-mist text-body",
      )}
    >
      {children}
    </div>
  );
}
