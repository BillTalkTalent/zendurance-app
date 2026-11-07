"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertIcon, CheckIcon, LockIcon } from "@/components/icons";
import { StoreGate } from "@/components/StoreGate";
import { Button, Card, Pill, cx } from "@/components/ui";
import { fmtDay, fmtMonthDay, fmtSession, fmtShortSession, fmtStamp } from "@/lib/dates";
import { METRICS, allClients, flagFor, lastDays, unreadForMeghan, updateClient } from "@/lib/derive";
import { newId, resetDemo, update, useLoadedState } from "@/lib/store";
import type { ClientRecord, MetricKey } from "@/lib/types";

const FILTERS = ["All", "Needs attention", "Intensive", "Coaching", "Therapy"] as const;
type Filter = (typeof FILTERS)[number];

export default function PractitionerPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-white px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Zendurance Wellness" width={180} height={39} priority />
          <span className="border-l border-line-strong pl-3 text-sm text-muted">Practitioner</span>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <LockIcon size={16} /> Demo · data stays on this device
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-[13px] font-bold text-pine">MF</span>
            Meghan Fanning
          </span>
        </div>
      </header>
      <StoreGate>
        <Dashboard />
      </StoreGate>
    </div>
  );
}

function Dashboard() {
  const s = useLoadedState();
  const clients = allClients(s);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedId, setSelectedId] = useState(clients[0].id);
  const sel = clients.find((c) => c.id === selectedId) ?? clients[0];

  const list = clients.filter((c) =>
    filter === "All" ? true : filter === "Needs attention" ? !!flagFor(c) : c.group === filter,
  );
  const attention = clients.filter((c) => flagFor(c)).length;

  return (
    <div className="flex flex-wrap items-start gap-5 px-6 pt-5 pb-8">
      <aside className="flex max-w-full flex-[1_1_260px] flex-col gap-3" aria-label="Clients">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-[26px] font-normal">Clients</h1>
          <span className="text-[13px] text-muted">{attention} need attention</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <Pill key={f} selected={filter === f} onClick={() => setFilter(f)} className="min-h-9 px-3 text-[13px]">
              {f}
            </Pill>
          ))}
        </div>
        <ul className="flex flex-col gap-2">
          {list.map((c) => {
            const flag = flagFor(c);
            const on = c.id === sel.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  aria-current={on ? "true" : undefined}
                  className={cx(
                    "flex min-h-16 w-full flex-col gap-1 rounded-[14px] border-[1.5px] px-3.5 py-3 text-left",
                    on ? "border-pine bg-mist" : "border-line bg-white",
                  )}
                >
                  <span className="flex w-full justify-between gap-2">
                    <span className="text-[15px] font-bold">{c.name}</span>
                    <span className="text-xs text-muted">{fmtShortSession(c.nextSession)}</span>
                  </span>
                  <span className="text-[13px] text-muted">{c.service}</span>
                  {flag ? (
                    <span className="flex items-center gap-1.5 text-[13px] font-semibold text-flag">
                      <span className="h-2 w-2 rounded-full bg-flag-dot" />
                      {flag.title}
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
          {!list.length ? <li className="text-sm text-muted">No clients match this filter.</li> : null}
        </ul>
        <button
          type="button"
          onClick={() => {
            if (confirm("Reset all demo data on this device back to the sample clients?")) resetDemo();
          }}
          className="mt-2 self-start text-[13px] text-muted underline"
        >
          Reset demo data
        </button>
      </aside>

      <ClientDetail key={sel.id} c={sel} />
    </div>
  );
}

function ClientDetail({ c }: { c: ClientRecord }) {
  const s = useLoadedState();
  const flag = flagFor(c);
  const isMe = c.id === s.me.id;

  return (
    <div className="flex min-w-0 flex-[999_1_560px] flex-col gap-4">
      <Card className="flex flex-wrap items-center justify-between gap-4 px-5">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-[30px] font-normal tracking-[-0.01em]">{c.name}</h2>
          <span className="text-sm text-muted">
            {c.service} · {c.about}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-sm text-body">
            Next: <strong>{fmtSession(c.nextSession)}</strong>
          </span>
          <Button className="text-sm">Start session</Button>
          <a
            href="https://api.portal.therapyappointment.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center rounded-full border-[1.5px] border-line-strong bg-white px-4 text-sm font-semibold text-ink no-underline"
          >
            Open chart in TherapyAppointment
          </a>
        </div>
      </Card>

      {flag ? (
        <div className="flex items-center gap-2.5 rounded-[14px] bg-warn-bg px-4 py-3 text-sm text-warn-ink">
          <AlertIcon size={18} className="shrink-0 text-flag" />
          <span>
            <strong>{flag.title}.</strong> {flag.detail}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
        <Trends c={c} />
        <SharedJournal c={c} />
        {isMe && s.ketamine.shareIntention && s.ketamine.intention.trim() ? (
          <Card className="flex flex-col gap-2 px-5">
            <h3 className="text-base font-bold">Ketamine session intention</h3>
            <span className="text-[13px] text-muted">
              Session {s.ketamine.sessionNumber} of {s.ketamine.sessionCount} · {fmtSession(s.ketamine.sessionAt)}
              {s.ketamine.feeling ? ` · Feeling: ${s.ketamine.feeling}` : ""}
            </span>
            <p className="font-serif text-xl leading-snug italic">“{s.ketamine.intention.trim()}”</p>
            <span className="text-[13px] text-muted">
              Prep checklist: {s.ketamine.prep.filter((p) => p.done).length} of {s.ketamine.prep.length} done
            </span>
          </Card>
        ) : null}
        <Agenda c={c} />
        <Messages c={c} />
      </div>

      <PostSession c={c} />
    </div>
  );
}

function Trends({ c }: { c: ClientRecord }) {
  const [metric, setMetric] = useState<MetricKey>("stress");
  const days = lastDays(c, 14);
  const def = METRICS.find((m) => m.key === metric)!;
  const vals = days.map((d) => d.checkin?.[metric] ?? null);
  const logged = vals.filter((v): v is number => v != null);
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const w1 = vals.slice(0, 7).filter((v): v is number => v != null);
  const w2 = vals.slice(7).filter((v): v is number => v != null);
  const change = w1.length && w2.length ? mean(w2) - mean(w1) : null;

  return (
    <Card className="flex flex-col gap-3.5 px-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-bold">Check-ins, last 14 days</h3>
        <span className="text-[13px] text-muted">{logged.length} of 14 days logged</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {METRICS.map((m) => (
          <Pill key={m.key} selected={metric === m.key} onClick={() => setMetric(m.key)} className="min-h-9 rounded-[10px] px-3 text-[13px]">
            {m.label}
          </Pill>
        ))}
      </div>
      <div
        className="flex h-[120px] items-end gap-1 border-b border-line"
        role="img"
        aria-label={`${def.label} over 14 days: ${vals.map((v) => v ?? "no check-in").join(", ")}`}
      >
        {days.map((d, i) => {
          const v = vals[i];
          return (
            <span
              key={d.date}
              title={`${fmtMonthDay(d.date + "T12:00:00")}: ${v ?? "no check-in"}`}
              className={cx("block flex-1 rounded-t", v == null ? "bg-line" : i === days.length - 1 ? "bg-pine" : "bg-sage-mid")}
              style={{ height: v == null ? 3 : v * 22 }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-muted">
        <span>{fmtMonthDay(days[0].date + "T12:00:00")}</span>
        <span>
          1 = {def.lo.toLowerCase()} · 5 = {def.hi.toLowerCase()}
        </span>
        <span>Today</span>
      </div>
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-paper p-2.5 text-center">
        <Stat value={logged.length ? mean(logged).toFixed(1) : "—"} label="14-day avg" />
        <Stat value={logged.length ? String(logged.at(-1)) : "—"} label="Latest" />
        <Stat value={change == null ? "—" : `${change > 0 ? "+" : ""}${change.toFixed(1)}`} label="vs. first week" />
      </div>
    </Card>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}

function SharedJournal({ c }: { c: ClientRecord }) {
  const shared = c.journal.filter((j) => j.shared).sort((a, b) => b.at.localeCompare(a.at));
  const label = (src: string, phase?: string) =>
    src === "ketamine" ? ` · Ketamine integration${phase ? `, ${phase}` : ""}` : src === "intensive" ? " · Intensive" : "";

  return (
    <Card className="flex flex-col gap-3 px-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold">Shared journal entries</h3>
        <span className="text-[13px] text-muted">
          Only entries {c.first} chose to share. Private entries never appear here.
        </span>
      </div>
      <div className="flex max-h-[300px] flex-col overflow-y-auto">
        {shared.map((j) => (
          <article key={j.id} className="flex flex-col gap-1 border-t border-line py-2.5">
            <span className="text-[13px] font-bold">
              {fmtDay(j.at)}
              <span className="font-normal text-muted">{label(j.source, j.phase)}</span>
            </span>
            <p className="text-[15px] leading-relaxed whitespace-pre-line">
              {j.voiceSeconds ? `Voice note · 0:${String(j.voiceSeconds).padStart(2, "0")} (demo, no audio saved)` : j.text}
            </p>
          </article>
        ))}
        {!shared.length ? <span className="text-sm text-muted">Nothing shared since the last session.</span> : null}
      </div>
    </Card>
  );
}

function Agenda({ c }: { c: ClientRecord }) {
  function toggle(id: string) {
    update((st) =>
      updateClient(st, c.id, (cc) => ({ ...cc, agenda: cc.agenda.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) })),
    );
  }
  return (
    <Card className="flex flex-col gap-2 px-5">
      <h3 className="text-base font-bold">{c.first} wants to bring up</h3>
      {c.agenda.map((a) => (
        <button
          key={a.id}
          type="button"
          role="checkbox"
          aria-checked={a.done}
          onClick={() => toggle(a.id)}
          className="flex min-h-11 items-center gap-3 text-left text-[15px]"
        >
          <span
            className={cx(
              "flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border-2 border-pine",
              a.done ? "bg-pine text-white" : "bg-white text-transparent",
            )}
          >
            <CheckIcon size={13} />
          </span>
          <span className={a.done ? "text-muted line-through" : ""}>{a.text}</span>
        </button>
      ))}
      {!c.agenda.length ? <span className="text-sm text-muted">Nothing added yet.</span> : null}
      <span className="text-[13px] text-muted">Check items off as you cover them in session.</span>
    </Card>
  );
}

function Messages({ c }: { c: ClientRecord }) {
  const [reply, setReply] = useState("");
  const unread = unreadForMeghan(c);

  // Opening a client's thread marks it read.
  useEffect(() => {
    if (unread > 0) {
      const t = setTimeout(() => {
        update((st) => updateClient(st, c.id, (cc) => ({ ...cc, meghanReadAt: new Date().toISOString() })));
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [c.id, unread]);

  function send() {
    const t = reply.trim();
    if (!t) return;
    const now = new Date().toISOString();
    update((st) =>
      updateClient(st, c.id, (cc) => ({
        ...cc,
        messages: [...cc.messages, { id: newId("m"), from: "meghan", text: t, at: now }],
        meghanReadAt: now,
      })),
    );
    setReply("");
  }

  return (
    <Card className="flex flex-col gap-2.5 px-5">
      <div className="flex items-baseline justify-between">
        <h3 className="text-base font-bold">Messages</h3>
        <span className="text-[13px] text-muted">Reply within 1 business day</span>
      </div>
      <ol className="flex max-h-[260px] flex-col gap-2 overflow-y-auto">
        {c.messages.map((m) => {
          const mine = m.from === "meghan";
          return (
            <li key={m.id} className={cx("flex flex-col gap-0.5", mine ? "items-end" : "items-start")}>
              <div className={cx("max-w-[85%] rounded-[14px] px-3 py-2.5 text-sm leading-relaxed", mine ? "bg-pine text-white" : "bg-paper text-ink")}>
                {m.text}
              </div>
              <span className="text-xs text-muted">
                {mine ? "You" : c.first} · {fmtStamp(m.at)}
              </span>
            </li>
          );
        })}
        {!c.messages.length ? <li className="text-sm text-muted">No messages yet.</li> : null}
      </ol>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <label htmlFor="reply" className="sr-only">
          Reply to {c.first}
        </label>
        <input
          id="reply"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder={`Reply to ${c.first}…`}
          className="min-h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-paper px-3 text-sm"
        />
        <Button type="submit" className="text-sm">
          Send
        </Button>
      </form>
    </Card>
  );
}

function PostSession({ c }: { c: ClientRecord }) {
  const [takeaways, setTakeaways] = useState("");
  const [practice, setPractice] = useState("");
  const [justSent, setJustSent] = useState(false);
  const items = useMemo(
    () => takeaways.split("\n").map((t) => t.trim()).filter(Boolean),
    [takeaways],
  );

  function post() {
    if (!items.length && !practice.trim()) return;
    update((st) =>
      updateClient(st, c.id, (cc) => ({
        ...cc,
        takeaways: { at: new Date().toISOString(), items, practice: practice.trim() },
      })),
    );
    setTakeaways("");
    setPractice("");
    setJustSent(true);
  }

  return (
    <Card className="flex flex-col gap-3 px-5">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold">After the session: send to {c.first}&apos;s app</h3>
        <span className="text-[13px] text-muted">
          Shows on their Today screen as &quot;From our last session.&quot; Keep clinical notes in TherapyAppointment, not here.
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="take" className="text-[13px] font-semibold">
            Takeaways (one per line)
          </label>
          <textarea
            id="take"
            value={takeaways}
            onChange={(e) => setTakeaways(e.target.value)}
            placeholder="What you want them to remember…"
            className="min-h-24 resize-y rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-sm leading-relaxed"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="practice" className="text-[13px] font-semibold">
            Practice this week
          </label>
          <textarea
            id="practice"
            value={practice}
            onChange={(e) => setPractice(e.target.value)}
            placeholder="One small, doable thing…"
            className="min-h-24 resize-y rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-sm leading-relaxed"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <Button onClick={post} disabled={!items.length && !practice.trim()} className="text-sm">
          Send to {c.first}
        </Button>
        <span className="text-[13px] text-muted" aria-live="polite">
          {justSent
            ? c.id === "me"
              ? "Sent. Open the client app to see it on the Today screen."
              : "Sent."
            : c.takeaways
              ? `Last sent ${fmtDay(c.takeaways.at)}`
              : "Nothing sent yet"}
        </span>
        {justSent && c.id === "me" ? (
          <Link href="/app" className="text-[13px] font-semibold">
            Open client app
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
