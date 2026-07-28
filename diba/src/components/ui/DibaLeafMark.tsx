/**
 * Het Diba-blad als SVG (DIBA-RULES §8, Addendum A4).
 *
 * Overgenomen van het logo: één gesloten bladvorm onder 45°, met de nerf die aan de
 * onderkant doorloopt in de steel. Geen adertjes, geen ring, geen losse stip — het logo
 * heeft die ook niet, en juist die soberheid maakt het herkenbaar.
 *
 * Waarom SVG en niet de PNG: dit blad moet meekleuren met het vlak waar het op ligt
 * (crème op groen, groen op crème) en scherp blijven op elk formaat. Een PNG kan dat niet.
 *
 * Regel: **één blad per vlak.** Het is een merkteken, geen patroon.
 */

type DibaLeafMarkProps = {
  className?: string;
  /** Pixelmaat. Laat leeg om mee te schalen met de container. */
  size?: number;
  /**
   * Nerf en steel tonen. Aan op logo-formaat, waar het blad een merkteken is.
   * Uit als het blad groot en doorzichtig als watermerk op een vlak ligt — dan is
   * het silhouet rustiger en zou de nerf alleen ruis toevoegen.
   */
  vein?: boolean;
  /** Extra klassen op de nerf, bijvoorbeeld een afwijkende dekking. */
  veinClassName?: string;
};

export default function DibaLeafMark({
  className = "",
  size,
  vein = true,
  veinClassName = "opacity-45",
}: DibaLeafMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {/* Het blad: twee bogen die elkaar in twee punten raken. De bovenste boog
          bolt iets verder door dan de onderste — dat geeft het z'n natuurlijke helling. */}
      <path
        d="M14 86C8 40 40 8 86 14C92 60 60 92 14 86Z"
        fill="currentColor"
      />
      {/* Nerf en steel in één streek, vanaf buiten de bladpunt tot tweederde omhoog. */}
      {vein ? (
        <path
          d="M3 97C14 86 28 70 43 55C51 47 57 41 62 36"
          stroke="currentColor"
          strokeWidth="4.5"
          strokeLinecap="round"
          className={veinClassName}
        />
      ) : null}
    </svg>
  );
}
