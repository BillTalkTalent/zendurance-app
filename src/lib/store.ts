"use client";

import { useSyncExternalStore } from "react";
import { seed } from "./seed";
import type { State } from "./types";

/**
 * Demo store: everything lives in this browser's localStorage only.
 * Nothing is sent to a server. Replace with a HIPAA-eligible backend
 * (with a signed BAA) before any real client data goes in.
 */
const KEY = "zendurance-demo-v1";

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as State;
      if (parsed?.version === 1) return parsed;
    }
  } catch {
    // Private mode or corrupted data: fall through to fresh sample data.
  }
  const fresh = seed();
  persist(fresh);
  return fresh;
}

function persist(s: State) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage unavailable: keep working in memory.
  }
}

function getSnapshot(): State | null {
  if (state === null && typeof window !== "undefined") state = load();
  return state;
}

function getServerSnapshot(): State | null {
  return null;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns null during server render and the first hydration pass. */
export function useAppState(): State | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Use inside <StoreGate>, where state is guaranteed to be loaded. */
export function useLoadedState(): State {
  const s = useAppState();
  if (!s) throw new Error("useLoadedState must be used inside <StoreGate>");
  return s;
}

export function update(fn: (s: State) => State) {
  const current = getSnapshot();
  if (!current) return;
  state = fn(current);
  persist(state);
  listeners.forEach((l) => l());
}

export function resetDemo() {
  state = seed();
  persist(state);
  listeners.forEach((l) => l());
}

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
