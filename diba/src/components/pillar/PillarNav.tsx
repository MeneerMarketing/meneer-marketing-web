"use client";

import { useEffect, useState } from "react";

/**
 * Meelopende inhoudsnavigatie voor de lange huidprobleem-paginas.
 *
 * Deze pagina is bewust lang. Zonder oriëntatie is dat vervelend, dus loopt er een dunne
 * balk mee die laat zien waar je bent. De actieve sectie is de onderste die de bovenkant
 * van het scherm is gepasseerd; dat leest natuurlijker dan het midden van het scherm.
 *
 * Verdwijnt onder lg: op een telefoon kost hij meer ruimte dan hij oplevert, en daar
 * scrol je toch lineair.
 */

type Anker = { readonly id: string; readonly label: string };

export default function PillarNav({ ankers }: { ankers: readonly Anker[] }) {
  const [actief, setActief] = useState(ankers[0]?.id ?? "");

  useEffect(() => {
    const bepaal = () => {
      let huidig = ankers[0]?.id ?? "";
      for (const a of ankers) {
        const el = document.getElementById(a.id);
        if (el && el.getBoundingClientRect().top <= 140) huidig = a.id;
      }
      setActief(huidig);
    };
    bepaal();
    window.addEventListener("scroll", bepaal, { passive: true });
    window.addEventListener("resize", bepaal);
    return () => {
      window.removeEventListener("scroll", bepaal);
      window.removeEventListener("resize", bepaal);
    };
  }, [ankers]);

  return (
    <nav
      aria-label="Op deze pagina"
      className="sticky top-[var(--nav-h)] z-20 hidden border-b border-[var(--g-100)] bg-[var(--g-010)]/92 backdrop-blur-sm lg:block"
    >
      <ol className="mx-auto flex flex-wrap items-center gap-x-7 gap-y-2 px-5 py-3.5 sm:px-9 lg:px-[7.5vw]">
        {ankers.map((a) => {
          const gekozen = a.id === actief;
          return (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                aria-current={gekozen ? "true" : undefined}
                className={`diba-label inline-block border-b-[1.5px] pb-0.5 transition-colors ${
                  gekozen
                    ? "border-[var(--g-700)] text-[var(--g-700)]"
                    : "border-transparent text-[var(--t-muted)] hover:text-[var(--g-700)]"
                }`}
              >
                {a.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
