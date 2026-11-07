import { addDays, at, dayKey, nextWeekday } from "./dates";
import type { Checkin, ClientRecord, MetricKey, State } from "./types";

let n = 0;
const id = (p: string) => `${p}-${++n}`;

/**
 * Build check-ins from per-metric series. Index 0 is `days - 1` days ago and the
 * last index is `endOffset` days ago. A 0 means "no check-in that day".
 */
function series(
  data: Record<MetricKey, number[]>,
  endOffset = 0,
): Checkin[] {
  const len = data.mood.length;
  const out: Checkin[] = [];
  for (let i = 0; i < len; i++) {
    if (!data.mood[i]) continue;
    const date = dayKey(addDays(new Date(), -(len - 1 - i) - endOffset));
    out.push({
      date,
      mood: data.mood[i],
      stress: data.stress[i],
      sleep: data.sleep[i],
      energy: data.energy[i],
    });
  }
  return out;
}

const iso = (d: Date) => d.toISOString();

export function seed(): State {
  n = 0;
  const me: ClientRecord = {
    id: "me",
    name: "Jordan R.",
    first: "Jordan",
    group: "Intensive",
    service: "Intensive integration",
    about: "Firefighter, NH",
    nextSession: iso(nextWeekday(4, 16)),
    // 13 days ending yesterday: today is left open for the real check-in.
    checkins: series(
      {
        mood: [2, 2, 3, 2, 3, 3, 3, 2, 3, 3, 4, 3, 3],
        stress: [5, 4, 5, 4, 4, 4, 4, 5, 4, 4, 3, 4, 3],
        sleep: [2, 2, 2, 3, 2, 3, 3, 2, 3, 3, 3, 4, 3],
        energy: [2, 3, 2, 2, 3, 3, 2, 3, 3, 3, 3, 3, 4],
      },
      1,
    ),
    journal: [
      {
        id: id("j"),
        at: iso(at(-3, 21, 40)),
        text: "Slept better after trying the wind-down routine. Still woke at 3 but got back to sleep.",
        shared: true,
        source: "journal",
      },
      {
        id: id("j"),
        at: iso(at(-6, 22, 5)),
        text: "Hard call at work. Noticed my jaw before I noticed I was angry. Progress?",
        shared: false,
        source: "journal",
      },
    ],
    messages: [
      {
        id: id("m"),
        from: "client",
        text: "Rough shift last night, but I used the decompression track on the drive home. It helped.",
        at: iso(at(-1, 7, 48)),
      },
    ],
    agenda: [{ id: id("a"), text: "The conversation with my sister", done: false }],
    takeaways: {
      at: iso(at(-2, 17, 0)),
      items: [
        "You don't have to carry the shift home. Name it, then put it down.",
        "Noticing the tight jaw is the early signal, not the problem.",
      ],
      practice: "Five-minute decompression on the drive home, 3 times.",
    },
    meghanReadAt: iso(at(-2, 17, 0)),
  };

  const others: ClientRecord[] = [
    {
      id: "priya",
      name: "Priya S.",
      first: "Priya",
      group: "Coaching",
      service: "Performance coaching",
      about: "ER physician, CO",
      nextSession: iso(nextWeekday(1, 7, 30)),
      checkins: series({
        mood: [3, 4, 3, 3, 4, 3, 3, 3, 3, 2, 3, 2, 2, 2],
        stress: [3, 3, 3, 4, 3, 3, 4, 3, 4, 4, 4, 5, 5, 5],
        sleep: [3, 3, 4, 3, 3, 3, 2, 3, 2, 2, 2, 2, 1, 2],
        energy: [4, 4, 3, 4, 3, 3, 3, 3, 3, 2, 3, 2, 2, 2],
      }),
      journal: [
        {
          id: id("j"),
          at: iso(at(-1, 23, 10)),
          text: "Three codes in one shift. I keep replaying the second one. Want to use our next session for this, not the promotion stuff.",
          shared: true,
          source: "journal",
        },
      ],
      messages: [
        { id: id("m"), from: "meghan", text: "Good luck with the board review. Use the 3-minute breath right before you walk in.", at: iso(at(-3, 18, 10)) },
        { id: id("m"), from: "client", text: "It worked. Calmer than I've been in one of those in a long time.", at: iso(at(-2, 14, 2)) },
      ],
      agenda: [
        { id: id("a"), text: "Replaying the code from this week", done: false },
        { id: id("a"), text: "Department chair interview prep", done: false },
      ],
      takeaways: null,
      meghanReadAt: iso(at(-2, 15, 0)),
    },
    {
      id: "couple",
      name: "Sam & Alex T.",
      first: "Sam & Alex",
      group: "Therapy",
      service: "Couples therapy",
      about: "MA",
      nextSession: iso(nextWeekday(2, 18)),
      checkins: series({
        mood: [3, 3, 3, 4, 3, 0, 4, 4, 3, 4, 4, 4, 0, 4],
        stress: [4, 3, 4, 3, 3, 0, 3, 3, 3, 2, 3, 2, 0, 2],
        sleep: [3, 3, 3, 3, 4, 0, 3, 4, 3, 4, 3, 4, 0, 4],
        energy: [3, 3, 3, 3, 3, 0, 3, 3, 4, 3, 4, 4, 0, 4],
      }),
      journal: [
        {
          id: id("j"),
          at: iso(at(-2, 20, 0)),
          text: "Shared space: we tried the \"coming home\" exercise twice this week. The second time was much easier.",
          shared: true,
          source: "journal",
        },
      ],
      messages: [],
      agenda: [{ id: id("a"), text: "Holiday plans with Alex's family", done: false }],
      takeaways: null,
      meghanReadAt: null,
    },
    {
      id: "dana",
      name: "Dana K.",
      first: "Dana",
      group: "Therapy",
      service: "Individual therapy · Grief",
      about: "Hospice nurse, NH",
      nextSession: iso(nextWeekday(3, 11)),
      checkins: series(
        {
          mood: [2, 3, 2, 2, 3, 3, 2, 3],
          stress: [4, 3, 4, 4, 3, 3, 4, 4],
          sleep: [2, 2, 3, 2, 2, 3, 2, 2],
          energy: [2, 2, 2, 3, 2, 2, 2, 2],
        },
        6,
      ),
      journal: [],
      messages: [],
      agenda: [],
      takeaways: null,
      meghanReadAt: null,
    },
    {
      id: "marcus",
      name: "Marcus L.",
      first: "Marcus",
      group: "Coaching",
      service: "Performance coaching",
      about: "Operations executive, TX",
      nextSession: iso(nextWeekday(5, 12)),
      checkins: series({
        mood: [3, 3, 4, 3, 4, 4, 3, 4, 4, 4, 4, 3, 4, 4],
        stress: [4, 4, 3, 4, 3, 3, 3, 3, 3, 3, 2, 3, 3, 2],
        sleep: [3, 3, 3, 4, 3, 4, 4, 3, 4, 4, 4, 4, 4, 4],
        energy: [3, 4, 3, 4, 4, 4, 4, 4, 3, 4, 4, 4, 5, 4],
      }),
      journal: [
        {
          id: id("j"),
          at: iso(at(-4, 19, 30)),
          text: "Said no to the extra steering committee. Felt guilty for an hour, then relieved.",
          shared: true,
          source: "journal",
        },
      ],
      messages: [
        { id: id("m"), from: "client", text: "Quick win to share: I left at 5:30 three days this week.", at: iso(at(-1, 17, 41)) },
      ],
      agenda: [{ id: id("a"), text: "Quarterly offsite: how to show up", done: false }],
      takeaways: null,
      meghanReadAt: iso(at(-1, 18, 0)),
    },
  ];

  return {
    version: 1,
    me,
    intensive: {
      start: dayKey(addDays(new Date(), -11)),
      lengthDays: 90,
      practices: [
        { id: "p1", label: "Morning grounding", sub: "5 min audio", doneOn: dayKey() },
        { id: "p2", label: "Name it, put it down", sub: "After work, 2 min", doneOn: null },
        { id: "p3", label: "One honest sentence", sub: "To someone you trust", doneOn: null },
      ],
    },
    ketamine: {
      sessionNumber: 2,
      sessionCount: 6,
      sessionAt: iso(nextWeekday(2, 10)),
      integrationAt: iso(addDays(nextWeekday(2, 16), 2)),
      prep: [
        { id: "k1", label: "Medical clearance", sub: "Confirmed with [prescribing provider]", done: true },
        { id: "k2", label: "Consent reviewed and signed", sub: "In your TherapyAppointment portal", done: true },
        { id: "k3", label: "Support person confirmed", sub: "With you during and after", done: false },
        { id: "k4", label: "Food, drink and medication plan", sub: "[Instructions from your provider]", done: false },
        { id: "k5", label: "No-driving plan for the day", sub: "Ride home or stay put", done: false },
        { id: "k6", label: "Your space is ready", sub: "Quiet room, eye mask, headphones, blanket", done: false },
      ],
      intention: "",
      shareIntention: true,
      feeling: null,
    },
    others,
  };
}
