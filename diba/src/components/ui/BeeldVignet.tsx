import Image from "next/image";

/**
 * Een foto met een zacht verloop onderin en een witte regel erop.
 *
 * Deze behandeling stond op één plek: de quote-kaart op de homepage. Daar werkt hij zo
 * goed dat hij het waard is om vaker te gebruiken, en dat is precies waarom hij nu een
 * eigen component is in plaats van drie keer overgetypte klassen.
 *
 * WAAROM DIT VERLOOP WEL GROEN MAG EN DE ANDERE NIET.
 *
 * Over de rest van de site zijn de groene wassen eruit gehaald: die lagen over de hele
 * foto en verfden huidtinten naar olijf. Dit verloop doet iets anders. Het begint pas op
 * 35% van onderen, laat de bovenste twee derde van het beeld volledig ongemoeid, en is
 * er om één regel witte tekst te dragen. Dat is een leeslaag, geen filter.
 *
 * Zonder onderschrift verschijnt het verloop niet. Een vignet zonder tekst is versiering,
 * en dat is nu juist wat er weg moest.
 *
 * De tekst is kort gehouden met opzet: dit is een bijschrift en geen alinea. Wat er staat
 * hoort te benoemen wat je ziet, zodat een bezoeker het apparaat of de behandeling
 * herkent, en niet iets te beweren wat de foto niet laat zien.
 */
export default function BeeldVignet({
  src,
  alt,
  onderschrift,
  sizes,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  /** Eén korte regel. Laat weg en het verloop verdwijnt mee. */
  onderschrift?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[var(--r-lg)] bg-[var(--g-050)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-center"
      />

      {onderschrift ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--g-700)]/88 via-[var(--g-700)]/28 to-transparent"
          />
          <p className="diba-label absolute inset-x-0 bottom-0 px-6 pb-6 text-[var(--on-dark)] sm:px-7 sm:pb-7">
            {onderschrift}
          </p>
        </>
      ) : null}
    </div>
  );
}
