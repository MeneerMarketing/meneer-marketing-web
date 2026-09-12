"use client";

import { useState, type FormEvent } from "react";
import {
  SelectField,
  TextField,
  TextareaField,
} from "@/components/ui/FormField";
import { meld } from "@/lib/meten";
import {
  DIBA_EMAIL,
  DIBA_REACTIETIJDEN,
  DIBA_TELEFOON,
  DIBA_TELEFOON_HREF,
  DIBA_WHATSAPP_URL,
} from "@/lib/site";

/**
 * Het contactformulier.
 *
 * Yasin, 10 september 2026: "ik mis een contactformulier om gewoon snel een vraag te
 * stellen." Het stond er bewust niet, met het argument dat een formulier belooft dat er
 * iets aankomt zonder te zeggen wanneer er iemand kijkt. Dat argument gaat niet over
 * formulieren maar over wat je erbij zet, dus staat het er nu bij: onder de knop hoe lang
 * een antwoord op de mail duurt, en waar je heen moet als het haast heeft.
 *
 * WAT ER GEBEURT ALS HET VERSTUREN NOG UIT STAAT.
 *
 * Dan is er geen sleutel voor de maildienst en kan het bericht niet weg. Het formulier
 * gooit het niet weg: het zet alles wat je typte in een mail die in je eigen mailprogramma
 * opent, klaar om te versturen. Zo raakt er niets kwijt en doet de pagina geen belofte die
 * de server niet waar kan maken. Zie `app/api/contact/route.ts`.
 */

const ONDERWERPEN = [
  "Een afspraak maken, verzetten of afzeggen",
  "Een vraag over een behandeling",
  "Een vraag over de kosten of vergoeding",
  "Iets anders",
] as const;

type Stand = "leeg" | "bezig" | "gelukt" | "fout" | "zelf-versturen";

const leeg = {
  naam: "",
  email: "",
  telefoon: "",
  onderwerp: ONDERWERPEN[0] as string,
  bericht: "",
};

