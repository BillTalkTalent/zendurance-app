"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon } from "@/components/icons";
import { Card, Notice, PageTitle, Pill } from "@/components/ui";

const FILTERS = ["All", "First responders", "Healthcare", "Leaders", "Grief", "Couples"] as const;

// Placeholder titles: Meghan records and uploads her own practices.
const ITEMS = [
  { id: "l1", title: "Decompression for the drive home", meta: "Audio · 5 min", tags: ["First responders", "Healthcare"] },
  { id: "l2", title: "Steady breath before a high-stakes moment", meta: "Audio · 3 min", tags: ["Leaders", "First responders"] },
  { id: "l3", title: "When you can't sleep after a hard shift", meta: "Audio · 10 min", tags: ["First responders", "Healthcare"] },
  { id: "l4", title: "Grief doesn't keep a schedule", meta: "Video · 8 min", tags: ["Grief"] },
  { id: "l5", title: "Coming home without bringing the day with you", meta: "Exercise for two · 15 min", tags: ["Couples", "First responders"] },
  { id: "l6", title: "Spotting burnout before it spots you", meta: "Reading · 6 min", tags: ["Leaders", "Healthcare"] },
];

export default function LibraryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const items = ITEMS.filter((i) => filter === "All" || i.tags.includes(filter));

  return (
    <div className="flex flex-col gap-3.5">
      <PageTitle title="Library" sub="Practices from Meghan, for the moments between sessions." />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Pill key={f} selected={filter === f} onClick={() => setFilter(f)} className="min-h-10 shrink-0 px-3.5 text-sm">
            {f}
          </Pill>
        ))}
      </div>
      {items.map((it) => {
        const on = playing === it.id;
        return (
          <Card key={it.id} className="flex items-center gap-3.5 px-4 py-3.5">
            <button
              type="button"
              onClick={() => setPlaying(on ? null : it.id)}
              aria-label={`${on ? "Pause" : "Play"} ${it.title}`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-mist text-pine"
            >
              {on ? <PauseIcon /> : <PlayIcon />}
            </button>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[15px] font-bold">{it.title}</span>
              <span className="text-[13px] text-muted">{on ? "Playing (demo, no audio yet)" : it.meta}</span>
            </div>
          </Card>
        );
      })}
      <Notice tone="calm">These are placeholder titles. Meghan will record and upload her own practices.</Notice>
    </div>
  );
}
