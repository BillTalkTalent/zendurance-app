"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, MicIcon, PlayIcon } from "@/components/icons";
import { Button, Card, CheckRow, Eyebrow, Notice, Pill, ProgressBar, ShareToggle, cx } from "@/components/ui";
import { fmtSession } from "@/lib/dates";
import { newId, update, useLoadedState } from "@/lib/store";
import type { Feeling, JournalEntry, State } from "@/lib/types";

type Stage = "before" | "day" | "after";

const PHASES = [
  {
    label: "Day 1",
    hint: "Just notice",
    prompts: [
      "What images, words or feelings stayed with you?",
      "What did your body feel, during or after?",
      "Anything that felt important but hard to name?",
    ],
  },
  {
    label: "Day 3",
    hint: "Make meaning",
    prompts: [
      "What feels different now, even slightly?",
      "Did anything connect to your intention?",
      "What do you want to understand better?",
    ],
  },
  {
    label: "Week 1",
    hint: "Bring it into life",
    prompts: [
      "One small change you want to keep",
      "Where did the old pattern show up this week?",
      "What do you want to bring to Meghan?",
    ],
  },
];

const setK = (fn: (k: State["ketamine"]) => State["ketamine"]) =>
  update((st) => ({ ...st, ketamine: fn(st.ketamine) }));

