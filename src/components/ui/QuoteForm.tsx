"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const workTypes = ["Pronto intervento / guasto", "Impianto nuovo o rifacimento", "Quadro e messa in sicurezza", "Illuminazione", "Domotica", "Altro"];

type Errors = Partial<Record<"nome" | "telefono" | "comune" | "tipo" | "privacy", string>>;

function validate(data: FormData): Errors {
  const e: Errors = {};
  const nome = String(data.get("nome") || "").trim();
  const tel = String(data.get("telefono") || "").replace(/[\s./-]/g, "");
  if (nome.length < 2) e.nome = "Scrivi il tuo nome.";
  if (!/^\+?\d{6,15}$/.test(tel)) e.telefono = "Inserisci un numero di telefono valido, solo cifre.";
  if (String(data.get("comune") || "").trim().length < 2) e.comune = "Indica il comune dell'intervento.";
  if (!data.get("tipo")) e.tipo = "Scegli il tipo di lavoro.";
  if (!data.get("privacy")) e.privacy = "Serve il consenso per poterti ricontattare.";
  return e;
}

/** Form sopralluogo: validazione locale ed esito dimostrativo. Nessun dato viene inviato. */
export function QuoteForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const e = validate(data);
    setErrors(e);
    const keys = Object.keys(e);
    if (keys.length) {
      setStatus(`Il modulo contiene ${keys.length === 1 ? "un errore" : `${keys.length} errori`}. Controlla i campi evidenziati.`);
      formRef.current?.querySelector<HTMLElement>(`[name="${keys[0]}"]`)?.focus();
      return;
    }
    // TODO: collegare a un backend o servizio email. Per ora esito dimostrativo.
    track("quote_submit", { tipo: String(data.get("tipo")) });
    setSent(true);
    setStatus("Richiesta registrata (simulazione).");
  };

  const fieldProps = (name: keyof Errors) => ({
    name,
    id: `f-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `f-${name}-err` : undefined,
  });
  const err = (name: keyof Errors) =>
    errors[name] ? (
      <p id={`f-${name}-err`} className="text-sm font-semibold text-alarm-text">
        {errors[name]}
      </p>
    ) : null;

  if (sent) {
    return (
      <div className="grid gap-4 rounded-3xl border border-light/50 bg-surface p-8" role="status">
        <CheckCircle2 aria-hidden className="size-10 text-light-text" />
        <p className="t-h3">Grazie, richiesta ricevuta.</p>
        <p className="text-muted">
          Questo è un esito dimostrativo: nel sito reale riceverai una conferma e verrai ricontattato entro <span className="tbd">[DA COMPLETARE]</span>.
        </p>
        <button type="button" className="btn btn-ghost justify-self-start" onClick={() => setSent(false)}>
          Invia un&apos;altra richiesta
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} method="post" className="grid gap-5" aria-describedby="form-note">
      <p id="form-note" className="text-sm text-muted">
        Tutti i campi con * sono obbligatori. Versione demo: nessun dato viene inviato.
      </p>
      <noscript>
        <p className="text-sm text-alarm-text">Per inviare il modulo serve JavaScript. In alternativa chiamaci.</p>
      </noscript>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="f-nome" className="text-sm font-semibold">Nome e cognome *</label>
          <input {...fieldProps("nome")} type="text" autoComplete="name" className="field" />
          {err("nome")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="f-telefono" className="text-sm font-semibold">Telefono *</label>
          <input {...fieldProps("telefono")} type="tel" inputMode="tel" autoComplete="tel" className="field" />
          {err("telefono")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="f-comune" className="text-sm font-semibold">Comune *</label>
          <input {...fieldProps("comune")} type="text" autoComplete="address-level2" className="field" />
          {err("comune")}
        </div>
        <div className="grid gap-2">
          <label htmlFor="f-tipo" className="text-sm font-semibold">Tipo di lavoro *</label>
          <select {...fieldProps("tipo")} defaultValue="" className="field appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat" style={{ backgroundImage: "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)", backgroundSize: "6px 6px, 6px 6px", backgroundPosition: "calc(100% - 22px) 50%, calc(100% - 16px) 50%" }}>
            <option value="" disabled>
              Scegli…
            </option>
            {workTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {err("tipo")}
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="f-messaggio" className="text-sm font-semibold">Messaggio</label>
        <textarea id="f-messaggio" name="messaggio" rows={4} className="field resize-y" placeholder="Raccontaci in due righe cosa ti serve." />
      </div>

      <div className="grid gap-2">
        <div className="flex items-start gap-3">
          <input {...fieldProps("privacy")} type="checkbox" className="mt-1 size-5 shrink-0 accent-[var(--light)]" />
          <label htmlFor="f-privacy" className="text-sm text-muted">
            Ho letto l&apos;
            <Link href="/privacy" className="text-fg underline hover:text-light-text">
              informativa privacy
            </Link>{" "}
            e acconsento a essere ricontattato per questa richiesta. *
          </label>
        </div>
        {err("privacy")}
      </div>

      <p aria-live="assertive" className={cn("text-sm font-semibold", status && "text-alarm-text")}>
        {status}
      </p>

      <button type="submit" className="btn btn-primary justify-self-start">
        Invia la richiesta di sopralluogo
      </button>
    </form>
  );
}
