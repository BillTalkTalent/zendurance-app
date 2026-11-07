export type MetricKey = "mood" | "stress" | "sleep" | "energy";

export type Checkin = { date: string } & Record<MetricKey, number>;

export type JournalSource = "journal" | "intensive" | "ketamine";

export type JournalEntry = {
  id: string;
  at: string; // ISO timestamp
  text: string;
  shared: boolean;
  source: JournalSource;
  /** For ketamine integration: "Day 1" | "Day 3" | "Week 1" */
  phase?: string;
  /** Simulated voice note length in seconds (demo only, no audio is recorded) */
  voiceSeconds?: number;
};

export type Message = {
  id: string;
  from: "client" | "meghan";
  text: string;
  at: string;
};

export type AgendaItem = { id: string; text: string; done: boolean };

export type Takeaways = { at: string; items: string[]; practice: string };

export type DailyPractice = {
  id: string;
  label: string;
  sub: string;
  /** Date (YYYY-MM-DD) it was last checked off; done for today when equal to today */
  doneOn: string | null;
};

export type PrepItem = { id: string; label: string; sub: string; done: boolean };

export type Feeling = "Ready" | "Nervous" | "Unsure";

export type ClientRecord = {
  id: string;
  name: string;
  first: string;
  group: "Intensive" | "Coaching" | "Therapy";
  service: string;
  about: string;
  nextSession: string; // ISO
  checkins: Checkin[];
  journal: JournalEntry[];
  messages: Message[];
  agenda: AgendaItem[];
  takeaways: Takeaways | null;
  /** Last time Meghan opened this client's messages */
  meghanReadAt: string | null;
};

export type State = {
  version: 1;
  /** The client who "owns" this phone in the demo */
  me: ClientRecord;
  intensive: { start: string; lengthDays: number; practices: DailyPractice[] };
  ketamine: {
    sessionNumber: number;
    sessionCount: number;
    sessionAt: string;
    integrationAt: string;
    prep: PrepItem[];
    intention: string;
    shareIntention: boolean;
    feeling: Feeling | null;
  };
  /** Other clients on Meghan's caseload (sample data) */
  others: ClientRecord[];
};
