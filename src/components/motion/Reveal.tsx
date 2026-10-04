"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  id?: string;
};

/** Dissolvenza con salita all'ingresso nel viewport. */
export function Reveal({ as: Tag = "div", children, className, y = 36, delay = 0, id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from(el, { autoAlpha: 0, y, duration: 1.1, delay, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      el.dataset.animReady = "";
    });
    return () => mm.revert();
  });

  return (
    <Tag ref={ref} id={id} data-anim className={className}>
      {children}
    </Tag>
  );
}

/** Come Reveal, ma sui figli diretti in sequenza. */
export function Stagger({ as: Tag = "div", children, className, y = 32, id }: Omit<Props, "delay">) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from(el.children, {
        autoAlpha: 0,
        y,
        duration: 1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      el.dataset.animReady = "";
    });
    return () => mm.revert();
  });

  return (
    <Tag ref={ref} id={id} data-anim-group className={className}>
      {children}
    </Tag>
  );
}
