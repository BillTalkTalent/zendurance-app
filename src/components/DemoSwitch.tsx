import Link from "next/link";
import type { CSSProperties } from "react";
import { cx } from "./ui";

/**
 * Demo-only shortcut between the client app and the practitioner view.
 * Hidden when NEXT_PUBLIC_DEMO_MODE is "off" (set that in Vercel once real accounts exist).
 */
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "off";

export function DemoSwitch({
  to,
  className,
  style,
}: {
  to: "client" | "practitioner";
  className?: string;
  style?: CSSProperties;
}) {
  if (!DEMO_MODE) return null;
  const href = to === "client" ? "/app" : "/practitioner";
  const label = to === "client" ? "Jordan's app" : "Meghan's view";

  return (
    <Link
      href={href}
      style={style}
      title="Demo only: switch between the client app and the practitioner view"
      className={cx(
        "fixed z-20 inline-flex min-h-9 items-center gap-1.5 rounded-full border-[1.5px] border-dashed border-pine-soft bg-paper/95 px-3 text-[13px] font-semibold text-pine no-underline shadow-sm backdrop-blur",
        className,
      )}
    >
      <span className="rounded-full bg-pine px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
        Demo
      </span>
      {label}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 7h11l-3-3M17 17H6l3 3" />
      </svg>
    </Link>
  );
}
