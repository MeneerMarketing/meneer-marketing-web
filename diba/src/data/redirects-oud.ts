/**
 * De adressen van de oude WordPress-site.
 *
 * WAT HET PROBLEEM WAS.
 *
 * De oude site staat nog in Google. Elk van die adressen bestaat op deze site niet meer, dus
 * wie erop klikt komt op de 404. Yasin, 15 september 2026: "de oude geindexeerde links van
 * de oude diba site staan nog in google waardoor er heel veel mensen op de 404 pagina
 * komen." Een 404 is het einde van het bezoek, en de waarde die zo'n adres in jaren heeft
 * opgebouwd gaat er in zijn geheel mee verloren.
 *
 * Een 301 doet twee dingen tegelijk: hij brengt de bezoeker alsnog waar hij heen wilde, en
 * hij vertelt Google dat de pagina verhuisd is in plaats van verdwenen. Dat tweede is de
 * reden dat dit haast heeft: hoe langer een adres 404 geeft, hoe minder er van die waarde
 * over is tegen de tijd dat de omleiding er staat.
 *
 * WAT ER NIET IN STAAT, EN WAAROM.
 *
 * /es en /es/tratamientos. De CSV wees die naar het Engels, want toen hij gemaakt werd was
 * er geen Spaanse site meer. Inmiddels wel: /es is onze Spaanse homepage en /es/tratamientos
 * het Spaanse behandeloverzicht, dus die twee adressen dragen nog steeds hetzelfde soort
 * pagina als vroeger. Een omleiding zou hier schade doen in plaats van herstellen — Next
 * handelt omleidingen namelijk vóór de routes af, dus onze eigen pagina zou onbereikbaar
 * worden. `npm run omleidingen` bewaakt dat.
 *
 * WAAR DE SPAANSE ADRESSEN HEEN GAAN.
 *
 * Naar het Engels, niet naar het Spaans. Het Spaans is nog niet af: het staat op `noindex`
 * en het is met opzet niet in de taalkiezer te kiezen (zie `TAAL_AF` in lib/taal.ts). Wie
 * uit Google komt hoort dan een complete pagina te krijgen in een taal die hij waarschijnlijk
 * leest, en niet een halfvertaalde. Zodra het Spaans af is, is dit blok de plek om dat om te
 * zetten.
 *
 * DIT BESTAND WORDT GEGENEREERD.
 *
 * Door `scratch/maak-oude-omleidingen.mjs` uit de CSV van Yasin, met de eindbestemming
 * opgevraagd bij de draaiende site. De CSV wees de Engelse en Spaanse adressen namelijk naar
 * Nederlandse slugs met /en ervoor (/en/behandelingen/hydrafacial), zoals het Engels twee
 * dagen heette. Die staan hier als hun huidige adres, zodat er één sprong nodig is en niet
 * twee. Verander je een slug in `lib/slugs.ts`, draai het script dan opnieuw.
 */
