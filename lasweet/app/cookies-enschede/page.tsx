import { permanentRedirect } from "next/navigation";

/** Engelse zoekintent → canonieke koekjes-pagina */
export default function CookiesEnschedeRedirect() {
  permanentRedirect("/koekjes-enschede");
}
