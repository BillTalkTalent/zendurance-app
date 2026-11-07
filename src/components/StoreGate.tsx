"use client";

import type { ReactNode } from "react";
import { useAppState } from "@/lib/store";

/** Renders children only once the on-device demo data has loaded. */
export function StoreGate({ children }: { children: ReactNode }) {
  const state = useAppState();
  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted" aria-busy="true">
        Opening your space…
      </div>
    );
  }
  return <>{children}</>;
}
