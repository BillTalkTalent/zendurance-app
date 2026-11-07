"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { DemoSwitch } from "./DemoSwitch";
import { HelpSheet } from "./HelpSheet";
import { BookIcon, ChatIcon, LibraryIcon, PulseIcon, SunIcon } from "./icons";
import { StoreGate } from "./StoreGate";
import { cx } from "./ui";

const tabs = [
  { href: "/app", label: "Today", Icon: SunIcon, match: ["/app", "/app/intensive", "/app/ketamine"] },
  { href: "/app/check-in", label: "Check-in", Icon: PulseIcon },
  { href: "/app/journal", label: "Journal", Icon: BookIcon },
  { href: "/app/messages", label: "Messages", Icon: ChatIcon },
  { href: "/app/library", label: "Library", Icon: LibraryIcon },
];

export function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);
  const isKetamine = pathname.startsWith("/app/ketamine");

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-paper">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-paper/95 px-5 pt-[max(18px,env(safe-area-inset-top))] pb-3 backdrop-blur">
        <Link href="/app" className="flex flex-col gap-1" aria-label="Zendurance Wellness, Today">
          <Image src="/logo.png" alt="" width={150} height={33} priority />
          <span className="text-xs text-muted">Private &amp; encrypted · Demo</span>
        </Link>
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="min-h-11 rounded-full border-[1.5px] border-alert bg-white px-3.5 text-sm font-semibold text-alert"
        >
          Need help now
        </button>
      </header>

      <main className="flex flex-1 flex-col px-5 pt-1 pb-40">
        <StoreGate>{children}</StoreGate>
      </main>

      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-10 mx-auto grid w-full max-w-md grid-cols-5 border-t border-line bg-white px-1 pt-1.5 pb-[max(18px,env(safe-area-inset-bottom))]"
      >
        {tabs.map(({ href, label, Icon, match }) => {
          const active = match ? match.includes(pathname) : pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs no-underline",
                active ? "font-bold text-pine" : "font-medium text-muted",
              )}
            >
              <Icon />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sits just above the tab bar, aligned to the app column on wide screens. */}
      <DemoSwitch
        to="practitioner"
        style={{
          right: "max(12px, calc(50% - 224px + 12px))",
          bottom: "calc(max(18px, env(safe-area-inset-bottom)) + 70px)",
        }}
      />

      <HelpSheet open={helpOpen} onClose={() => setHelpOpen(false)} withProvider={isKetamine} />
    </div>
  );
}
