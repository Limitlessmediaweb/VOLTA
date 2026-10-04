import { TBD } from "@/data/business";

/** Mostra il valore reale o il segnaposto visibile "[DA COMPLETARE]". */
export function Tbd({ value, label = TBD }: { value?: string | null; label?: string }) {
  if (value) return <>{value}</>;
  return <span className="tbd">{label}</span>;
}
