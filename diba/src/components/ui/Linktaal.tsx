import NextLink from "next/link";
import type { ComponentProps } from "react";
import { eigenPad } from "@/lib/eigen-pad";

/**
 * Dezelfde taalbewuste link als `Taalpad`, maar voor server components.
 *
 * Het verschil zit alleen in waar de taal vandaan komt: hier uit het serverdoosje van
 * `taalcontext`, daar uit het adres in de browser. Zie `Taalpad.tsx` voor het waarom.
 *
 * Twee varianten en niet één, omdat een enkele client-variant elke link op de site in een
 * client component zou veranderen. Op een pagina met honderd links is dat honderd keer
 * javascript voor iets wat de server al weet.
 */
type Props = ComponentProps<typeof NextLink>;

export default function Link({ href, ...rest }: Props) {
  const doel = typeof href === "string" ? eigenPad(href) : href;
  return <NextLink href={doel} {...rest} />;
}
