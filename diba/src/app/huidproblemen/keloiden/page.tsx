import { permanentRedirect } from "next/navigation";

/**
 * Keloïden hebben geen eigen pagina. De littekenpagina behandelt ze als een van de vier
 * beelden, met hetzelfde antwoord dat hier zou staan: keloïd hoort bij de arts, wij
 * verwijzen door, en te stevig behandelen maakt het groter.
 *
 * Een aparte pagina zou dat herhalen in minder woorden, en dat is precies de dunne
 * doorslagpagina die DIBA-RULES §2 verbiedt.
 *
 * Een statische route wint van de dynamische [slug]-route, dus dit vangt hem af voordat
 * de lege sjabloonversie wordt gerenderd.
 */
export default function KeloidenRedirect() {
  permanentRedirect("/huidproblemen/littekens#welke");
}
