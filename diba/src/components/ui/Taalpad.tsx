"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { inTaal } from "@/lib/taalpad";

/**
 * Een link die in je eigen taal blijft.
 *
 * HET PROBLEEM. De hele site verwijst naar Nederlandse adressen: `/tarieven`,
 * `/huidproblemen/acne`, `/behandelingen/hydrafacial`. Sta je op de Engelse kant, dan brengt
 * zo'n link je terug naar het Nederlands, en dat is precies wat een taalkeuze niet hoort te
 * doen. Yasin, 12 september 2026: "ik wil gewoon dat alle teksten op dezelfde site in het
 * engels worden weergegeven."
 *
 * WAT DIT DOET. Sta je onder /en, dan krijgt elk intern adres er /en voor. `/tarieven` wordt
 * `/en/tarieven`. Sta je op het Nederlands, dan verandert er niets. Externe adressen,
 * telefoonnummers, mailadressen en ankers blijven zoals ze zijn.
 *
 * WAAROM DIT EEN COMPONENT IS EN GEEN KLIKAFVANGER. Een afvanger op document-niveau zou
 * dezelfde klik kunnen omleiden, maar dan staat er in de HTML nog steeds een Nederlands
 * adres: dat is wat een zoekmachine leest en wat je kopieert als je de link in een nieuw
 * tabblad opent. Dit zet het goede adres in de pagina zelf.
 */

type Props = ComponentProps<typeof NextLink>;

export default function Link({ href, ...rest }: Props) {
  const pad = usePathname() ?? "/";
  const doel = typeof href === "string" ? inTaal(href, pad) : href;
  return <NextLink href={doel} {...rest} />;
}