export default function KetaminePage() {
  const s = useLoadedState();
  const k = s.ketamine;
  const [stage, setStage] = useState<Stage>("before");

  return (
    <div className="flex flex-col gap-3.5">
      <Link href="/app" className="-ml-1 flex min-h-11 items-center gap-1 self-start font-semibold text-pine no-underline">
        <ChevronLeft size={18} /> Today
      </Link>
      <header>
        <h1 className="font-serif text-[30px] leading-tight font-normal tracking-[-0.01em]">Ketamine-assisted therapy</h1>
        <p className="mt-1 text-sm text-muted">
          Session {k.sessionNumber} of {k.sessionCount} · {fmtSession(k.sessionAt)}
        </p>
      </header>

      <div role="tablist" aria-label="Stage" className="grid grid-cols-3 gap-1 rounded-full bg-mist p-1">
        {(
          [
            ["before", "Before"],
            ["day", "Day of"],
            ["after", "After"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={stage === id}
            onClick={() => setStage(id)}
            className={cx(
              "min-h-10 rounded-full text-sm font-semibold",
              stage === id ? "bg-white text-pine shadow-sm" : "text-body",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {stage === "before" ? <Before /> : null}
      {stage === "day" ? <DayOf onDone={() => setStage("after")} /> : null}
      {stage === "after" ? <After /> : null}
    </div>
  );
}

function Before() {
  const k = useLoadedState().ketamine;
  const done = k.prep.filter((p) => p.done).length;

  return (
    <>
      <section className="flex flex-col gap-2.5 rounded-[18px] bg-pine p-[18px] text-white">
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-[22px]">Getting ready</span>
          <span className="text-sm text-sage">
            {done} of {k.prep.length}
          </span>
        </div>
        <ProgressBar pct={(done / k.prep.length) * 100} track="bg-pine-soft" fill="bg-white" label="Preparation progress" />
        <span className="text-sm text-mist">Telehealth with Meghan and [prescribing provider]. MA clients only.</span>
      </section>

      <Card className="flex flex-col gap-0.5 px-[18px] py-4">
        <h2 className="mb-1.5 text-base font-bold">Preparation checklist</h2>
        {k.prep.map((p) => (
          <CheckRow
            key={p.id}
            checked={p.done}
            label={p.label}
            sub={p.sub}
            onToggle={() => setK((kk) => ({ ...kk, prep: kk.prep.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)) }))}
          />
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5 px-[18px] py-4">
        <Eyebrow>Your intention</Eyebrow>
        <label htmlFor="intention" className="font-serif text-xl leading-snug">
          What would you like to bring into this session?
        </label>
        <div className="flex flex-wrap gap-1.5">
          {["I want to understand…", "I'm ready to let go of…", "I want to feel…"].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setK((kk) => ({ ...kk, intention: p.replace("…", " ") }))}
              className="min-h-9 rounded-full border border-line-strong bg-paper px-3 py-1.5 text-[13px]"
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          id="intention"
          value={k.intention}
          onChange={(e) => setK((kk) => ({ ...kk, intention: e.target.value }))}
          placeholder="A word, a question, a feeling…"
          className="min-h-[88px] resize-none rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-[15px] leading-relaxed"
        />
        <ShareToggle
          checked={k.shareIntention}
          onChange={(v) => setK((kk) => ({ ...kk, shareIntention: v }))}
          label="Share with Meghan so we can talk it through first"
        />
      </Card>

      <Card className="flex flex-col gap-2.5 px-[18px] py-4">
        <h2 className="text-base font-bold">How are you feeling about the session?</h2>
        <div className="grid grid-cols-3 gap-2">
          {(["Ready", "Nervous", "Unsure"] as Feeling[]).map((f) => (
            <Pill key={f} selected={k.feeling === f} onClick={() => setK((kk) => ({ ...kk, feeling: f }))} className="min-h-11 text-sm">
              {f}
            </Pill>
          ))}
        </div>
        {k.feeling === "Nervous" || k.feeling === "Unsure" ? (
          <div className="flex flex-col gap-2 rounded-xl bg-mist px-3.5 py-3">
            <p className="text-sm leading-relaxed text-body">
              That&apos;s normal, and worth talking about before you begin. Meghan can set aside time at the start of the
              session, or you can message her now.
            </p>
            <Link
              href="/app/messages"
              className="inline-flex min-h-10 items-center self-start rounded-full bg-pine px-4 text-sm font-semibold text-white no-underline"
            >
              Message Meghan
            </Link>
          </div>
        ) : null}
      </Card>
    </>
  );
}

function DayOf({ onDone }: { onDone: () => void }) {
  const k = useLoadedState().ketamine;
  const [playing, setPlaying] = useState<string | null>(null);
  const audio = [
    { id: "a1", title: "Arriving: grounding with Meghan", meta: "Audio · 6 min · before you begin" },
    { id: "a2", title: "Session music", meta: "Curated playlist · downloaded for offline" },
  ];

  return (
    <>
      <section className="flex flex-col gap-2 rounded-[18px] bg-pine px-[18px] py-5 text-white">
        <span className="text-xs font-semibold tracking-[0.08em] text-sage uppercase">Your intention</span>
        <p className="font-serif text-[22px] leading-snug italic">
          {k.intention.trim() ? `“${k.intention.trim()}”` : "Set your intention on the Before tab. It will be here for you today."}
        </p>
      </section>

      <Card className="flex flex-col gap-1 px-[18px] py-4">
        <h2 className="mb-1 text-base font-bold">Settle in</h2>
        {audio.map((a) => (
          <div key={a.id} className="flex min-h-[60px] items-center gap-3.5">
            <button
              type="button"
              onClick={() => setPlaying(playing === a.id ? null : a.id)}
              aria-label={`Play ${a.title}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist text-pine"
            >
              <PlayIcon />
            </button>
            <div className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold">{a.title}</span>
              <span className="text-[13px] text-muted">{playing === a.id ? "Playing (demo, no audio yet)" : a.meta}</span>
            </div>
          </div>
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5 px-[18px] py-4">
        <h2 className="text-base font-bold">Your support person</h2>
        <p className="text-sm leading-relaxed text-body">
          [Support person&apos;s name] is with you today and will make sure you get home or stay settled afterward.
        </p>
        <a
          href="tel:"
          className="flex min-h-11 items-center justify-center rounded-full border-[1.5px] border-pine font-semibold text-pine no-underline"
        >
          Call [support person]
        </a>
      </Card>

      <div className="flex flex-col gap-1.5 rounded-[18px] bg-sand px-[18px] py-4">
        <span className="text-[15px] font-bold">After the session today</span>
        <span className="text-sm leading-relaxed text-body">
          [Driving, food and medication guidance from your prescribing provider goes here.] Rest. Nothing needs to be
          figured out today.
        </span>
      </div>

      <Button size="lg" onClick={onDone}>
        I&apos;m done with today&apos;s session
      </Button>
    </>
  );
}

function After() {
  const s = useLoadedState();
  const k = s.ketamine;
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState("");
  const [share, setShare] = useState(true);
  const [recording, setRecording] = useState(false);
  const [secs, setSecs] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const ph = PHASES[phase];
  const entries = s.me.journal.filter((j) => j.source === "ketamine");

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  function add(entry: Omit<JournalEntry, "id" | "at" | "source" | "phase">) {
    update((st) => ({
      ...st,
      me: {
        ...st.me,
        journal: [{ id: newId("j"), at: new Date().toISOString(), source: "ketamine", phase: ph.label, ...entry }, ...st.me.journal],
      },
    }));
  }

  function toggleRecord() {
    if (recording) {
      if (timer.current) clearInterval(timer.current);
      setRecording(false);
      add({ text: "Voice note", shared: share, voiceSeconds: Math.max(1, secs) });
      setSecs(0);
    } else {
      setRecording(true);
      setSecs(0);
      timer.current = setInterval(() => setSecs((x) => x + 1), 1000);
    }
  }

  return (
    <>
      <Card className="flex items-center justify-between gap-3 px-[18px] py-4">
        <div className="flex flex-col gap-0.5">
          <Eyebrow>Integration session</Eyebrow>
          <span className="font-serif text-xl">{fmtSession(k.integrationAt)}</span>
          <span className="text-[13px] text-muted">With Meghan · Telehealth</span>
        </div>
        <span className="text-right text-[13px] font-bold text-pine">
          {entries.filter((e) => e.shared).length} shared
          <br />
          so far
        </span>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {PHASES.map((p, i) => {
          const n = entries.filter((e) => e.phase === p.label).length;
          return (
            <Pill key={p.label} selected={phase === i} onClick={() => setPhase(i)} className="flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[14px]">
              <span className="text-sm font-bold">{p.label}</span>
              <span className="text-xs font-normal">{n ? `${n} saved` : p.hint}</span>
            </Pill>
          );
        })}
      </div>

      <Card className="flex flex-col gap-3 px-[18px] py-4">
        <Eyebrow>
          {ph.label} · {ph.hint}
        </Eyebrow>
        <div className="flex flex-col gap-1.5">
          {ph.prompts.map((q) => {
            const on = text.startsWith(q);
            return (
              <button
                key={q}
                type="button"
                onClick={() => setText(q + "\n")}
                className={cx(
                  "min-h-11 rounded-xl border px-3 py-2.5 text-left font-serif text-[17px] leading-snug",
                  on ? "border-pine bg-mist" : "border-line bg-paper",
                )}
              >
                {q}
              </button>
            );
          })}
        </div>
        <label htmlFor="reflection" className="sr-only">
          Your reflection
        </label>
        <textarea
          id="reflection"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Images, words, feelings, body sensations. Fragments are fine."
          className="min-h-[110px] resize-none rounded-xl border border-line-strong bg-paper px-3 py-2.5 text-[15px] leading-relaxed"
        />
        <button
          type="button"
          onClick={toggleRecord}
          aria-pressed={recording}
          className={cx(
            "flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] bg-white text-sm font-semibold",
            recording ? "border-alert text-alert" : "border-line-strong text-ink",
          )}
        >
          <MicIcon size={16} />
          {recording ? `Stop recording · 0:${String(secs).padStart(2, "0")}` : "Record a voice note instead"}
        </button>
        <ShareToggle checked={share} onChange={setShare} label="Share with Meghan before our integration session" />
        <Button
          className="min-h-12"
          disabled={!text.trim()}
          onClick={() => {
            add({ text: text.trim(), shared: share });
            setText("");
          }}
        >
          Save reflection
        </Button>
      </Card>

      {entries.map((e) => (
        <Card key={e.id} className="flex flex-col gap-1.5 px-4 py-3.5">
          <div className="flex justify-between text-[13px]">
            <span className="font-bold">{e.phase}</span>
            <span className={cx("font-semibold", e.shared ? "text-pine" : "text-muted")}>{e.shared ? "Shared with Meghan" : "Private"}</span>
          </div>
          <p className="text-[15px] leading-relaxed whitespace-pre-line">
            {e.voiceSeconds ? `Voice note · 0:${String(e.voiceSeconds).padStart(2, "0")} (demo, no audio saved)` : e.text}
          </p>
        </Card>
      ))}

      <Notice>
        Feeling physically unwell, or worse instead of better? Contact [prescribing provider] at [phone]. For a crisis, call
        or text 988, or 911 for immediate danger.
      </Notice>
    </>
  );
}
