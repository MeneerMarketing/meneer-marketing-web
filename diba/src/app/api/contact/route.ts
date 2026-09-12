import { NextResponse, type NextRequest } from "next/server";
import { DIBA_EMAIL } from "@/lib/site";

/**
 * Het contactformulier: waar het bericht heen gaat.
 *
 * WAAROM DIT GEEN PAKKET GEBRUIKT.
 *
 * Resend heeft een gewone HTTPS-koppeling, dus één `fetch` is genoeg. Een maildienst
 * toevoegen aan `package.json` zou de eerste afhankelijkheid van deze site zijn buiten
 * Next en React, en dat voor twintig regels.
 *
 * WAT ER GEBEURT ALS DE SLEUTEL ER NIET IS.
 *
 * Dan antwoordt dit eindpunt met 503 en `verzendenUit: true`, en zet het formulier de
 * ingevulde tekst in een mailtje dat de bezoeker zelf verstuurt. Dat is de eerlijke
 * uitkomst: het alternatief is "bedankt, we nemen contact op" zeggen terwijl er niets
 * verstuurd wordt, en dan wacht iemand op een antwoord dat nooit komt.
 *
 * [GEGEVEN-NODIG: RESEND_API_KEY en CONTACT_AFZENDER in de omgeving zetten, Yasin. De
 * afzender moet een adres zijn op een domein dat bij Resend geverifieerd is; het antwoord
 * gaat via reply-to naar de bezoeker.]
 */

const MAX = {
  naam: 120,
  email: 200,
  telefoon: 40,
  onderwerp: 80,
  bericht: 4000,
} as const;

/** Waar een vraag over kan gaan. Dezelfde lijst als in het formulier. */
const ONDERWERPEN = [
  "Een afspraak maken, verzetten of afzeggen",
  "Een vraag over een behandeling",
  "Een vraag over de kosten of vergoeding",
  "Iets anders",
] as const;

/**
 * Een eenvoudige rem op herhaald versturen.
 *
 * In het geheugen van het proces en dus niet waterdicht: bij meerdere instanties telt elke
 * instantie apart. Het houdt wel de gewone dubbele klik en het simpele scriptje tegen, en
 * dat is negenennegentig procent van wat er op een formulier van een kliniek gebeurt.
 */
const VERSTUURD = new Map<string, { aantal: number; tot: number }>();
const VENSTER_MS = 10 * 60 * 1000;
const MAX_PER_VENSTER = 5;

function teVaak(ip: string): boolean {
  const nu = Date.now();
  const staat = VERSTUURD.get(ip);
  if (!staat || staat.tot < nu) {
    VERSTUURD.set(ip, { aantal: 1, tot: nu + VENSTER_MS });
    return false;
  }
  staat.aantal += 1;
  return staat.aantal > MAX_PER_VENSTER;
}

function schoon(waarde: unknown, max: number): string {
  return typeof waarde === "string" ? waarde.trim().slice(0, max) : "";
}

/** Genoeg om een typefout te vangen, niet zo streng dat een geldig adres afvalt. */
function lijktOpEmail(waarde: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(waarde);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ongeldig verzoek." },
      { status: 400 },
    );
  }

  /* Het onzichtbare veld. Een mens laat het leeg; een script vult alles in. */
  if (schoon(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const naam = schoon(body.naam, MAX.naam);
  const email = schoon(body.email, MAX.email);
  const telefoon = schoon(body.telefoon, MAX.telefoon);
  const gekozen = schoon(body.onderwerp, MAX.onderwerp);
  const onderwerp = (ONDERWERPEN as readonly string[]).includes(gekozen)
    ? gekozen
    : ONDERWERPEN[3];
  const bericht = schoon(body.bericht, MAX.bericht);

  if (!naam || !bericht || !lijktOpEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Vul je naam, een geldig e-mailadres en je vraag in.",
      },
      { status: 400 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "onbekend";
  if (teVaak(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Er zijn net meerdere berichten vanaf dit adres verstuurd. Probeer het over een paar minuten opnieuw, of bel ons.",
      },
      { status: 429 },
    );
  }

  const sleutel = process.env.RESEND_API_KEY?.trim();
  const afzender = process.env.CONTACT_AFZENDER?.trim();
  /**
   * Waar de vraag heen gaat. Meerdere adressen mag, gescheiden door komma's.
   *
   * Dat is er bewust in gezet voor de overgang: tijdens het testen gaat de post naar een
   * postvak waar je zelf bij kunt, en bij het omzetten naar de kliniek kunnen ze even
   * allebei meelezen. Eén adres blijft gewoon werken; zonder instelling is het het adres
   * uit `lib/site.ts`.
   */
  const ontvangers = (process.env.CONTACT_ONTVANGER?.trim() || DIBA_EMAIL)
    .split(",")
    .map((adres) => adres.trim())
    .filter(Boolean);

  if (!sleutel || !afzender) {
    return NextResponse.json(
      {
        ok: false,
        verzendenUit: true,
        error: "Het versturen staat nog niet aan.",
      },
      { status: 503 },
    );
  }

  const regels = [
    `Naam: ${naam}`,
    `E-mail: ${email}`,
    telefoon ? `Telefoon: ${telefoon}` : null,
    `Onderwerp: ${onderwerp}`,
    "",
    bericht,
  ]
    .filter((r) => r !== null)
    .join("\n");

  try {
    const antwoord = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sleutel}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: afzender,
        to: ontvangers,
        reply_to: email,
        subject: `Contactformulier: ${onderwerp}`,
        text: regels,
      }),
    });

    if (!antwoord.ok) {
      return NextResponse.json(
        {
          ok: false,
          verzendenUit: true,
          error: "Het bericht kon niet verstuurd worden.",
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        verzendenUit: true,
        error: "Het bericht kon niet verstuurd worden.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
