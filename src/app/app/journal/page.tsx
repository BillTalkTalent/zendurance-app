"use client";

import { useEffect, useState } from "react";
import { Button, Card, PageTitle, ShareToggle } from "@/components/ui";
import { fmtDay } from "@/lib/dates";
import { newId, update, useLoadedState } from "@/lib/store";
import type { JournalEntry } from "@/lib/types";

const PROMPTS = ["What am I carrying today?", "One thing I handled well", "What do I need right now?"];

const SOURCE_LABEL: Record<JournalEntry["source"], string> = {
  journal: "",
  intensive: "Intensive",
  ketamine: "Ketamine integration",
};

export default function JournalPage() {
  const s = useLoadedState();
  const [text, setText] = useState(() => {
    // Prefill handed over from another screen (e.g. the intensive reflection prompt).
    try {
      return sessionStorage.getItem("zen-journal-prefill") ?? "";
    } catch {
      return "";
    }
  });
  useEffect(() => {
    try {
      sessionStorage.removeItem("zen-journal-prefill");
    } catch {}
  }, []);
  const [share, setShare] = useState(true);
  const entries = [...s.me.journal].sort((a, b) => b.at.localeCompare(a.at));

  function save() {
    const t = text.trim();
    if (!t) return;
    const entry: JournalEntry = { id: newId("j"), at: new Date().toISOString(), text: t, shared: share, source: "journal" };
    update((st) => ({ ...st, me: { ...st.me, journal: [entry, ...st.me.journal] } }));
    setText("");
  }

  function toggleShared(id: string) {
    update((st) => ({
      ...st,
      me: { ...st.me, journal: st.me.journal.map((j) => (j.id === id ? { ...j, shared: !j.shared } : j)) },
    }));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <PageTitle title="Journal" sub="Private to you unless you choose to share." />

      <div className="flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setText(p + " ")}
            className="min-h-9 rounded-full border border-line-strong bg-white px-3 py-1.5 text-left text-[13px]"
          >
            {p}
          </button>
        ))}
      </div>

      <Card className="flex flex-col gap-3 p-3.5">
        <label htmlFor="journal" className="text-[13px] font-semibold text-muted">
          Today · {fmtDay(new Date().toISOString())}
        </label>
        <textarea
          id="journal"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Whatever's on your mind…"
          className="min-h-[140px] resize-none border-0 bg-transparent p-0 text-base leading-relaxed outline-none"
        />
        <div className="border-t border-line pt-2">
          <ShareToggle checked={share} onChange={setShare} label="Share with Meghan before our next session" />
        </div>
        <Button onClick={save} disabled={!text.trim()} className="min-h-12">
          Save entry
        </Button>
      </Card>

      {entries.length ? (
        <h2 className="mt-1 text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">Earlier</h2>
      ) : null}
      {entries.map((e) => (
        <Card key={e.id} className="flex flex-col gap-1.5 px-4 py-3.5">
          <div className="flex items-center justify-between gap-2 text-[13px]">
            <span className="font-bold">
              {fmtDay(e.at)}
              {SOURCE_LABEL[e.source] ? <span className="font-normal text-muted"> · {SOURCE_LABEL[e.source]}{e.phase ? `, ${e.phase}` : ""}</span> : null}
            </span>
            <button
              type="button"
              onClick={() => toggleShared(e.id)}
              className={`min-h-8 shrink-0 font-semibold ${e.shared ? "text-pine" : "text-muted"}`}
              aria-label={e.shared ? "Shared with Meghan. Tap to make private." : "Private. Tap to share with Meghan."}
            >
              {e.shared ? "Shared with Meghan" : "Private"}
            </button>
          </div>
          <p className="text-[15px] leading-relaxed whitespace-pre-line">
            {e.voiceSeconds ? `Voice note · 0:${String(e.voiceSeconds).padStart(2, "0")}` : e.text}
          </p>
        </Card>
      ))}
    </div>
  );
}
