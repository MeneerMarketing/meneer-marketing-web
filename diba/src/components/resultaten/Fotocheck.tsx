import { FOTOVARIABELEN } from "@/data/fotobewijs";

/**
 * De zeven vragen bij een voor-en-na-foto.
 *
 * WAT HIER STOND EN WAAROM NIEMAND HET SNAPTE.
 *
 * Zeven schakelaars, een balk, en een oordeel dat opliep van "deze foto's zeggen niets"
 * naar "0 van 10 punten twijfel weggenomen". Rojda snapte het niet en Yasin ook niet, en
 * dat lag niet aan hen.
 *
 * Het ding vroeg je namelijk om een foto te beoordelen die er niet was. Je moest aanvinken
 * wat een onbekende fotograaf op een onbekende foto gelijk had gehouden — dingen die je per
 * definitie niet weet, want dat is nou juist het punt van de hele pagina. Daar kwam een
 * score uit van tien punten terwijl het kopje "zeven variabelen" zei, met twee schakelaars
 * die stiekem dubbel telden. Drie tellingen die niet met elkaar klopten, over een foto die
 * er niet was.
 *
 * WAT ER NU STAAT.
 *
 * Precies dezelfde inhoud, maar als zeven vragen die je stelt bij een foto die je wél voor
 * je hebt. Op Instagram, op de site van een andere kliniek, straks op die van ons. Per
 * vraag: wat er misgaat als het antwoord nee is, waarom dat zo werkt, en wat wij eraan doen.
 *
 * De drie zwaarste staan als zodanig gemarkeerd. Dat was eerst het dubbele gewicht in de
 * score; nu is het gewoon een zin die zegt dat deze drie het meeste werk doen.
 *
 * Geen schakelaars meer, dus ook geen `use client`: dit is nu tekst en die wordt op de
 * server gerenderd. Scheelt de bezoeker een bundel JavaScript voor iets dat stilstaat.
 */

export default function Fotocheck() {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {FOTOVARIABELEN.map((v) => (
        <li
          key={v.id}
          className="flex h-full flex-col rounded-[var(--r-md)] bg-white p-6 sm:p-7"
        >
          <div className="flex items-baseline gap-3">
            {/* De drie zwaarste. Eerst was dit een verborgen vermenigvuldiging in de
                score; een zin die zegt welke het meeste doen is even waar en veel
                bruikbaarder. */}
            {v.gewicht === 2 ? (
              <span className="diba-label rounded-[var(--r-pill)] bg-[var(--g-075)] px-3 py-1 text-[var(--g-700)]">
                Weegt het zwaarst
              </span>
            ) : null}
          </div>

          <h3 className="diba-card-title mt-4 text-[var(--t-strong)]">
            {v.label}
          </h3>

          <p className="mt-3 text-[15px] leading-7 text-[var(--t-body)]">
            {v.effect}
          </p>

          <p className="mt-3 text-[15px] leading-7 text-[var(--t-muted)]">
            {v.waarom}
          </p>

          <p className="mt-auto border-t border-[var(--g-100)] pt-4 text-[14px] leading-6 text-[var(--t-body)]">
            <span className="diba-label text-[var(--g-700)]">Bij ons</span>
            <span className="mt-2 block">{v.onzeRegel}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}
