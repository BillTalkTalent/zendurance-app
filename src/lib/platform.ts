"use client";

import { useEffect, useState } from "react";

export type Platform = "ios" | "ios-other-browser" | "android" | "desktop";

/** Chrome/Edge on Android fire this when the app can be installed with one tap. */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

// Capture the install prompt as soon as this module loads on the client: the
// browser fires it once, often before the install screen is open.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    promptListeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    promptListeners.forEach((l) => l());
  });
}

export function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  // iPadOS reports itself as a Mac; touch support gives it away.
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  if (isIOS) {
    // Chrome, Firefox and Edge on iOS identify themselves with these tokens.
    return /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua) ? "ios-other-browser" : "ios";
  }
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

export function isInstalled(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari's own flag for home-screen web apps
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Platform info, or null until mounted (keeps server and client markup identical). */
export function usePlatform() {
  const [info, setInfo] = useState<{ platform: Platform; installed: boolean } | null>(null);
  useEffect(() => {
    // Reading the user agent is only possible after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInfo({ platform: detectPlatform(), installed: isInstalled() });
  }, []);
  return info;
}

/** True when the browser offers a one-tap install (Android Chrome/Edge, desktop Chrome). */
export function useInstallPrompt() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const sync = () => setAvailable(deferredPrompt !== null);
    sync();
    promptListeners.add(sync);
    return () => {
      promptListeners.delete(sync);
    };
  }, []);

  async function install(): Promise<boolean> {
    if (!deferredPrompt) return false;
    const e = deferredPrompt;
    deferredPrompt = null;
    await e.prompt();
    const { outcome } = await e.userChoice;
    promptListeners.forEach((l) => l());
    return outcome === "accepted";
  }

  return { available, install };
}
