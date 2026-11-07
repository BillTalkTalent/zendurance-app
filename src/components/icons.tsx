import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 22, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SunIcon = (p: P) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Base>
);
export const PulseIcon = (p: P) => (
  <Base {...p}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </Base>
);
export const BookIcon = (p: P) => (
  <Base {...p}>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
    <path d="M9 9h6M9 13h4" />
  </Base>
);
export const ChatIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 5h16v11H9l-5 4z" />
  </Base>
);
export const LibraryIcon = (p: P) => (
  <Base {...p}>
    <path d="M4 4v16M9 4v16M14 5l5 15" />
  </Base>
);
export const CheckIcon = (p: P) => (
  <Base strokeWidth={3} {...p}>
    <path d="M5 12l5 5L20 7" />
  </Base>
);
export const PlayIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <path d="M7 4.5v15l13-7.5z" />
  </svg>
);
export const PauseIcon = ({ size = 18, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
export const MicIcon = (p: P) => (
  <Base strokeWidth={2} {...p}>
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
  </Base>
);
export const LockIcon = (p: P) => (
  <Base {...p}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Base>
);
export const AlertIcon = (p: P) => (
  <Base strokeWidth={2} {...p}>
    <path d="M12 8v5M12 16.5v.5" />
    <circle cx="12" cy="12" r="9" />
  </Base>
);
export const ChevronLeft = (p: P) => (
  <Base strokeWidth={2} {...p}>
    <path d="M15 5l-7 7 7 7" />
  </Base>
);
export const ChevronRight = (p: P) => (
  <Base strokeWidth={2} {...p}>
    <path d="M9 5l7 7-7 7" />
  </Base>
);
