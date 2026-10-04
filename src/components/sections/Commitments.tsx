import { commitments, demoStats } from "@/data/content";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Stagger } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";

/** Al posto delle recensioni: impegni concreti, da confermare con il cliente reale. */
export function Commitments() {
  return (
    <section aria-labelledby="impegni-title" className="section">
      <div className="wrap">
        <div className="mb-14 grid gap-4 lg:mb-20">
          <p className="t-mono text-light-text">Metodo</p>
          <SplitReveal id="impegni-title" className="t-h2 max-w-[18ch]">
            Come lavoriamo e cosa ti garantiamo.
          </SplitReveal>
        </div>
        <Stagger as="ol" className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {commitments.map((c) => (
            <li key={c.step} className="flex flex-col gap-4 bg-bg p-7 lg:p-9">
              <span className="t-mono text-light-text">{c.step}</span>
              <h3 className="t-h3">{c.title}</h3>
              <p className="text-sm text-muted">{c.text}</p>
            </li>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section aria-labelledby="numeri-title" className="border-y border-line bg-surface">
      <div className="wrap py-16 lg:py-24">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="numeri-title" className="t-h3">In numeri</h2>
          <p className="tbd">Dati dimostrativi</p>
        </div>
        <dl className="grid gap-10 sm:grid-cols-3">
          {demoStats.map((s) => (
            <div key={s.label} className="grid gap-2 border-l border-line-strong pl-6">
              <dt className="order-2 text-sm text-muted">{s.label}</dt>
              <dd className="order-1 font-display text-[clamp(3rem,7vw,6rem)] leading-none font-semibold tabular-nums text-light-text">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
