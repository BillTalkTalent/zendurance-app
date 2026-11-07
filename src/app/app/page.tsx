"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Eyebrow, ProgressBar } from "@/components/ui";
import { ChevronRight } from "@/components/icons";
import { InstallTip } from "@/components/InstallGuide";
import { fmtDay, fmtSession, greeting } from "@/lib/dates";
import { intensiveProgress, practicesDoneToday, todaysCheckin } from "@/lib/derive";
import { newId, update, useLoadedState } from "@/lib/store";

export default function TodayPage() {
  const s = useLoadedState();
  const me = s.me;
  const checkedIn = !!todaysCheckin(me);
  const prog = intensiveProgress(s);
  const nextMilestone = prog.milestones.find((m) => !m.passed);
  const [draft, setDraft] = useState("");
  const [videoNote, setVideoNote] = useState(false);

  function addAgenda() {
    const text = draft.trim();
    if (!text) return;
    update((st) => ({ ...st, me: { ...st.me, agenda: [...st.me.agenda, { id: newId("a"), text, done: false }] } }));
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-3.5">
      <header className="pt-1.5">
        <h1 className="font-serif text-[32px] leading-tight font-normal tracking-[-0.01em]">
          {greeting()}, {me.first}
        </h1>
        <p className="mt-1 text-[15px] text-muted">This is your space. Set the weight down.</p>
      </header>

      <InstallTip />

      <section className="flex flex-col gap-1.5 rounded-[18px] bg-pine p-[18px] text-white">
        <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">Next session</span>
        <span className="font-serif text-2xl">{fmtSession(me.nextSession)}</span>
        <span className="text-sm text-mist">Telehealth with Meghan</span>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setVideoNote(true)}
            className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-white text-[15px] font-bold text-pine"
          >
            Join video
          </button>
          <a
            href="https://api.portal.therapyappointment.com/n/public/clientRegistration?therapistId=D924F5FC70B841BEBC1A0A031C487116"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 flex-1 items-center justify-center rounded-full border-[1.5px] border-sage text-[15px] font-semibold text-white no-underline"
          >
            Reschedule
          </a>
        </div>
        {videoNote ? (
          <p className="text-[13px] text-mist" role="status">
            In the live app this opens Meghan&apos;s secure telehealth room.
          </p>
        ) : null}
      </section>

      {checkedIn ? (
        <div className="flex flex-col gap-0.5 rounded-[18px] bg-mist px-[18px] py-4">
          <span className="text-base font-bold">Check-in saved</span>
          <span className="text-sm text-body">Meghan will see your trend before your next session.</span>
        </div>
      ) : (
        <Link
          href="/app/check-in"
          className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white px-[18px] py-4 text-ink no-underline"
        >
          <span className="flex flex-col gap-0.5">
            <span className="text-base font-bold">Today&apos;s check-in</span>
            <span className="text-sm text-muted">30 seconds: mood, stress, sleep, energy</span>
          </span>
          <span className="text-sm font-bold text-pine">Start</span>
        </Link>
      )}

      {me.takeaways ? (
        <Card className="flex flex-col gap-2.5">
          <Eyebrow>From our last session · {fmtDay(me.takeaways.at)}</Eyebrow>
          <div className="flex flex-col gap-2 text-[15px] leading-relaxed">
            {me.takeaways.items.map((t, i) => (
              <p key={i}>{t}</p>
            ))}
          </div>
          {me.takeaways.practice ? (
            <div className="flex flex-col gap-0.5 rounded-xl bg-paper px-3.5 py-3">
              <span className="text-[13px] font-bold text-pine">Practice this week</span>
              <span className="text-sm">{me.takeaways.practice}</span>
            </div>
          ) : null}
          <span className="text-[13px] text-muted">— Meghan</span>
        </Card>
      ) : null}

      <Link
        href="/app/intensive"
        className="flex flex-col gap-2.5 rounded-[18px] border border-line bg-white p-[18px] text-ink no-underline"
      >
        <span className="flex w-full justify-between">
          <span className="text-base font-bold">Intensive integration</span>
          <span className="text-sm font-bold text-pine">
            Day {prog.day} of {prog.length}
          </span>
        </span>
        <ProgressBar pct={prog.pct} label="Integration progress" />
        <span className="text-sm text-muted">
          {practicesDoneToday(s)} of {s.intensive.practices.length} practices done today
          {nextMilestone ? ` · ${nextMilestone.label} on ${nextMilestone.date}` : ""}
        </span>
      </Link>

      <Link
        href="/app/ketamine"
        className="flex items-center justify-between gap-3 rounded-[18px] border border-line bg-white px-[18px] py-4 text-ink no-underline"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-base font-bold">Ketamine-assisted therapy</span>
          <span className="text-sm text-muted">
            Session {s.ketamine.sessionNumber} of {s.ketamine.sessionCount} · {fmtSession(s.ketamine.sessionAt)}
          </span>
        </span>
        <ChevronRight className="text-pine" />
      </Link>

      <Card className="flex flex-col gap-2.5">
        <h2 className="text-base font-bold">Bring to next session</h2>
        <p className="text-sm text-muted">Jot it down when it comes up, so it doesn&apos;t get lost.</p>
        {me.agenda.length ? (
          <ul className="flex flex-col gap-2">
            {me.agenda.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-[15px] leading-snug">
                <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${a.done ? "bg-sage-mid" : "bg-pine"}`} />
                <span className={a.done ? "text-muted line-through" : ""}>{a.text}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addAgenda();
          }}
        >
          <label htmlFor="agenda" className="sr-only">
            Add a topic
          </label>
          <input
            id="agenda"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a topic…"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-line-strong bg-paper px-3 text-[15px]"
          />
          <Button type="submit">Add</Button>
        </form>
      </Card>
    </div>
  );
}
