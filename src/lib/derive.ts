import { addDays, dayKey, daysBetween, fmtMonthDay, fromKey } from "./dates";
import type { Checkin, ClientRecord, MetricKey, State } from "./types";

export const METRICS: { key: MetricKey; label: string; lo: string; hi: string }[] = [
  { key: "mood", label: "Mood", lo: "Heavy", hi: "Light" },
  { key: "stress", label: "Stress", lo: "Calm", hi: "Maxed out" },
  { key: "sleep", label: "Sleep", lo: "Rough", hi: "Restful" },
  { key: "energy", label: "Energy", lo: "Drained", hi: "Charged" },
];

export function todaysCheckin(c: ClientRecord): Checkin | undefined {
  const k = dayKey();
  return c.checkins.find((x) => x.date === k);
}

/** One slot per day for the last `days` days (oldest first); null = no check-in. */
export function lastDays(c: ClientRecord, days: number): { date: string; checkin: Checkin | null }[] {
  const byDate = new Map(c.checkins.map((x) => [x.date, x]));
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayKey(addDays(new Date(), -i));
    out.push({ date, checkin: byDate.get(date) ?? null });
  }
  return out;
}

export function intensiveProgress(s: State) {
  const start = fromKey(s.intensive.start);
  const day = Math.min(s.intensive.lengthDays, daysBetween(start, new Date()) + 1);
  const milestone = (d: number) => addDays(start, d - 1);
  return {
    day,
    length: s.intensive.lengthDays,
    pct: (day / s.intensive.lengthDays) * 100,
    range: `${fmtMonthDay(start)} – ${fmtMonthDay(milestone(s.intensive.lengthDays))}`,
    milestones: [30, 60, 90].map((d) => ({
      day: d,
      label: d === 90 ? "90-day review" : `${d}-day call`,
      date: fmtMonthDay(milestone(d)),
      passed: day >= d,
    })),
  };
}

export function practicesDoneToday(s: State) {
  const k = dayKey();
  return s.intensive.practices.filter((p) => p.doneOn === k).length;
}

export function unreadForMeghan(c: ClientRecord) {
  const since = c.meghanReadAt ? new Date(c.meghanReadAt).getTime() : 0;
  return c.messages.filter((m) => m.from === "client" && new Date(m.at).getTime() > since).length;
}

/** Gentle, rule-based flags for Meghan. Not a risk assessment. */
export function flagFor(c: ClientRecord): { title: string; detail: string } | null {
  const unread = unreadForMeghan(c);
  if (unread > 0) {
    const last = [...c.messages].reverse().find((m) => m.from === "client");
    return {
      title: unread === 1 ? "Unread message" : `${unread} unread messages`,
      detail: last ? `Latest: "${truncate(last.text, 80)}"` : "",
    };
  }
  const recent = lastDays(c, 3).map((d) => d.checkin);
  if (recent.every((x) => x && x.stress >= 5)) {
    return { title: "Stress at 5 for 3 days", detail: "Worth a check-in before the next session." };
  }
  const last = [...c.checkins].sort((a, b) => a.date.localeCompare(b.date)).at(-1);
  const gap = last ? daysBetween(fromKey(last.date), new Date()) : Infinity;
  if (gap >= 5) {
    return {
      title: last ? `No check-ins in ${gap} days` : "No check-ins yet",
      detail: last ? `Last logged ${fmtMonthDay(fromKey(last.date))}.` : "",
    };
  }
  return null;
}

export function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

export function allClients(s: State): ClientRecord[] {
  return [s.me, ...s.others];
}

export function updateClient(s: State, id: string, fn: (c: ClientRecord) => ClientRecord): State {
  if (s.me.id === id) return { ...s, me: fn(s.me) };
  return { ...s, others: s.others.map((c) => (c.id === id ? fn(c) : c)) };
}
