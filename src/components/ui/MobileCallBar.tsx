import { Phone } from "lucide-react";
import { callHref } from "@/data/business";
import { TrackedLink } from "./TrackedLink";

/** Barra fissa in basso su mobile: chiamata sempre a portata di pollice. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/92 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="grid grid-cols-2 gap-3">
        <TrackedLink href={callHref} event="call_click" eventLabel="barra_mobile" className="btn btn-alarm w-full !px-3 text-sm">
          <Phone aria-hidden className="size-4" />
          Chiama ora
        </TrackedLink>
        <TrackedLink href="/contatti#sopralluogo" eventLabel="barra_mobile_sopralluogo" className="btn btn-primary w-full !px-3 text-sm">
          Sopralluogo
        </TrackedLink>
      </div>
    </div>
  );
}
