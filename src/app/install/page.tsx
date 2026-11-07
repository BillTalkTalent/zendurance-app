import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InstallGuide } from "@/components/InstallGuide";

export const metadata: Metadata = {
  title: "Add Zendurance to your phone",
};

export default function InstallPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-6 px-5 pt-[max(24px,env(safe-area-inset-top))] pb-12">
      <Link href="/app" aria-label="Zendurance Wellness, Today" className="self-start">
        <Image src="/logo.png" alt="" width={170} height={37} priority />
      </Link>
      <header className="flex flex-col gap-2">
        <h1 className="font-serif text-[34px] leading-[1.1] font-normal tracking-[-0.01em]">
          Add Zendurance to your phone
        </h1>
        <p className="text-[15px] leading-relaxed text-body">
          It takes about 30 seconds. Afterward, Zendurance opens from its own icon, full screen, like any other app.
        </p>
      </header>
      <InstallGuide />
      <Link href="/app" className="self-center text-sm font-semibold">
        Skip for now
      </Link>
    </main>
  );
}
