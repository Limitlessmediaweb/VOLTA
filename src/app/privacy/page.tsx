import { PageHero } from "@/components/ui/PageHero";
import { pageMetadata } from "@/lib/seo";
import { PLAUSIBLE_DOMAIN } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy policy | VOLTA",
  description: "Informativa sul trattamento dei dati personali del sito VOLTA: dati raccolti, finalità, base giuridica, conservazione e diritti.",
  path: "/privacy",
});

const T = () => <span className="tbd">[DA DEFINIRE]</span>;

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Privacy policy" lead="Informativa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR)." />
      <article className="wrap section prose-legal">
        <p role="note" className="rounded-2xl border border-dashed border-light/60 p-5 !text-fg">
          <strong>Bozza da far revisionare prima del lancio.</strong> Questo testo è un modello generico per un progetto concept: va verificato da un
          professionista e adattato all&apos;attività reale.
        </p>
        <p className="mt-6">Ultimo aggiornamento: <T /></p>

        <h2>1. Titolare del trattamento</h2>
        <p>
          Titolare: <T />, con sede in <T />, P.IVA <T />. Email di contatto per la privacy: <T />.
        </p>

        <h2>2. Dati trattati</h2>
        <ul>
          <li>
            <strong>Dati forniti volontariamente</strong> tramite il modulo di richiesta sopralluogo: nome e cognome, numero di telefono, comune
            dell&apos;intervento, tipo di lavoro e il contenuto del messaggio.
          </li>
          <li>
            <strong>Dati di navigazione</strong>: informazioni tecniche raccolte dai sistemi che fanno funzionare il sito (per esempio indirizzo IP,
            tipo di browser, pagine visitate), trattate in forma aggregata o per la sicurezza del servizio.
          </li>
          <li>
            <strong>Comunicazioni telefoniche</strong>: se ci chiami, trattiamo il numero e le informazioni che ci fornisci per gestire la richiesta.
          </li>
        </ul>

        <h2>3. Finalità e base giuridica</h2>
        <ul>
          <li>Rispondere alle richieste di contatto, sopralluogo e preventivo — misure precontrattuali richieste dall&apos;interessato (art. 6.1.b GDPR).</li>
          <li>Eseguire i lavori concordati e gestire gli adempimenti amministrativi e fiscali — contratto e obbligo legale (art. 6.1.b e 6.1.c).</li>
          <li>Garantire la sicurezza e il corretto funzionamento del sito — legittimo interesse del titolare (art. 6.1.f).</li>
          <li>Statistiche aggregate e anonime sull&apos;uso del sito — legittimo interesse (art. 6.1.f), senza profilazione.</li>
        </ul>

        <h2>4. Modalità e conservazione</h2>
        <p>
          I dati sono trattati con strumenti elettronici e misure di sicurezza adeguate. Le richieste di contatto non seguite da un incarico sono
          conservate per <T />; i dati legati a un incarico per il tempo previsto dagli obblighi di legge (<T />).
        </p>

        <h2>5. Destinatari e terze parti</h2>
        <p>I dati possono essere trattati da fornitori che operano per conto del titolare come responsabili del trattamento, tra cui:</p>
        <ul>
          <li>fornitore di hosting del sito: <T />;</li>
          <li>servizio di invio email o gestione del modulo: <T />;</li>
          <li>consulente fiscale o commercialista, per gli adempimenti di legge.</li>
        </ul>
        <p>I dati non sono venduti né ceduti a terzi per finalità di marketing. Eventuali trasferimenti fuori dallo Spazio economico europeo: <T />.</p>

        <h2>6. Cookie e analytics</h2>
        <p>
          Il sito non usa cookie di profilazione. Le preferenze tecniche (tema chiaro o scuro, intro già vista) sono salvate solo nel tuo browser
          tramite localStorage e sessionStorage e non vengono trasmesse.
        </p>
        <p>
          {PLAUSIBLE_DOMAIN
            ? "Per le statistiche usiamo Plausible Analytics, un servizio che non usa cookie e non raccoglie dati personali: le visite sono conteggiate in forma aggregata e anonima."
            : "Se attivate, le statistiche di visita usano Plausible Analytics, un servizio che non usa cookie e non raccoglie dati personali: le visite sono conteggiate in forma aggregata e anonima."}
        </p>

        <h2>7. I tuoi diritti</h2>
        <p>
          Puoi chiedere in qualsiasi momento l&apos;accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la
          portabilità e opporti al trattamento basato sul legittimo interesse (artt. 15–22 GDPR). Hai inoltre diritto di proporre reclamo al Garante
          per la protezione dei dati personali (www.garanteprivacy.it).
        </p>

        <h2>8. Contatti</h2>
        <p>
          Per esercitare i tuoi diritti o per qualsiasi domanda su questa informativa scrivi a <T />.
        </p>
      </article>
    </>
  );
}
