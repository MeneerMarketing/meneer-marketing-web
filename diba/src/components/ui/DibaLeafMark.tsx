/**
 * Het Diba-blad als SVG (DIBA-RULES §8, Addendum A4).
 *
 * Dit is het **officiële pad uit het merkbestand** (`icon01.svg` uit de huisstijl-map),
 * niet nagetekend en niet getraceerd. De viewBox is de opgemeten inktgrens van dat pad
 * (x 28.9–72.3, y 40.8–84.0), zodat het blad de volle hoogte en breedte vult.
 *
 * Wijzig dit pad niet met de hand. Verandert het logo, neem dan het nieuwe pad over uit
 * het merkbestand en meet de inktgrens opnieuw.
 *
 * Twee regels bij gebruik:
 * 1. **Eén blad per vlak.** Het is een merkteken, geen patroon.
 * 2. **Nooit een licht blad achter tekst.** Op een groen vlak zakt tekst dan onder WCAG
 *    AA — al bij 12% dekking. Gebruik daar een blad dat juist dieper is dan het vlak.
 */

const LEAF_PATH =
  "M72.411,40.7681q-.164.26883-.32763.53764a23.08388,23.08388,0,0,0-1.22286,2.4479A44.7" +
  "7158,44.77158,0,0,0,68.09593,53.9154c-2.41529,14.62626-9.90557,22.2925-9.90557,22.29" +
  "26-2.93939,3.0084-8.0581,8.2477-15.42454,7.8522-7.17456-.38511-11.8036-5.86393-12.87" +
  "239-7.19777a32.34281,32.34281,0,0,0,3.5729-.73654,39.19359,39.19359,0,0,0,10.24145-4" +
  ".72564C51.73665,66.11417,57.03853,57.10945,57.99,55.461a74.32692,74.32692,0,0,1-8.31" +
  "453,7.12342,78.06294,78.06294,0,0,1-8.22924,5.26345,39.215,39.215,0,0,1-4.854,2.4898" +
  "1A31.41361,31.41361,0,0,1,28.892,72.39635a23.71658,23.71658,0,0,1,2.17224-8.47611c.8" +
  "1863-1.73348,3.88189-7.64179,18.12272-14.8405A100.41761,100.41761,0,0,1,72.411,40.76" +
  "81Z";

type DibaLeafMarkProps = {
  className?: string;
  /** Pixelmaat. Laat leeg om mee te schalen met de container. */
  size?: number;
};

export default function DibaLeafMark({
  className = "",
  size,
}: DibaLeafMarkProps) {
  return (
    <svg
      viewBox="28.9 40.8 43.4 43.2"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={LEAF_PATH} fill="currentColor" />
    </svg>
  );
}
