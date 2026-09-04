import type { Metadata } from "next";
import Link from "next/link";
import BeeldVignet from "@/components/ui/BeeldVignet";
import { notFound } from "next/navigation";
import Werkingsvenster from "@/components/apparatuur/Werkingsvenster";
import { PillarFaq } from "@/components/pillar/PillarSecties";
import Label from "@/components/ui/Label";
import { APPARATUUR, apparaatVoorSlug } from "@/data/apparatuur";
import { behandelingVoorSlug, prijsTekst } from "@/data/behandelingen";
import { publicCopy } from "@/lib/copy-flags";
import { breadcrumbSchema, SchemaMarkup } from "@/lib/schema";
import { DIBA_SITE_URL } from "@/lib/site";
import { zoekmachineVelden } from "@/lib/seo";

/**
 * De apparatuurpagina's.
 *
 * Eén sjabloon voor alle apparaten, want ze beantwoorden allemaal dezelfde drie vragen:
 * wat is het, wat draait erop, en wat kan het niet.
 *
 * Die derde is de reden dat deze reeks bestaat. Een apparatuurpagina zonder "wat het niet
 * kan" is een merkfolder, en daar heeft niemand iets aan behalve de fabrikant.
 *
 * De koppeling naar behandelingen loopt twee kanten op: hier staat wat er op dit apparaat
 * draait, en op elke behandelpagina staat op welk apparaat die behandeling gaat. Beide
 * komen uit dezelfde tabel in `apparatuur.ts`.
 *
 * WAT ERBIJ IS GEKOMEN.
 *
 * Twee vragen die iemand op zo een pagina heeft en die hier niet beantwoord werden.
 *
 * De eerste: waarom dit apparaat en niet dat andere. Er staan er twaalf op deze site en
 * meerdere doen hetzelfde soort werk. Twee microneedlingpennen, vier apparaten die met
 * licht werken. Wie op de SkinPen belandt wil weten waarom het niet de Dermapen wordt, en
 * dat is precies wat een folder nooit vertelt. Zie `verschilMet` in de apparatuurdata.
 *
 * De tweede: waar het bij helpt. Deze pagina wees door naar behandelingen, en die wijzen
 * door naar huidproblemen, maar de stap van apparaat naar probleem was er niet. Die wordt
 * nu afgeleid uit de behandelingen die erop draaien, dus er valt niets uit de pas te lopen.
 *
 * Eén donkergroen vlak: het nietblok (§5).
 */

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return APPARATUUR.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const a = apparaatVoorSlug(slug);
  if (!a) return {};
  /* Drie apparaten heten net zo als de behandeling die erop draait: CooLift, Dermapen 4
     en de Fotona. Die paren hadden daardoor een identieke paginatitel, en dat is voor
     Google een signaal dat er twee keer hetzelfde staat. Het zijn juist twee verschillende
     pagina's: wat de behandeling met je huid doet tegenover wat het apparaat is. Dat
     verschil hoort dan ook in de titel te staan. */
  return zoekmachineVelden({
    pad: `/apparatuur/${a.slug}`,
    titel: `${a.naam}: het apparaat`,
    omschrijving: publicCopy(a.kort),
    /* Waar we een eigen opname van het apparaat hebben, deelt die beter dan het
       algemene beeld: je herkent het ding uit de behandelkamer. */
    ...(a.foto
      ? {
          beeld: {
            url: a.foto.src.replace("/shoot/", "/og/"),
            alt: a.foto.alt,
          },
        }
      : {}),
  });
}

