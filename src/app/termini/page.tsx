import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Termini d'uso | VOLTA",
  description: "Condizioni d'uso del sito VOLTA: uso consentito dei contenuti, limiti di responsabilità, modifiche e contatti.",
  path: "/termini",
});

const T = () => <span className="tbd">[DA DEFINIRE]</span>;

export default function TerminiPage() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Termini d'uso" lead="Le regole per usare questo sito." />
      <article className="wrap section prose-legal">
        <p role="note" className="rounded-2xl border border-dashed border-light/60 p-5 !text-fg">
          <strong>Bozza da far revisionare prima del lancio.</strong> Modello generico per un progetto concept, da adattare all&apos;attività reale.
        </p>
        <p className="mt-6">Ultimo aggiornamento: <T /></p>

        <h2>1. Oggetto</h2>
        <p>
          Questi termini regolano l&apos;uso del sito gestito da <T /> (di seguito &quot;VOLTA&quot;). Navigando il sito accetti le condizioni qui
          descritte.
        </p>

        <h2>2. Contenuti e informazioni</h2>
        <p>
          Le informazioni sul sito hanno carattere generale e non sostituiscono un sopralluogo o una consulenza tecnica. Prezzi, tempi e condizioni
          dei lavori sono definiti solo nel preventivo scritto.
        </p>

        <h2>3. Condotta dell&apos;utente</h2>
        <ul>
          <li>Usa il sito e il modulo di contatto solo per richieste reali e lecite.</li>
          <li>Non inserire dati di altre persone senza il loro consenso.</li>
          <li>Non tentare di compromettere la sicurezza o il funzionamento del sito.</li>
        </ul>

        <h2>4. Proprietà intellettuale</h2>
        <p>Testi, grafica, illustrazioni e marchi sono protetti. Non è consentito riprodurli senza autorizzazione scritta.</p>

        <h2>5. Responsabilità</h2>
        <p>
          VOLTA cura l&apos;accuratezza dei contenuti ma non garantisce che siano sempre completi o aggiornati, e non risponde di danni derivanti
          dall&apos;uso delle informazioni generali del sito. Per interventi sull&apos;impianto elettrico rivolgiti sempre a un professionista
          abilitato: non intervenire da solo su parti in tensione.
        </p>

        <h2>6. Link esterni</h2>
        <p>Il sito può contenere link a siti di terzi, sui quali VOLTA non ha controllo.</p>

        <h2>7. Privacy</h2>
        <p>
          Il trattamento dei dati personali è descritto nella{" "}
          <Link href="/privacy" className="text-fg underline hover:text-light-text">
            privacy policy
          </Link>
          .
        </p>

        <h2>8. Modifiche</h2>
        <p>Questi termini possono essere aggiornati. La versione valida è quella pubblicata su questa pagina, con la data di ultimo aggiornamento.</p>

        <h2>9. Legge applicabile e contatti</h2>
        <p>
          Si applica la legge italiana. Foro competente: <T />. Per domande su questi termini scrivi a <T />.
        </p>
      </article>
    </>
  );
}
