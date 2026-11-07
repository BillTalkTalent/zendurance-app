/** Local calendar date as YYYY-MM-DD. */
export function dayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

/** A Date on day `offset` from today at the given local time. */
export function at(offset: number, hours: number, minutes = 0): Date {
  const d = addDays(new Date(), offset);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

/** Next given weekday (0 = Sunday) strictly after today, at a local time. */
export function nextWeekday(weekday: number, hours: number, minutes = 0): Date {
  const now = new Date();
  let diff = (weekday - now.getDay() + 7) % 7;
  if (diff === 0) diff = 7;
  return at(diff, hours, minutes);
}

export function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(a: Date, b: Date): number {
  const ms = fromKey(dayKey(b)).getTime() - fromKey(dayKey(a)).getTime();
  return Math.round(ms / 86_400_000);
}

const weekdayShort = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const monthDay = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

export function fmtSession(iso: string): string {
  const d = new Date(iso);
  return `${weekdayShort.format(d)}, ${monthDay.format(d)} · ${time.format(d)}`;
}

export function fmtDay(iso: string): string {
  const d = new Date(iso);
  return `${weekdayShort.format(d)}, ${monthDay.format(d)}`;
}

export function fmtMonthDay(d: Date | string): string {
  return monthDay.format(typeof d === "string" ? new Date(d) : d);
}

export function fmtShortSession(iso: string): string {
  const d = new Date(iso);
  return `${weekdayShort.format(d)} ${time.format(d)}`;
}

/** "Just now", "9:12 AM", "Tue 9:12 AM" or "Nov 3" depending on age. */
export function fmtStamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const mins = (now.getTime() - d.getTime()) / 60_000;
  if (mins < 1) return "Just now";
  const days = daysBetween(d, now);
  if (days === 0) return time.format(d);
  if (days < 7) return `${weekdayShort.format(d)} ${time.format(d)}`;
  return monthDay.format(d);
}

export function weekdayLetter(key: string): string {
  return weekdayShort.format(fromKey(key)).slice(0, 3);
}

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
