"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "@/components/icons";
import { Button, Card, CheckRow, Eyebrow, PageTitle, ProgressBar } from "@/components/ui";
import { dayKey } from "@/lib/dates";
import { intensiveProgress } from "@/lib/derive";
import { update, useLoadedState } from "@/lib/store";

export default function IntensivePage() {
  const s = useLoadedState();
  const router = useRouter();
  const prog = intensiveProgress(s);
  const today = dayKey();

  function toggle(id: string) {
    update((st) => ({
      ...st,
      intensive: {
        ...st.intensive,
        practices: st.intensive.practices.map((p) =>
          p.id === id ? { ...p, doneOn: p.doneOn === today ? null : today } : p,
        ),
      },
    }));
  }

  return (
    <div className="flex flex-col gap-3.5">
      <Link href="/app" className="-ml-1 flex min-h-11 items-center gap-1 self-start font-semibold text-pine no-underline">
        <ChevronLeft size={18} /> Today
      </Link>
      <PageTitle title="Intensive integration" sub="Keeping what opened up in your intensive." />

      <section className="flex flex-col gap-2.5 rounded-[18px] bg-pine p-[18px] text-white">
        <div className="flex items-baseline justify-between">
          <span className="font-serif text-2xl">
            Day {prog.day} of {prog.length}
          </span>
          <span className="text-sm text-sage">{prog.range}</span>
        </div>
        <ProgressBar pct={prog.pct} track="bg-pine-soft" fill="bg-white" label="Integration progress" />
        <div className="grid grid-cols-3 gap-2 text-[13px] text-mist">
          {prog.milestones.map((m) => (
            <span key={m.day} className={m.passed ? "opacity-70" : ""}>
              {m.label}
              <br />
              {m.date}
            </span>
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-1 px-[18px] py-4">
        <h2 className="mb-1.5 text-base font-bold">Today&apos;s practices</h2>
        {s.intensive.practices.map((p) => (
          <CheckRow key={p.id} checked={p.doneOn === today} onToggle={() => toggle(p.id)} label={p.label} sub={p.sub} />
        ))}
      </Card>

      <Card className="flex flex-col gap-2.5 px-[18px] py-4">
        <Eyebrow>This week&apos;s reflection</Eyebrow>
        <p className="font-serif text-xl leading-snug">What feels different since the intensive, even slightly?</p>
        <Button
          variant="outline"
          className="border-pine font-bold text-pine"
          onClick={() => {
            try {
              sessionStorage.setItem("zen-journal-prefill", "What feels different since the intensive: ");
            } catch {}
            router.push("/app/journal");
          }}
        >
          Write in journal
        </Button>
      </Card>
    </div>
  );
}
