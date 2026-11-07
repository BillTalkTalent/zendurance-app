"use client";

import { useEffect, useRef, useState } from "react";
import { Button, Notice, PageTitle } from "@/components/ui";
import { fmtStamp } from "@/lib/dates";
import { newId, update, useLoadedState } from "@/lib/store";

export default function MessagesPage() {
  const s = useLoadedState();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const msgs = s.me.messages;

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [msgs.length]);

  function send() {
    const t = draft.trim();
    if (!t) return;
    update((st) => ({
      ...st,
      me: { ...st.me, messages: [...st.me.messages, { id: newId("m"), from: "client", text: t, at: new Date().toISOString() }] },
    }));
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3">
      <PageTitle title="Meghan" sub="Secure messaging" />
      <Notice>
        Meghan replies within one business day. Messages aren&apos;t monitored around the clock. In a crisis, call or text 988, or
        911 for immediate danger.
      </Notice>

      <ol className="flex flex-col gap-3" aria-label="Conversation">
        {msgs.map((m) => {
          const mine = m.from === "client";
          return (
            <li key={m.id} className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-3 text-[15px] leading-relaxed ${
                  mine ? "bg-pine text-white" : "border border-line bg-white text-ink"
                }`}
              >
                {m.text}
              </div>
              <span className="text-xs text-muted">
                {mine ? "You" : "Meghan"} · {fmtStamp(m.at)}
              </span>
            </li>
          );
        })}
      </ol>
      <div ref={endRef} />

      <form
        className="mt-1.5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="msg" className="sr-only">
          Message Meghan
        </label>
        <input
          id="msg"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message Meghan…"
          className="min-h-12 min-w-0 flex-1 rounded-full border border-line-strong bg-white px-4 text-[15px]"
        />
        <Button type="submit" className="min-h-12">
          Send
        </Button>
      </form>
    </div>
  );
}
