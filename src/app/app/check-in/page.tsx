"use client";

import { useState } from "react";
import { Button, Card, Notice, PageTitle, Pill } from "@/components/ui";
import { dayKey, weekdayLetter } from "@/lib/dates";
import { METRICS, lastDays, todaysCheckin } from "@/lib/derive";
import { update, useLoadedState } from "@/lib/store";
import type { Checkin, MetricKey } from "@/lib/types";

type Draft = Record<MetricKey, number | null>;

export default function CheckInPage() {
  const s = useLoadedState();
  const existing = todaysCheckin(s.me);
  const [editing, setEditing] = useState(!existing);
  const [draft, setDraft] = useState<Draft>(() => ({
    mood: existing?.mood ?? null,
    stress: existing?.stress ?? null,
    sleep: existing?.sleep ?? null,
    energy: existing?.energy ?? null,
  }));
  const complete = METRICS.every((m) => draft[m.key] != null);

  function save() {
    if (!complete) return;
    const entry = { date: dayKey(), ...(draft as Record<MetricKey, number>) } satisfies Checkin;
    update((st) => ({
      ...st,
      me: { ...st.me, checkins: [...st.me.checkins.filter((c) => c.date !== entry.date), entry] },
    }));
    setEditing(false);
  }

  return (
    <div className="flex flex-col gap-3.5">
      <PageTitle title="Check-in" sub="No right answers. Just notice where you are." />

      {editing ? (
        <>
          {METRICS.map((m) => (
            <Card key={m.key} className="flex flex-col gap-2.5 p-4">
              <fieldset className="flex flex-col gap-2.5">
                <legend className="mb-2.5 text-base font-bold">{m.label}</legend>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Pill
                      key={n}
                      selected={draft[m.key] === n}
                      onClick={() => setDraft((d) => ({ ...d, [m.key]: n }))}
                      aria-label={`${m.label} ${n} of 5`}
                      className="min-h-11 rounded-xl text-base"
                    >
                      {n}
                    </Pill>
                  ))}
                </div>
                <div className="flex justify-between text-[13px] text-muted">
                  <span>{m.lo}</span>
                  <span>{m.hi}</span>
                </div>
              </fieldset>
            </Card>
          ))}
          <Button size="lg" onClick={save} disabled={!complete}>
            {complete ? "Save check-in" : "Rate all four to save"}
          </Button>
        </>
      ) : (
        <Saved onEdit={() => setEditing(true)} />
      )}
    </div>
  );
}

function Saved({ onEdit }: { onEdit: () => void }) {
  const s = useLoadedState();
  const today = todaysCheckin(s.me)!;
  const week = lastDays(s.me, 7);
  const first = week.slice(0, 3).map((d) => d.checkin?.stress).filter((v): v is number => v != null);
  const avgEarly = first.length ? first.reduce((a, b) => a + b, 0) / first.length : null;
  const lower = avgEarly != null && today.stress < avgEarly;

  return (
    <>
      <Notice tone="calm">
        {lower
          ? "Saved. Your stress is lower than it was at the start of the week. That's worth noticing."
          : "Saved. Thank you for checking in. Meghan will see this before your next session."}
      </Notice>

      <Card className="flex flex-col gap-3.5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-bold">Stress, last 7 days</h2>
          <span className="text-[13px] text-muted">1 calm – 5 maxed</span>
        </div>
        <div className="grid h-[140px] grid-cols-7 items-end gap-2.5" role="img" aria-label={`Stress over the last 7 days: ${week.map((d) => d.checkin?.stress ?? "none").join(", ")}`}>
          {week.map((d, i) => {
            const v = d.checkin?.stress ?? 0;
            return (
              <div key={d.date} className="flex h-full flex-col items-center justify-end gap-1.5">
                <span className="text-xs font-semibold text-body">{v || "–"}</span>
                <span
                  className={`block w-full rounded-t-md ${i === 6 ? "bg-pine" : v ? "bg-sage-mid" : "bg-line"}`}
                  style={{ height: v ? v * 22 : 4 }}
                />
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-2.5 text-center text-xs text-muted" aria-hidden="true">
          {week.map((d) => (
            <span key={d.date}>{weekdayLetter(d.date)}</span>
          ))}
        </div>
      </Card>

      <Card className="grid grid-cols-3 gap-2 px-[18px] py-4 text-center">
        {(["mood", "sleep", "energy"] as const).map((k) => (
          <div key={k} className="flex flex-col gap-0.5">
            <span className="text-[22px] font-bold">{today[k]}</span>
            <span className="text-[13px] text-muted capitalize">{k}</span>
          </div>
        ))}
      </Card>

      <Button variant="outline" onClick={onEdit}>
        Edit today&apos;s check-in
      </Button>
    </>
  );
}
