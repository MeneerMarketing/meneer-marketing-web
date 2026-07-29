/**
 * Het DC-merkicoon (DIBA-RULES §4).
 *
 * Beide paden komen letterlijk uit `icon.svg` in de huisstijlmap. Was een PNG van
 * 928x928 met de D in bijna-zwart (#383734); dat oogde hard naast het groen van de
 * site. De merkmap heeft daar groene varianten voor (#405038, zie icon04 en
 * icon-cirkel03) en die zijn nu de standaard.
 *
 * SVG en geen PNG: scherp op elk formaat, een fractie van de bytes, en de kleur van de
 * D volgt de variant in plaats van vastgebakken te zitten in het beeld.
 *
 * Het blad houdt zijn verloop uit het merkbestand — dat is de enige plek in de huisstijl
 * waar een verloop hoort, want het zit in het logo zelf en is geen decoratie (§2).
 */
"use client";

import { useId } from "react";

const D_PAD =
  "M121.38237,53.558a73.41147,73.41147,0,0,1-.58977,8.86618c-.14741,1.05189-.3147,2.09937-.5655" +
  "3,3.19306a48.55722,48.55722,0,0,1-1.72525,6.05161A47.25631,47.25631,0,0,1,108.5001,91.16827a" +
  "45.51694,45.51694,0,0,1-11.70272,9.7068,47.17436,47.17436,0,0,1-23.762,6.09343H41.43494Q41.3" +
  "2928,96.4948,41.228,86.01668A18.237,18.237,0,0,0,52.24865,83.1075l.09019,18.16807h15.633a42." +
  "54678,42.54678,0,0,0,22.58688-6.3245c18.59274-11.81056,19.85589-34.85734,19.9395-37.443a38.5" +
  "0291,38.50291,0,0,0,.12545-3.928c-.0638-4.89631-1.36658-29.94344-20.56889-41.83542A41.26063," +
  "41.26063,0,0,0,67.97184,5.69512h-15.633q-.00987,19.81851-.022,39.637a43.1474,43.1474,0,0,0-1" +
  "0.86649,5.63131q-.00664-9.33492-.01538-18.6698a48.09759,48.09759,0,0,0,17.01932,93.05857,47." +
  "3783,47.3783,0,0,0,22.54289-5.71494l1.82868-.98806,2.79473,5.04376-1.91229.98586a54.723,54.7" +
  "23,0,0,1-25.254,6.22106H53.80883A53.689,53.689,0,0,1,41.43494,24.93928V0H73.03539c14.28625,0" +
  ",26.5369,5.46407,35.46471,15.80022a51.99067,51.99067,0,0,1,9.56157,17.01939,64.13958,64.1395" +
  "8,0,0,1,3.3207,20.73836";

const BLAD_PAD =
  "M72.41145,40.7681q-.164.26882-.32763.53764a23.082,23.082,0,0,0-1.22286,2.4479A44.772,44.772," +
  "0,0,0,68.0964,53.9154c-2.41528,14.62626-9.90557,22.2925-9.90557,22.2926-2.93938,3.0084-8.058" +
  "09,8.2477-15.42454,7.8522-7.17456-.38512-11.8036-5.86394-12.87239-7.19778a32.34058,32.34058," +
  "0,0,0,3.5729-.73654,39.19375,39.19375,0,0,0,10.24146-4.72563C51.73712,66.11417,57.039,57.109" +
  "45,57.99043,55.461a74.32628,74.32628,0,0,1-8.31453,7.12342,78.06229,78.06229,0,0,1-8.22924,5" +
  ".26345,39.21486,39.21486,0,0,1-4.854,2.48981,31.41369,31.41369,0,0,1-7.70015,2.05868,23.7166" +
  "2,23.71662,0,0,1,2.17224-8.47611c.81863-1.73348,3.88189-7.64179,18.12272-14.8405A100.41722,1" +
  "00.41722,0,0,1,72.41145,40.7681Z";

/** groen = lichte achtergrond · wit = donkere achtergrond */
export type DibaIconVariant = "groen" | "wit";

const D_KLEUR: Record<DibaIconVariant, string> = {
  groen: "#405038",
  wit: "#ffffff",
};

type DibaIconProps = {
  variant?: DibaIconVariant;
  size?: number;
  className?: string;
  /** Zet een label als het icoon op zichzelf betekenis draagt. */
  label?: string;
};

export default function DibaIcon({
  variant = "groen",
  size = 56,
  className = "",
  label,
}: DibaIconProps) {
  // Eigen id per instantie: het verloop staat meerdere keren op een pagina en
  // dubbele ids laten alle exemplaren naar de eerste verwijzen.
  const verloopId = `diba-blad-verloop-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 121.38 130.9"
      width={size}
      height={size * (130.9 / 121.38)}
      className={`shrink-0 ${className}`}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true, focusable: false })}
    >
      <defs>
        <linearGradient
          id={verloopId}
          x1="61.55555"
          y1="1098.26206"
          x2="98.0398"
          y2="1098.26206"
          gradientTransform="translate(192.54677 -1030.9787) rotate(11.61156)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#89a183" />
          <stop offset="1" stopColor="#3d4b34" />
        </linearGradient>
      </defs>
      <path d={D_PAD} fill={D_KLEUR[variant]} />
      <path d={BLAD_PAD} fill={`url(#${verloopId})`} />
    </svg>
  );
}
