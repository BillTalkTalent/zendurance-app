"use client";

import Link from "next/link";
import QRCode from "qrcode";
import { useEffect, useState, type ReactNode } from "react";
import { CheckIcon } from "./icons";
import { Button, Notice, Pill, cx } from "./ui";
import { useInstallPrompt, usePlatform, type Platform } from "@/lib/platform";

type Tab = "iphone" | "android" | "computer";

const tabFor = (p: Platform): Tab => (p === "android" ? "android" : p === "desktop" ? "computer" : "iphone");

export function InstallGuide() {
  const info = usePlatform();
  const [picked, setPicked] = useState<Tab | null>(null);

  if (!info) {
    return <div className="py-10 text-center text-sm text-muted" aria-busy="true">Checking your device…</div>;
  }

  if (info.installed) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 rounded-[18px] bg-mist px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-pine text-white">
            <CheckIcon size={22} />
          </span>
          <h2 className="font-serif text-[26px]">You&apos;re all set</h2>
          <p className="text-[15px] leading-relaxed text-body">
            Zendurance is on your home screen. Open it from the icon any time.
          </p>
        </div>
        <Link
          href="/app"
          className="flex min-h-[52px] items-center justify-center rounded-full bg-pine font-semibold text-white no-underline"
        >
          Go to Today
        </Link>
      </div>
    );
  }

  const tab = picked ?? tabFor(info.platform);

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Device" className="grid grid-cols-3 gap-1 rounded-full bg-mist p-1">
        {(
          [
            ["iphone", "iPhone / iPad"],
            ["android", "Android"],
            ["computer", "Computer"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setPicked(id)}
            className={cx(
              "min-h-10 rounded-full text-sm font-semibold",
              tab === id ? "bg-white text-pine shadow-sm" : "text-body",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "iphone" ? <IPhone otherBrowser={info.platform === "ios-other-browser"} /> : null}
      {tab === "android" ? <Android /> : null}
      {tab === "computer" ? <Computer /> : null}

      <Notice tone="calm">
        Zendurance is private to you. Adding it to your home screen doesn&apos;t share anything, and you can remove it
        like any other app.
      </Notice>
    </div>
  );
}

function Steps({ children }: { children: ReactNode }) {
  return <ol className="flex flex-col gap-3">{children}</ol>;
}

function Step({ n, title, children, art }: { n: number; title: ReactNode; children?: ReactNode; art?: ReactNode }) {
  return (
    <li className="flex gap-3.5 rounded-[18px] border border-line bg-white p-4">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pine text-[15px] font-bold text-white"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-base leading-snug font-bold">{title}</span>
        {children ? <span className="text-sm leading-relaxed text-body">{children}</span> : null}
        {art ? <div className="mt-1.5">{art}</div> : null}
      </div>
    </li>
  );
}

/** A small drawing of the control to look for, so people can match it on screen. */
function Chip({ children, label }: { children: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-xl border border-line-strong bg-paper px-3 py-2 text-sm font-semibold text-ink">
      <span className="text-[#007AFF]" aria-hidden="true">
        {children}
      </span>
      {label}
    </span>
  );
}

const ShareGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3v12M8 7l4-4 4 4" />
    <path d="M6 11H5v10h14V11h-1" />
  </svg>
);
const MoreGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
const AddGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);
const KebabGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="12" cy="19" r="1.8" />
  </svg>
);

function IPhone({ otherBrowser }: { otherBrowser: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      {otherBrowser ? (
        <Notice>
          You&apos;re in a browser other than Safari. It may still work, but the steps are simplest in{" "}
          <strong>Safari</strong>: copy this page&apos;s link and open it there.
        </Notice>
      ) : null}
      <Steps>
        <Step
          n={1}
          title="Tap the Share button"
          art={
            <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <Chip label="Share">
                <ShareGlyph />
              </Chip>
              <span>or, on newer iPhones, tap</span>
              <Chip label="More">
                <MoreGlyph />
              </Chip>
              <span>first</span>
            </div>
          }
        >
          It&apos;s a square with an arrow pointing up, at the bottom of Safari (or next to the address bar).
        </Step>
        <Step
          n={2}
          title="Choose “Add to Home Screen”"
          art={
            <Chip label="Add to Home Screen">
              <AddGlyph />
            </Chip>
          }
        >
          Scroll down the list if you don&apos;t see it right away.
        </Step>
        <Step n={3} title="Keep “Open as Web App” on, then tap Add">
          If you see an <strong>Open as Web App</strong> switch, leave it on. Then tap <strong>Add</strong> in the top
          corner.
        </Step>
        <Step n={4} title="Open Zendurance from your home screen">
          Look for the green <strong>Z</strong> icon. From now on, open it from there rather than from Safari.
        </Step>
      </Steps>
    </div>
  );
}

