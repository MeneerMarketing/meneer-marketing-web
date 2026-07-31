import { permanentRedirect } from "next/navigation";

/**
 * De oude slug uit PILLARS. De uitgebouwde pagina staat op /huidproblemen/moedervlekken,
 * want dat is het woord waarmee mensen zoeken en waarmee ze het zelf noemen.
 *
 * Deze route blijft bestaan omdat het overzicht en oude links nog naar de oude slug
 * wijzen. Een statische route wint van de dynamische [slug]-route, dus dit vangt hem af
 * voordat de lege sjabloonversie wordt gerenderd.
 */
export default function HuidkankerNaeviRedirect() {
  permanentRedirect("/huidproblemen/moedervlekken");
}
