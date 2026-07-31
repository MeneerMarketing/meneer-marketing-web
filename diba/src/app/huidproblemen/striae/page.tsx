import { permanentRedirect } from "next/navigation";

/**
 * Striae hebben geen eigen pagina meer. De littekenpagina behandelt ze volledig, en langs
 * precies dezelfde as: striae rubrae zijn rood en jong, striae albae zijn wit en oud, en
 * dat is hetzelfde verhaal als bij een litteken. Twee pagina's die dat allebei vertellen
 * concurreren met elkaar en zeggen het geen van beide compleet.
 *
 * Deze route blijft bestaan omdat het overzicht en oude links nog naar de losse slug
 * wijzen. Een statische route wint van de dynamische [slug]-route, dus dit vangt hem af
 * voordat de lege sjabloonversie wordt gerenderd.
 */
export default function StriaeRedirect() {
  permanentRedirect("/huidproblemen/littekens");
}
