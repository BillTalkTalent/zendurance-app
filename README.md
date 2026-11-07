# Zendurance client app (demo)

A private companion app for clients of Meghan Fanning, Zendurance Wellness, plus Meghan's practitioner view.

**This is a demo.** All data lives in the browser's `localStorage` on the device in use. Nothing is sent to a
server. Do not enter real client information.

## What's in it

| Route | What it is |
| --- | --- |
| `/` | Landing page: choose the client app or the practitioner view |
| `/app` | Client: Today (next session, takeaways from Meghan, intensive progress, ketamine track, "bring to next session") |
| `/app/check-in` | 30-second mood / stress / sleep / energy check-in with a 7-day trend |
| `/app/journal` | Private journal, with optional "share with Meghan" per entry |
| `/app/messages` | Secure messaging, with reply expectations and crisis numbers shown up front |
| `/app/library` | Meghan's practices, filtered by audience (placeholder titles) |
| `/app/intensive` | 90-day intensive integration: milestones, daily practices, weekly reflection |
| `/app/ketamine` | Ketamine-assisted therapy track: Before / Day of / After, with guided integration |
| `/practitioner` | Meghan's dashboard: client list with flags, trends, shared entries, agenda, messages, post-session takeaways |

Both views read the same on-device data, so you can play both sides in one browser. "Reset demo data" in the
practitioner view restores the sample clients.

A "Need help now" sheet (988, 911 and the Veterans Crisis Line option) is one tap away on every client screen.

## Placeholders Meghan must fill

- Ketamine track: anything medical (fasting, medications, driving) and the prescribing provider's name and phone.
  These must come from the prescribing provider.
- Library: real audio and video practices.
- Telehealth "Join video" link.

## Before real clients use it (HIPAA)

Meghan is a licensed clinician, so client data is protected health information. Before going live:

1. Move storage to a HIPAA-eligible backend with a signed BAA (e.g. Supabase Team + HIPAA add-on, Aptible, or
   Healthie's API), with real sign-in for clients and for Meghan.
2. Encrypt data at rest and in transit, add an audit log of who viewed what, and add an app lock (PIN / Face ID).
3. Push notifications must never include message content.
4. Review with a healthcare attorney and her malpractice insurer, especially for messaging between sessions.

`src/lib/store.ts` is the only place that reads and writes data, so swapping in a real backend is contained there.

## Development

```bash
npm install
npm run dev
```

Brand tokens (colors, fonts) are in `src/app/globals.css` and were taken from zendurancewellness.com. Update them
there when the brand refresh lands.

Built on Next.js 16 (App Router, Cache Components) with Tailwind CSS 4. Installable on phones as a web app
(Add to Home Screen) via `src/app/manifest.ts`.