export default async function ApparaatPage({ params }: PageProps) {
  const { slug } = await params;
  const a = apparaatVoorSlug(slug);
  if (!a) notFound();

  const behandelingen = a.behandelingen
    .map((s) => behandelingVoorSlug(s))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  /* Waar dit apparaat bij helpt: afgeleid uit de behandelingen die erop draaien, niet
     apart bijgehouden. Een tweede lijst zou uiteenlopen zodra er één behandeling
     bijkomt, en dan wijst het apparaat naar een probleem waar het niets meer mee doet. */
  const problemen = [
    ...new Map(
      behandelingen
        .flatMap((b) => b.bijProblemen ?? [])
        .filter((p) => p.href.startsWith("/huidproblemen/"))
        .map((p) => [p.href, p]),
    ).values(),
  ];

  /* De apparaten waar dit apparaat het meest op lijkt, met de naam erbij. */
  const buren = (a.verschilMet ?? [])
    .map((v) => ({ ...v, ander: apparaatVoorSlug(v.apparaat) }))
    .filter((v): v is typeof v & { ander: NonNullable<typeof v.ander> } =>
      Boolean(v.ander),
    );

  return (
    <main className="figma-home bg-[var(--g-010)] text-[var(--t-strong)]">
      <SchemaMarkup
        data={breadcrumbSchema([
          { name: "Home", url: DIBA_SITE_URL },
          { name: "Apparatuur", url: `${DIBA_SITE_URL}/apparatuur` },
          { name: a.naam, url: `${DIBA_SITE_URL}/apparatuur/${a.slug}` },
        ])}
      />

      {/* ── Hero ── */}
      {/* ── De hero ──

          Dit is het sjabloon voor alle twaalf apparatuurpagina's, en het is met opzet
          overal hetzelfde: wie van het ene apparaat naar het andere klikt hoort niet
          telkens een andere opbouw te krijgen.

          Wat er eerst stond: de foto hing onder de tekst in de linkerkolom, op 4:3.
          Daardoor stond een staand apparaat liggend in beeld en zag je een uitsnede van
          het midden in plaats van het ding zelf. Rechts stond een witte kaart met wat
          erop draait, die op een korte pagina halverwege bleef zweven.

          Nu: tekst links, apparaat rechts, en de twee kolommen zijn even lang. Dat laatste
          doet `items-stretch` samen met de `mt-auto` op het blok "Hierop draait": dat blok
          zakt naar de voet van de linkerkolom, dus beide kolommen eindigen op dezelfde
          hoogte. Het beeldvlak is staand en minstens 640 hoog, zodat een apparaat dat
          rechtop staat er ook rechtop in past.

          Zonder foto vervalt de rechterkolom en loopt de tekst over de volle breedte. Dat
          is beter dan een grijs vlak: twee apparaten wachten nog op een opname waarvan
          zeker is welk apparaat erop staat. */}
      <section className="mx-auto px-5 sm:px-9 lg:px-[7.5vw]">
        <div
          className={`grid gap-8 py-14 lg:items-stretch lg:gap-12 lg:py-20 ${
            a.foto ? "lg:grid-cols-[1fr_0.82fr]" : ""
          }`}
        >
          <div className="flex flex-col">
            <nav
              aria-label="Kruimelpad"
              className="diba-label flex flex-wrap gap-2"
            >
              <Link href="/" className="hover:text-[var(--g-700)]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/apparatuur" className="hover:text-[var(--g-700)]">
                Apparatuur
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--t-muted)]">{a.naam}</span>
            </nav>

            <div className="mt-8">
              {a.merk ? <Label>{a.merk}</Label> : null}
              <h1 className="diba-display-l mt-3 max-w-[16ch]">{a.naam}</h1>
              {/* Alleen waar de fabrikant een eigen site heeft. Extern, dus in een
                  nieuw tabblad; de bezoeker is hier nog niet klaar. */}
              {a.merk && a.merkUrl ? (
                <a
                  href={a.merkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diba-label mt-4 inline-flex min-h-11 items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                >
                  Meer over dit apparaat bij {a.merk}
                  <span aria-hidden="true">›</span>
                </a>
              ) : null}
            </div>

            <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(a.kort)}
            </p>

            <p className="mt-6 max-w-[54ch] text-[16px] leading-7 text-[var(--t-body)]">
              {publicCopy(a.wat)}
            </p>

            {/* Wat erop draait, onderaan de kolom.

                `mt-auto` duwt dit blok naar de voet, zodat de tekstkolom even lang wordt als
                het beeld ernaast. De hele reden dat deze pagina naast de behandelpagina
                bestaat staat hier, dus hij mag niet wegzakken onder de vouw. */}
            <div className="mt-auto rounded-[var(--r-lg)] bg-white p-7 pt-10 sm:p-9">
              <Label>Hierop draait</Label>
              {behandelingen.length > 0 ? (
                <ul className="mt-5 space-y-2">
                  {behandelingen.map((b) => (
                    <li key={b.slug}>
                      <Link
                        href={`/behandelingen/${b.slug}`}
                        className="-mx-4 flex items-baseline justify-between gap-4 rounded-[var(--r-sm)] px-4 py-3 transition-colors hover:bg-[var(--g-050)]"
                      >
                        <span className="text-[16px] leading-6 font-medium text-[var(--t-strong)]">
                          {b.naam}
                        </span>
                        <span className="shrink-0 text-[14px] leading-6 text-[var(--t-muted)] tabular-nums">
                          {prijsTekst(b.prijs)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 text-[15px] leading-7 text-[var(--t-body)]">
                  Nog niet gekoppeld aan een behandeling op deze site.
                </p>
              )}

              <p className="mt-6 text-[14px] leading-6 text-[var(--t-muted)]">
                De behandelaar kiest de instellingen op basis van je huid, je
                gezondheid, de behandelzone en het doel van de behandeling.
              </p>
            </div>
          </div>

          {/* Het apparaat, staand en over de volle hoogte van de kolom. */}
          {a.foto ? (
            <BeeldVignet
              src={a.foto.src}
              alt={a.foto.alt}
              onderschrift={a.merk ? `${a.naam} · ${a.merk}` : a.naam}
              priority
              sizes="(min-width: 1024px) 42vw, 92vw"
              className="min-h-[460px] sm:min-h-[560px] lg:min-h-[640px]"
            />
          ) : null}
        </div>
      </section>

      {/* ── Het mechaniek ── */}
      <section className="px-5 pb-16 sm:px-9 lg:px-[7.5vw] lg:pb-24">
        <div className="mx-auto">
          <div>
            <Label>Hoe het werkt</Label>
            <h2 className="diba-display-m mt-4">
              {a.werkingKop?.kop ?? "Hoe dit apparaat"}{" "}
              <span className="diba-accent">
                {a.werkingKop?.accent ?? "op de huid werkt"}
              </span>
            </h2>
            <p className="max-w-[62ch] mt-6 text-[16px] leading-7 text-[var(--t-body)]">
              Elk apparaat grijpt ergens op aan en komt tot een bepaalde diepte.
              Dat is meteen ook de grens van wat het kan. Hieronder zie je die
              grens, in dezelfde doorsnede als bij elk ander apparaat, zodat je
              ze naast elkaar kunt leggen.
            </p>
          </div>

          <div className="mt-10">
            <Werkingsvenster apparaat={a} />
          </div>

          {/* De techniek zelf.

              Golflengte, pulsduur en werkingsprincipe staan in de brochure van de
              fabrikant, dus er is geen reden ze hier weg te laten. Het is bovendien het
              enige deel van deze pagina dat per apparaat echt verschilt: de tekening, de
              legenda en de veiligheidszin zijn overal gelijk, en twaalf pagina's die verder
              hetzelfde zeggen zitten elkaar in de weg. */}
          {a.techniek?.length ? (
            <div className="mt-16 border-t border-[var(--g-100)] pt-12">
              <Label>De techniek</Label>
              <h3 className="diba-display-s mt-4 max-w-[24ch]">
                Wat de diepte{" "}
                <span className="diba-accent">van dit apparaat bepaalt</span>
              </h3>
              <div className="mt-6 max-w-[68ch] space-y-4">
                {a.techniek.map((alinea) => (
                  <p
                    key={alinea.slice(0, 40)}
                    className="text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {publicCopy(alinea)}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Waarvoor en waarvoor niet ── */}
      <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
        <div className="mx-auto">
          <Label>Wat het wel en niet kan</Label>
          <h2 className="diba-display-m mt-4 max-w-[22ch]">
            Wat een behandeling{" "}
            <span className="diba-accent">met je huid doet</span>
          </h2>
          <p className="mt-6 max-w-[62ch] text-[16px] leading-7 text-[var(--t-body)]">
            Links waar dit apparaat voor gemaakt is, rechts waar het niets aan
            doet.
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <Label>Hiervoor is het gemaakt</Label>
              <ul className="mt-5 space-y-3">
                {a.waarvoor.map((w) => (
                  <li
                    key={w}
                    className="rounded-[var(--r-sm)] bg-white p-5 text-[16px] leading-7 text-[var(--t-body)]"
                  >
                    {publicCopy(w)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <Label>Hiervoor niet</Label>
              <ul className="mt-5 space-y-3">
                {a.nietVoor.map((n) => (
                  <li
                    key={n}
                    className="rounded-[var(--r-sm)] bg-[var(--g-700)] p-5 text-[16px] leading-7 text-[var(--on-dark-body)]"
                  >
                    {publicCopy(n)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waarom dit en niet dat ──
          Er staan twaalf apparaten op deze site en meerdere doen hetzelfde soort werk.
          Wie hier belandt wil weten waarom hij dit apparaat zou krijgen en niet de buur
          ernaast, en dat is precies wat een merkfolder niet vertelt. */}
      {buren.length ? (
        <section className="px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <div>
              <Label>Waarom dit apparaat</Label>
              <h2 className="diba-display-m mt-4">
                Wat er anders is dan{" "}
                <span className="diba-accent">de andere apparaten hier</span>
              </h2>
              <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
                Meerdere apparaten hier doen op het oog hetzelfde. Welke je
                krijgt hangt af van je huid en van wat er gemeten is. Hieronder
                staat waarin ze van elkaar verschillen.
              </p>
            </div>

            <ul className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-start">
              {buren.map((v) => (
                <li
                  key={v.apparaat}
                  className="rounded-[var(--r-lg)] bg-white p-6 sm:p-7"
                >
                  <Label>Tegenover</Label>
                  <p className="diba-card-title mt-2 text-[var(--t-strong)]">
                    {v.ander.naam}
                  </p>
                  {/* Vier regelhoogtes gereserveerd, zoals bij de stapkaarten op de
                      behandelpagina's: even lange teksten geven niet vanzelf even hoge
                      kaarten, want dat hangt af van waar de woorden breken. */}
                  <p className="mt-4 min-h-[4lh] text-[15px] leading-7 text-[var(--t-body)]">
                    {publicCopy(v.verschil)}
                  </p>
                  <Link
                    href={`/apparatuur/${v.ander.slug}`}
                    className="diba-label mt-5 inline-flex min-h-11 items-center gap-1.5 text-[var(--g-700)] underline underline-offset-4 hover:text-[var(--g-800)]"
                  >
                    Naar de {v.ander.naam}
                    <span aria-hidden="true">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Waar het bij helpt ──
          De stap van apparaat naar huidprobleem ontbrak: je kon van hier naar een
          behandeling en van daar naar een probleem, maar niet in één keer. Afgeleid uit
          de behandelingen, zodat er geen tweede lijst is die kan gaan afwijken. */}
      {problemen.length ? (
        <section className="bg-[var(--g-050)] px-5 py-16 sm:px-9 lg:px-[7.5vw] lg:py-24">
          <div className="mx-auto">
            <div>
              <Label>Waar het bij helpt</Label>
              <h2 className="diba-display-m mt-4">
                De problemen waar{" "}
                <span className="diba-accent">dit apparaat bij past.</span>
              </h2>
              <p className="max-w-[62ch] mt-6 text-[17px] leading-8 text-[var(--t-body)]">
                Op elke pagina hieronder staat ook wat er niet lukt bij dit
                apparaat, en of wij die klacht behandelen.
              </p>
            </div>

            <ul className="mt-10 flex flex-wrap gap-3">
              {problemen.map((p) => (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    className="inline-flex min-h-12 items-center rounded-[var(--r-pill)] bg-white px-5 text-[16px] leading-6 text-[var(--t-strong)] transition-colors hover:bg-[var(--g-025)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--g-700)]"
                  >
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* ── Vragen ──

          Deze ontbraken. De behandelpagina's hebben een vragenlijst en deze niet, en dat is
          precies waarom ze half aanvoelen: je leest wat het apparaat is en tot hoe diep het
          komt, en dan houdt het op. De vragen die je op dat moment hebt — waarom dit ding en
          niet dat andere, wat de instelling uitmaakt — staan er dan niet.

          PillarFaq, zodat de indeling dezelfde is als overal en de vragen ook bij Google
          worden aangemeld. */}
      {a.vragen?.length ? (
        <PillarFaq items={a.vragen} onderwerp={`de ${a.naam}`} />
      ) : null}

      {/* ── Afsluiter ──

          Dit was een losse alinea met twee knoppen eronder: de pagina hield gewoon op. De
          behandelpagina's sluiten af met een blok dat het onderwerp terugbrengt naar de
          meting, en die afsluiter is hier eigenlijk nog nodiger. Iemand die op een
          apparaatnaam zoekt, zoekt op het apparaat — terwijl het apparaat het minst
          bepalende deel van de uitkomst is. Dat is het enige wat hier nog gezegd moet
          worden, en het verdient een blok en geen voetnoot. */}
      <section className="px-5 pt-16 sm:px-9 lg:px-[7.5vw] lg:pt-20">
        <div className="mx-auto">
          <div className="rounded-[var(--r-lg)] bg-[var(--g-700)] p-8 text-[var(--on-dark)] sm:p-12">
            <div className="lg:grid lg:grid-cols-[1.18fr_.82fr] lg:gap-14">
              <div>
                <Label opDonker>Eerst meten</Label>
                <h2 className="diba-display-m mt-4 max-w-[20ch]">
                  Het verschil zit in{" "}
                  <span className="diba-accent-on-dark">
                    de hand die het bedient
                  </span>
                </h2>
                <p className="mt-6 max-w-[52ch] text-[16px] leading-7 text-[var(--on-dark-body)]">
                  Dezelfde {a.naam} levert in twee klinieken een ander
                  resultaat. Wat telt is de meting vooraf, de instelling die
                  daarbij hoort en de behandelaar die beoordeelt wat bij jouw
                  huid past.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/intake"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] bg-[var(--on-dark-btn)] px-6 text-[var(--on-dark-btn-text)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-accent)]"
                  >
                    Wat er in een huidconsult gebeurt
                  </Link>
                  <Link
                    href="/apparatuur"
                    className="diba-label inline-flex min-h-12 items-center gap-2 rounded-[var(--r-pill)] border border-white/25 px-6 text-[var(--on-dark)] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--on-dark-accent)]"
                  >
                    Alle apparatuur
                  </Link>
                </div>
              </div>

              {/* De drie dingen die wél het verschil maken, in de volgorde waarin ze
                  gebeuren. Dit is geen opsomming van diensten maar het antwoord op de
                  vraag die de kop stelt — zonder dit is de kop een bewering. */}
              <ul className="mt-12 space-y-6 border-t border-white/15 pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                {[
                  [
                    "De meting",
                    "Onder UV en in normaal licht, zodat je weet wat er zit en hoe diep.",
                  ],
                  [
                    "De instelling",
                    "Sterkte, diepte en pulsduur worden op jouw huid gekozen, niet op een standaard.",
                  ],
                  [
                    "Het eerlijke nee",
                    "Past dit niet bij wat er bij jou aan de hand is, dan zeggen we dat.",
                  ],
                ].map(([kop, uitleg]) => (
                  <li key={kop}>
                    <h3 className="diba-label text-[var(--on-dark-accent)]">
                      {kop}
                    </h3>
                    <p className="mt-2 max-w-[38ch] text-[15px] leading-7 text-[var(--on-dark-body)]">
                      {uitleg}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
