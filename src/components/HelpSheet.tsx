"use client";

import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Show the prescribing provider first (ketamine track). */
  withProvider?: boolean;
};

/**
 * Crisis resources. Always one tap away in the client app.
 * Uses a native <dialog> so focus is trapped and Escape closes it.
 */
export function HelpSheet({ open, onClose, withProvider }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="help-title"
      className="m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-ink/55 sm:mx-auto sm:max-w-md"
    >
      <div className="flex flex-col gap-3 rounded-t-3xl bg-white px-5 pt-6 pb-8">
        <h2 id="help-title" className="font-serif text-[26px] font-normal">
          {withProvider ? "You're not alone in this." : "You don't have to wait for your next session."}
        </h2>
        <p className="text-[15px] leading-relaxed text-body">
          If you&apos;re in danger or thinking about ending your life, reach out right now. Someone is there 24/7.
        </p>
        {withProvider ? (
          <a
            href="tel:"
            className="flex min-h-[52px] items-center justify-center rounded-full bg-pine font-bold text-white no-underline"
          >
            Call [prescribing provider]
          </a>
        ) : null}
        <a
          href="tel:988"
          className="flex min-h-[52px] items-center justify-center rounded-full bg-alert font-bold text-white no-underline"
        >
          Call or text 988
        </a>
        <a
          href="tel:911"
          className="flex min-h-[52px] items-center justify-center rounded-full border-[1.5px] border-alert font-bold text-alert no-underline"
        >
          Call 911: immediate danger
        </a>
        <p className="text-[13px] leading-snug text-muted">
          Veterans and first responders: press 1 after dialing 988 for the Veterans Crisis Line.
        </p>
        <button type="button" onClick={onClose} className="min-h-11 font-semibold text-pine">
          Close
        </button>
      </div>
    </dialog>
  );
}
