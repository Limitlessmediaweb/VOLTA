import { cn } from "@/lib/utils";

/**
 * Wordmark VOLTA disegnato a tratto. La "O" è una lampadina con filamento.
 * Gli id dei path servono all'intro per animarli con DrawSVG.
 */
export function Logo({ className, title = "VOLTA", idPrefix = "logo" }: { className?: string; title?: string; idPrefix?: string }) {
  return (
    <svg
      viewBox="0 0 262 66"
      className={cn("h-auto", className)}
      role="img"
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g data-logo="letters">
        <path id={`${idPrefix}-v`} d="M3 6 L21 58 L39 6" />
        <path id={`${idPrefix}-l`} d="M119 6 V58 H151" />
        <path id={`${idPrefix}-t`} d="M165 6 H205 M185 6 V58" />
        <path id={`${idPrefix}-a`} d="M217 58 L237 6 L257 58 M224 40 H250" />
      </g>
      <g data-logo="bulb">
        {/* vetro */}
        <path d="M70 46 C 60 40 56 32 56 26 A 22 22 0 0 1 100 26 C 100 32 96 40 86 46 V51 H70 Z" />
        {/* attacco */}
        <path d="M71 56 H85 M73 61 H83" />
      </g>
      <path
        data-logo="filament"
        d="M72 46 V34 C 72 30 75 28 76 31 C 77 34 79 34 80 31 C 81 28 84 30 84 34 V46"
        stroke="var(--light)"
        strokeWidth={2.4}
      />
    </svg>
  );
}