export default function Contactformulier() {
  const [velden, setVelden] = useState(leeg);
  const [stand, setStand] = useState<Stand>("leeg");
  const [melding, setMelding] = useState("");

  function zet(sleutel: keyof typeof leeg) {
    return (e: { target: { value: string } }) =>
      setVelden((v) => ({ ...v, [sleutel]: e.target.value }));
  }

  /** Alles wat is ingevuld, als mailtekst. Ook de terugval als versturen uitstaat. */
  function alsMail(): string {
    const regels = [
      `Naam: ${velden.naam}`,
      `E-mail: ${velden.email}`,
      velden.telefoon ? `Telefoon: ${velden.telefoon}` : null,
      "",
      velden.bericht,
    ].filter((r) => r !== null);
    return `mailto:${DIBA_EMAIL}?subject=${encodeURIComponent(
      velden.onderwerp,
    )}&body=${encodeURIComponent(regels.join("\n"))}`;
  }

  async function verstuur(e: FormEvent) {
    e.preventDefault();
    setStand("bezig");
    setMelding("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...velden, website: "" }),
      });
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        verzendenUit?: boolean;
      } | null;

      if (res.ok && data?.ok) {
        /* Alleen het onderwerp gaat mee, en dat is een keuze uit een vaste lijst. Naam,
           mailadres en de vraag zelf horen niet in een statistiekenpakket. */
        meld("contact_verstuurd", { onderwerp: velden.onderwerp });
        setVelden(leeg);
        setStand("gelukt");
        return;
      }
      if (data?.verzendenUit) {
        setStand("zelf-versturen");
        return;
      }
      setStand("fout");
      setMelding(data?.error ?? "Er ging iets mis. Probeer het nog eens.");
    } catch {
      setStand("zelf-versturen");
    }
  }

  if (stand === "gelukt") {
    return (
      <div className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8">
        <p className="diba-card-title text-[var(--t-strong)]">
          Je bericht is verstuurd.
        </p>
        <p className="mt-3 text-[16px] leading-7 text-[var(--t-body)]">
          {DIBA_REACTIETIJDEN.email} Heb je er eerder antwoord op nodig, bel dan{" "}
          <a
            href={DIBA_TELEFOON_HREF}
            className="text-[var(--g-700)] underline underline-offset-4"
          >
            {DIBA_TELEFOON}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStand("leeg")}
          className="diba-label mt-6 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
        >
          Nog een vraag stellen
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={verstuur}
      className="rounded-[var(--r-lg)] bg-white p-6 sm:p-8"
    >
      <p className="diba-card-title text-[var(--t-strong)]">Stel je vraag</p>
      <p className="mt-2 text-[15px] leading-7 text-[var(--t-body)]">
        Je krijgt antwoord van iemand die in de kliniek staat. Wat er bij jouw
        huid kan, zien we pas als we hem gezien hebben.
      </p>

      <div className="mt-6 space-y-4">
        <TextField
          id="contact-naam"
          name="naam"
          label="Naam"
          autoComplete="name"
          required
          value={velden.naam}
          onChange={zet("naam")}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="contact-email"
            name="email"
            type="email"
            label="E-mailadres"
            autoComplete="email"
            required
            value={velden.email}
            onChange={zet("email")}
          />
          <TextField
            id="contact-telefoon"
            name="telefoon"
            type="tel"
            label="Telefoon"
            hint="Alleen als je liever gebeld wordt"
            autoComplete="tel"
            value={velden.telefoon}
            onChange={zet("telefoon")}
          />
        </div>
        <SelectField
          id="contact-onderwerp"
          name="onderwerp"
          label="Waar gaat je vraag over"
          value={velden.onderwerp}
          onChange={zet("onderwerp")}
        >
          {ONDERWERPEN.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </SelectField>
        <TextareaField
          id="contact-bericht"
          name="bericht"
          label="Je vraag"
          rows={5}
          required
          value={velden.bericht}
          onChange={zet("bericht")}
        />

        {/* Het onzichtbare veld tegen scripts. Buiten beeld en buiten de tabvolgorde, dus
            een schermlezer en een toetsenbord komen er niet langs. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0">
          <label htmlFor="contact-website">Laat dit veld leeg</label>
          <input id="contact-website" name="website" tabIndex={-1} />
        </div>
      </div>

      {stand === "fout" ? (
        <p
          role="alert"
          className="mt-5 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4 text-[15px] leading-7 text-[var(--t-strong)]"
        >
          {melding}
        </p>
      ) : null}

      {stand === "zelf-versturen" ? (
        <div
          role="alert"
          className="mt-5 rounded-[var(--r-sm)] bg-[var(--g-025)] p-4"
        >
          <p className="text-[15px] leading-7 text-[var(--t-strong)]">
            Het versturen lukt nu niet. Je vraag is niet weg: hij staat klaar in
            een mail die je zelf verstuurt.
          </p>
          <a
            href={alsMail()}
            className="diba-label mt-3 inline-flex text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
          >
            Open het bericht in je mail
          </a>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={stand === "bezig"}
        className="diba-label mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--r-pill)] bg-[var(--g-700)] px-6 text-white transition-colors hover:bg-[var(--g-800)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)] disabled:opacity-60 sm:w-auto"
      >
        {stand === "bezig" ? "Bezig met versturen…" : "Verstuur je vraag"}
      </button>

      <p className="mt-4 text-[14px] leading-6 text-[var(--t-muted)]">
        {DIBA_REACTIETIJDEN.email} Heb je haast, bel{" "}
        <a
          href={DIBA_TELEFOON_HREF}
          className="text-[var(--g-700)] underline underline-offset-4"
        >
          {DIBA_TELEFOON}
        </a>{" "}
        of stuur een{" "}
        <a
          href={DIBA_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--g-700)] underline underline-offset-4"
        >
          WhatsApp-bericht
        </a>
        . We gebruiken je gegevens alleen om je vraag te beantwoorden.
      </p>
    </form>
  );
}
