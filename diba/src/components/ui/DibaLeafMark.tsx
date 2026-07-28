/**
 * Het Diba-blad als SVG (DIBA-RULES §8, Addendum A4).
 *
 * Dit pad is niet nagetekend maar **uitgemeten**: het masker van het blad is uit
 * `public/images/diba-icon-dark.png` gehaald, de contour getraceerd en vereenvoudigd tot
 * 24 ankerpunten. Daardoor zit de snede aan de binnenkant er ook echt in — die wig van
 * negatieve ruimte is wat het een blad maakt in plaats van een lensvorm.
 *
 * Wijzig dit pad niet met de hand. Verandert het logo, meet dan opnieuw.
 *
 * Twee regels bij gebruik:
 * 1. **Eén blad per vlak.** Het is een merkteken, geen patroon.
 * 2. **Nooit achter tekst.** Zelfs op 12% dekking zakt tekst op een groen vlak dan onder
 *    WCAG AA. Zet het in de vrije ruimte; dan mag het juist groter en steviger.
 */

const LEAF_PATH =
  "M99.1 0C100.5 2.8 93.7 13.3 91.7 20.6C89.8 28 89 37.3 87.2 44C85.3 50.8 83.6 55.2 " +
  "80.7 61C77.8 66.8 73.3 74.2 69.7 78.9C66.1 83.6 63.1 86.4 59.2 89.4C55.3 92.5 51.2 " +
  "95.6 46.3 97.2C41.4 98.9 35 100 29.8 99.5C24.6 99.1 19.6 97.1 15.1 94.5C10.6 91.9 " +
  "1.8 86.7 2.8 83.9C3.7 81.2 14.8 80.7 20.6 78C26.5 75.3 32.4 72.2 38.1 67.9C43.7 " +
  "63.5 49.9 57.3 54.6 51.8C59.3 46.4 67 35.7 66.1 35.3C65.1 34.9 55.1 44.9 48.6 " +
  "49.5C42.1 54.2 32.6 60.1 27.1 63.3C21.6 66.5 20.1 67.3 15.6 68.8C11.1 70.3 1.9 " +
  "74.8 0 72.5C-1.9 70.1 2.7 58.9 4.1 54.6C5.6 50.3 6.6 49.5 8.7 46.8C10.9 44 13.1 " +
  "41.4 17 38.1C20.9 34.8 25.7 31 32.1 27.1C38.5 23.2 46.9 18.5 55.5 14.7C64.1 10.9 " +
  "76.2 6.6 83.5 4.1C90.7 1.7 97.7 -2.8 99.1 0Z";

type DibaLeafMarkProps = {
  className?: string;
  /** Pixelmaat. Laat leeg om mee te schalen met de container. */
  size?: number;
};

export default function DibaLeafMark({ className = "", size }: DibaLeafMarkProps) {
  return (
    <svg
      viewBox="-3 -4 107 107"
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
