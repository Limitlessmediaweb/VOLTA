"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MQ } from "@/lib/gsap";

/** Contatore animato. Usare solo con numeri veri; nel concept i valori sono etichettati "Dati dimostrativi". */
export function Counter({ value, suffix = "", className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const obj = { v: 0 };
      el.textContent = `0${suffix}`;
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: value,
            duration: 1.8,
            ease: "expo.out",
            onUpdate: () => {
              el.textContent = `${Math.round(obj.v)}${suffix}`;
            },
          }),
      });
      return () => {
        el.textContent = `${value}${suffix}`;
      };
    });
    return () => mm.revert();
  });

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