export const OUDE_SITE_REDIRECTS: readonly {
  source: string;
  destination: string;
}[] = [
  /* ── Nederlands (44) ── */
  { source: "/behandelingen/huidaandoeningen", destination: "/huidproblemen" },
  {
    source: "/behandelingen/huidaandoeningen/acnelittekens-acne-therapie",
    destination: "/huidproblemen/acne-littekens",
  },
  {
    source: "/behandelingen/huidaandoeningen/fibromen",
    destination: "/behandelingen/fibromen",
  },
  {
    source: "/behandelingen/huidaandoeningen/hyperpigmentatie-en-melasma",
    destination: "/huidproblemen/melasma",
  },
  {
    source: "/behandelingen/huidaandoeningen/hyperpigmentatie-intieme-zones",
    destination: "/behandelingen/dermamelan-intimate",
  },
  {
    source: "/behandelingen/huidaandoeningen/ongewenste-haargroei",
    destination: "/behandelingen/laserontharing",
  },
  {
    source: "/behandelingen/huidaandoeningen/rosacea",
    destination: "/huidproblemen/rosacea",
  },
  {
    source: "/behandelingen/huidaandoeningen/rug-acne",
    destination: "/huidproblemen/acne",
  },
  {
    source: "/behandelingen/huidaandoeningen/striae-po-littekens",
    destination: "/huidproblemen/littekens",
  },
  {
    source: "/behandelingen/huidaandoeningen/veroudering-anti-aging",
    destination: "/huidproblemen/huidveroudering",
  },
  { source: "/blog", destination: "/kennisbank" },
  /* Controleren: carbon laser peel staat niet meer in het aanbod; Fotona is de dichtstbijzijnde Nd:YAG-pagina */
  { source: "/carbon-laser-peel-nd-yag", destination: "/behandelingen/fotona" },
  {
    source: "/consult-eve-m-huidanalyse",
    destination: "/behandelingen/huidanalyse",
  },
  {
    source: "/consult-gezichtsbehandeling-observ-520",
    destination: "/behandelingen/huidanalyse",
  },
  { source: "/contact-us", destination: "/contact" },
  { source: "/cookie-notice", destination: "/cookiebeleid" },
  /* Zie de reden bij /behandelingen/coolift in redirects.ts. */
  {
    source: "/coolift-cryo-therapy",
    destination: "/behandelingen/skinboosters",
  },
  { source: "/cosmelan-en-dermamelan", destination: "/behandelingen/cosmelan" },
  /* Controleren: behandeling niet meer in aanbod */
  { source: "/cryo-t-elephant", destination: "/behandelingen" },
  { source: "/dermapen-4", destination: "/behandelingen/dermapen-4" },
  { source: "/dermapen-4-concept", destination: "/behandelingen/dermapen-4" },
  { source: "/dermapen4", destination: "/behandelingen/dermapen-4" },
  { source: "/dermaplaning", destination: "/behandelingen/dermaplaning" },
  { source: "/faq", destination: "/kennisbank" },
  { source: "/fotona-4d-timewalker", destination: "/behandelingen/fotona-4d" },
  { source: "/gentle-max-pro", destination: "/gentlemax-pro" },
  { source: "/happy-intim-peel", destination: "/behandelingen/happy-intim" },
  { source: "/hydrafacial-concept", destination: "/behandelingen/hydrafacial" },
  {
    source: "/hydrafacial-md-elite",
    destination: "/behandelingen/hydrafacial",
  },
  { source: "/hydrafacial-syndeo", destination: "/behandelingen/hydrafacial" },
  /* WordPress-menu-artefact; mag ook 410 blijven */
  { source: "/jet-menu/mega-item-22656", destination: "/" },
  { source: "/lumi-8-led", destination: "/behandelingen/led-therapie" },
  {
    source: "/mesotherapy-skinbooster",
    destination: "/behandelingen/skinboosters",
  },
  /* Oude webshop-account; online agenda is de vervanger */
  { source: "/mijn-account", destination: "/afspraak" },
  { source: "/onze-professionals", destination: "/team" },
  { source: "/peelings", destination: "/behandelingen/peelings" },
  { source: "/reserveren", destination: "/afspraak" },
  {
    source: "/skinpen-cit-medisch-microneedling",
    destination: "/behandelingen/skinpen",
  },
  {
    source: "/skinpen-medische-microneedling",
    destination: "/behandelingen/skinpen",
  },
  {
    source: "/vacature-allround-schoonheidsspecialist-huidtherapeut",
    destination: "/vacatures/huidtherapeut",
  },
  { source: "/vature-open-sollicitatie", destination: "/werken-bij" },
  {
    source: "/voedingsintolerantietest",
    destination: "/behandelingen/voedingsintolerantietest",
  },
  {
    source: "/voedingsintolerantietest-2",
    destination: "/behandelingen/voedingsintolerantietest",
  },
  { source: "/wachtlijst", destination: "/afspraak" },

  /* ── Engels (41) ── */
  {
    source: "/en/all-round-beautician-skin-therapist",
    destination: "/en/vacancies/skin-therapist",
  },
  { source: "/en/blog", destination: "/en/knowledge" },
  { source: "/en/booking", destination: "/en/book" },
  {
    source: "/en/carbon-laser-peel-nd-yag",
    destination: "/en/treatments/fotona",
  },
  {
    source: "/en/consultation-facial-treatment-observation-520",
    destination: "/en/treatments/skin-analysis",
  },
  { source: "/en/cookie-notice", destination: "/en/cookie-policy" },
  /* Zie de reden bij /behandelingen/coolift in redirects.ts. */
  {
    source: "/en/coolift-cryo-therapy",
    destination: "/en/treatments/skinboosters",
  },
  { source: "/en/cosmelan-dermamelan", destination: "/en/treatments/cosmelan" },
  { source: "/en/cryo-t-elephant", destination: "/en/treatments" },
  { source: "/en/dermapen-4", destination: "/en/treatments/dermapen-4" },
  { source: "/en/dermaplaning", destination: "/en/treatments/dermaplaning" },
  { source: "/en/faq", destination: "/en/knowledge" },
  {
    source: "/en/food-intolerance-test",
    destination: "/en/treatments/food-intolerance-test",
  },
  {
    source: "/en/food-intolerance-test-2",
    destination: "/en/treatments/food-intolerance-test",
  },
  {
    source: "/en/fotona-4d-timewalker",
    destination: "/en/treatments/fotona-4d",
  },
  {
    source: "/en/fotona-4d-timewalker-rotterdam",
    destination: "/en/treatments/fotona-4d",
  },
  { source: "/en/general-conditions", destination: "/en/terms" },
  { source: "/en/gentle-laser-pro-u", destination: "/en/gentlemax-pro" },
  { source: "/en/happy-intim-peel", destination: "/en/treatments/happy-intim" },
  {
    source: "/en/hydrafacial-syndeo",
    destination: "/en/treatments/hydrafacial",
  },
  {
    source: "/en/hydrafacial-syndeo-rotterdam",
    destination: "/en/treatments/hydrafacial",
  },
  { source: "/en/lumi-8-led", destination: "/en/treatments/led-therapy" },
  {
    source: "/en/medical-peelings-level-i-to-iii",
    destination: "/en/treatments/peels",
  },
  {
    source: "/en/mesotherapy-skinbooster",
    destination: "/en/treatments/skinboosters",
  },
  { source: "/en/open-application", destination: "/en/careers" },
  { source: "/en/our-professionals", destination: "/en/team" },
  { source: "/en/rates", destination: "/en/prices" },
  {
    source: "/en/skinpen-cit-medical-microneedling",
    destination: "/en/treatments/skinpen",
  },
  {
    source: "/en/skinpen-cit-rotterdam",
    destination: "/en/treatments/skinpen",
  },
  {
    source: "/en/treatments/skin-disorders/acne-scars-acne-therapy",
    destination: "/en/skin-concerns/acne-scars",
  },
  {
    source: "/en/treatments/skin-disorders/aging-anti-aging",
    destination: "/en/skin-concerns/skin-ageing",
  },
  {
    source: "/en/treatments/skin-disorders/back-acne-scars",
    destination: "/en/skin-concerns/acne",
  },
  {
    source: "/en/treatments/skin-disorders/hyperpigmentation-intimate-areas",
    destination: "/en/treatments/dermamelan-intimate",
  },
  {
    source: "/en/treatments/skin-disorders/hyperpigmentation-melasma",
    destination: "/en/skin-concerns/melasma",
  },
  {
    source: "/en/treatments/skin-disorders/rosacea",
    destination: "/en/skin-concerns/rosacea",
  },
  {
    source: "/en/treatments/skin-disorders/striae-p-o-scars",
    destination: "/en/skin-concerns/scars",
  },
  {
    source: "/en/treatments/skin-disorders/unwanted-fibroids",
    destination: "/en/treatments/fibromas",
  },
  {
    source: "/en/treatments/skin-disorders/unwanted-hair-growth",
    destination: "/en/treatments/laser-hair-removal",
  },
  { source: "/en/waiting-list", destination: "/en/book" },
  { source: "/en/working-at", destination: "/en/careers" },
  {
    source: "/en/xl-hair-hair-hairbooster",
    destination: "/en/treatments/xl-hair",
  },

  /* ── Spaans, naar het Engels (43) ── */
  { source: "/es/aviso-sobre-cookies", destination: "/en/cookie-policy" },
  { source: "/es/blog", destination: "/en/knowledge" },
  { source: "/es/condiciones-generales", destination: "/en/terms" },
  {
    source: "/es/consulta-facial-observ-520",
    destination: "/en/treatments/skin-analysis",
  },
  {
    source: "/es/cosmelan-y-dermamelan",
    destination: "/en/treatments/cosmelan",
  },
  { source: "/es/crio-t-elefante", destination: "/en/treatments" },
  /* Zie de reden bij /behandelingen/coolift in redirects.ts. */
  {
    source: "/es/crioterapia-coolift",
    destination: "/en/treatments/skinboosters",
  },
  { source: "/es/dermapen-4", destination: "/en/treatments/dermapen-4" },
  { source: "/es/dermaplaning", destination: "/en/treatments/dermaplaning" },
  {
    source: "/es/esteticista-polivalente-terapeuta-de-la-piel",
    destination: "/en/vacancies/skin-therapist",
  },
  {
    source: "/es/exfoliacion-con-laser-de-carbono-nd-yag",
    destination: "/en/treatments/fotona",
  },
  {
    source: "/es/exfoliacion-happy-intim",
    destination: "/en/treatments/happy-intim",
  },
  {
    source: "/es/fotona-4d-timewalker",
    destination: "/en/treatments/fotona-4d",
  },
  {
    source: "/es/fotona-4d-timewalker-rotterdam",
    destination: "/en/treatments/fotona-4d",
  },
  {
    source: "/es/hydrafacial-syndeo-rotterdam",
    destination: "/en/treatments/hydrafacial",
  },
  { source: "/es/laser-suave-pro-u", destination: "/en/gentlemax-pro" },
  { source: "/es/lista-de-espera", destination: "/en/book" },
  { source: "/es/lumi-8-led", destination: "/en/treatments/led-therapy" },
  {
    source: "/es/mesoterapia-skinbooster",
    destination: "/en/treatments/skinboosters",
  },
  { source: "/es/nuestros-profesionales", destination: "/en/team" },
  {
    source: "/es/peladuras-medicas-de-nivel-i-a-iii",
    destination: "/en/treatments/peels",
  },
  { source: "/es/pongase-en-contacto-con", destination: "/en/contact" },
  { source: "/es/preguntas-frecuentes", destination: "/en/knowledge" },
  {
    source: "/es/prueba-de-intolerancia-alimentaria",
    destination: "/en/treatments/food-intolerance-test",
  },
  {
    source: "/es/prueba-de-intolerancia-alimentaria-2",
    destination: "/en/treatments/food-intolerance-test",
  },
  { source: "/es/reservas", destination: "/en/book" },
  {
    source: "/es/sindeo-hidrafacial",
    destination: "/en/treatments/hydrafacial",
  },
  {
    source: "/es/skinpen-cit-microneedling-medico",
    destination: "/en/treatments/skinpen",
  },
  {
    source: "/es/skinpen-cit-rotterdam",
    destination: "/en/treatments/skinpen",
  },
  { source: "/es/solicitud-abierta", destination: "/en/careers" },
  { source: "/es/tarifas", destination: "/en/prices" },
  { source: "/es/trabajar-en", destination: "/en/careers" },
  {
    source: "/es/tratamientos/trastornos-cutaneos",
    destination: "/en/skin-concerns",
  },
  {
    source:
      "/es/tratamientos/trastornos-cutaneos/acne-cicatrices-terapia-del-acne",
    destination: "/en/skin-concerns/acne-scars",
  },
  {
    source:
      "/es/tratamientos/trastornos-cutaneos/acne-en-la-espalda-cicatrices",
    destination: "/en/skin-concerns/acne",
  },
  {
    source:
      "/es/tratamientos/trastornos-cutaneos/crecimiento-de-vello-no-deseado",
    destination: "/en/treatments/laser-hair-removal",
  },
  {
    source:
      "/es/tratamientos/trastornos-cutaneos/envejecimiento-antienvejecimiento",
    destination: "/en/skin-concerns/skin-ageing",
  },
  {
    source: "/es/tratamientos/trastornos-cutaneos/estrias-y-cicatrices-p-o",
    destination: "/en/skin-concerns/scars",
  },
  {
    source: "/es/tratamientos/trastornos-cutaneos/fibromas-no-deseados",
    destination: "/en/treatments/fibromas",
  },
  {
    source: "/es/tratamientos/trastornos-cutaneos/hiperpigmentacion-y-melasma",
    destination: "/en/skin-concerns/melasma",
  },
  {
    source:
      "/es/tratamientos/trastornos-cutaneos/hiperpigmentacion-zonas-intimas",
    destination: "/en/treatments/dermamelan-intimate",
  },
  {
    source: "/es/tratamientos/trastornos-cutaneos/rosacea",
    destination: "/en/skin-concerns/rosacea",
  },
  { source: "/es/xl-hair-hairbooster", destination: "/en/treatments/xl-hair" },

  /* ── Hele takken ──

     Deze staan achteraan omdat de eerste regel die past wint: de losse adressen hierboven
     zijn preciezer en horen dus eerst gelezen te worden. ── */
  /* De losse blogberichten van de oude site. */
  { source: "/blog/:pad*", destination: "/kennisbank" },
  { source: "/en/blog/:pad*", destination: "/en/knowledge" },
  { source: "/es/blog/:pad*", destination: "/en/knowledge" },
  /* De oude huidaandoeningenboom. De negen adressen die in Google staan gaan hierboven naar hun eigen pagina; dit is voor de rest. */
  {
    source: "/behandelingen/huidaandoeningen/:pad*",
    destination: "/huidproblemen",
  },
  {
    source: "/en/treatments/skin-disorders/:pad*",
    destination: "/en/skin-concerns",
  },
  {
    source: "/es/tratamientos/trastornos-cutaneos/:pad*",
    destination: "/en/skin-concerns",
  },
  /* Artefacten van de menubouwer van het oude thema. Ze hebben nooit inhoud gehad. */
  { source: "/jet-menu/:pad*", destination: "/" },
];