function Android() {
  const { available, install } = useInstallPrompt();
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {available && !done ? (
        <div className="flex flex-col gap-2.5 rounded-[18px] bg-pine p-[18px] text-white">
          <span className="font-serif text-[22px]">One tap to install</span>
          <span className="text-sm text-mist">Your phone can add Zendurance directly.</span>
          <button
            type="button"
            onClick={async () => setDone(await install())}
            className="min-h-12 rounded-full bg-white font-bold text-pine"
          >
            Install Zendurance
          </button>
        </div>
      ) : null}
      {done ? (
        <Notice tone="calm">Installed. Look for the green Z icon on your home screen.</Notice>
      ) : null}
      <h2 className="text-sm font-semibold text-muted">{available ? "Or do it by hand:" : "In Chrome:"}</h2>
      <Steps>
        <Step
          n={1}
          title="Tap the menu"
          art={
            <Chip label="Menu">
              <KebabGlyph />
            </Chip>
          }
        >
          The three dots in the top-right corner of Chrome.
        </Step>
        <Step n={2} title="Tap “Add to Home screen” or “Install app”">
          The wording depends on your phone. Then confirm with <strong>Install</strong> or <strong>Add</strong>.
        </Step>
        <Step n={3} title="Open Zendurance from your home screen">
          Look for the green <strong>Z</strong> icon. From now on, open it from there.
        </Step>
      </Steps>
    </div>
  );
}

function Computer() {
  const [svg, setSvg] = useState<string | null>(null);
  // Only rendered after mount (InstallGuide waits for usePlatform), so window is available.
  const [url] = useState(() => `${window.location.origin}/install`);

  useEffect(() => {
    QRCode.toString(url, {
      type: "svg",
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#1B1F1D", light: "#FFFFFF" },
    }).then(setSvg, () => setSvg(null));
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="font-serif text-[26px] leading-tight">Scan with your phone&apos;s camera</h2>
      <p className="max-w-sm text-[15px] leading-relaxed text-body">
        Point your phone&apos;s camera at the code and tap the link that appears. Your phone will show the steps for
        your device.
      </p>
      <div className="rounded-[18px] border border-line bg-white p-4">
        {svg ? (
          <div
            role="img"
            aria-label={`QR code linking to ${url}`}
            className="h-56 w-56 [&>svg]:h-full [&>svg]:w-full"
            // Generated locally from our own URL by the qrcode library.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="h-56 w-56" aria-busy="true" />
        )}
      </div>
      {url ? (
        <p className="text-sm text-muted">
          Or type this on your phone: <span className="font-semibold break-all text-ink">{url}</span>
        </p>
      ) : null}
      <Pill selected={false} onClick={() => navigator.clipboard?.writeText(url)} className="min-h-11 px-4 text-sm">
        Copy link
      </Pill>
    </div>
  );
}

export function InstallTip() {
  const info = usePlatform();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(localStorage.getItem("zen-install-tip-dismissed") === "1");
    } catch {
      setHidden(false);
    }
  }, []);

  if (!info || info.installed || info.platform === "desktop" || hidden) return null;

  return (
    <div className="flex items-center gap-3 rounded-[18px] border border-line bg-white px-4 py-3.5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[15px] font-bold">Add Zendurance to your home screen</span>
        <span className="text-[13px] text-muted">So it&apos;s one tap away, like any app.</span>
      </div>
      <Link
        href="/install"
        className="inline-flex min-h-10 shrink-0 items-center rounded-full bg-pine px-4 text-sm font-semibold text-white no-underline"
      >
        Show me
      </Link>
      <Button
        variant="ghost"
        aria-label="Dismiss"
        className="min-h-10 shrink-0 px-2 text-muted"
        onClick={() => {
          try {
            localStorage.setItem("zen-install-tip-dismissed", "1");
          } catch {}
          setHidden(true);
        }}
      >
        ✕
      </Button>
    </div>
  );
}
