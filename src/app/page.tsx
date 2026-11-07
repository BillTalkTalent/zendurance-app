import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col gap-8 px-6 py-14">
      <Image src="/logo.png" alt="Zendurance Wellness" width={260} height={57} priority />

      <div className="flex flex-col gap-3">
        <h1 className="font-serif text-[42px] leading-[1.05] font-normal tracking-[-0.02em]">
          A private space between sessions.
        </h1>
        <p className="text-[17px] leading-relaxed text-body">
          A working demo of the Zendurance client app and Meghan&apos;s practitioner view. Everything you type stays in
          this browser on this device. Nothing is sent anywhere.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/app"
          className="flex flex-col gap-1.5 rounded-[18px] bg-pine p-5 text-white no-underline hover:bg-pine-dark"
        >
          <span className="font-serif text-2xl">Client app</span>
          <span className="text-sm text-mist">
            Check-ins, journal, messages, library, intensive integration and the ketamine track. Best on a phone.
          </span>
        </Link>
        <Link
          href="/practitioner"
          className="flex flex-col gap-1.5 rounded-[18px] border border-line bg-white p-5 text-ink no-underline hover:border-pine"
        >
          <span className="font-serif text-2xl">Practitioner view</span>
          <span className="text-sm text-muted">
            Meghan&apos;s dashboard: client trends, shared entries, agenda, messages and post-session notes.
          </span>
        </Link>
      </div>

      <section className="flex flex-col gap-2 rounded-[18px] bg-sand p-5 text-sm leading-relaxed text-body">
        <h2 className="text-base font-bold text-ink">How the demo works</h2>
        <p>
          Both views share the same on-device data, so you can play both sides: share a journal entry or send a message
          as Jordan, then open the practitioner view and see it arrive. Send takeaways as Meghan and they appear on
          Jordan&apos;s Today screen.
        </p>
        <p>
          To install on a phone: open this page in Safari (iPhone) or Chrome (Android), then choose{" "}
          <strong>Add to Home Screen</strong>.
        </p>
        <p className="text-muted">
          Demo only. Do not enter real client information. All names and content are sample data.
        </p>
      </section>
    </main>
  );
}
