/**
 * Het Spaanse woordenboek van de site.
 *
 * De sleutel is de Nederlandse zin zoals hij in de code staat, letterlijk — dezelfde
 * sleutel als in `en.ts`. Zie `lib/vertaal.ts` voor waarom dat de sleutel is en niet een
 * verzonnen naam.
 *
 * WELK SPAANS.
 *
 * Neutraal Spaans en de tú-vorm. Neutraal omdat de bezoeker net zo goed uit Madrid als uit
 * Bogotá kan komen: geen "vosotros", geen regionale woorden waar een gewoon woord bestaat.
 * De tú-vorm omdat de Nederlandse bron consequent "je" zegt en het Engels "you"; met
 * "usted" zou de Spaanse kant formeler klinken dan de kliniek is, en dat is een andere
 * kliniek dan de andere twee talen laten zien.
 *
 * De beleefdheid zit in de woordkeuze, niet in de aanspreekvorm: "te explicamos" en niet
 * "te vamos a explicar todo lo que".
 *
 * TWEE DINGEN DIE HET SPAANS VRAAGT EN HET NEDERLANDS NIET.
 *
 * GESLACHT VAN DE LEZER. "Je ligt achterover" heeft in het Spaans een mannelijke of een
 * vrouwelijke vorm: tumbado of tumbada. De meeste klanten zijn vrouw, maar niet alle, dus
 * kiezen we de vorm die niemand buitensluit: liever een zin herschrijven ("te tumbas boca
 * arriba") dan een deelwoord met een geslacht. Waar dat niet lukt staat de mannelijke vorm,
 * want dat is in het Spaans de ongemarkeerde.
 *
 * GESLACHT VAN DE BEHANDELAAR. "De behandelaar" wordt "la terapeuta", vrouwelijk. Dat is
 * geen aanname maar de bezetting: de mensen die hier behandelen zijn huidtherapeuten en
 * die zijn bij Diba allemaal vrouw (zie `data/team.ts`). "El/la terapeuta" zou honderd keer
 * een schuine streep in een lopende zin zetten om een geval te dekken dat er niet is.
 *
 * WAT HIER NIET IN HOORT.
 *
 * Reviews. Die zijn door klanten geschreven en een vertaalde review is een verzonnen
 * review. Ze blijven staan zoals ze binnenkwamen.
 *
 * Eigennamen: Diba Clinics, GentleMax Pro, HydraFacial, Nordlys, Fotona, SkinPen, EVE-M.
 * Die vertalen niet, en een merknaam die in het Spaans anders heet is een andere machine.
 *
 * MEDISCHE UITSPRAKEN. Een vertaling kan kloppen als taal en tegelijk een claim
 * verschuiven. Alles wat in het Nederlands een [MEDISCHE-CHECK-ROJDA] draagt, draagt hem
 * hier ook: de vlag staat in de Nederlandse bron en komt via `publicCopy` mee.
 *
 * STAND. Dit woordenboek wordt in golven gevuld. Zolang `TAAL_AF.es` in
 * `lib/taal.ts` op false staat dragen de Spaanse pagina's `noindex`, staan ze niet in de
 * sitemap en biedt hreflang ze niet aan. Een zin die hier nog niet staat valt terug op het
 * Nederlands — zichtbaar, en dat is met opzet: `npm run vreemdetaal es` telt ze.
 */

export const WOORDENBOEK: Readonly<Record<string, string>> = {
  "gebaseerd op": "basado en",
  reviews: "reseñas",
  "Mijn Diba": "Mi Diba",
  "Straks je huid op één plek": "Pronto: tu piel en un solo lugar",
  "Je metingen naast elkaar, van de eerste tot de laatste":
    "Tus mediciones una al lado de la otra, de la primera a la última",
  "Je foto's onder hetzelfde licht, dus echt vergelijkbaar":
    "Tus fotos con la misma luz, así que de verdad se pueden comparar",
  "Je plan, je afspraken en wat er nog komt":
    "Tu plan, tus citas y lo que queda por venir",
  "Dit portaal is nog in ontwikkeling.":
    "Este portal todavía se está construyendo.",
  "Snelle links": "Enlaces rápidos",
  "Diba Clinics, naar de homepage": "Diba Clinics, ir a la página de inicio",
  Hoofdnavigatie: "Navegación principal",
  "Afspraak maken": "Pedir cita",
  "Menu sluiten": "Cerrar el menú",
  Terug: "Volver",
  Bellen: "Llamar",
  Huidproblemen: "Problemas de piel",
  Behandelingen: "Tratamientos",
  "Over Diba": "Sobre Diba",
  Praktisch: "Práctico",
  "Weet je niet hoe het heet": "¿No sabes cómo se llama?",
  Symptoomzoeker: "Buscador de síntomas",
  "Kruis aan wat je ziet en wat je voelt, in gewone woorden. Geen vakterm nodig, en aan het eind weet je waar je moet zijn.":
    "Marca lo que ves y lo que sientes, con palabras normales. No hacen falta términos médicos, y al final sabes a dónde acudir.",
  "Weet je het al? Vul je huidprofiel in":
    "¿Ya lo sabes? Rellena tu perfil de piel",
  "Begin hier": "Empieza aquí",
  "Je huidprofiel": "Tu perfil de piel",
  "Negen vragen over je huid, je routine en wat je al geprobeerd hebt. De site onthoudt je antwoorden, dus je hoeft ze bij de intake niet opnieuw te vertellen.":
    "Nueve preguntas sobre tu piel, tu rutina y lo que ya has probado. La web recuerda tus respuestas, así que no tienes que repetirlas en la consulta.",
  "Liever eerst meten? Naar het huidconsult":
    "¿Prefieres medir primero? A la consulta de la piel",
  "Openbaar en ongefilterd": "Públicas y sin filtrar",
  "Wat klanten zeggen": "Lo que dicen los clientes",
  "Alle reviews staan op Salonized, met datum en zonder selectie vooraf. Wij kunnen er niets uithalen en niets bijzetten.":
    "Todas las reseñas están en Salonized, con su fecha y sin selección previa. No podemos quitar ninguna ni añadir ninguna.",
  "Liever eerst het team zien?": "¿Prefieres ver primero al equipo?",
  "Kruis aan wat je ziet": "Marca lo que ves",
  Kennisbank: "Guías",
  "Alle uitleg op een plek": "Todas las explicaciones en un solo lugar",
  Snurken: "Ronquidos",
  "Waar het geluid ontstaat": "Dónde se origina el sonido",
  "Van binnenuit bekeken": "Visto desde dentro",
  "Wij behandelen dit": "Esto lo tratamos nosotros",
  "Samen met je arts": "Junto con tu médico",
  "Behandeling op advies": "Tratamiento con asesoramiento",
  "Je weet wat je wilt, niet welke behandeling":
    "Sabes lo que quieres, pero no qué tratamiento",
  "Het huidconsult": "La consulta de la piel",
  "Meten, uitleg en een plan op maat":
    "Medir, explicar y un plan hecho a tu medida",
  "Negen stappen, en de site onthoudt het":
    "Nueve pasos, y la web los recuerda",
  "Alle behandelingen": "Todos los tratamientos",
  "Filter op doel en op hersteltijd":
    "Filtra por objetivo y por tiempo de recuperación",
  "Onze apparatuur": "Nuestros equipos",
  "Welk apparaat waarvoor wordt ingezet": "Qué equipo se usa para qué",
  Tarieven: "Precios",
  "Elk tarief, per sessie en per zone": "Cada precio, por sesión y por zona",
  Vergoedingen: "Reembolso",
  "Wat je verzekeraar hiervan vergoedt": "Lo que tu seguro cubre de esto",
  "Meest gevraagd": "Lo más solicitado",
  "Consult met EVE-M": "Consulta con el EVE-M",
  "SkinPen Microneedling": "Microneedling con el SkinPen",
  "Medische peelings": "Peelings médicos",
  "Nordlys IPL bij pigment": "Nordlys IPL para la pigmentación",
  "LED-therapie": "Terapia LED",
  Laserontharing: "Depilación láser",
  "Hoe het werkt": "Cómo funciona",
  "Het apparaat waar we mee werken": "El equipo con el que trabajamos",
  "Wie wij zijn": "Quiénes somos",
  "Over ons": "Sobre nosotros",
  "De kliniek in Rotterdam": "La clínica en Rotterdam",
  "Ons verhaal": "Nuestra historia",
  "Hoe we werken, en waarom zo": "Cómo trabajamos, y por qué así",
  "Het team": "El equipo",
  "Negen mensen, en wie wat doet": "Nueve personas, y quién hace qué",
  "Wat anderen zien": "Lo que ven los demás",
  "Alles op Salonized, zonder selectie vooraf":
    "Todo en Salonized, sin selección previa",
  "Werken bij Diba": "Trabajar en Diba",
  "Twee vacatures en een open sollicitatie":
    "Dos vacantes y una candidatura espontánea",
  "Voor en na je afspraak": "Antes y después de tu cita",
  "Contact en route": "Contacto y cómo llegar",
  "Adres, tijden en hoe snel we antwoorden":
    "Dirección, horarios y en cuánto contestamos",
  "Je eerste afspraak": "Tu primera cita",
  "Wat er in een huidconsult gebeurt": "Lo que pasa en una consulta de la piel",
  Nazorg: "Cuidados posteriores",
  "Per behandeling: wanneer alles weer mag":
    "Por tratamiento: cuándo se puede volver a todo",
  "Goed om te weten": "Conviene saber",
  "Kwaliteit en registraties": "Calidad y registros",
  "Bij welke registers we horen": "A qué registros pertenecemos",
  "Merken en apparatuur": "Marcas y equipos",
  "Waar we mee werken, en waarvoor": "Con qué trabajamos, y para qué",
  "Voor verwijzende zorgverleners": "Para profesionales que derivan",
  "Verwijzen, samenwerken en onze behandelgrenzen":
    "Derivar, colaborar y dónde ponemos el límite",
  "Alle huidproblemen": "Todos los problemas de piel",
  Pigmentvlekken: "Manchas de pigmentación",
  "Littekens en striae": "Cicatrices y estrías",
  Rimpels: "Arrugas",
  Huidanalyse: "Análisis de piel",
  Apparatuur: "Equipos",
  Privacy: "Privacidad",
  Cookies: "Cookies",
  Voorwaarden: "Condiciones",
  "Aangesloten bij en geregistreerd in": "Miembros de y registrados en",
  "Website door": "Web hecha por",
  "Dé huidkliniek": "La clínica de la piel",
  "in Rotterdam": "en Rotterdam",
  Sinds: "Desde",
  "Elke eerste behandeling begint met een meting.":
    "Todo primer tratamiento empieza con una medición.",
  "Bekijk de behandelingen": "Mira los tratamientos",
  Afspraak: "Cita",
  "Voor jou": "Para ti",
  "Waar wil je": "¿Con qué necesitas",
  "hulp bij?": "ayuda?",
  "Veeg langs de klachten en klik door naar het hele verhaal: wat het is, wat eraan te doen valt en wat het kost.":
    "Desliza por los problemas y entra en la historia completa: qué es, qué se puede hacer y cuánto cuesta.",
  "Diba kennisbank": "Guías de Diba",
  "Uitleg per klacht.": "Una explicación por problema.",
  "Naar de kennisbank": "A las guías",
  "Lees meer": "Leer más",
  Huidklachten: "Problemas de piel",
  Waardering: "Valoración",
  "op basis van": "basado en",
  "reviews, bekijk ze op Salonized. Opent in een nieuw tabblad.":
    "reseñas, míralas en Salonized. Se abre en una pestaña nueva.",
  Voettekst: "Pie de página",
  "Huidkliniek in": "Clínica de la piel en",
  ", sinds 2017. Acne, pigment, littekens, huidverbetering en ongewenste haargroei, door huidtherapeuten die eerst meten en daarna pas behandelen.":
    ", desde 2017. Acné, pigmentación, cicatrices, mejora de la piel y vello no deseado, por terapeutas de piel que primero miden y solo después tratan.",
  "Alles onder": "Todo en",
  Klantreviews: "Reseñas de clientes",
  "Geholpen klanten": "Clientes ayudados",
  "Op Zorgkaart": "En Zorgkaart",
  Behandeld: "Tratados",
  "Diba Clinics in cijfers": "Diba Clinics en cifras",
  Kruimelpad: "Ruta de navegación",
  "Op deze pagina": "En esta página",
  Home: "Inicio",
  "In het kort": "En resumen",
  "Hoe diep": "Hasta qué profundidad",
  "Hoe lang": "Cuánto dura",
  Herstel: "Recuperación",
  "Hoe vaak": "Con qué frecuencia",
  "Per sessie": "Por sesión",
  "Plan consult": "Pide consulta",
  "Plan een huidconsult": "Reserva una consulta",
  Vergelijk: "Compara",
  "Vergelijk met de rest": "Compara con el resto",
  "Wat het doet": "Qué hace",
  "Dit draait op": "Esto funciona con",
  "In de afspraak": "En la cita",
  "Wat er gebeurt,": "Lo que pasa,",
  "in volgorde.": "en orden.",
  "Hoe het voelt": "Cómo se siente",
  "Waar het voor is": "Para qué es",
  "Hier werkt het goed bij": "Funciona bien para",
  "Hiervoor kies je iets anders": "Para esto eliges otra cosa",
  "Weet je niet of deze behandeling bij je past?":
    "¿No sabes si este tratamiento te conviene?",
  "Naar advies": "Al tratamiento con asesoramiento",
  "Waarvoor mensen hiermee komen": "Con qué viene la gente a esto",
  "bij hoort": "corresponde esto",
  "Waar we dit voor gebruiken": "Para qué usamos esto",
  "per klacht uitgeschreven": "explicado por problema",
  "Hoort hierbij": "Va con esto",
  "Wat er": "Lo que",
  "bij aansluit": "conecta con esto",
  "Wat het inhoudt": "En qué consiste",
  "De eerste afspraak": "La primera cita",
  huidanalyse: "análisis de piel",
  Huidconsult: "Consulta de la piel",
  Vragen: "Preguntas",
  "Waar het aankomt": "Dónde llega",
  "Elke behandeling begint met reinigen, en dat gaat met de hand. Make-up en talg gaan eraf en de behandelaar loopt na of alles weg is, want een apparaat of een werkstof die op een laagje werkt komt niet bij je huid.":
    "Todo tratamiento empieza con una limpieza, y esa se hace a mano. El maquillaje y el sebo salen, y la terapeuta comprueba que no queda nada, porque un equipo o un principio activo que trabaja sobre una capa nunca llega a tu piel.",
  "merkt in de stoel": "notas en la camilla",
  "Links waar deze behandeling goed werkt, rechts wanneer een andere behandeling meer voor je doet.":
    "A la izquierda, para qué funciona bien este tratamiento; a la derecha, cuándo otro tratamiento hace más por ti.",
  "Boek een behandeling op advies. De behandelaar bekijkt je huid en kiest, en je hoort vooraf wat het wordt en wat het kost.":
    "Reserva un tratamiento con asesoramiento. La terapeuta mira tu piel y elige, y antes de empezar sabes qué será y cuánto cuesta.",
  "Op elke klachtpagina staat wat de klacht is, wat eraan te doen is en wanneer een andere aanpak meer oplevert.":
    "En cada página de un problema encuentras qué es, qué se puede hacer y cuándo otro enfoque da más resultado.",
  "Wat er anders gaat aan de instelling, wat je kunt verwachten en wanneer je hier beter iets anders voor kiest.":
    "Qué cambia en los ajustes, qué puedes esperar y cuándo es mejor elegir otra cosa para esto.",
  "De behandelaar bekijkt je huid, meet met de EVE-M en stelt vast wat er bij jou past. Je hoort meteen om hoeveel sessies het gaat en wat het kost.":
    "La terapeuta mira tu piel, mide con el EVE-M y determina qué te conviene. Enseguida sabes cuántas sesiones hacen falta y cuánto cuesta.",
  Hoornlaag: "Capa córnea",
  Opperhuid: "Epidermis",
  "Bovenste lederhuid": "Dermis superior",
  "Diepe lederhuid": "Dermis profunda",
  Onderhuid: "Hipodermis",
  "Dode cellen en vetten. De waterkering.":
    "Células muertas y lípidos. La barrera del agua.",
  "Pigmentcellen en de deellaag waar nieuwe huid vandaan komt.":
    "Las células de pigmento y la capa que se divide, de donde sale la piel nueva.",
  "Fijne vaatjes, zenuwuiteinden en jong collageen.":
    "Vasos finos, terminaciones nerviosas y colágeno joven.",
  "Haarwortels, talgklieren, grotere vaten en het dragende collageen.":
    "Raíces del pelo, glándulas sebáceas, vasos más grandes y el colágeno que sostiene.",
  "Vetweefsel en de grote bloedvaten.":
    "Tejido graso y los vasos sanguíneos grandes.",
  tot: "hasta",
  Zuiging: "Succión",
  Warmte: "Calor",
  Licht: "Luz",
  Naalden: "Agujas",
  Zuur: "Ácido",
  minuten: "minutos",
  "Waar deze behandeling": "Para qué está pensado",
  "voor bedoeld is": "este tratamiento",
  "De klachten waar dit": "Los problemas a los que",
  "Wat je ervan": "Lo que",
  "Meet, zonder aanraking": "Mide, sin tocar",
  "Nog niet vastgesteld": "Todavía sin determinar",
  "Hier werkt het": "Aquí es donde actúa",
  "Gaat hier doorheen": "Pasa por aquí",
  "Komt hier niet": "Hasta aquí no llega",
  "Wat er gebeurt": "Lo que pasa",
  "Grijpt aan op": "Actúa sobre",
  "Tot hier": "Hasta aquí",
  "Loopt vanzelf door. Klik een stap om zelf te sturen.":
    "Avanza solo. Haz clic en un paso para llevarlo tú.",
  "De verhoudingen zijn schematisch; de diepten erbij zijn dat niet.":
    "Las proporciones son esquemáticas; las profundidades que hay al lado no lo son.",
  "Gangbare waarden voor gezichtshuid. Per plek op het lichaam verschilt de dikte; op de rug is de lederhuid een veelvoud hiervan.":
    "Valores habituales para la piel del rostro. El grosor cambia según la zona del cuerpo; en la espalda la dermis es varias veces esto.",
  "Hoe diep er bij jou gewerkt wordt hangt af van de instelling die de behandelaar kiest.":
    "Hasta qué profundidad se trabaja en tu caso depende del ajuste que elija la terapeuta.",
  "De buitenste laag dode cellen. Wat hier gebeurt zie je snel en het herstelt snel.":
    "La capa exterior de células muertas. Lo que pasa aquí se ve rápido y se recupera rápido.",
  "Waar je pigment zit en waar nieuwe huidcellen vandaan komen.":
    "Donde está tu pigmento y de donde salen las células nuevas de la piel.",
  "Hier begint het bindweefsel. Wat je hier raakt, herstelt met opbouw.":
    "Aquí empieza el tejido conectivo. Lo que tocas aquí se recupera construyendo.",
  "Haarwortels, vaten en de stevigheid van je huid. Diep werken vraagt om een reden.":
    "Raíces del pelo, vasos y la firmeza de tu piel. Trabajar así de profundo pide un motivo.",
  "De hoornlaag": "La capa córnea",
  "De behandeling werkt op de buitenste laag met dode huidcellen; de diepere huidlagen worden niet op dezelfde manier behandeld.":
    "El tratamiento actúa sobre la capa exterior de células muertas; las capas más profundas no se tratan de la misma manera.",
  Losmaken: "Soltar",
  "Een vloeistof maakt de verbinding tussen de buitenste cellen los.":
    "Un líquido suelta la unión entre las células exteriores.",
  Wegzuigen: "Aspirar",
  "Een wervelend mondstuk trekt losgekomen cellen en poriënvulling weg.":
    "Un cabezal giratorio retira las células sueltas y lo que hay dentro de los poros.",
  Terugbrengen: "Devolver",
  "Daarna gaan er werkzame stoffen in dezelfde beweging weer in.":
    "Después entran principios activos en ese mismo movimiento.",
  "Er is doorgaans geen hersteltijd en je kunt na de afspraak je dag vervolgen.":
    "Normalmente no hay tiempo de recuperación y puedes seguir con tu día después de la cita.",
  "Los te doen, of maandelijks als onderhoud.":
    "Se puede hacer suelto, o cada mes como mantenimiento.",
  "Reinigen, exfoliëren en hydrateren. In één doorloop, direct zichtbaar en zonder hersteltijd.":
    "Limpiar, exfoliar e hidratar. En una sola pasada, visible al momento y sin tiempo de recuperación.",
  "Wat een HydraFacial bij ons kost, met welk apparaat we werken en hoe een eerste afspraak verloopt, staat op":
    "Cuánto cuesta aquí un HydraFacial, con qué equipo trabajamos y cómo va una primera cita, está en",
  "HydraFacial in Rotterdam": "HydraFacial en Rotterdam",
  "Een apparaat dat in één behandeling reinigt, de bovenste laag losmaakt, poriën leegzuigt en er daarna werkzame stoffen in brengt. Het werkt op de bovenste lagen, en juist daarom zie je het resultaat direct en heb je geen hersteltijd.":
    "Un equipo que en un solo tratamiento limpia, suelta la capa superior, vacía los poros por succión y después mete principios activos. Trabaja sobre las capas superiores, y justo por eso ves el resultado al momento y no tienes tiempo de recuperación.",
  "HydraFacial, tijdens de behandeling": "HydraFacial, durante el tratamiento",
  "Je ligt achterover en het mondstuk gaat in banen over je gezicht. Wat je voelt is vooral de zuiging: een licht trekkend gevoel dat rond je neus en kin sterker is dan op je wangen. Pijn hoort er niet bij; wel merk je duidelijk waar een porie vastzit.":
    "Te tumbas boca arriba y el cabezal recorre tu cara por franjas. Lo que notas es sobre todo la succión: una sensación de tirón suave, más fuerte alrededor de la nariz y la barbilla que en las mejillas. No duele; sí notas claramente dónde hay un poro obstruido.",
  "Tussendoor wisselt de behandelaar van tip en van vloeistof. De laatste stap voelt koeler dan de rest, omdat er dan serum in plaats van alleen zuiging op je huid komt.":
    "Entre medias, la terapeuta cambia de cabezal y de líquido. El último paso se siente más fresco que el resto, porque ahí llega sérum a tu piel y no solo succión.",
  "Erna ben je meteen klaar. Je huid is roze en voelt strak aan, en dat trekt binnen een uur weg. Make-up kan diezelfde dag, al is het zonde van het resultaat om er meteen overheen te gaan.":
    "Después ya has terminado. Tu piel está rosada y tirante, y eso se va en una hora. Puedes maquillarte ese mismo día, aunque es una pena tapar el resultado enseguida.",
  "Maakt de huid meteen schoner, gladder en frisser":
    "Deja la piel más limpia, más lisa y más fresca al momento",
  "Werkt op verstopte poriën en een doffe huid":
    "Actúa sobre los poros obstruidos y la piel apagada",
  "Is te combineren met een peeling of microneedling":
    "Se puede combinar con un peeling o con microneedling",
  "Voor littekens of pigment dieper in de huid past microneedling beter":
    "Para cicatrices o pigmento más profundo, el microneedling encaja mejor",
  "Voor blijvend verschil in structuur wordt het een reeks behandelingen":
    "Para una diferencia duradera en la textura hacen falta varias sesiones",
  "Bij actieve acne begin je met het acnetraject":
    "Con acné activo empiezas por el programa de acné",
  Poriën: "Poros",
  "Kleiner maken kan niet. Minder zichtbaar wel, en dat scheelt meer dan je denkt.":
    "Hacerlos más pequeños no se puede. Hacerlos menos visibles sí, y eso cambia más de lo que crees.",
  varianten: "opciones",
  "Wat het oplevert": "Lo que te aporta",
  "Lees over": "Lee sobre",
  poriën: "los poros",
  "Droge huid": "Piel seca",
  "droge huid": "la piel seca",
  "Droog en uitgedroogd zijn twee losse assen, en daar gaat het meestal mis.":
    "Seca y deshidratada son dos cosas distintas, y ahí es donde suele torcerse.",
  "Doffe huid": "Piel apagada",
  "doffe huid": "la piel apagada",
  "Een grauwe tint en weinig glans, zonder duidelijke vlekken.":
    "Un tono grisáceo y poco brillo, sin manchas claras.",
  "Onzuivere huid": "Piel con imperfecciones",
  "onzuivere huid": "la piel con imperfecciones",
  "Veelgestelde vragen": "Preguntas frecuentes",
  "Over hydrafacial": "Sobre el HydraFacial",
  "Hoe lang duurt een afspraak?": "¿Cuánto dura una cita?",
  "Hoeveel hersteltijd heb ik nodig?":
    "¿Cuánto tiempo de recuperación necesito?",
  "Hoe vaak moet ik komen?": "¿Cada cuánto tengo que venir?",
  "Wat kost het?": "¿Cuánto cuesta?",
  "Verstopte porien en af en toe een puistje, zonder echte acne.":
    "Poros obstruidos y algún grano de vez en cuando, sin acné de verdad.",
  Over: "Sobre",
  "Reken op": "Cuenta con",
  "minuten in de kliniek. Dat is de tijd die in de agenda voor je gereserveerd staat, inclusief het reinigen vooraf.":
    "minutos en la clínica. Ese es el tiempo que tienes reservado en la agenda, incluida la limpieza previa.",
  Vanaf: "Desde",
  "euro; het bedrag hangt af van de variant die je kiest. Alle varianten staan op de tarievenpagina.":
    "euros; el importe depende de la opción que elijas. Todas las opciones están en la página de precios.",
  "euro per sessie. Alle tarieven staan openbaar op de tarievenpagina.":
    "euros por sesión. Todos los precios están publicados en la página de precios.",
  "Dat hoor je tijdens de intake.": "Eso lo sabes durante la primera consulta.",
  "Los te doen, of maandelijks als onderhoud. Een startreeks is meestal drie tot zes.":
    "Se puede hacer suelto, o cada mes como mantenimiento. Una serie inicial suele ser de tres a seis.",
  hydrafacial: "HydraFacial",
  "Acne en onzuiverheden": "Acné e imperfecciones",
  "Actieve puistjes, mee-eters en een huid die blijft opspelen.":
    "Granos activos, puntos negros y una piel que sigue reaccionando.",
  behandelingen: "tratamientos",
  "Pigment, roodheid en vaatjes": "Pigmentación, rojeces y vasos",
  "Vlekken die blijven staan, roodheid die niet wegtrekt, zichtbare vaatjes.":
    "Manchas que no se van, rojeces que no bajan, vasos visibles.",
  "Littekens, poriën en huidstructuur":
    "Cicatrices, poros y textura de la piel",
  "Putjes na acne, grove poriën, een huid die oneffen aanvoelt.":
    "Hoyos tras el acné, poros abiertos, una piel que se nota irregular.",
  "Huidverjonging en versteviging": "Rejuvenecimiento y firmeza",
  "Lijnen, verslapping en verlies van stevigheid.":
    "Líneas, flacidez y pérdida de firmeza.",
  "Glow en huidonderhoud": "Luminosidad y mantenimiento",
  "Een frisse behandeling zonder hersteltijd, of onderhoud tussendoor.":
    "Un tratamiento fresco sin tiempo de recuperación, o mantenimiento entre medias.",
  "Ongewenste haargroei": "Vello no deseado",
  "Haar dat terugkomt, ingroei, dagelijks scheren.":
    "Pelo que vuelve, pelos encarnados, afeitarse a diario.",
  Haaruitval: "Caída del cabello",
  "Dunner wordend haar en een terugwijkende haarlijn.":
    "Pelo cada vez más fino y una línea del pelo que retrocede.",
  "De huidanalyse": "El análisis de piel",
  "Zo verloopt": "Así va",
  "een traject bij ons": "un tratamiento aquí",
  "We bekijken je huid en bespreken je klacht. Helpt een huidanalyse daarbij, dan meten we met de EVE-M, zodat je later ziet wat er veranderd is.":
    "Miramos tu piel y hablamos de tu problema. Si un análisis de piel ayuda, medimos con el EVE-M, para que más tarde veas qué ha cambiado.",
  "Wat gebeurt er in een huidanalyse?": "¿Qué pasa en un análisis de piel?",
  "Mini-scan, 4 vragen": "Mini escáner, 4 preguntas",
  "Doe de mini-scan": "Haz el mini escáner",
  "Weet je nog niet waar te beginnen? Vier vragen, dertig seconden. Je krijgt een profielschets op basis van wat je zelf aangeeft. Een meting doen we in de kliniek; dit is een eerste indruk.":
    "¿Aún no sabes por dónde empezar? Cuatro preguntas, treinta segundos. Recibes un esbozo de tu perfil según lo que tú indicas. La medición la hacemos en la clínica; esto es una primera impresión.",
  "Start de mini-scan": "Empieza el mini escáner",
  Vorige: "Anterior",
  "Profiel opbouwen…": "Construyendo tu perfil…",
  "Nog geen idee waar te beginnen?": "¿Todavía sin idea de por dónde empezar?",
  "Stel je vraag, dan kijken we samen welke richting past.":
    "Haz tu pregunta y vemos juntos qué dirección encaja.",
  "Stel je vraag": "Haz tu pregunta",
  "Onze werkwijze": "Cómo trabajamos",
  "Hoe een behandeling": "Cómo empieza",
  "bij ons begint": "un tratamiento aquí",
  Eerst: "Primero",
  "Het gesprek": "La conversación",
  "Je vertelt ons wat je klacht is en wat je wilt bereiken.":
    "Nos cuentas cuál es tu problema y qué quieres conseguir.",
  Stap: "Paso",
  van: "de",
  Daarna: "Después",
  "Het onderzoek": "La exploración",
  "De behandelaar bekijkt je huid en maakt zo nodig foto’s.":
    "La terapeuta mira tu piel y hace fotos cuando sirve.",
  "Tot slot": "Por último",
  "Het voorstel": "La propuesta",
  "Je hoort welke behandeling past en wat die gaat kosten.":
    "Sabes qué tratamiento encaja y cuánto va a costar.",
  "Diba Clinics in Rotterdam": "Diba Clinics en Rotterdam",
  "De behandelaars": "Las terapeutas",
  "Behandeld door huidtherapeuten": "Te tratan terapeutas de piel",
  "Bij Diba werken huidtherapeuten, orthomoleculair huidspecialisten en schoonheidsspecialisten. Huidtherapeut is een beschermde titel: daarvoor volg je een hbo-opleiding en sta je ingeschreven in het Kwaliteitsregister Paramedici.":
    "En Diba trabajan terapeutas de piel, especialistas ortomoleculares de la piel y esteticistas. Terapeuta de piel es un título protegido en los Países Bajos: exige una carrera universitaria y estar inscrita en el registro nacional de profesionales paramédicos.",
  "NVH en Kwaliteitsregister Paramedici":
    "NVH y el registro de profesionales paramédicos",
  "Onze huidtherapeuten zijn lid van de beroepsvereniging en staan in het register. Veel aanvullende pakketten stellen dat als eis voor vergoeding.":
    "Nuestras terapeutas de piel son miembros de la asociación profesional y figuran en el registro. Muchas pólizas complementarias lo exigen para reembolsar.",
  "Contracten met zorgverzekeraars": "Contratos con aseguradoras de salud",
  "Of jouw behandeling vergoed wordt, hangt af van je klacht en je aanvullende pakket.":
    "Que tu tratamiento se reembolse depende de tu problema y de tu póliza complementaria.",
  "ANBOS en SKIN Register": "ANBOS y el registro SKIN",
  "De kliniek is aangesloten bij de branchevereniging, met eisen aan opleiding, hygiëne en klachtafhandeling; onze schoonheidsspecialisten staan in het SKIN Register.":
    "La clínica pertenece a la asociación del sector, con requisitos de formación, higiene y gestión de quejas; nuestras esteticistas figuran en el registro SKIN.",
  "Zo werkt een eerste afspraak": "Así va una primera cita",
  "Het traject": "El tratamiento completo",
  "Hoeveel afspraken je nodig hebt.": "Cuántas citas necesitas.",
  "Dat verschilt per klacht en per behandeling. Tijdens de intake hoor je wat er in jouw geval nodig is.":
    "Eso cambia según el problema y según el tratamiento. Durante la primera consulta sabes qué hace falta en tu caso.",
  "Wat we": "Lo que",
  "vastleggen.": "registramos.",
  Pigment: "Pigmentación",
  "Onder UV-licht wordt pigment zichtbaar dat je zelf niet ziet.":
    "Bajo luz UV se ve pigmento que tú no ves.",
  Roodheid: "Rojeces",
  "We leggen vast waar de roodheid zit en hoe fel die nu is.":
    "Registramos dónde están las rojeces y con cuánta fuerza aparecen ahora.",
  Textuur: "Textura",
  "Hoe glad of oneffen je huid is, en waar dat het meest opvalt.":
    "Cómo de lisa o irregular está tu piel, y dónde se nota más.",
  "In de kliniek": "En la clínica",
  "Wat je van een afspraak kunt verwachten.":
    "Lo que puedes esperar de una cita.",
  "Ervaren behandelaars": "Terapeutas con experiencia",
  "We werken sinds 2017 en hebben ruim 55.000 behandelingen gedaan. Die ervaring hoor je terug in het advies dat je krijgt.":
    "Trabajamos desde 2017 y hemos hecho más de 55.000 tratamientos. Esa experiencia se nota en el consejo que recibes.",
  "Je vindt ons in": "Nos encuentras en",
  "Een resultaat met een verwachting": "Un resultado con una expectativa",
  "Je hoort vooraf wat je van de behandeling kunt verwachten en welke kosten daarbij horen. Alle tarieven vind je transparant op deze site.":
    "Antes de empezar sabes qué puedes esperar del tratamiento y qué costes lleva. Todos los precios están publicados de forma transparente en esta web.",
  "Bekijk tarieven": "Ver los precios",
  "Acne & huidzorg": "Acné y cuidado de la piel",
  "Acne: wat wanneer werkt": "Acné: qué funciona y cuándo",
  "Van comedonen tot ontstekingen: welke behandeling bij welk stadium hoort.":
    "De comedones a inflamación: qué tratamiento corresponde a cada fase.",
  "Pigment & melasma": "Pigmentación y melasma",
  "Pigment: een realistisch plan": "Pigmentación: un plan realista",
  "Waarom geduld en bescherming net zo belangrijk zijn als behandeling.":
    "Por qué la paciencia y la protección cuentan tanto como el tratamiento.",
  "Laserontharing uitgelegd": "La depilación láser explicada",
  "Veiligheid, huidtype, zones en wat je per sessie kunt verwachten.":
    "Seguridad, fototipo, zonas y qué puedes esperar por sesión.",
  "Wat mensen erover": "Lo que la gente ha",
  "geschreven hebben": "escrito al respecto",
  "Lees alle reviews": "Lee todas las reseñas",
  "Of controleer ze bij de bron": "O compruébalas en la fuente",
  "Wat mensen het vaakst vragen": "Lo que la gente pregunta más",
  "Dit zijn de vragen die het vaakst gesteld worden voordat iemand een afspraak maakt. Staat die van jou er niet bij,":
    "Estas son las preguntas que más se hacen antes de pedir cita. Si la tuya no está,",
  "bel ons": "llámanos",
  "app ons": "escríbenos por WhatsApp",
  "Moet ik al weten welke behandeling ik wil?":
    "¿Tengo que saber ya qué tratamiento quiero?",
  "Nee. Je komt juist voor advies. We kijken samen wat voor jouw huid en doel passend is.":
    "No. Vienes justamente para que te asesoremos. Vemos juntos qué encaja con tu piel y con tu objetivo.",
  "Wat kost een eerste afspraak?": "¿Cuánto cuesta una primera cita?",
  "Kan ik ook alleen een intake boeken?":
    "¿Puedo reservar solo la primera consulta?",
  "Is een huidanalyse altijd nodig?":
    "¿Siempre hace falta un análisis de piel?",
  "Niet altijd. Wanneer een huidscan waarde toevoegt, leggen we uit wat we meten en waarom.":
    "No siempre. Cuando un escáner de la piel aporta algo, te explicamos qué medimos y por qué.",
  "Jouw eerste afspraak": "Tu primera cita",
  "Plan een intake": "Pide una primera consulta",
  "bij ons in Rotterdam.": "con nosotros en Rotterdam.",
  "Nog niet zeker? Stel je vraag":
    "¿Todavía no lo tienes claro? Haz tu pregunta",
  "Jouw profielschets": "Tu esbozo de perfil",
  Klanten: "Clientes",
  Zorgkaart: "Zorgkaart",
  Reviews: "Reseñas",
  Acne: "Acné",
  "Acne die steeds": "Acné que vuelve",
  terugkomt: "una y otra vez",
  "Acne kent verschillende vormen, en elke vorm vraagt een andere aanpak. We stellen eerst vast waar het bij jou om gaat en behandelen daarop, met peelings, needling, laser of een combinatie.":
    "El acné tiene varias formas, y cada forma pide un enfoque distinto. Primero determinamos de cuál se trata en tu caso y tratamos eso, con peelings, needling, láser o una combinación.",
  "Zit je vooral met wat er is achtergebleven? Dan begint het bij":
    "¿Lo que más te molesta es lo que ha quedado? Entonces empieza por",
  acnelittekens: "las cicatrices acneicas",
  ", want dat is vaak helemaal geen litteken.":
    ", porque muchas veces no es una cicatriz.",
  "Liever eerst een vraag stellen": "¿Prefieres hacer primero una pregunta?",
  "Waar zit het": "Dónde está",
  "Welk type": "Qué tipo",
  "Onder je huid": "Bajo tu piel",
  "Wat helpt": "Qué ayuda",
  "Onze volgorde": "Nuestro orden",
  "Hoe we meten": "Cómo medimos",
  "De acnekaart": "El mapa del acné",
  "Waar het zit,": "Dónde está",
  "zegt wat het is.": "dice qué es.",
  "De kaaklijn wijst iets anders aan dan de T-zone. Bij wangen kan het van buiten komen, van je telefoon of je kussensloop, maar net zo goed hormonaal zijn. En acne op je rug, schouders of borst is een zone op zich, met een eigen oorzaak. Tik aan waar het bij jou zit, dan lezen we mee. Je mag er meerdere kiezen.":
    "La línea de la mandíbula apunta a algo distinto que la zona T. En las mejillas puede venir de fuera, del móvil o de la funda de la almohada, pero igual de bien puede ser hormonal. Y el acné en la espalda, los hombros o el pecho es una zona aparte, con su propia causa. Toca dónde está en tu caso y lo leemos contigo. Puedes elegir varias.",
  "Waar zit het bij jou?": "¿Dónde está en tu caso?",
  "Meerdere mag. De plaats zegt vaak meer over de oorzaak dan hoe erg het eruitziet.":
    "Puedes elegir varias. El sitio suele decir más sobre la causa que lo mal que se vea.",
  Voorhoofd: "Frente",
  Wangen: "Mejillas",
  Neus: "Nariz",
  Kaaklijn: "Línea de la mandíbula",
  Kin: "Barbilla",
  "Buiten het gezicht": "Fuera de la cara",
  "Rug en schouders": "Espalda y hombros",
  "Decolleté en borst": "Escote y pecho",
  "Ga over een zone om te lezen wat die op zichzelf meestal betekent. Tik hem aan om hem mee te tellen in de duiding hiernaast.":
    "Pasa por encima de una zona para leer qué suele significar por sí sola. Tócala para contarla en la lectura de al lado.",
  "Nog niets gekozen": "Todavía no has elegido nada",
  "Tik aan waar het zit": "Toca dónde está",
  "Je kunt meerdere zones kiezen. Waar acne zit vertelt vaak meer over de oorzaak dan hoe het eruitziet.":
    "Puedes elegir varias zonas. Dónde está el acné suele decir más sobre la causa que su aspecto.",
  "Wat wij dan eerst doen": "Lo que hacemos primero",
  "Als je het niet goed kunt aangeven, lopen we de zones tijdens de intake samen na.":
    "Si no lo sabes señalar bien, recorremos las zonas juntos durante la primera consulta.",
  "Dit is een patroonduiding, geen diagnose. Twee mensen met dezelfde zones kunnen een ander plan krijgen. Daarom meten we voordat we behandelen.":
    "Esto es la lectura de un patrón, no un diagnóstico. Dos personas con las mismas zonas pueden recibir un plan distinto. Por eso medimos antes de tratar.",
  "Hoe we dit meten": "Cómo lo medimos",
  Herkenning: "Reconocerlo",
  "Welke acne heb jij?": "¿Qué acné tienes?",
  "Acne is geen één ding. Het type bepaalt wat er wél helpt, en bij één van deze vijf bepaalt het dat je bij de arts hoort en niet bij ons.":
    "El acné no es una sola cosa. El tipo decide qué ayuda de verdad, y con uno de estos cinco decide que te corresponde un médico y no nosotros.",
  "Mee-eters, weinig rood": "Puntos negros, poco rojo",
  "Kleine bultjes en zwarte puntjes, maar niet echt ontstoken":
    "Bultitos y puntos negros, pero sin inflamación de verdad",
  "Rode bultjes en puskopjes": "Granos rojos y con pus",
  "Rode plekjes die opkomen, soms met een wit kopje":
    "Zonas rojas que salen, a veces con una punta blanca",
  "Diepe, pijnlijke knobbels": "Nódulos profundos y dolorosos",
  "Harde bultjes onder je huid die dagen of weken blijven zitten":
    "Bultos duros bajo la piel que se quedan días o semanas",
  "Vooral op kin en kaaklijn": "Sobre todo en la barbilla y la mandíbula",
  "Puistjes op je kin die met je cyclus meekomen":
    "Granos en la barbilla que siguen tu ciclo",
  "Door wrijving of contact": "Por roce o contacto",
  "Puistjes precies waar iets tegen je huid drukt":
    "Granos justo donde algo presiona contra tu piel",
  "comedonale acne": "acné comedoniano",
  "Wat je ziet": "Lo que ves",
  "Een huid die ruw aanvoelt als je eroverheen gaat. Open mee-eters met een donker kopje en gesloten mee-eters die je vooral voelt. Weinig rood, nauwelijks pijnlijk.":
    "Una piel que se nota áspera al pasar la mano. Puntos negros abiertos con la punta oscura y comedones cerrados que sobre todo notas. Poco rojo, casi sin dolor.",
  "Wat het betekent": "Lo que significa",
  "De porie zit dicht, maar je afweer is nog niet in actie gekomen. Dit is het stadium waarin je het meeste kunt vóórkomen in plaats van herstellen.":
    "El poro está cerrado, pero tus defensas aún no han entrado en acción. Esta es la fase en la que más puedes prevenir en lugar de reparar.",
  "Wat wij eerst doen": "Lo que hacemos primero",
  "Poriën reinigen en de verhoorning aanpakken, in stappen en zonder de huid te irriteren. Dit is vaak het traject met de minste sessies.":
    "Limpiar los poros y tratar la acumulación de queratina, por pasos y sin irritar la piel. Suele ser el tratamiento con menos sesiones.",
  "Wat mensen hier vaak verkeerd hebben":
    "Lo que la gente suele entender mal aquí",
  "Die donkere puntjes zijn geen vuil. Het is talg dat aan de lucht is verkleurd. Daarom poetst het er ook niet uit.":
    "Esos puntos oscuros no son suciedad. Es sebo que se ha oscurecido con el aire. Por eso no salen frotando.",
  "Laat dit beeld bekijken": "Deja que miremos esto",
  "Weet je het niet zeker? Dan kiezen we het samen.":
    "¿No lo tienes claro? Lo decidimos juntos.",
  "Acne verloopt in verschillende stadia": "El acné pasa por varias fases",
  "Bij elk stadium kun je iets anders doen. Daarom harder schrobben niet werkt: dat grijpt in op het tweede stadium en maakt het vierde erger. Klik erdoor en kijk wat er verandert.":
    "En cada fase puedes hacer algo distinto. Por eso frotar más fuerte no funciona: actúa sobre la segunda fase y empeora la cuarta. Haz clic y mira qué cambia.",
  HUIDOPPERVLAK: "SUPERFICIE DE LA PIEL",
  TALGKLIER: "GLÁNDULA SEBÁCEA",
  Talg: "Sebo",
  Verhoorning: "Queratinización",
  Bacterie: "Bacteria",
  Ontsteking: "Inflamación",
  Stadium: "Fase",
  "Wat je hiervan merkt": "Lo que notas de esto",
  "Je huid glanst sneller dan je wilt, vooral op je neus en voorhoofd.":
    "Tu piel brilla antes de lo que quieres, sobre todo en la nariz y la frente.",
  "De talgklier zit diep in de huid en maakt vet dat langs de haarschacht naar boven loopt. Onder invloed van hormonen maakt hij meer dan de huid kwijt kan.":
    "La glándula sebácea está profunda en la piel y produce grasa que sube por el tallo del pelo. Por influencia de las hormonas produce más de lo que la piel puede sacar.",
  "Waar je hier iets kunt veranderen": "Dónde puedes cambiar algo aquí",
  "Aan de productie zelf doe je met crème weinig. Wat wél werkt is de afvoer verbeteren, zodat het niet blijft staan.":
    "Con crema haces poco sobre la producción en sí. Lo que sí funciona es mejorar la salida, para que no se quede ahí.",
  "Zonder omwegen": "Sin rodeos",
  "Wat helpt en wat we afraden": "Lo que ayuda y lo que desaconsejamos",
  "Links wat we bij acne doen, rechts wat we afraden. Bij elk punt staat waarom, want een “niet doen” zonder reden onthoudt niemand.":
    "A la izquierda lo que hacemos con el acné, a la derecha lo que desaconsejamos. En cada punto está el porqué, porque un “no lo hagas” sin motivo no se le queda a nadie.",
  "Dit werkt": "Esto funciona",
  "Een huidanalyse voordat we starten, zodat we later onder vergelijkbare omstandigheden kunnen meten":
    "Un análisis de piel antes de empezar, para poder medir después en condiciones comparables",
  "Poriën reinigen en verhoorning aanpakken, in stappen die je huid aankan":
    "Limpiar los poros y tratar la queratinización, en pasos que tu piel aguanta",
  "Ontsteking eerst omlaag, met chemische peelings en kruidenpeels die ook antibacterieel werken. Littekens daarna, nooit tegelijk":
    "Primero bajar la inflamación, con peelings químicos y peelings de hierbas que además son antibacterianos. Las cicatrices después, nunca a la vez",
  "Zonbescherming, elke dag, ook in de winter. Dit voorkomt de donkere vlekken die na een puistje overblijven":
    "Protección solar, todos los días, también en invierno. Así evitas las manchas oscuras que quedan después de un grano",
  "Doorverwijzen naar de arts als het beeld daarom vraagt, ook als je bij ons kwam":
    "Derivarte al médico cuando el cuadro lo pide, aunque hayas venido a nosotros",
  "Dit raden we af": "Esto lo desaconsejamos",
  "Tandpasta of citroensap op een plekje. Het irriteert de huid en laat vaker een donkere vlek achter dan het puistje zelf zou doen":
    "Pasta de dientes o zumo de limón en un grano. Irrita la piel y deja una mancha oscura más a menudo de lo que lo haría el grano",
  "Onder de zonnebank. Het maakt roodheid tijdelijk onzichtbaar en beschadigt intussen je huid":
    "Los rayos UVA. Esconden la rojez un tiempo y mientras tanto dañan tu piel",
  "Dagelijks scrubben. Je haalt de barrière weg die de ontsteking moet beperken":
    "Exfoliar a diario. Quitas la barrera que debe limitar la inflamación",
  "Alcoholtoners die je huid laten trekken. Een uitgedroogde huid maakt méér talg, niet minder":
    "Tónicos con alcohol que dejan la piel tirante. Una piel deshidratada produce más sebo, no menos",
  "Zelf uitknijpen. Je duwt de ontsteking dieper in plaats van eruit. Dit is de snelste route naar een litteken":
    "Apretarte los granos. Empujas la inflamación hacia dentro en vez de hacia fuera. Es la vía más rápida a una cicatriz",
  "Waarom we beginnen": "Por qué empezamos",
  "bij de ontsteking": "por la inflamación",
  "Littekens behandelen op een huid die nog ontstoken is maakt het beeld slechter. Daarom brengen we eerst de ontsteking tot rust en pakken we daarna de littekens aan. Die volgorde levert meer op dan allebei tegelijk proberen.":
    "Tratar cicatrices en una piel que sigue inflamada empeora el cuadro. Por eso primero calmamos la inflamación y después trabajamos las cicatrices. Ese orden da más que intentar las dos cosas a la vez.",
  "Eerst de ontsteking, dan het litteken":
    "Primero la inflamación, después la cicatriz",
  "Laseren of needlen in actieve acne verergert de ontsteking en kan een litteken vastzetten. We wachten tot de huid rustig is voor we beginnen.":
    "Aplicar láser o needling sobre acné activo empeora la inflamación y puede fijar una cicatriz. Esperamos a que la piel esté tranquila antes de empezar.",
  "Medicatie loopt via je arts": "La medicación va por tu médico",
  "Antibiotica, de pil en isotretinoïne schrijft je huisarts of dermatoloog voor. Wij stemmen onze behandeling af op wat jij van je arts meekrijgt.":
    "Los antibióticos, la píldora y la isotretinoína los receta tu médico de cabecera o tu dermatólogo. Ajustamos nuestro tratamiento a lo que te haya dado tu médico.",
  "Geen vast aantal sessies vooraf":
    "Ningún número fijo de sesiones por adelantado",
  "Hoeveel sessies je nodig hebt, hangt af van je huid en hoe die reageert. Vooraf beloven we daarom geen aantal: we meten tussendoor, en stoppen als het niet werkt.":
    "Cuántas sesiones necesitas depende de tu piel y de cómo responde. Por eso no prometemos un número de antemano: medimos por el camino, y paramos si no funciona.",
  "Deze kenmerken volgen we bij acne":
    "Estos son los rasgos que seguimos en el acné",
  "De EVE-M-meting legt je huid vast voordat we beginnen. Bij acne zijn poriën, ontstekingen, roodheid en textuur de assen die tellen. Na acht tot twaalf weken meten we opnieuw en leggen we de twee naast elkaar.":
    "La medición con el EVE-M registra tu piel antes de empezar. En el acné, los poros, las inflamaciones, las rojeces y la textura son los ejes que cuentan. A las ocho o doce semanas medimos otra vez y ponemos las dos una al lado de la otra.",
  "Dat is niet om je te overtuigen. Het is zodat we het kunnen zien als iets niet werkt, en dan iets anders kunnen doen.":
    "Eso no es para convencerte. Es para que podamos verlo cuando algo no funciona, y hacer otra cosa.",
  "Meer over de huidanalyse": "Más sobre el análisis de piel",
  "Grootte en dichtheid, gemeten in plaats van geschat":
    "Tamaño y densidad, medidos en vez de estimados",
  "Hoeveel actieve ontsteking er zichtbaar is en waar":
    "Cuánta inflamación activa se ve y dónde",
  "Oneffenheid, en of er littekens beginnen te ontstaan":
    "Irregularidad, y si empiezan a formarse cicatrices",
  "Veelgestelde vragen over acne": "Preguntas sobre el acné",
  "Kom ik hier van mijn acne af?": "¿Me voy a librar del acné aquí?",
  "Bij de meeste mensen is acne goed te beheersen. Bij sommigen blijft het terugkomen, bijvoorbeeld door hormonen. We zeggen vooraf wat we in jouw geval realistisch vinden, en we meten of het werkt. Beheersing is soms het eerlijke doel, en dat is geen tweede keus.":
    "En la mayoría de las personas el acné se puede controlar bien. En algunas sigue volviendo, por ejemplo por las hormonas. Antes de empezar te decimos qué nos parece realista en tu caso, y medimos si funciona. Controlarlo es a veces el objetivo honesto, y eso no es un segundo premio.",
  "Hoeveel sessies heb ik nodig?": "¿Cuántas sesiones necesito?",
  "Dat hangt af van het type acne, hoe lang het speelt en hoe je huid op de eerste behandelingen reageert. Na de huidanalyse hoor je wat wij verwachten en wat een sessie kost, maar een vast aantal vooraf kunnen we niet beloven.":
    "Depende del tipo de acné, de cuánto tiempo lleva y de cómo responde tu piel a los primeros tratamientos. Después del análisis de piel sabes qué esperamos y cuánto cuesta una sesión, pero no podemos prometer un número fijo de antemano.",
  "Ik heb al alles geprobeerd. Waarom zou dit werken?":
    "Ya lo he probado todo. ¿Por qué iba a funcionar esto?",
  "Eerlijk gezegd weten we dat nog niet. Daarom beginnen we met meten in plaats van behandelen. Als wij denken dat het bij ons niet gaat lukken, zeggen we dat liever nu dan na zes sessies.":
    "Sinceramente, todavía no lo sabemos. Por eso empezamos midiendo en vez de tratando. Si creemos que aquí no va a salir, preferimos decírtelo ahora y no después de seis sesiones.",
  "Mag ik make-up blijven gebruiken?": "¿Puedo seguir usando maquillaje?",
  "Ja. We kijken wel samen naar wat je gebruikt, want een paar veelgebruikte producten houden het beeld in stand zonder dat je het merkt.":
    "Sí. Eso sí, miramos juntos qué usas, porque unos cuantos productos muy corrientes mantienen el cuadro sin que te des cuenta.",
  "Kan ik komen als ik onder behandeling ben bij een dermatoloog?":
    "¿Puedo venir si estoy en tratamiento con un dermatólogo?",
  "Dat kan, en het is vaak juist verstandig. Vertel het ons wel, dan stemmen we af wat veilig combineert met je medicatie.":
    "Puedes, y muchas veces es lo más sensato. Dínoslo, y así vemos qué se combina bien con tu medicación.",
  "Helpt het als ik anders ga eten?": "¿Ayuda si cambio lo que como?",
  "Soms wel. We werken samen met een laboratorium en kunnen een voedingsintolerantietest doen; komt daar iets uit, dan heeft je voeding aanpassen ook echt effect. Zonder die test blijft het gokken, en dan gaan we je hier geen dieet aanpraten.":
    "A veces sí. Trabajamos con un laboratorio y podemos hacer un test de intolerancia alimentaria; si sale algo, cambiar tu alimentación sí tiene efecto. Sin ese test todo es adivinar, y aquí no te vamos a vender una dieta.",
  "Ik heb vooral last van de vlekken die overblijven.":
    "Lo que más me molesta son las marcas que quedan.",
  "Dat zijn meestal geen littekens maar pigmentvlekken. Zonbescherming voorkomt dat ze donkerder worden en dat er nieuwe bij komen, maar het laat een vlek die er al zit niet verdwijnen; daar zijn behandelingen voor nodig. Zit er een kuiltje in de huid, dan is het wél een litteken en kijken we ernaar zodra de huid rustig is.":
    "Normalmente no son cicatrices sino manchas de pigmento. La protección solar evita que se oscurezcan y que salgan nuevas, pero no hace desaparecer una marca que ya está; para eso hacen falta tratamientos. Si hay un hoyito en la piel, entonces sí es una cicatriz, y la miramos en cuanto la piel esté tranquila.",
  "Dat hangt af van de behandeling die bij jouw huid past, en dat stellen we tijdens de intake vast. De intake kost 50 euro; neem je in dezelfde afspraak een behandeling, dan gaat dat bedrag daar weer af. Je hoort dan meteen om hoeveel sessies het gaat en wat het totaal wordt. Alle tarieven per behandeling staan openbaar op de tarievenpagina.":
    "Depende del tratamiento que encaje con tu piel, y eso lo determinamos durante la primera consulta. La consulta cuesta 50 euros; si en esa misma cita te haces un tratamiento, ese importe se descuenta. Ahí mismo sabes de cuántas sesiones hablamos y cuál será el total. Todos los precios por tratamiento están publicados en la página de precios.",
  "Wat anderen": "Lo que otros",
  "erover zeggen.": "dicen al respecto.",
  "Deze komen uit Salonized en zijn niet door ons uitgezocht op inhoud: het zijn de reviews waarin acne, puistjes of onzuiverheden voorkomen. Let op de tijd die erin genoemd wordt, want daar gaat het bij acne om.":
    "Estas vienen de Salonized y no las hemos elegido nosotros por su contenido: son las reseñas en las que aparece el acné, los granos o las imperfecciones. Fíjate en el tiempo que se menciona, porque con el acné de eso se trata.",
  "Bezoek Diba Clinics": "Visita a Diba Clinics",
  "Alle reviews": "Todas las reseñas",
  "Bij deze klacht": "Para este problema",
  "Wat we hiervoor": "Lo que usamos",
  inzetten: "para esto",
  "Van licht tot stevig. De sterkte bepaalt hoe diep het gaat en hoeveel je vervelt.":
    "De suave a fuerte. La concentración decide hasta dónde llega y cuánto se descama la piel.",
  "Met de": "Con el",
  Peelinglijnen: "Líneas de peeling",
  "Chemische peeling in Rotterdam": "Peeling químico en Rotterdam",
  Kruidenpeel: "Peeling de hierbas",
  "Een peeling van fijngemalen kruiden, zonder zuur. Remt de ontsteking en werkt antibacterieel.":
    "Un peeling de hierbas molidas muy finas, sin ácido. Calma la inflamación y actúa contra las bacterias.",
  "Fotona Acne Control": "Fotona Acne Control",
  "Op aanvraag": "A consultar",
  "Laser bij actieve acne, gericht op de ontsteking en de talgklier.":
    "Láser para el acné activo, dirigido a la inflamación y a la glándula sebácea.",
  Acnebehandeling: "Tratamiento de acné",
  "Eén afspraak voor een onrustige huid: reinigen, verstoppingen weghalen, kalmeren. Los te boeken.":
    "Una cita para una piel alterada: limpiar, sacar los tapones, calmar. Se reserva por separado.",
  Acnetraject: "Programa de acné",
  "Een begeleid traject voor acne: behandelingen in de kliniek, producten en controles thuis.":
    "Un programa guiado para el acné: tratamientos en la clínica, productos y controles en casa.",
  "Jongeren acne traject": "Programa de acné juvenil",
  "Een begeleid programma van drie maanden, opgezet voor jongeren tot en met achttien jaar.":
    "Un programa guiado de tres meses, pensado para jóvenes de hasta dieciocho años.",
  Voedingsintolerantietest: "Test de intolerancia alimentaria",
  "Een bloedtest die in kaart brengt op welke voedingsmiddelen je lichaam reageert.":
    "Un análisis de sangre que muestra a qué alimentos reacciona tu cuerpo.",
  "bij Diba Clinics": "en Diba Clinics",
  "Tijdens de intake meten we je huid, bespreken we het type en hoor je wat we verwachten en hoe we dat tussendoor meten. Ook als het antwoord is dat je beter even wacht.":
    "Durante la primera consulta medimos tu piel, hablamos del tipo y sabes qué esperamos y cómo lo vamos midiendo. También cuando la respuesta es que mejor esperes un poco.",
  "Waar wij nee zeggen": "Dónde decimos que no",
  "In het consult": "En la consulta",
  "Wat we hier meten": "Lo que medimos aquí",
  "Elke as wordt bij elke controle opnieuw gemeten, onder dezelfde belichting. Daarom is verschil later iets dat je ziet en niet iets dat je moet geloven.":
    "Cada eje se vuelve a medir en cada control, con la misma iluminación. Así, una diferencia más adelante es algo que ves y no algo que tienes que creerte.",
  "Wat wij doen": "Lo que hacemos",
  "Laat dit bekijken": "Deja que miremos esto",
  "Twijfel je tussen twee? Dan kijken we samen.":
    "¿Dudas entre dos? Lo miramos juntos.",
  "Wat het is": "Qué es",
  "Waar je het zelf aan herkent": "Cómo lo reconoces tú",
  "Waar we": "Lo que",
  "naar kijken": "miramos",
  "Wat heb je": "Qué tienes",
  behandelen: "que tratamos",
  "Naar de acnepagina": "A la página del acné",
  "Vier beelden": "Cuatro cuadros",
  Rosacea: "Rosácea",
  Couperose: "Cuperosis",
  Eczeem: "Eccema",
  Psoriasis: "Psoriasis",
  Melasma: "Melasma",
  Littekens: "Cicatrices",
  Acnelittekens: "Cicatrices de acné",
  Striae: "Estrías",
  Wallen: "Bolsas en los ojos",
  "Donkere kringen": "Ojeras",
  "Grove poriën": "Poros dilatados",
  Moedervlekken: "Lunares",
  Steelwratjes: "Acrocordones",
  Gerstekorrels: "Milium",
  "Keratosis pilaris": "Queratosis pilaris",
  "Ingegroeide haren": "Pelos encarnados",
  Huiduitslag: "Erupción cutánea",
  Huidverkleuring: "Decoloración de la piel",
  Huidveroudering: "Envejecimiento",
  Huidverslapping: "Flacidez cutánea",
  Ouderdomsvlekken: "Manchas de la edad",
  "Gevoelige huid": "Piel sensible",
  "Microneedling met trillende naaldjes, die gelijkmatig door de huid komen.":
    "Microneedling con agujas vibrantes, que atraviesan la piel de forma uniforme.",
  "Medisch gecertificeerd microneedlen. Werkt op de laag waar de structuur van je huid zit.":
    "Microneedling con certificación médica. Actúa sobre la capa donde está la estructura de tu piel.",
  "Microneedling in Rotterdam": "Microneedling en Rotterdam",
  "Fotona 4D in Rotterdam": "Fotona 4D en Rotterdam",
  "Skinboosters in Rotterdam": "Skin boosters en Rotterdam",
  "IPL-behandeling in Rotterdam": "Tratamiento IPL en Rotterdam",
  "Wat kost dit?": "¿Cuánto cuesta esto?",
  "Vastgelegd in beeld": "Registrado en imágenes",
  "Zo gaat het bij ons": "Así lo hacemos aquí",
  "Wat je ervan merkt": "Lo que notas de ello",
  "Waar het vandaan komt": "De dónde viene",
  "Wat er aan te doen is": "Qué se puede hacer",
  "Hoe het ontstaat": "Cómo aparece",
  "Wanneer je bij de arts hoort": "Cuándo te corresponde un médico",
  "Wat we niet doen": "Lo que no hacemos",
  "Hoe lang het duurt": "Cuánto tarda",
  "Wat je zelf kunt doen": "Lo que puedes hacer tú",
  "Wat het verschil maakt": "Lo que marca la diferencia",
  "Rosacea en couperose": "Rosácea y cuperosis",
  "Rosacea: een huid": "Rosácea: una piel",
  "die steeds opvlamt": "que se enciende una y otra vez",
  "Rosacea is een chronische aandoening die goed te sturen is. Met de juiste behandelingen en verzorging wordt je basiskleur rustiger, vlam je minder vaak op en worden de adertjes minder zichtbaar.":
    "La rosácea es una enfermedad crónica que se puede manejar bien. Con los tratamientos y el cuidado adecuados tu color de base se calma, te enciendes menos a menudo y los vasos se ven menos.",
  "Zie je vooral losse adertjes en geen opvlammingen? Dan gaat het waarschijnlijk om":
    "¿Ves sobre todo vasos sueltos y ningún brote? Entonces seguramente se trata de",
  couperose: "cuperosis",
  ". Ze zitten vaak samen; de huidtherapeut beoordeelt onder vergroting wat er bij jou speelt.":
    ". Suelen ir juntas; la terapeuta de piel valora con lupa cuál es tu caso.",
  "Sorteer jouw triggers": "Ordena tus desencadenantes",
  "Wat zet het aan": "Qué lo enciende",
  "Welk beeld": "Qué cuadro",
  "Rosacea of acne": "Rosácea o acné",
  "De triggersorteerder": "El clasificador de desencadenantes",
  "Welke triggers": "Qué desencadenantes",
  "je zelf kunt sturen": "puedes controlar tú",
  "Dat wijn je rood maakt wist je al. De vraag die telt is hoeveel van jouw triggers je kunt beïnvloeden en hoeveel niet, want die verhouding bepaalt of gewoontes of behandelen het meeste oplevert. Tik aan wat je herkent.":
    "Que el vino te pone rojo ya lo sabías. La pregunta que cuenta es cuántos de tus desencadenantes puedes influir y cuántos no, porque esa proporción decide si te da más resultado cambiar hábitos o tratarte. Marca lo que reconozcas.",
  "Tik aan wat jou rood maakt": "Marca lo que te pone rojo",
  Alcohol: "Alcohol",
  "Pittig eten": "Comida picante",
  "Hete koffie of thee": "Café o té caliente",
  "Verzorging met parfum": "Cosmética con perfume",
  "Sauna of hete douche": "Sauna o ducha muy caliente",
  Zon: "Sol",
  "Kou en wind": "Frío y viento",
  Stress: "Estrés",
  Hormonen: "Hormonas",
  Inspanning: "Esfuerzo físico",
  "Hier heb je zelf invloed op": "En estos tienes tú la palabra",
  "Aan deze triggers kun je iets veranderen, en dat levert vaak het meeste op.":
    "En estos desencadenantes puedes cambiar algo, y eso suele dar el mayor resultado.",
  "Nog niets in deze groep.": "Todavía nada en este grupo.",
  "Hier ligt het buiten je hand": "Estos se te escapan de las manos",
  "Deze triggers zijn lastig te vermijden. Een behandeling kan dan helpen om de klachten beter te beheersen.":
    "Estos desencadenantes son difíciles de evitar. Un tratamiento puede ayudar entonces a controlar mejor las molestias.",
  "Kies alles wat je herkent. Het gaat om de verhouding: hoeveel van jouw triggers kun je zelf beïnvloeden?":
    "Elige todo lo que reconozcas. Lo que importa es la proporción: ¿en cuántos de tus desencadenantes puedes influir tú?",
  "Waar wij dan beginnen": "Por dónde empezaríamos",
  "Weet je het niet precies? Houd het twee weken bij. Dat levert meer op dan welke test dan ook.":
    "¿No lo tienes claro? Apúntalo durante dos semanas. Eso da más que cualquier test.",
  "Dit is geen diagnose en geen test. Het is een manier om je eigen patroon te zien voordat je hier binnenloopt, zodat het gesprek niet bij nul begint.":
    "Esto no es un diagnóstico ni un test. Es una manera de ver tu propio patrón antes de entrar por la puerta, para que la conversación no empiece de cero.",
  "Welke vorm van rosacea": "¿Qué forma de rosácea",
  "herken je?": "reconoces?",
  "Rosacea kent stadia die om een andere aanpak vragen. Bij twee ervan is ons antwoord dat je bij de dermatoloog hoort. Dat staat er dan ook, want dat is sneller dan eerst een traject bij ons.":
    "La rosácea tiene fases que piden un enfoque distinto. En dos de ellas nuestra respuesta es que te corresponde el dermatólogo. Y así lo decimos, porque eso es más rápido que hacer primero un tratamiento aquí.",
  "Blozen dat blijft hangen": "Rubor que se queda",
  "Je wordt snel rood en het trekt langzamer weg dan bij anderen":
    "Te pones rojo enseguida y tarda más en irse que en otras personas",
  "Zichtbare adertjes": "Vasos visibles",
  "Kleine rode lijntjes op je wangen of naast je neus":
    "Pequeñas líneas rojas en las mejillas o al lado de la nariz",
  "Rode bultjes op een rode ondergrond": "Granos rojos sobre un fondo rojo",
  "Puistjes die eruitzien als acne, maar op een huid die al rood is":
    "Granos que parecen acné, pero sobre una piel que ya está roja",
  "Verdikte huid op de neus": "Piel engrosada en la nariz",
  "De huid van je neus wordt dikker en de poriën groter":
    "La piel de la nariz se engrosa y los poros se hacen más grandes",
  flushing: "flushing",
  "Golven van roodheid over wangen, neus en voorhoofd. In het begin trekt het weg, later blijft er een basis achter.":
    "Oleadas de rojez por las mejillas, la nariz y la frente. Al principio se va; más adelante queda un color de base.",
  "De vaatreactie is overactief maar er is nog geen blijvende schade. Dit is het beste moment om in te grijpen.":
    "La reacción de los vasos es excesiva pero todavía no hay daño permanente. Este es el mejor momento para intervenir.",
  "Triggers in kaart, en pas daarna kijken of de vaatjes behandeling nodig hebben. Vaak is dit het stadium met de minste sessies.":
    "Poner los desencadenantes sobre la mesa, y solo después mirar si los vasos necesitan tratamiento. Suele ser la fase con menos sesiones.",
  "Dit is geen gevoelige huid door verkeerde producten. Het is een vaatreactie, en die verandert niet door een andere crème.":
    "Esto no es una piel sensible por usar productos equivocados. Es una reacción de los vasos, y eso no cambia con otra crema.",
  "Het verschil dat uitmaakt": "La diferencia que importa",
  "Rosacea of acne?": "¿Rosácea o acné?",
  "Dit gaat het vaakst mis, en het is niet onschuldig: rosacea behandelen als acne maakt het erger. Vier verschillen die je zelf kunt nagaan.":
    "Esto es lo que más se confunde, y no es inocente: tratar la rosácea como acné la empeora. Cuatro diferencias que puedes comprobar tú.",
  "Mee-eters": "Puntos negros",
  "Bij acne wel, bij rosacea niet. Het snelste verschil.":
    "En el acné sí, en la rosácea no. La diferencia más rápida.",
  "Waar het zit": "Dónde está",
  "Acne op kaaklijn en voorhoofd, rosacea in het midden.":
    "El acné en la mandíbula y la frente, la rosácea en el centro de la cara.",
  Blozen: "Rubor",
  "Bij rosacea hoort opvlammen erbij, bij acne niet.":
    "En la rosácea los brotes forman parte; en el acné no.",
  "Wat scrubben doet": "Lo que hace exfoliar",
  "Bij acne soms iets. Bij rosacea maakt het het erger.":
    "Con el acné a veces algo. Con la rosácea lo empeora.",
  "Denk je na het lezen hiervan dat je toch acne hebt? Dan hoor je op de andere pagina, en dat is geen omweg maar de kortste route.":
    "¿Después de leer esto crees que sí tienes acné? Entonces te toca la otra página, y eso no es un rodeo sino el camino más corto.",
  "Bij rosacea is het eerste punt links gratis en levert het vaak het meest op. Dat is niet het antwoord dat een kliniek hoort te geven, maar het is wel het juiste.":
    "En la rosácea, el primer punto de la izquierda es gratis y suele dar el mayor resultado. No es la respuesta que se espera de una clínica, pero es la correcta.",
  "Twee weken je triggers bijhouden voordat je iets koopt. Dit is gratis en levert het meeste op":
    "Anotar tus desencadenantes durante dos semanas antes de comprar nada. Es gratis y es lo que más da",
  "Zonbescherming, elke dag. Bij rosacea is UV zowel trigger als versneller":
    "Protección solar, todos los días. En la rosácea el UV es desencadenante y acelerador a la vez",
  "Lauw douchen en je gezicht lauw afspoelen. Onaantrekkelijk advies, groot effect":
    "Ducharte con agua templada y aclararte la cara templada. Consejo poco atractivo, efecto grande",
  "Producten zonder alcohol en parfum, en niet meer dan drie stappen":
    "Productos sin alcohol ni perfume, y no más de tres pasos",
  "Doorverwijzen naar de arts als er bultjes bij komen":
    "Derivarte al médico cuando aparecen granos",
  "Behandelen als acne. Scrubs en uitdrogende middelen maken rosacea aantoonbaar erger":
    "Tratarla como acné. Los exfoliantes y los productos que resecan empeoran la rosácea de forma demostrable",
  "Sauna, hete douche en stomen. Warmte is de sterkste trigger die er is":
    "Sauna, ducha caliente y vapor. El calor es el desencadenante más fuerte que hay",
  "Steeds nieuwe producten proberen. Elke wisseling is weer een prikkel voor een huid die al overreageert":
    "Probar productos nuevos sin parar. Cada cambio es otro estímulo para una piel que ya reacciona de más",
  "Camoufleren met een dikke laag en dan niet reinigen. Dat levert een tweede probleem op":
    "Taparla con una capa gruesa y luego no limpiarla. Eso te da un segundo problema",
  "Verwachten dat het weggaat. Rosacea is te beheersen, niet te genezen, en dat zeggen we liever nu":
    "Esperar que desaparezca. La rosácea se controla, no se cura, y preferimos decirlo ahora",
  "Bij rosacea telt roodheid.": "En la rosácea lo que cuenta es la rojez.",
  "Roodheid is het soort ding waar je oog aan gewent raakt. Daarom meten we het: niet om je te overtuigen, maar zodat we het verschil kunnen zien op een dag dat jij vindt dat er niets veranderd is.":
    "La rojez es de esas cosas a las que tu ojo se acostumbra. Por eso la medimos: no para convencerte, sino para poder ver la diferencia un día en que tú creas que no ha cambiado nada.",
  "We meten ook de zichtbare vaatjes afzonderlijk, want die reageren anders dan de basiskleur.":
    "También medimos los vasos visibles por separado, porque responden de otra manera que el color de base.",
  "De basiskleur van je huid, los van een opvlamming":
    "El color de base de tu piel, al margen de un brote",
  Vaatjes: "Vasos",
  "Hoeveel er zichtbaar zijn en waar ze zitten": "Cuántos se ven y dónde están",
  Barrière: "Barrera",
  "Hoe prikkelbaar je huid op dit moment is":
    "Cómo de reactiva está tu piel en este momento",
  "Nordlys IPL bij roodheid en vaatjes": "Nordlys IPL para rojeces y vasos",
  "Licht op zichtbare vaatjes, rosacea en blijvende roodheid. Het vaatje wordt donkerder en trekt weg.":
    "Luz sobre vasos visibles, rosácea y rojez persistente. El vaso se oscurece y luego desaparece.",
  "Licht dat de huid rustiger maakt. In meerdere golflengtes, zonder naalden of zuren.":
    "Luz que calma la piel. En varias longitudes de onda, sin agujas ni ácidos.",
  "Gaat mijn rosacea weg?": "¿Se me va a ir la rosácea?",
  "Nee, rosacea is chronisch. Wat wél kan: minder opvlammingen, minder zichtbare adertjes en een rustiger basiskleur. Bij de meeste mensen is dat een groot verschil in hoe ze zich voelen.":
    "No, la rosácea es crónica. Lo que sí se puede: menos brotes, menos vasos visibles y un color de base más tranquilo. Para la mayoría de las personas eso es una gran diferencia en cómo se sienten.",
  "Hoe weet ik of het rosacea is en niet acne?":
    "¿Cómo sé si es rosácea y no acné?",
  "Het snelste onderscheid: bij acne zitten er mee-eters, bij rosacea niet. Rosacea zit ook meer in het midden van je gezicht en gaat samen met blozen. Zeker weten doe je het pas na een beoordeling.":
    "La diferencia más rápida: en el acné hay puntos negros, en la rosácea no. La rosácea está además más en el centro de la cara y va con rubor. Solo lo sabes con seguridad después de una valoración.",
  "Moet ik stoppen met wijn en pittig eten?":
    "¿Tengo que dejar el vino y la comida picante?",
  "Dat is jouw keuze, niet ons voorschrift. We vertellen je wel wat het doet, en dan bepaal jij wat je ervoor over hebt. Bij sommige mensen scheelt het veel, bij andere weinig.":
    "Eso lo eliges tú, no es una receta nuestra. Sí te contamos lo que hace, y luego decides tú qué estás dispuesto a dejar. A algunas personas les cambia mucho, a otras poco.",
  "Helpt laser tegen de adertjes?": "¿El láser ayuda con los vasos?",
  "Bij zichtbare vaatjes levert behandeling doorgaans het meeste op van alles wat we doen. Nieuwe vaatjes kunnen wel ontstaan zolang de triggers doorgaan, dus onderhoud hoort erbij.":
    "Con vasos visibles, el tratamiento suele dar el mayor resultado de todo lo que hacemos. Pueden aparecer vasos nuevos mientras los desencadenantes sigan, así que el mantenimiento forma parte.",
  "Mag ik nog sporten?": "¿Puedo seguir haciendo deporte?",
  "Ja. Stoppen met sporten is geen advies dat wij geven. We kijken naar timing, koeling en wat je erna doet.":
    "Sí. Dejar el deporte no es un consejo que demos. Miramos el momento, el enfriamiento y lo que haces después.",
  "Ik schaam me ervoor dat ik zo snel rood word.":
    "Me da vergüenza ponerme rojo tan rápido.",
  "Dat horen we vaak, en het is de reden dat mensen jaren wachten. Je hoeft hier niets uit te leggen. We kijken naar je huid en niet naar je gedrag.":
    "Lo oímos a menudo, y es la razón por la que la gente espera años. Aquí no tienes que explicar nada. Miramos tu piel, no tu comportamiento.",
  "Tijdens de intake meten we je roodheid, lopen we je triggers na en hoor je wat er in jouw geval realistisch is. Ook als dat betekent dat je bij de arts hoort.":
    "Durante la primera consulta medimos tu rojez, repasamos tus desencadenantes y sabes qué es realista en tu caso. También cuando eso significa que te corresponde un médico.",
  "We behandelen pigmentvlekken met laser, IPL en peelings. Welke aanpak past, hangt af van het type vlek en van je huidtype. Dat stellen we tijdens de intake samen vast.":
    "Tratamos las manchas de pigmentación con láser, IPL y peelings. Qué enfoque encaja depende del tipo de mancha y de tu fototipo. Eso lo determinamos juntos durante la primera consulta.",
  "Het seizoen telt mee. Met weinig zon houdt het resultaat beter stand, dus in het najaar en de winter zit je het beste.":
    "La estación cuenta. Con poco sol el resultado aguanta mejor, así que el otoño y el invierno son el mejor momento.",
  "Bekijk het zonjaar": "Mira el año solar",
  "Wanneer starten": "Cuándo empezar",
  "Welk pigment": "Qué pigmentación",
  "Het zonjaar": "El año solar",
  "Het jaar bepaalt": "El año decide",
  "of het gaat werken.": "si va a funcionar.",
  "De staafhoogte is de gemiddelde UV-index in Nederland. Klik op een maand en je ziet wat er dan met pigment gebeurt, en of wij je zouden aanraden om te starten. Deze maand staat al open.":
    "La altura de cada barra es el índice UV medio en los Países Bajos. Haz clic en un mes y ves qué le pasa entonces a la pigmentación, y si te aconsejaríamos empezar. Este mes ya está abierto.",
  jan: "ene",
  feb: "feb",
  mrt: "mar",
  apr: "abr",
  mei: "may",
  jun: "jun",
  jul: "jul",
  aug: "ago",
  sep: "sep",
  okt: "oct",
  nov: "nov",
  dec: "dic",
  "Goed startmoment": "Buen momento para empezar",
  "Kan, met voorbehoud": "Se puede, con reservas",
  "Liever niet nu": "Mejor ahora no",
  "Staafhoogte = gemiddelde UV-index": "Altura de la barra = índice UV medio",
  September: "Septiembre",
  "UV-index": "Índice UV",
  "De UV zakt. Dit is de maand waarin het pigment zijn donkerste stand laat zien.":
    "El UV baja. Este es el mes en que la pigmentación enseña su estado más oscuro.",
  "Vanaf nu wordt het interessant. Meten in september geeft het eerlijkste vertrekpunt van het jaar.":
    "A partir de ahora se pone interesante. Medir en septiembre da el punto de partida más honesto del año.",
  "Plan je huidconsult": "Reserva tu consulta",
  "Dit zijn maandgemiddelden. Op een heldere zomerdag ligt de zonkracht in Nederland flink hoger dan wat je hier ziet, en dat is het moment waarop pigment ontstaat.":
    "Estas son medias mensuales. En un día claro de verano la fuerza del sol en los Países Bajos es bastante mayor que lo que ves aquí, y ese es el momento en que se forma la pigmentación.",
  "Drie soorten": "Tres tipos de",
  pigment: "pigmentación",
  "Zonschade en melasma lijken op elkaar, maar vragen een andere behandeling. Welk type je hebt, stellen we vast voordat we beginnen. Kies het patroon dat het dichtst bij jou komt.":
    "El daño solar y el melasma se parecen, pero piden tratamientos distintos. Qué tipo tienes lo determinamos antes de empezar. Elige el patrón que más se acerque al tuyo.",
  "Losse, scherp begrensde vlekken": "Manchas sueltas con bordes definidos",
  "Bruine vlekjes met een duidelijke rand, vooral waar de zon komt":
    "Manchitas marrones con un borde claro, sobre todo donde da el sol",
  "Symmetrische, vage velden": "Zonas simétricas y difusas",
  "Grotere wolkachtige vlakken, vaak aan beide kanten hetzelfde":
    "Áreas más grandes con forma de nube, muchas veces iguales a los dos lados",
  "Donkere plek ná een puistje of wondje":
    "Mancha oscura después de un grano o una herida",
  "De vlek die achterblijft nadat iets genezen is":
    "La marca que queda cuando algo ya ha curado",
  "lentigines, zonschade": "léntigos, daño solar",
  "Het patroon": "El patrón",
  "Op de uitstekende delen: jukbeen, neusbrug, voorhoofd, handrug en decolleté. Niet symmetrisch, elke vlek heeft zijn eigen vorm.":
    "En las partes que sobresalen: pómulo, puente de la nariz, frente, dorso de la mano y escote. No simétrico; cada mancha tiene su propia forma.",
  "Opgetelde UV-belasting over jaren. Elke vlek is een plek waar pigmentcellen zijn ontregeld.":
    "Carga de UV sumada a lo largo de los años. Cada mancha es un sitio donde las células de pigmento se han descontrolado.",
  "We stellen het type vast, behandelen gericht en houden het daarna bij met zonbescherming. Zonder dat laatste komt het terug.":
    "Determinamos el tipo, tratamos de forma dirigida y después lo mantenemos con protección solar. Sin esto último vuelve.",
  "Wat realistisch is": "Qué es realista",
  "Hier valt vaak het meeste te winnen. Dit type reageert doorgaans goed en komt minder snel terug dan melasma, zolang je de zon buiten houdt.":
    "Aquí suele haber más que ganar. Este tipo responde normalmente bien y vuelve menos rápido que el melasma, mientras mantengas el sol fuera.",
  "Laat dit patroon bekijken": "Que lo miremos",
  "Weet je het niet zeker? Dan bepalen we het bij de meting.":
    "¿No lo tienes claro? Lo determinamos en la medición.",
  "Waarom het terugkomt": "Por qué vuelve",
  "Waarom pigment terugkomt": "Por qué vuelve la pigmentación",
  "Pigmentcellen die eenmaal ontregeld zijn, reageren de volgende keer sneller op zonlicht. Elke onbeschermde zomer telt daardoor op bij de vorige.":
    "Las células de pigmento que una vez se han descontrolado responden más rápido a la luz solar la siguiente vez. Por eso cada verano sin protección se suma al anterior.",
  "Dagelijkse zonbescherming en het beperken van nieuwe zonbelasting zijn bij pigment minstens zo belangrijk als de behandeling in de kliniek.":
    "Con la pigmentación, la protección solar diaria y limitar la nueva exposición cuentan por lo menos tanto como el tratamiento en la clínica.",
  "Zonder bescherming": "Sin protección",
  "Elke zomer legt een laag op de vorige. Wat je in de winter wint, verlies je in juli.":
    "Cada verano pone una capa sobre la anterior. Lo que ganas en invierno lo pierdes en julio.",
  "Met bescherming": "Con protección",
  "Het pigment dat er is kan lichter worden, en er komt weinig nieuw bij.":
    "La pigmentación que hay puede aclararse, y aparece poca nueva.",
  "Met bescherming én behandeling": "Con protección y tratamiento",
  "Hier zit de meeste winst. Begin wel met de bescherming, want zonder dat houdt het resultaat niet stand.":
    "Aquí está lo que más se gana. Eso sí, empieza por la protección, porque sin ella el resultado no aguanta.",
  "Bij pigment gaat het vaak mis door te vroeg beginnen, niet door te weinig behandelen.":
    "Con la pigmentación suele torcerse por empezar demasiado pronto, no por tratar demasiado poco.",
  "Elke dag zonbescherming, ook op een grijze dag. Bij pigment is dat het belangrijkste onderdeel":
    "Protección solar todos los días, también en un día gris. En la pigmentación es la parte más importante",
  "Starten in het najaar, zodat je maanden met lage UV vóór je hebt":
    "Empezar en otoño, para tener por delante meses de UV bajo",
  "Meten per seizoen, want pigment beweegt met het jaar mee":
    "Medir por estación, porque la pigmentación se mueve con el año",
  "Vóór de eerste behandeling vaststellen welk type het is en hoe diep het zit: in de opperhuid, in de lederhuid of in allebei":
    "Determinar antes del primer tratamiento de qué tipo es y a qué profundidad está: en la epidermis, en la dermis o en las dos",
  "Een pet of hoed. Die houdt meer zon tegen dan welke crème ook":
    "Una gorra o un sombrero. Frena más sol que cualquier crema",
  "Beginnen in mei of juni. Je behandelt dan vier maanden tegen de zon in en dat kost je het resultaat":
    "Empezar en mayo o junio. Entonces tratas cuatro meses a contracorriente del sol y eso te cuesta el resultado",
  "Agressief aanpakken bij melasma. Dat wakkert het juist aan in plaats van het weg te halen":
    "Ir a por todas con el melasma. Eso lo aviva en vez de quitarlo",
  "Bleekcrèmes van internet. Er zit regelmatig hydrochinon of kwik in, buiten elke controle om":
    "Cremas blanqueadoras de internet. A menudo llevan hidroquinona o mercurio, sin ningún control",
  "De zonnebank, ook niet om het te camoufleren. Je maakt het pigment donkerder, niet lichter":
    "Los rayos UVA, ni siquiera para disimularlo. Oscureces la pigmentación, no la aclaras",
  "Elke dag in de spiegel vergelijken. Pigment verandert in maanden, niet in dagen":
    "Compararte en el espejo cada día. La pigmentación cambia en meses, no en días",
  "Deze kenmerken volgen we bij pigment":
    "Estos son los rasgos que seguimos en la pigmentación",
  "De EVE-M-meting legt vast hoe donker en hoe uitgebreid het pigment is voordat we beginnen. Bij pigment meten we per seizoen in plaats van per sessie, omdat het beeld met het jaar meebeweegt.":
    "La medición con el EVE-M registra cómo de oscura y cómo de extensa es la pigmentación antes de empezar. En la pigmentación medimos por estación en vez de por sesión, porque el cuadro se mueve con el año.",
  "Net zo belangrijk is hoe diep het zit. Pigment kan in de opperhuid liggen (epidermaal), in de lederhuid (dermaal) of in allebei, zoals vaak bij melasma. Oppervlakkig pigment reageert sneller en op meer behandelingen; dieper pigment vraagt meer tijd en een andere keuze. Onder UV-licht is dat verschil te zien, met het blote oog niet.":
    "Igual de importante es a qué profundidad está. El pigmento puede estar en la epidermis, en la dermis o en las dos, como pasa a menudo con el melasma. El pigmento superficial responde más rápido y a más tratamientos; el más profundo pide más tiempo y otra elección. Bajo luz UV esa diferencia se ve; a simple vista no.",
  "Dat is ook de eerlijkste manier om te zien of het werkt. Pigment verandert langzaam, en je oog raakt eraan gewend.":
    "Esa es también la manera más honesta de ver si funciona. La pigmentación cambia despacio, y tu ojo se acostumbra.",
  "Hoe donker en hoe verspreid, objectief in kaart":
    "Cómo de oscura y cómo de extendida, medido de forma objetiva",
  Diepte: "Profundidad",
  "In de opperhuid, in de lederhuid of in allebei. Dat bepaalt de prognose en de keuze van de behandeling":
    "En la epidermis, en la dermis o en las dos. Eso decide el pronóstico y la elección del tratamiento",
  "UV-belasting": "Carga de UV",
  "Wat de zon al heeft aangericht, ook wat je niet ziet":
    "Lo que el sol ya ha hecho, también lo que no ves",
  "Of er naast kleur ook oneffenheid meespeelt":
    "Si además del color hay irregularidad de por medio",
  "Licht op pigmentvlekken en zonschade. Het pigment komt eerst naar boven en vervaagt daarna.":
    "Luz sobre manchas de pigmentación y daño solar. El pigmento sale primero a la superficie y después se difumina.",
  "Traject van zes maanden tegen hyperpigmentatie, met een masker in de kliniek en producten thuis.":
    "Programa de seis meses contra la hiperpigmentación, con una mascarilla en la clínica y productos en casa.",
  "Cosmelan en Dermamelan in Rotterdam": "Cosmelan y Dermamelan en Rotterdam",
  "De intensievere pigmentaanpak, meestal bij melasma. Zes maanden, met een strak schema thuis.":
    "El enfoque más intensivo para la pigmentación, normalmente en el melasma. Seis meses, con una rutina estricta en casa.",
  "Gaan mijn pigmentvlekken helemaal weg?":
    "¿Mis manchas de pigmentación se van del todo?",
  "Bij zonschade vaak grotendeels. Bij melasma is beheersing realistischer dan verdwijning, en dat zeggen we liever nu dan na vijf sessies. Welke van de twee je hebt, bepaalt dus het antwoord.":
    "Con el daño solar, muchas veces en gran parte. Con el melasma es más realista controlarlo que hacerlo desaparecer, y preferimos decirlo ahora y no después de cinco sesiones. Cuál de los dos tienes decide, por tanto, la respuesta.",
  "Waarom mag ik in de zomer niet starten?":
    "¿Por qué no puedo empezar en verano?",
  "Omdat je dan vier maanden tegen de zon in werkt. Pigmentcellen die net zijn aangepakt reageren extra fel op UV. Je betaalt dan voor een resultaat dat je in september kwijt bent.":
    "Porque entonces trabajas cuatro meses a contracorriente del sol. Las células de pigmento recién tratadas responden con más fuerza al UV. Pagarías por un resultado que en septiembre habrás perdido.",
  "Helpt zonnebrand echt zo veel?":
    "¿De verdad ayuda tanto la protección solar?",
  "Bij pigment levert dagelijkse bescherming meer op dan welke behandeling ook, en we verdienen er niets aan.":
    "Con la pigmentación, la protección diaria da más que cualquier tratamiento, y nosotros no ganamos nada con ella.",
  "Ik heb een donkere huid. Kan ik behandeld worden?":
    "Tengo la piel oscura. ¿Me pueden tratar?",
  "Ja, en het vraagt een andere aanpak. Bij huidtype IV tot VI is de kans op nieuwe pigmentvlekken door de behandeling zelf groter, dus gaan we voorzichtiger en trager. Dat bespreken we vooraf.":
    "Sí, y pide otro enfoque. Con los fototipos IV a VI hay más riesgo de que el propio tratamiento deje pigmentación nueva, así que vamos con más cuidado y más despacio. Eso lo hablamos antes.",
  "Mijn vlek ziet er anders uit dan de rest. Moet ik me zorgen maken?":
    "Mi mancha tiene otro aspecto que las demás. ¿Debo preocuparme?",
  "Een vlek die verandert van vorm of kleur, of die bloedt, laat je beoordelen door je huisarts. Dat is geen paniekverhaal maar de juiste route. We kijken er wel naar en verwijzen door als dat nodig is.":
    "Una mancha que cambia de forma o de color, o que sangra, que la valore tu médico de cabecera. Eso no es alarmismo sino el camino correcto. Nosotros la miramos y derivamos si hace falta.",
  "Kan ik iets doen aan de vlekken op mijn handen?":
    "¿Puedo hacer algo con las manchas de las manos?",
  "Ja, en handen zijn eerlijk gezegd het vervelendste gebied: ze krijgen de meeste zon en je vergeet ze het vaakst. Behandelen kan, volhouden met bescherming is het echte werk.":
    "Sí, y las manos son sinceramente la zona más incómoda: son las que más sol reciben y las que más se olvidan. Tratarlas se puede; mantener la protección es el trabajo de verdad.",
  "Waarom het seizoen": "Por qué la estación",
  "meetelt bij pigment": "cuenta en la pigmentación",
  "De huidanalyse kan het hele jaar door. Zo hebben we een vertrekpunt klaarliggen voor het moment dat het seizoen wél meewerkt.":
    "El análisis de piel se puede hacer todo el año. Así tenemos un punto de partida listo para el momento en que la estación sí acompañe.",
  "Melasma behandelen we met peelings, gerichte verzorging en zonbescherming. Hoe diep het pigment zit, bepaalt wat er mogelijk is, en dat zie je in gewoon licht niet.":
    "El melasma lo tratamos con peelings, cuidados dirigidos y protección solar. A qué profundidad está el pigmento decide qué es posible, y con luz normal eso no se ve.",
  "Daarom kijken we eerst onder UV-licht. Zit het pigment diep, dan richten we ons op beheersen: minder opvlammingen en een rustiger beeld.":
    "Por eso miramos primero bajo luz UV. Si el pigmento está profundo, apuntamos a controlarlo: menos brotes y un cuadro más tranquilo.",
  "Melasma of zonvlek": "Melasma o mancha solar",
  "De drie kranen": "Los tres grifos",
  "Hoe je het": "Cómo lo",
  herkent: "reconoces",
  "Ze lijken op elkaar en vragen een andere aanpak. Het verschil zit in het patroon, de plek en hoe de vlek zich door het jaar heen gedraagt.":
    "Se parecen y piden enfoques distintos. La diferencia está en el patrón, en el sitio y en cómo se comporta la mancha a lo largo del año.",
  "Vlakken met vage randen, links en rechts meestal even veel.":
    "Zonas de bordes difusos, normalmente igual de grandes a la izquierda y a la derecha.",
  "De plek": "El sitio",
  "Wangen, voorhoofd, boven de lip en langs de kaaklijn.":
    "Mejillas, frente, encima del labio y a lo largo de la mandíbula.",
  "Het verloop": "La evolución",
  "Wordt donkerder in de zomer en lichter in de winter.":
    "Se oscurece en verano y se aclara en invierno.",
  "De aanjager": "Lo que lo impulsa",
  "Hormonen, zon en warmte samen. Vaak begonnen tijdens een zwangerschap.":
    "Hormonas, sol y calor juntos. Muchas veces empezó durante un embarazo.",
  "Een zonvlek": "Una mancha solar",
  "Losse vlekjes met een scherpe rand, willekeurig verdeeld.":
    "Manchitas sueltas con un borde nítido, repartidas al azar.",
  "Waar de zon jarenlang op stond: gezicht, handen, decollete.":
    "Donde el sol ha estado dando durante años: cara, manos, escote.",
  "Blijft zoals hij is, en er komen er langzaam bij.":
    "Se queda como está, y van saliendo nuevas poco a poco.",
  "Opgetelde zonuren over de jaren, zonder hormonale kant.":
    "Horas de sol sumadas a lo largo de los años, sin la parte hormonal.",
  "Ook achter glas": "También detrás del cristal",
  "UVA komt door een autoruit en door je raam heen. Ook binnen en op een grijze dag loopt pigment gewoon door.":
    "El UVA atraviesa la ventanilla del coche y el cristal de tu casa. También dentro y en un día gris la pigmentación sigue su curso.",
  "Warmte telt ook mee": "El calor también cuenta",
  "Het gaat niet alleen om UV. Een hete keuken, een sauna of een fohn dicht op je gezicht wakkert melasma net zo goed aan.":
    "No va solo del UV. Una cocina caliente, una sauna o un secador cerca de la cara avivan el melasma igual de bien.",
  "De diepte bepaalt het tempo": "La profundidad marca el ritmo",
  "Pigment hoog in de huid wordt sneller lichter. Zit het dieper, dan vraagt het meer sessies en meer geduld.":
    "El pigmento alto en la piel se aclara más rápido. Si está más profundo, pide más sesiones y más paciencia.",
  "Wat het aanwakkert": "Lo que lo aviva",
  "Drie dingen die": "Tres cosas que",
  "melasma sturen": "gobiernan el melasma",
  "Een zonvlek zit er en blijft er. Melasma gaat open en dicht, en drie dingen bepalen hoe ver hij open staat. Kijk naar de derde kolom: dat is het deel dat je zelf in de hand hebt.":
    "Una mancha solar está ahí y se queda. El melasma se abre y se cierra, y tres cosas deciden cuánto está abierto. Mira la tercera columna: esa es la parte que tienes tú en la mano.",
  "De sterkste van de drie, en de enige die je volledig zelf in de hand hebt. Ook winterlicht en licht door een autoruit telt mee.":
    "El más fuerte de los tres, y el único que tienes del todo en tu mano. También cuenta la luz de invierno y la luz que entra por la ventanilla del coche.",
  "Zelf in de hand": "En tu mano",
  Volledig: "Del todo",
  "Zwangerschap, de pil en hormoonspiralen spelen mee. Dit is de reden dat melasma vaker bij vrouwen voorkomt en soms vanzelf wegtrekt na een bevalling.":
    "El embarazo, la píldora y los DIU hormonales influyen. Por eso el melasma es más frecuente en mujeres y a veces se va solo después de un parto.",
  Nauwelijks: "Casi nada",
  "Sauna, hete douches, een warme keuken, en ook de warmte van een behandeling zelf. Dit is de aanjager die het vaakst over het hoofd wordt gezien.":
    "Sauna, duchas calientes, una cocina caliente, y también el calor del propio tratamiento. Este es el impulsor que más se pasa por alto.",
  Deels: "En parte",
  "Bescherming is bij melasma geen advies naast de behandeling maar een deel van de behandeling zelf. Zonder dat werkt de rest niet, en dat is de reden dat we er hier zo lang over doorgaan.":
    "En el melasma la protección no es un consejo que acompaña al tratamiento, sino parte del tratamiento mismo. Sin ella el resto no funciona, y por eso insistimos tanto aquí.",
  "Zijn het toch gewone pigmentvlekken?":
    "¿Serán manchas de pigmentación normales después de todo?",
  "Het eerste kruisje rechts is bij melasma de duurste fout die er is, en hij wordt gemaakt door klinieken en niet door klanten.":
    "En el melasma, la primera cruz de la derecha es el error más caro que hay, y lo cometen las clínicas, no los clientes.",
  "Elke dag beschermen, het hele jaar door. Dit is bij melasma geen advies maar de behandeling zelf; zonder dit werkt de rest niet.":
    "Proteger todos los días, todo el año. En el melasma esto no es un consejo sino el tratamiento mismo; sin ello el resto no funciona.",
  "Rustig behandelen en langzaam opbouwen. Melasma is de enige aandoening op deze site waarbij harder werken je verder van huis brengt.":
    "Tratar con suavidad y subir despacio. El melasma es la única afección de esta web en la que trabajar más fuerte te aleja de donde quieres llegar.",
  "Eerst kijken hoe diep het zit. Dat bepaalt of behandelen zin heeft, en het kost één afspraak.":
    "Mirar primero a qué profundidad está. Eso decide si tratar tiene sentido, y cuesta una cita.",
  "Warmte vermijden rond een behandeling, ook sauna en hete douches.":
    "Evitar el calor alrededor de un tratamiento, también la sauna y las duchas calientes.",
  "Accepteren dat dit beheerd wordt en niet genezen. Wie dat vooraf weet, is achteraf niet teleurgesteld.":
    "Aceptar que esto se maneja y no se cura. Quien lo sabe de antemano no se lleva una decepción después.",
  "Een agressieve laser of stevige peeling. Bij melasma is dat de bekendste manier om het erger te maken dan het was.":
    "Un láser agresivo o un peeling fuerte. En el melasma esa es la manera más conocida de dejarlo peor de lo que estaba.",
  "In de zomer beginnen. Dan werk je tegen de aanjager in die je net probeert uit te zetten.":
    "Empezar en verano. Estarías trabajando en contra del impulsor que justo intentas apagar.",
  "Stoppen met beschermen zodra het lichter wordt. Dan is het binnen een seizoen terug en heb je voor niets betaald.":
    "Dejar de proteger en cuanto se aclara. Entonces vuelve en una estación y has pagado para nada.",
  "Melasma behandelen alsof het gewone pigmentvlekken zijn. Dezelfde aanpak geeft hier een ander en slechter resultaat.":
    "Tratar el melasma como si fueran manchas de pigmentación normales. El mismo enfoque da aquí otro resultado, y peor.",
  "Zelf bleekmiddelen bestellen die je hier niet zonder recept krijgt. Die zijn er niet voor niets aan banden gelegd.":
    "Pedir por tu cuenta blanqueantes que aquí no se consiguen sin receta. Por algo están restringidos.",
  "Meten gaat hier over diepte.": "Medir aquí va de profundidad.",
  "Bij gewone pigmentvlekken meten we hoe donker en hoe groot. Bij melasma is de eerste vraag hoe diep het zit, want dat bepaalt of de rest van de meting er nog toe doet.":
    "Con las manchas de pigmentación normales medimos cómo de oscuras y cómo de grandes. Con el melasma la primera pregunta es a qué profundidad está, porque eso decide si el resto de la medición todavía importa.",
  "Daarnaast leggen we vast wat je aanjagers zijn. Melasma dat lichter wordt terwijl de kraan openstaat, is een resultaat dat niet blijft, en dat wil je vooraf weten.":
    "Además registramos cuáles son tus impulsores. Un melasma que se aclara mientras el grifo sigue abierto es un resultado que no se queda, y eso lo quieres saber antes.",
  "Hoog, gemengd of diep in de huid": "Alto, mezclado o profundo en la piel",
  Intensiteit: "Intensidad",
  "Hoe sterk het afsteekt tegen de huid eromheen":
    "Cuánto destaca frente a la piel de alrededor",
  Uitbreiding: "Extensión",
  "Welke gebieden meedoen en hoe groot ze zijn":
    "Qué zonas participan y cómo de grandes son",
  "Skinboosters en mesotherapie": "Skin boosters y mesoterapia",
  "Werkzame stoffen ín de huid gebracht in plaats van erop, op een vaste diepte per prik.":
    "Principios activos puestos dentro de la piel en lugar de encima, a una profundidad fija por pinchazo.",
  "U225 intradermale injector": "Inyector intradérmico U225",
  "Gaat melasma ooit helemaal weg?": "¿El melasma se va alguna vez del todo?",
  "Meestal niet uit zichzelf, en behandelen maakt het lichter zonder het weg te nemen. Na een zwangerschap trekt het soms grotendeels weg; dat is dan het hormonale deel dat wegvalt en niet iets wat een behandeling deed.":
    "Normalmente no por sí solo, y tratarlo lo aclara sin quitarlo. Después de un embarazo a veces se va en gran parte; eso es la parte hormonal que desaparece, no algo que haya hecho un tratamiento.",
  "Waarom is dit anders dan gewone pigmentvlekken?":
    "¿Por qué es distinto de las manchas de pigmentación normales?",
  "Een zonvlek zit er en blijft er. Melasma heeft een kraan die open- en dichtgaat, en die kraan staat deels buiten je macht. Dezelfde behandeling geeft daarom een ander resultaat.":
    "Una mancha solar está ahí y se queda. El melasma tiene un grifo que se abre y se cierra, y ese grifo está en parte fuera de tu control. Por eso el mismo tratamiento da otro resultado.",
  "Ik ben zwanger. Kan ik nu iets doen?":
    "Estoy embarazada. ¿Puedo hacer algo ahora?",
  "Beschermen wel, behandelen niet. We wachten tot na de zwangerschap en de borstvoeding, ook omdat een deel dan vanzelf terugloopt.":
    "Proteger sí, tratar no. Esperamos a después del embarazo y de la lactancia, entre otras cosas porque para entonces una parte baja sola.",
  "Ik heb een donkere huid. Verandert dat iets?":
    "Tengo la piel oscura. ¿Cambia eso algo?",
  "Ja, in twee richtingen. Melasma komt vaker voor, en de kans dat een te stevige behandeling juist meer pigment achterlaat is groter. Rustiger werken is dan geen voorzichtigheid maar noodzaak.":
    "Sí, en dos sentidos. El melasma es más frecuente, y el riesgo de que un tratamiento demasiado fuerte deje aún más pigmento es mayor. Trabajar con más calma no es entonces prudencia sino necesidad.",
  "Hoe lang duurt het voor ik iets zie?": "¿Cuánto tardo en ver algo?",
  "De eerste verandering zie je meestal na twee tot drie maanden. Reken dus op maanden en niet op weken, en op onderhoud daarna. Dat laatste is geen bijzaak maar het grootste deel van het werk.":
    "El primer cambio se suele ver a los dos o tres meses. Cuenta con meses y no con semanas, y con mantenimiento después. Eso último no es un detalle sino la mayor parte del trabajo.",
  "De meting kost vijftig euro; de trajecten daarna staan met hun tarief op de tarievenpagina. Blijkt uit de meting dat het pigment diep zit, dan raden we behandelen af en houdt het daar op.":
    "La medición cuesta cincuenta euros; los programas posteriores están con su precio en la página de precios. Si de la medición sale que el pigmento está profundo, desaconsejamos tratarlo y ahí se queda.",
  "We schatten de diepte in en leggen je aanjagers vast. Zit het diep, dan hoor je dat en raden we behandelen af. Zit het hoog, dan weet je meteen wat er te halen valt en wat het vraagt.":
    "Estimamos la profundidad y registramos tus impulsores. Si está profundo, te lo decimos y desaconsejamos tratarlo. Si está alto, sabes enseguida qué hay que ganar y qué exige.",
  "Ouderdomsvlekken en zonnevlekken zijn onschuldig en goed te behandelen. We halen ze weg met IPL of laser, en meestal zijn er een of twee sessies nodig.":
    "Las manchas de la edad y las manchas solares son inofensivas y responden bien al tratamiento. Las quitamos con IPL o láser, y normalmente bastan una o dos sesiones.",
  "De behandelaar beoordeelt eerst elke plek. Verandert er iets aan de vorm of de kleur, dan gaat die eerst langs je huisarts.":
    "La terapeuta valora primero cada mancha. Si algo cambia en la forma o en el color, esa mancha pasa antes por tu médico de cabecera.",
  "Kijk wat jij hebt": "Mira cuál tienes",
  "De verandercheck": "La comprobación de cambios",
  "De behandelaar beoordeelt vorm, rand en kleur, en legt de plek vast in beeld. Zo is later te zien of er iets is veranderd.":
    "La terapeuta valora forma, borde y color, y registra la mancha en imagen. Así más adelante se puede ver si ha cambiado algo.",
  "Vorm, rand en kleur": "Forma, borde y color",
  "De behandelaar kijkt of de kleur gelijkmatig is en of de rand scherp loopt. Dat onderscheidt een zonvlek van iets anders.":
    "La terapeuta mira si el color es uniforme y si el borde va nítido. Eso distingue una mancha solar de otra cosa.",
  "Onder UV-licht": "Bajo luz UV",
  "Daaronder wordt zichtbaar hoeveel pigment er dieper in de huid zit. Dat bepaalt met hoeveel sessies je rekening moet houden.":
    "Ahí se ve cuánto pigmento hay más profundo en la piel. Eso decide con cuántas sesiones tienes que contar.",
  "We fotograferen de plek onder vaste belichting. Bij een volgende afspraak leggen we de opnames naast elkaar en zie je wat er veranderd is.":
    "Fotografiamos la mancha con una iluminación fija. En una cita posterior ponemos las imágenes una al lado de la otra y ves qué ha cambiado.",
  "Verandert de plek?": "¿La mancha está cambiando?",
  "Dan kijkt eerst een arts, en daarna behandelen wij.":
    "Entonces la mira primero un médico, y después la tratamos nosotros.",
  "Een rafelige rand, ongelijke kleur, groei of jeuk zijn redenen om het eerst te laten beoordelen. Is het goedaardig, dan halen we de plek daarna hier weg.":
    "Un borde irregular, un color desigual, que crezca o que pique son motivos para que la valoren primero. Si es benigna, después la quitamos aquí.",
  "Naar de ABCDE-check": "A la comprobación ABCDE",
  "Vier soorten": "Cuatro tipos de",
  "bruine vlekken": "manchas marrones",
  "Vier soorten bruine vlekken die op elkaar lijken. Verandert er iets aan een plek, dan gaat die eerst langs je huisarts.":
    "Cuatro tipos de mancha marrón que se parecen. Si algo cambia en una mancha, esa pasa antes por tu médico de cabecera.",
  "Platte bruine vlek": "Una mancha marrón plana",
  "Een egale bruine plek op je hand, slaap of decolleté":
    "Una marca marrón uniforme en la mano, la sien o el escote",
  "Ruwe bruine bult": "Un bulto marrón rugoso",
  "Een bruin plekje dat verheven aanvoelt, alsof het erop geplakt zit":
    "Una manchita marrón que se nota elevada, como si estuviera pegada encima",
  "Grote vlakken op je wangen": "Zonas grandes en las mejillas",
  "Symmetrische bruine vlakken, vaak na een zwangerschap of de pil":
    "Áreas marrones simétricas, muchas veces tras un embarazo o la píldora",
  "Een plek die verandert": "Una mancha que cambia",
  "Iets dat groeit, van kleur verschiet, jeukt of bloedt":
    "Algo que crece, cambia de color, pica o sangra",
  "lentigo solaris, zonnevlek of ouderdomsvlek":
    "lentigo solaris, mancha solar o mancha de la edad",
  "Voelt hij helemaal glad, is hij egaal van kleur met een scherpe rand, en zit hij op een plek die veel zon heeft gehad?":
    "¿Se nota completamente lisa, es uniforme de color con un borde nítido, y está en un sitio que ha recibido mucho sol?",
  "Pigment dat zich na jaren zonblootstelling op een plek heeft opgehoopt. Onschuldig, en het meest voorkomende beeld op deze pagina.":
    "Pigmento que se ha acumulado en un punto tras años de exposición al sol. Inofensivo, y el cuadro más frecuente de esta página.",
  "Dit reageert goed op licht. We meten eerst hoeveel er zit, ook wat je zelf nog niet ziet, en behandelen daarna in een reeks.":
    "Esto responde bien a la luz. Primero medimos cuánto hay, también lo que tú todavía no ves, y después lo tratamos en una serie.",
  "Dit behandelen wij": "Esto sí lo tratamos",
  "Een egale, platte vlek op een plek die veel zon heeft gehad. Dit is het beeld waar licht het meest oplevert.":
    "Una mancha plana y uniforme en un sitio que ha recibido mucho sol. Este es el cuadro en el que la luz da más.",
  "Bij pigment is zonbescherming geen advies achteraf maar onderdeel van de behandeling. Zonder dat komt het terug en is het geld weg.":
    "En la pigmentación, la protección solar no es un consejo posterior sino parte del tratamiento. Sin ella vuelve y el dinero se ha ido.",
  "Eerst beoordelen of een plek onschuldig is, en bij twijfel doorsturen in plaats van behandelen":
    "Valorar primero si una mancha es inofensiva, y derivar en lugar de tratar cuando hay dudas",
  "Een huidanalyse onder UV-licht, want daar zie je pigment dat er al zit en nog niet zichtbaar is":
    "Un análisis de piel bajo luz UV, porque ahí se ve el pigmento que ya está y aún no se nota",
  "Zonbescherming, elke dag en het hele jaar. Zonder dat komen de vlekken terug en werkt de rest niet":
    "Protección solar, todos los días y todo el año. Sin ella las manchas vuelven y el resto no funciona",
  "Licht op platte, egale vlekken, in een reeks met tijd ertussen":
    "Luz sobre manchas planas y uniformes, en una serie con tiempo entre medias",
  "Eerlijk zeggen dat er nieuwe bij kunnen komen zolang je in de zon komt":
    "Decir con honestidad que pueden salir nuevas mientras te dé el sol",
  "Alles wat bruin is wegbranden. Een plek die verandert hoort eerst beoordeeld te worden":
    "Quemar todo lo que sea marrón. Una mancha que cambia debe valorarse primero",
  "Melasma behandelen alsof het een zonnevlek is. Dat maakt het erger en niet beter":
    "Tratar el melasma como si fuera una mancha solar. Eso lo empeora en vez de mejorarlo",
  "Bleekcrèmes met hydrochinon op eigen houtje. Dat hoort onder begeleiding":
    "Cremas con hidroquinona por tu cuenta. Eso va bajo supervisión",
  "Behandelen in de zomer zonder afspraken over zon. Dan is het weggegooid geld":
    "Tratar en verano sin acuerdos sobre el sol. Eso es tirar el dinero",
  "Beginnen op een gebruinde huid": "Empezar sobre una piel bronceada",
  "Onder UV zie je wat er nog komt.":
    "Bajo el UV ves lo que todavía está por llegar.",
  "Pigment begint dieper in de huid dan waar je het ziet. Onder UV-licht wordt zichtbaar wat er al ligt en aan de oppervlakte nog niet doorkomt, en dat is vaak meer dan mensen verwachten.":
    "El pigmento empieza más profundo en la piel que donde lo ves. Bajo luz UV se hace visible lo que ya está ahí y todavía no asoma en la superficie, y eso suele ser más de lo que la gente espera.",
  "Confronterend, en nuttig: het verklaart waarom er zonder zonbescherming steeds nieuwe vlekken bij lijken te komen. Ze kwamen er niet bij; ze waren er al.":
    "Impactante, y útil: explica por qué sin protección solar parece que salen manchas nuevas todo el rato. No eran nuevas; ya estaban ahí.",
  "Zichtbaar pigment": "Pigmentación visible",
  "De vlekken zoals je ze nu in de spiegel ziet":
    "Las manchas tal como las ves ahora en el espejo",
  "Onderliggend pigment": "Pigmentación subyacente",
  "Wat er dieper ligt en later doorkomt":
    "Lo que está más profundo y asoma después",
  Zonschade: "Daño solar",
  "Hoeveel de huid over de jaren te verwerken kreeg":
    "Cuánto ha tenido que encajar la piel a lo largo de los años",
  "Zijn ouderdomsvlekken gevaarlijk?":
    "¿Son peligrosas las manchas de la edad?",
  "Een gewone zonnevlek is onschuldig. Andere plekjes lijken er in het begin op, en die zijn niet onschuldig altijd. Daarom is de eerste vraag hier niet hoe je ervan afkomt maar of het is wat je denkt.":
    "Una mancha solar normal es inofensiva. Otras manchitas se le parecen al principio, y esas no siempre son inofensivas. Por eso la primera pregunta aquí no es cómo quitártela sino si es lo que crees que es.",
  "Komen ze terug na de behandeling?": "¿Vuelven después del tratamiento?",
  "De behandelde vlek komt niet terug, maar er kunnen nieuwe bij komen zolang je huid zon blijft vangen. Daarom is het advies dat zonbescherming hier geen advies achteraf is maar onderdeel van de behandeling.":
    "La mancha tratada no vuelve, pero pueden salir nuevas mientras tu piel siga cogiendo sol. Por eso la protección solar aquí no es un consejo posterior sino parte del tratamiento.",
  "Waarom zie ik na de meting meer vlekken dan in de spiegel?":
    "¿Por qué veo más manchas después de la medición que en el espejo?",
  "Omdat pigment dieper in de huid begint dan waar je het ziet. De meting maakt zichtbaar wat er al ligt, en dat is soms confronterend. Het is ook nuttig: het verklaart waarom er zonder bescherming steeds nieuwe bij lijken te komen.":
    "Porque el pigmento empieza más profundo en la piel que donde lo ves. La medición hace visible lo que ya está ahí, y eso a veces impacta. También es útil: explica por qué sin protección parece que salen nuevas continuamente.",
  "Kan dit ook op mijn handen?": "¿Se puede hacer también en las manos?",
  "Ja, en dat is vaak de plek waar mensen het het eerst storend vinden. De huid daar is dunner en herstelt langzamer, dus we gaan er voorzichtiger te werk dan in het gezicht.":
    "Sí, y suele ser el sitio donde a la gente le molesta primero. La piel de ahí es más fina y se recupera más despacio, así que vamos con más cuidado que en la cara.",
  "In het huidconsult beoordelen we de plekken en meten we onder UV-licht ook het pigment dat je zelf nog niet ziet. Daarna weet je wat er kan en wat er eerst ergens anders hoort.":
    "En la consulta de la piel valoramos las manchas y medimos, bajo luz UV, también el pigmento que tú todavía no ves. Después sabes qué se puede hacer y qué corresponde antes a otro sitio.",
  Verkleuringen: "Decoloraciones",
  "op je huid": "en tu piel",
  "Verkleuring is een verzamelwoord. Bruin, rood en wit hebben elk een andere oorzaak, zitten in een andere laag en vragen een andere behandeling.":
    "Decoloración es una palabra paraguas. El marrón, el rojo y el blanco tienen cada uno otra causa, están en otra capa y piden otro tratamiento.",
  "Hieronder vind je per kleur welke behandeling erbij hoort, met een doorverwijzing naar de pagina die erover gaat.":
    "Abajo encuentras, por color, qué tratamiento le corresponde, con un enlace a la página que habla de ello.",
  "Kies je kleur": "Elige tu color",
  "Per kleur": "Por color",
  Vier: "Cuatro",
  kleuren: "colores",
  "Je hoeft de vakterm niet te kennen. Kijk bij daglicht met je onderarm ernaast als vergelijking, en kies de kleur die past.":
    "No hace falta que sepas el término médico. Míralo con luz de día y con tu antebrazo al lado como comparación, y elige el color que encaje.",
  "Bruin of beige": "Marrón o beige",
  "Rood of roze": "Rojo o rosa",
  "Wit of lichter": "Blanco o más claro",
  "Blauw of paars": "Azul o morado",
  "Wat deze kleur betekent": "Lo que significa este color",
  "Meer pigment dan de huid eromheen. De vraag die telt is niet hoe donker maar waaróm het er zit, want dat bepaalt wat er mogelijk is.":
    "Más pigmento que la piel de alrededor. La pregunta que cuenta no es cómo de oscuro sino por qué está ahí, porque eso decide qué es posible.",
  "Kwam het geleidelijk met de jaren, of kwam het in vlakken tegelijk?":
    "¿Vino poco a poco con los años, o apareció en zonas de golpe?",
  "Dan gaat het waarschijnlijk hierover": "Entonces seguramente va de esto",
  "Losse plekjes die er tien jaar geleden niet zaten, vooral waar zon komt.":
    "Manchitas sueltas que hace diez años no estaban, sobre todo donde da el sol.",
  "Grotere vlakken op wangen, bovenlip of voorhoofd, vaak begonnen bij zwangerschap of de pil.":
    "Zonas más grandes en las mejillas, el labio superior o la frente, muchas veces iniciadas con un embarazo o la píldora.",
  "Alleen onder je ogen, terwijl de rest van je gezicht egaal blijft.":
    "Solo debajo de los ojos, mientras el resto de la cara sigue uniforme.",
  "Waarom de kleur en niet de plaats: de kleur zegt iets over de laag waarin het zit. Pigment ligt anders dan bloedvaten, en dat bepaalt of iets reageert op behandeling. Een behandelaar kijkt daarom als eerste hiernaar, en jij kunt dat ook.":
    "Por qué el color y no el sitio: el color dice algo sobre la capa en la que está. El pigmento está de otra manera que los vasos sanguíneos, y eso decide si algo responde al tratamiento. Por eso una terapeuta mira esto primero, y tú también puedes.",
  "Alles op een rij": "Todo de un vistazo",
  "Alles op": "Todo",
  "een rij": "de un vistazo",
  "Hierboven zie je een kleur per keer. Hier staan ze naast elkaar, zodat je kunt scannen in plaats van klikken.":
    "Arriba ves un color cada vez. Aquí están uno al lado del otro, para que puedas repasarlos en vez de ir haciendo clic.",
  "Komt het op en gaat het weer weg, of staat het er altijd?":
    "¿Aparece y se vuelve a ir, o está siempre?",
  "Blijvende roodheid op wangen en neus, met opvlammingen na warmte, alcohol of inspanning.":
    "Rojez permanente en mejillas y nariz, con brotes tras el calor, el alcohol o el esfuerzo.",
  "Rode plekjes met bultjes of puistjes erin, die komen en gaan.":
    "Zonas rojas con bultitos o granos dentro, que van y vienen.",
  "Plotseling opgekomen, verspreid, of samen met ziek zijn. Bel dan eerst je huisarts.":
    "Aparecido de repente, extendido, o junto con encontrarte mal. Llama entonces primero a tu médico de cabecera.",
  "Eén rode streep of plek op de plaats van een oude wond of van striae.":
    "Una raya o mancha roja en el sitio de una herida antigua o de estrías.",
  "Zit het op één oude plek, of komen er verspreid nieuwe plekken bij?":
    "¿Está en un solo sitio antiguo, o van saliendo manchas nuevas por distintos sitios?",
  "Eén plek die precies samenvalt met een oud litteken of oude striae.":
    "Una sola mancha que coincide exactamente con una cicatriz antigua o con estrías antiguas.",
  "Naar de huisarts": "Al médico de cabecera",
  "Verspreide witte plekken die groter worden of erbij komen.":
    "Manchas blancas repartidas que crecen o van a más.",
  "Zit het onder je ogen, of ergens anders?":
    "¿Está debajo de los ojos, o en otro sitio?",
  "Onder de ogen, blauwpaars van tint, en het wisselt met slaap en vocht.":
    "Debajo de los ojos, de tono azul violáceo, y cambia con el sueño y los líquidos.",
  "Paarse strepen op buik, dijen of borsten, vaak nog vrij nieuw.":
    "Rayas moradas en la barriga, los muslos o los pechos, muchas veces todavía bastante recientes.",
  "Een blauwe plek zonder dat je je gestoten hebt, of iets dat snel verandert.":
    "Un moratón sin haberte dado un golpe, o algo que cambia rápido.",
  "De grens van deze pagina": "Donde se para esta página",
  "Wat de kleur": "Lo que el color",
  "niet zegt.": "no dice.",
  "De kleur is de eerste vraag en niet de laatste. Hij wijst de richting aan; wat er in die richting mogelijk is hangt af van dingen die je aan de buitenkant niet ziet.":
    "El color es la primera pregunta y no la última. Señala la dirección; qué es posible en esa dirección depende de cosas que por fuera no se ven.",
  "Hoe erg het is": "Cómo de grave es",
  "Een lichte verkleuring kan hardnekkiger zijn dan een donkere. Wat er te doen valt hangt af van de laag waarin het zit, en dat zie je niet aan de intensiteit.":
    "Una decoloración clara puede ser más terca que una oscura. Lo que se puede hacer depende de la capa en la que está, y eso no se ve por la intensidad.",
  "Of het weggaat": "Si se va a ir",
  "Twee mensen met dezelfde kleur op dezelfde plek kunnen een ander verloop hebben. Een uitkomst voorspellen op kleur alleen is gokken, en dat doen we niet.":
    "Dos personas con el mismo color en el mismo sitio pueden tener una evolución distinta. Predecir un resultado solo por el color es adivinar, y eso no lo hacemos.",
  "Hoe lang het er al zit": "Cuánto tiempo lleva ahí",
  "Vers en oud zien er vaak hetzelfde uit, terwijl dat verschil juist bepaalt wat er nog beweegt. Daarom vragen we ernaar en kijken we er niet alleen naar.":
    "Lo reciente y lo antiguo suelen tener el mismo aspecto, mientras que esa diferencia es justo la que decide cuánto se mueve todavía. Por eso lo preguntamos y no solo lo miramos.",
  "Eén ding telt zwaarder dan de kleur": "Una cosa cuenta más que el color",
  "Verandert een plek van vorm, kleur of grootte, jeukt of bloedt hij, of is hij er in korte tijd bij gekomen? Dan doet de kleur er niet toe en hoort hij bij de huisarts. Dat geldt voor bruin, rood, wit en blauw evengoed.":
    "¿Una mancha cambia de forma, de color o de tamaño, pica o sangra, o ha salido en poco tiempo? Entonces el color da igual y le corresponde tu médico de cabecera. Eso vale igual para el marrón, el rojo, el blanco y el azul.",
  "Dermamelan Intimate": "Dermamelan Intimate",
  "Pigmentbehandeling voor de intieme zone, met dezelfde opzet als het gezichtstraject.":
    "Tratamiento del pigmento para la zona íntima, planteado igual que el programa facial.",
  "Happy Intim": "Happy Intim",
  "Peelings die pigment in de intieme zone en oksels lichter en egaler maken.":
    "Peelings que aclaran y uniforman el pigmento de la zona íntima y de las axilas.",
  "Wat als ik meerdere kleuren tegelijk heb?":
    "¿Y si tengo varios colores a la vez?",
  "Dat komt vaak voor en het betekent meestal dat er meer dan één ding speelt. Begin bij de kleur die je het meest stoort; de rest komt in het gesprek vanzelf aan bod.":
    "Es frecuente y normalmente significa que hay más de una cosa en juego. Empieza por el color que más te molesta; el resto sale solo en la conversación.",
  "Ik weet niet goed welke kleur het is.": "No sé bien de qué color es.",
  "Kijk bij daglicht en niet onder een lamp, en houd je onderarm ernaast als vergelijking. Twijfel je tussen bruin en rood, druk er dan even op: rood verbleekt onder druk, bruin niet.":
    "Míralo con luz de día y no bajo una lámpara, y pon tu antebrazo al lado como comparación. Si dudas entre marrón y rojo, presiona un momento: el rojo palidece con la presión, el marrón no.",
  "Is verkleuring gevaarlijk?": "¿Es peligrosa una decoloración?",
  "Meestal niet, en er zijn uitzonderingen die er wel toe doen. Een plek die verandert van vorm, kleur of grootte hoort bij de huisarts, en dat geldt voor elke kleur.":
    "Normalmente no, y hay excepciones que sí importan. Una mancha que cambia de forma, de color o de tamaño le corresponde a tu médico de cabecera, y eso vale para cualquier color.",
  "Waarom staat er geen prijs op deze pagina?":
    "¿Por qué no hay ningún precio en esta página?",
  "Omdat hier niets te koop is. Dit is een wegwijzer; de prijzen staan bij de behandeling die er uiteindelijk bij hoort.":
    "Porque aquí no se vende nada. Esto es una señal indicadora; los precios están en el tratamiento al que acabe llevando.",
  "Weet je het nog niet": "¿Todavía no lo sabes?",
  "Kom gewoon langs.": "Pásate sin más.",
  "Wij kijken mee.": "Lo miramos contigo.",
  "Twijfel je tussen twee kleuren of spelen er meerdere veranderingen tegelijk, laat de plek dan beoordelen.":
    "Si dudas entre dos colores o hay varios cambios a la vez, deja que valoremos la mancha.",
  Alle: "Todos los",
  huidproblemen: "problemas de piel",
  "Bij elke klacht telt iets anders: waar het zit, welk seizoen het is, hoe oud het is of hoe diep het ligt. Kies je klacht en lees wat er bij jou telt.":
    "En cada problema cuenta otra cosa: dónde está, qué estación es, cuántos años tiene o a qué profundidad llega. Elige tu problema y lee lo que cuenta en tu caso.",
  "Bij acne telt wáár het zit, want de plek zegt iets over de oorzaak. Bij pigment telt welk seizoen het is. Bij littekens hoe oud ze zijn, en bij melasma hoe diep het pigment ligt. Dat klinkt als een detail en het bepaalt de uitkomst: wie met de verkeerde vraag begint, behandelt maanden het verkeerde.":
    "En el acné cuenta dónde está, porque el sitio dice algo sobre la causa. En la pigmentación cuenta qué estación es. En las cicatrices, cuántos años tienen, y en el melasma, a qué profundidad está el pigmento. Suena a detalle y decide el resultado: quien empieza con la pregunta equivocada pasa meses tratando lo que no es.",
  "Geen idee waar je moet zijn": "Ni idea de a dónde acudir",
  "Je hoeft niet te weten hoe het heet. Kruis aan wat je ziet, dan zoeken wij de pagina erbij.":
    "No hace falta que sepas cómo se llama. Marca lo que ves y nosotros buscamos la página que le corresponde.",
  "Naar de symptoomzoeker": "Al buscador de síntomas",
  "Of stel je vraag": "O haz tu pregunta",
  "Waar het gesprek plaatsvindt": "Dónde tiene lugar la conversación",
  "Samen met een arts": "Junto con un médico",
  "Bij een arts": "Con un médico",
  "Geen behandeling": "Sin tratamiento",
  "Weet je het niet": "No lo sabes",
  "Hier kunnen wij iets": "Aquí sí podemos hacer algo",
  "Wat wij": "Lo que sí",
  "behandelen.": "tratamos.",
  "Elk met een eigen pagina die begint bij de vraag die bij dat probleem het zwaarst weegt. Eerst meten, dan pas een plan, en soms is het advies om niets te doen.":
    "Cada uno con su propia página, que empieza por la pregunta que más pesa en ese problema. Primero medir, después un plan, y a veces el consejo es no hacer nada.",
  "Waar op je gezicht zit het?": "¿En qué parte de la cara está?",
  "Litteken of kleur?": "¿Cicatriz o color?",
  "Rimpels en fijne lijntjes": "Arrugas y líneas finas",
  "Beweegt de lijn mee?": "¿La línea se mueve contigo?",
  "Is het 's avonds minder?": "¿Por la tarde se nota menos?",
  "Is de plek veranderd?": "¿Ha cambiado la mancha?",
  "Gerstekorrels en milia": "Milium y granos de sebo",
  "Wit en hard of rood?": "¿Blanco y duro, o rojo?",
  "Wat zie je liggend?": "¿Qué ves tumbado?",
  "Zit er een haar in?": "¿Hay un pelo dentro?",
  "Mee-eter of porie?": "¿Punto negro o poro?",
  "Bultjes of ruw?": "¿Bultitos o aspereza?",
  "Waar komt het vandaan?": "¿De dónde viene?",
  "Aan een steeltje?": "¿Cuelga de un tallito?",
  "Wat zet het aan?": "¿Qué lo enciende?",
  "Vaatjes of gloed?": "¿Vasos o rubor?",
  "Welk seizoen is het?": "¿Qué estación es?",
  "Hoe diep zit het pigment?": "¿A qué profundidad está el pigmento?",
  "Hoe oud is het litteken?": "¿Cuántos años tiene la cicatriz?",
  "Zijn ze nog rood of al wit?": "¿Siguen rojas o ya están blancas?",
  "Is dit tijd of is dit zon?": "¿Esto es el tiempo o es el sol?",
  "Wat valt er te doen?": "¿Qué se puede hacer?",
  "Vet of water?": "¿Grasa o agua?",
  "Wat staat er allemaal aan?": "¿Qué hay encendido?",
  "Kleur of schaduw?": "¿Color o sombra?",
  "Hier werken wij samen met een arts": "Aquí trabajamos junto con un médico",
  "Wat wij samen": "Lo que hacemos",
  "met een arts doen.": "junto a un médico.",
  "Deze klachten behandelen we wel, alleen niet alleen. De arts doet wat medisch nodig is en wij doen wat de huid daarnaast vraagt. Wie er begint hangt af van wat er speelt.":
    "Estos problemas sí los tratamos, solo que no solos. El médico hace lo que hace falta desde el punto de vista médico y nosotros hacemos lo que la piel pide además. Quién empieza depende de lo que haya.",
  Keloïden: "Queloides",
  "Over de wondrand heen?": "¿Más allá del borde de la herida?",
  "Waar breekt de cirkel?": "¿Por dónde se rompe el círculo?",
  "Ook je nagels erbij?": "¿También las uñas?",
  "Bel je vandaag of morgen?": "¿Llamas hoy o mañana?",
  "Hier sturen wij je door": "Aquí te derivamos",
  "Wat bij een arts": "Lo que le corresponde",
  "hoort.": "a un médico.",
  "Deze pagina's hebben geen afspraakknop. Ze staan er omdat mensen ons dit vragen terwijl ze bij ons op de stoel liggen, en dan is een goed antwoord beter dan een ontwijkend.":
    "Estas páginas no tienen botón de cita. Están aquí porque la gente nos pregunta esto mientras está tumbada en nuestra camilla, y entonces una buena respuesta vale más que una evasiva.",
  "Is er iets veranderd?": "¿Ha cambiado algo?",
  "Hier bestaat geen behandeling voor": "Para esto no existe tratamiento",
  "Waar niemand": "Lo que nadie",
  "iets aan kan.": "puede solucionar.",
  "Dat staat er zo, met de uitleg waarom geen enkele crème of apparaat het weghaalt. Dan weet je waar je aan toe bent voordat je ergens aan begint.":
    "Lo decimos tal cual, con la explicación de por qué ninguna crema ni ningún aparato lo quita. Así sabes a qué atenerte antes de empezar nada.",
  "Begin dan": "Entonces empieza",
  "bij wat je ziet.": "por lo que ves.",
  "Twee wegwijzers die sorteren op kleur of op wat je voelt, in plaats van op een naam die je niet kent.":
    "Dos señales indicadoras que ordenan por color o por lo que notas, en lugar de por un nombre que no conoces.",
  "Welke kleur heeft het?": "¿De qué color es?",
  "Wat zie je precies?": "¿Qué ves exactamente?",
  "Wat op elke pagina terugkomt": "Lo que vuelve en cada página",
  "Dezelfde vier vragen,": "Las mismas cuatro preguntas,",
  "elke keer.": "cada vez.",
  "Wat is het eigenlijk": "Qué es en realidad",
  "Uitgelegd zoals we het in de behandelkamer zeggen, met de vakterm erbij.":
    "Explicado como lo decimos en la sala de tratamiento, con el término médico al lado.",
  "Wat werkt en wat niet": "Qué funciona y qué no",
  "Wat er werkt en wat we afraden, en bij allebei de reden erachter.":
    "Lo que funciona y lo que desaconsejamos, y en los dos casos el motivo.",
  "Wat wij eraan doen": "Qué hacemos nosotros",
  "Welke behandeling erbij past, wat je ervan kunt verwachten en wat het kost.":
    "Qué tratamiento encaja, qué puedes esperar de él y cuánto cuesta.",
  "Hoe we het meten": "Cómo lo medimos",
  "We leggen vast hoe je huid er bij de start voor staat, zodat verschil later te zien is.":
    "Registramos cómo está tu piel al empezar, para que más adelante se pueda ver la diferencia.",
  "Behandeling nul": "Tratamiento cero",
  "Alles begint": "Todo empieza",
  "bij meten.": "midiendo.",
  "Iedere huidvraag begint met een beoordeling, waaruit ook kan volgen dat we geen behandeling adviseren.":
    "Cualquier duda sobre la piel empieza con una valoración, de la que también puede salir que no te aconsejemos ningún tratamiento.",
  "Die dunne rode of paarse lijntjes op je wangen of naast je neus heten couperose. Een egale rode waas is iets anders en vraagt om een andere aanpak, al zitten ze vaak samen. De huidtherapeut beoordeelt onder vergroting welke van de twee het bij jou is.":
    "Esas líneas finas rojas o moradas en las mejillas o al lado de la nariz se llaman cuperosis. Un velo rojo uniforme es otra cosa y pide otro enfoque, aunque suelen ir juntos. La terapeuta de piel valora con lupa cuál de los dos es en tu caso.",
  "We behandelen couperose met de Nordlys IPL en met laser. Onze huidtherapeuten werken hier dagelijks mee en stellen het apparaat af op jouw huidtype en op de vaatjes die er zitten. Hoeveel sessies dat vraagt hoor je tijdens de intake.":
    "Tratamos la cuperosis con el Nordlys IPL y con láser. Nuestras terapeutas de piel trabajan con ellos a diario y ajustan el equipo a tu fototipo y a los vasos que hay. Cuántas sesiones hacen falta lo sabes durante la primera consulta.",
  "Wat we in het consult bekijken": "Lo que miramos en la consulta",
  "Of is het rosacea": "O si es rosácea",
  "Vaatjes of": "Vasos o",
  roodheid: "rojez",
  "Couperose en rosacea lopen met het blote oog door elkaar en vragen een andere aanpak. Zo stelt de huidtherapeut vast waar je mee te maken hebt.":
    "A simple vista, la cuperosis y la rosácea se confunden, y piden enfoques distintos. Así determina la terapeuta de piel con qué tienes que ver.",
  "Onder vergroting": "Con lupa",
  "De huidtherapeut bekijkt de rode plek vergroot. Losse, vertakte lijntjes zien er heel anders uit dan een egale waas, en met het blote oog lopen die twee makkelijk door elkaar.":
    "La terapeuta mira la zona roja aumentada. Unas líneas sueltas y ramificadas se ven muy distintas de un velo uniforme, y a simple vista esas dos se confunden con facilidad.",
  "Met lichte druk": "Con una ligera presión",
  "Een korte druk op de plek laat zien of het rood wegtrekt of dat er een lijntje blijft staan. Dat verschil bepaalt of het om vaatjes gaat of om roodheid in de huid zelf.":
    "Una presión corta sobre la zona muestra si el rojo desaparece o si queda una línea. Esa diferencia decide si son vasos o si es rojez en la piel misma.",
  "De opname gaat onder vaste belichting, zodat we bij een volgende afspraak kunnen vergelijken. Roodheid wisselt per dag, dus zonder vast licht meet je vooral het weer.":
    "La foto se hace con una iluminación fija, para poder comparar en una cita posterior. La rojez cambia según el día, así que sin luz fija estarías midiendo sobre todo el tiempo que hace.",
  "Zag je allebei? Dat is de meest voorkomende uitkomst, en geen tussenvorm die je zelf hoeft op te lossen. Hieronder staat wat elk van de twee vraagt.":
    "¿Has visto las dos cosas? Es el resultado más frecuente, y no una forma intermedia que tengas que resolver tú. Abajo está lo que pide cada una de las dos.",
  "Wat de huidtherapeut ziet bepaalt bij welk beeld je uitkomt. Bij één daarvan begint het bij licht, bij een ander juist niet, en dat verschil is het hele punt van deze pagina.":
    "Lo que ve la terapeuta decide en qué cuadro acabas. En uno de ellos se empieza por la luz, en otro justo no, y esa diferencia es todo el sentido de esta página.",
  "Losse rode lijntjes": "Líneas rojas sueltas",
  "Dunne rode of paarse draadjes op je wangen of naast je neus":
    "Hilillos finos rojos o morados en las mejillas o al lado de la nariz",
  "Een rode gloed": "Un rubor rojo",
  "Een waas van rood over je wangen, zonder losse lijntjes":
    "Un velo de rojo sobre las mejillas, sin líneas sueltas",
  "Allebei door elkaar": "Las dos cosas mezcladas",
  "Een rode ondergrond met daarin een paar duidelijke lijntjes":
    "Un fondo rojo con unas cuantas líneas claras dentro",
  teleangiëctasieën: "telangiectasias",
  "Onder lichte druk": "Bajo una ligera presión",
  "Het lijntje blijft zichtbaar terwijl je drukt. Het bloed laat zich er niet uit duwen.":
    "La línea sigue visible mientras presionas. La sangre no se deja empujar fuera.",
  "Een bloedvaatje dat blijvend is opgerekt. Zo'n vaatje sluit zich uit zichzelf niet meer, en het zit onder de opperhuid, waar verzorgingsproducten niet komen.":
    "Un vaso sanguíneo que se ha dilatado de forma permanente. Un vaso así ya no se cierra solo, y está por debajo de la epidermis, donde los productos de cuidado no llegan.",
  "Hier levert licht het meeste op. We leggen eerst vast hoeveel er zichtbaar is, zodat je na een paar sessies het verschil kunt terugzien in plaats van moeten inschatten.":
    "Aquí la luz es lo que más da. Primero registramos cuánto se ve, para que después de unas sesiones puedas ver la diferencia en vez de tener que estimarla.",
  "Veel mensen noemen dit een gesprongen adertje. Er is niets gesprongen: het vaatje is opgerekt en staat open. Dat klinkt als een detail, maar het scheelt in wat eraan te doen is.":
    "Mucha gente llama a esto una vena reventada. No ha reventado nada: el vaso se ha dilatado y está abierto. Suena a detalle, pero cambia lo que se puede hacer.",
  "Couperose of rosacea?": "¿Cuperosis o rosácea?",
  "Ze lopen vaak samen en worden daarom door elkaar gehaald, ook door ons vak. Vier verschillen die je zelf kunt nagaan voordat je iets boekt.":
    "Suelen ir juntas y por eso se confunden, también en nuestro oficio. Cuatro diferencias que puedes comprobar tú antes de reservar nada.",
  "Blijft er een lijntje staan, dan is het couperose. Trekt alles weg, dan is het een gloed.":
    "Si queda una línea, es cuperosis. Si desaparece todo, es un rubor.",
  Opvlammen: "Brotes",
  "Bij rosacea komt en gaat het in aanvallen. Losse vaatjes staan er elke dag hetzelfde bij.":
    "En la rosácea va y viene por episodios. Los vasos sueltos están ahí igual todos los días.",
  "Branderig gevoel": "Sensación de ardor",
  "Dit beeld kan bij rosacea passen; een verwijd vaatje is meestal niet voelbaar.":
    "Este cuadro puede encajar con la rosácea; un vaso dilatado no suele notarse.",
  Bultjes: "Bultitos",
  "Rode bultjes zonder mee-eters wijzen op rosacea, en daar hoort een arts bij.":
    "Los bultitos rojos sin puntos negros apuntan a rosácea, y con eso va un médico.",
  "Herken je meer dan de vaatjes": "Si reconoces más que los vasos",
  "Dan is dit niet je pagina, en dat zeggen we liever nu.":
    "Entonces esta no es tu página, y preferimos decirlo ahora.",
  "Opvlammingen na warmte of wijn, een branderig gevoel, bultjes zonder mee-eters: dat wijst op rosacea. Daar hoort een ander gesprek bij, en soms een arts.":
    "Brotes tras el calor o el vino, una sensación de ardor, bultitos sin puntos negros: eso apunta a rosácea. Con eso va otra conversación, y a veces un médico.",
  "Naar de rosaceapagina": "A la página de la rosácea",
  "Bij couperose is de lijst korter dan bij de meeste huidproblemen, en dat is geen bescheidenheid. Er is één ding dat werkt op een vaatje dat al zichtbaar is, en er is veel dat er niets aan doet.":
    "En la cuperosis la lista es más corta que en la mayoría de los problemas de piel, y no es por modestia. Hay una cosa que funciona sobre un vaso que ya se ve, y hay mucho que no le hace nada.",
  "Vooraf vastleggen hoeveel vaatjes er zichtbaar zijn, onder vast licht, zodat je het later kunt vergelijken":
    "Registrar de antemano cuántos vasos se ven, con luz fija, para poder compararlo después",
  "Gericht licht op de vaatjes die bij druk blijven staan, verdeeld over meerdere sessies":
    "Luz dirigida a los vasos que quedan bajo presión, repartida en varias sesiones",
  "Elke dag zonbescherming. UV rekt vaatwanden verder op en is de belangrijkste reden dat er nieuwe bij komen":
    "Protección solar todos los días. El UV dilata más las paredes de los vasos y es el principal motivo de que salgan nuevos",
  "Uitzoeken waardoor de gloed opkomt, want zolang die blijft terugkomen ontstaan er nieuwe vaatjes":
    "Averiguar qué provoca el rubor, porque mientras siga volviendo se van formando vasos nuevos",
  "Vooraf zeggen wanneer één sessie waarschijnlijk volstaat en wanneer je op een reeks moet rekenen":
    "Decir de antemano cuándo una sesión probablemente basta y cuándo tienes que contar con una serie",
  "Stevig scrubben of borstelen. Je huid wordt er roder van terwijl de vaatjes blijven zitten":
    "Frotar o cepillar fuerte. Tu piel se pone más roja mientras los vasos siguen ahí",
  "Een hete douche of de sauna vlak na een vaatbehandeling, omdat warmte de roodheid opnieuw kan opwekken":
    "Una ducha caliente o la sauna justo después de un tratamiento de vasos, porque el calor puede volver a despertar la rojez",
  "Camouflage als behandeling presenteren. Groene concealer maakt roodheid minder zichtbaar en laat de vaatjes zoals ze zijn":
    "Presentar el maquillaje correctivo como tratamiento. El corrector verde hace la rojez menos visible y deja los vasos como están",
  "Een crème die belooft vaatjes te laten verdwijnen. Een opgerekt vaatje ligt onder de opperhuid, buiten bereik van wat je erop smeert":
    "Una crema que promete hacer desaparecer los vasos. Un vaso dilatado está bajo la epidermis, fuera del alcance de lo que te pongas encima",
  "Vaatjes zijn te tellen.": "Los vasos se pueden contar.",
  "Dat klinkt klein, maar het is de reden dat je bij dit huidprobleem niet hoeft te geloven dat het werkte. De EVE-M legt de vaatstructuur vast onder vast licht, vóór de eerste sessie.":
    "Suena a poco, pero es la razón por la que en este problema no tienes que creerte que funcionó. El EVE-M registra la estructura de los vasos con luz fija, antes de la primera sesión.",
  "Na de reeks leggen we de twee beelden naast elkaar. Zie je zelf geen verschil, dan is dat het antwoord en gaan we niet door omdat er nog sessies in een pakket zaten.":
    "Después de la serie ponemos las dos imágenes una al lado de la otra. Si tú no ves diferencia, esa es la respuesta y no seguimos porque a un paquete le quedaran sesiones.",
  Vaatstructuur: "Estructura de los vasos",
  "Hoeveel zichtbare lijntjes er zijn en hoe ze lopen":
    "Cuántas líneas visibles hay y cómo van",
  "De basiskleur van de huid, los van de losse vaatjes":
    "El color de base de la piel, al margen de los vasos sueltos",
  Gevoeligheid: "Sensibilidad",
  "Hoe snel je huid reageert, want dat bepaalt de instelling":
    "Con qué rapidez reacciona tu piel, porque eso decide el ajuste",
  "Komen die vaatjes terug na de behandeling?":
    "¿Esos vasos vuelven después del tratamiento?",
  "Een vaatje dat gesloten is, blijft dicht. Wat wel gebeurt, is dat er in de loop van de tijd nieuwe bij kunnen komen, want je aanleg en de dingen die je huid aanzetten veranderen niet door een behandeling. Daarom besteden we net zoveel aandacht aan wat de roodheid opwekt als aan wat er nu te zien is.":
    "Un vaso que se ha cerrado se queda cerrado. Lo que sí pasa es que con el tiempo pueden salir nuevos, porque tu predisposición y las cosas que encienden tu piel no cambian con un tratamiento. Por eso prestamos tanta atención a lo que provoca la rojez como a lo que se ve ahora.",
  "Is couperose hetzelfde als rosacea?": "¿Cuperosis es lo mismo que rosácea?",
  "Ze lopen vaak samen op, maar het is niet hetzelfde. Couperose zijn de zichtbare, blijvend opgerekte vaatjes. Rosacea is een ontstekingsbeeld met opvlammingen, soms bultjes en een branderig gevoel. Je kunt de vaatjes hebben zonder rosacea, en rosacea zonder zichtbare vaatjes. Herken je meer dan de lijntjes alleen, lees dan verder op de rosaceapagina.":
    "Suelen ir de la mano, pero no son lo mismo. La cuperosis son los vasos visibles, dilatados de forma permanente. La rosácea es un cuadro inflamatorio con brotes, a veces bultitos y una sensación de ardor. Puedes tener los vasos sin rosácea, y rosácea sin vasos visibles. Si reconoces algo más que las líneas, sigue leyendo en la página de la rosácea.",
  "Krijg ik dit van alcohol?": "¿Esto me sale del alcohol?",
  "Alcohol zet de vaten wijd open en kan een opvlamming uitlokken, maar het verklaart de aanleg niet. Dat hardnekkige verband zorgt er vooral voor dat mensen zich schamen voor iets waar ze zelf weinig aan konden doen.":
    "El alcohol abre los vasos de par en par y puede provocar un brote, pero no explica la predisposición. Esa asociación tan persistente sobre todo hace que la gente se avergüence de algo que poco podía evitar.",
  "Kan ik make-up blijven gebruiken?": "¿Puedo seguir usando maquillaje?",
  "Ja, ook tussen de sessies door. We vragen alleen om je huid schoon te laten op de dag van de behandeling zelf.":
    "Sí, también entre sesiones. Solo te pedimos que lleves la piel limpia el día del tratamiento.",
  "Wat kost een behandeling?": "¿Cuánto cuesta un tratamiento?",
  "Een behandeling van vaatjes met de Nordlys begint bij 75 euro voor een klein gebied. Wat het bij jou wordt, hangt af van hoe groot het gebied is en hoeveel sessies er nodig zijn; dat hoor je na de eerste afspraak. Alle tarieven staan op de tarievenpagina.":
    "Un tratamiento de vasos con el Nordlys empieza en 75 euros para una zona pequeña. Lo que salga en tu caso depende de lo grande que sea la zona y de cuántas sesiones hagan falta; eso lo sabes después de la primera cita. Todos los precios están en la página de precios.",
  "We tellen eerst": "Primero contamos",
  "hoeveel er zichtbaar is": "cuánto se ve",
  "Het huidconsult legt vast wat er nu zichtbaar is. Daarna weet je hoeveel sessies er nodig zijn, en wij ook.":
    "La consulta de la piel registra lo que se ve ahora. Después sabes cuántas sesiones hacen falta, y nosotros también.",
  "onder je ogen": "debajo de los ojos",
  "Donkere kringen hebben drie mogelijke oorzaken: pigment, doorschijnende vaatjes of schaduw door een groef. Pigment behandelen we met peelings en gerichte verzorging.":
    "Las ojeras tienen tres causas posibles: pigmento, vasos que se transparentan o sombra por un surco. El pigmento lo tratamos con peelings y cuidados dirigidos.",
  "Tijdens de intake stellen we vast om welke van de drie het gaat en wat daarbij past.":
    "Durante la primera consulta determinamos de cuál de las tres se trata y qué encaja con ella.",
  "De drie types": "Los tres tipos",
  "Onder het oog telt het licht dubbel: een lamp van boven maakt van elke holte een donkere plek. Daarom beoordelen we het onder vaste belichting.":
    "Debajo del ojo la luz cuenta doble: una lámpara desde arriba convierte cualquier hueco en una zona oscura. Por eso lo valoramos con una iluminación fija.",
  "Kleur of schaduw": "Color o sombra",
  "Onder vaste belichting van voren valt een schaduw weg en blijft kleur staan. Thuis lukt dat niet: een lamp aan het plafond maakt van elke holte een donkere plek.":
    "Con una iluminación fija de frente, una sombra desaparece y el color se queda. En casa eso no sale: una lámpara en el techo convierte cualquier hueco en una zona oscura.",
  "Pigment of vaatjes": "Pigmento o vasos",
  "Onder vergroting is te zien of de donkerte in de huid zelf zit of dat je door een dunne huid heen naar de vaatjes eronder kijkt. Die twee vragen een andere behandeling.":
    "Con lupa se ve si la oscuridad está en la piel misma o si estás mirando a través de una piel fina los vasos que hay debajo. Esas dos piden tratamientos distintos.",
  "De opname gaat onder dezelfde belichting als bij een volgende afspraak. Zo zie je het verschil naast elkaar in plaats van dat je het achteraf moet inschatten.":
    "La foto se hace con la misma iluminación que en una cita posterior. Así ves la diferencia una al lado de la otra en vez de tener que estimarla después.",
  Drie: "Tres",
  oorzaken: "causas",
  "De drie oorzaken naast elkaar, met per soort wat je ziet, waar het vandaan komt en wat er in de kliniek aan te doen is.":
    "Las tres causas una al lado de la otra, con lo que ves en cada tipo, de dónde viene y qué se puede hacer en la clínica.",
  "Dit is pigment": "Esto es pigmento",
  "peri-orbitale hyperpigmentatie": "hiperpigmentación periorbitaria",
  "Er zit meer kleur in de huid onder je oog. Dat kan erfelijk zijn, kan volgen op eczeem of op wrijven, en komt vaker voor bij een donkere huid.":
    "Hay más color en la piel de debajo del ojo. Puede ser hereditario, puede venir después de un eccema o de frotarse, y es más frecuente en pieles oscuras.",
  "Dit zijn doorschijnende vaatjes": "Estos son vasos que se transparentan",
  "vasculaire kringen": "ojeras vasculares",
  "De huid onder je oog is de dunste van je lichaam. Bij sommige mensen schemert het bloedvatennetwerk eronder erdoorheen, wat een blauwpaarse tint geeft.":
    "La piel de debajo del ojo es la más fina de tu cuerpo. En algunas personas la red de vasos sanguíneos se transparenta, lo que da un tono azul violáceo.",
  "Deels behandelbaar": "Tratable en parte",
  "Dit is schaduw, geen kleur": "Esto es sombra, no color",
  "traandalgroeve, structurele schaduw": "surco lagrimal, sombra estructural",
  "De overgang tussen je onderooglid en je wang ligt iets dieper, en licht van boven maakt daar een schaduw van. De huid zelf heeft geen afwijkende kleur.":
    "La transición entre el párpado inferior y la mejilla está un poco más hundida, y la luz de arriba hace ahí una sombra. La piel en sí no tiene ningún color distinto.",
  "Andere discipline": "Otra disciplina",
  "Kwam er pigment uit? Dan gelden dezelfde regels als voor pigment elders in je gezicht, inclusief het seizoen waarin je beter niet begint.":
    "¿Salió pigmento? Entonces valen las mismas reglas que para el pigmento del resto de la cara, incluida la estación en la que es mejor no empezar.",
  "Naar de pigmentpagina": "A la página de la pigmentación",
  "Behandelen voordat duidelijk is om welke van de drie het gaat, kost de meeste mensen het meeste geld.":
    "Tratar antes de tener claro de cuál de los tres se trata es lo que a la mayoría de la gente le cuesta más dinero.",
  "Eerst uitzoeken welk van de drie types het is. Dat kost je twee minuten voor de spiegel en bepaalt of behandelen überhaupt zin heeft.":
    "Averiguar primero cuál de los tres tipos es. Eso te cuesta dos minutos delante del espejo y decide si tratar tiene sentido siquiera.",
  "Zonbescherming tot op het ooglid als het om pigment gaat. Die plek wordt bijna altijd overgeslagen.":
    "Protección solar hasta el párpado si se trata de pigmento. Ese sitio casi siempre se salta.",
  "Stoppen met wrijven. Wrijven en krabben zijn een bekende aanjager van pigment op deze plek.":
    "Dejar de frotarte. Frotar y rascar son un impulsor conocido del pigmento en esta zona.",
  "Je foto's onder hetzelfde licht vergelijken, want licht van boven maakt elke kring erger.":
    "Comparar tus fotos con la misma luz, porque la luz de arriba empeora cualquier ojera.",
  "Accepteren dat een deel van wat je ziet bij je gezicht hoort en niet bij je huid.":
    "Aceptar que una parte de lo que ves pertenece a tu cara y no a tu piel.",
  "Een behandeling boeken voordat duidelijk is welk type je hebt. Bij één van de drie levert dat niets op en bij een tweede maar de helft.":
    "Reservar un tratamiento antes de tener claro qué tipo tienes. Con uno de los tres no da nada y con un segundo solo la mitad.",
  "Agressief werken op de dunne huid onder het oog. Dat geeft daar juist een grotere kans op meer pigment.":
    "Trabajar de forma agresiva sobre la piel fina de debajo del ojo. Eso aumenta justo ahí el riesgo de más pigmento.",
  "Denken dat het aan slaap ligt. Slaap maakt het wisselen erger, maar veroorzaakt geen van de drie types.":
    "Pensar que es cuestión de sueño. El sueño hace que varíe más, pero no causa ninguno de los tres tipos.",
  "Concealer als maatstaf nemen. Die dekt kleur af en verandert niets aan een schaduw.":
    "Tomar el corrector como medida. Tapa el color y no cambia nada en una sombra.",
  "Op internet gevonden hoeveelheden vitamine K of cafeïne aanhouden. Daar is voor deze plek geen betrouwbaar bewijs voor.":
    "Seguir cantidades de vitamina K o cafeína encontradas en internet. Para esta zona no hay pruebas fiables de eso.",
  "Onder het oog telt het licht dubbel.": "Debajo del ojo la luz cuenta doble.",
  "Geen enkel gebied is zo gevoelig voor de stand van een lamp als dit. Licht van boven maakt van elke holte een donkere plek, en dan meet je vooral je verlichting in plaats van je huid.":
    "Ninguna zona es tan sensible a la posición de una lámpara como esta. La luz de arriba convierte cualquier hueco en una zona oscura, y entonces estás midiendo sobre todo tu iluminación y no tu piel.",
  "Daarom leggen we dit gebied vast met vaste belichting en op vaste afstand. Pas dan is een verschil later een verschil, en geen ander moment van de dag.":
    "Por eso registramos esta zona con una iluminación fija y a una distancia fija. Solo así una diferencia más adelante es una diferencia, y no otro momento del día.",
  Kleur: "Color",
  "Hoeveel pigment er in de huid zelf zit":
    "Cuánto pigmento hay en la piel misma",
  Doorschijnen: "Transparencia",
  "Hoe sterk het vaatnetwerk eronder meetelt":
    "Cuánto cuenta la red de vasos que hay debajo",
  Schaduw: "Sombra",
  "Hoe diep de overgang naar de wang ligt":
    "A qué profundidad está la transición hacia la mejilla",
  "RRS Eyes": "RRS Eyes",
  "Werkzame stoffen rond de oogcontour. Voor donkere kringen, fijne lijntjes en een vermoeide blik.":
    "Principios activos alrededor del contorno de ojos. Para ojeras, líneas finas y una mirada cansada.",
  "Eye peel": "Eye peel",
  "Een peeling die op de oogcontour mag. Voor fijne lijntjes en een doffe, donkere oogzone.":
    "Un peeling que se puede usar en el contorno de ojos. Para líneas finas y una zona ocular apagada y oscura.",
  "Komt het echt niet door te weinig slaap?":
    "¿De verdad no es por dormir poco?",
  "Slaaptekort veroorzaakt geen van de drie types. Het maakt wel dat je gezicht vochtiger en bleker is, waardoor bestaande kringen sterker opvallen. Uitslapen laat ze dus tijdelijk meevallen zonder dat er iets veranderd is.":
    "La falta de sueño no causa ninguno de los tres tipos. Lo que sí hace es que tu cara esté más hinchada y más pálida, con lo que las ojeras que ya hay destacan más. Dormir mucho las hace parecer menos durante un rato sin que haya cambiado nada.",
  "Mijn moeder heeft ze ook. Is dat toeval?":
    "Mi madre también las tiene. ¿Es casualidad?",
  "Waarschijnlijk niet. Zowel de vorm van de oogkas als de neiging tot pigment op deze plek zit in de familie. Dat verandert niets aan wat er mogelijk is, maar het verklaart wel waarom ze er al vroeg waren.":
    "Seguramente no. Tanto la forma de la cuenca del ojo como la tendencia al pigmento en esta zona vienen de familia. Eso no cambia nada de lo que es posible, pero sí explica por qué estaban ahí tan pronto.",
  "Ja. Pigment onder het oog komt vaker voor bij een donkere huid, en tegelijk is de kans op ongewenste verkleuring na een te stevige behandeling daar groter. Rustiger werken is dan geen voorzichtigheid maar noodzaak.":
    "Sí. El pigmento debajo del ojo es más frecuente en pieles oscuras, y a la vez ahí es mayor el riesgo de una decoloración no deseada tras un tratamiento demasiado fuerte. Trabajar con más calma no es entonces prudencia sino necesidad.",
  "Helpt een oogcrème?": "¿Ayuda una crema de ojos?",
  "Bij pigment kan verzorging meehelpen, bij schaduw doet die niets. Dat is precies waarom het loont om eerst te weten welk type je hebt in plaats van iets te kopen.":
    "Con el pigmento, el cuidado puede echar una mano; con la sombra no hace nada. Justo por eso compensa saber primero qué tipo tienes en vez de comprar algo.",
  "Meestal drie tot zes, met vier tot zes weken ertussen, en dat hoor je pas na de meting omdat het van de oorzaak afhangt. Bij pigment werken we onder het oog bewust in kleinere stappen, dus reken op meer sessies dan bij dezelfde vlek op je wang.":
    "Normalmente de tres a seis, con cuatro a seis semanas entre medias, y eso lo sabes solo después de la medición porque depende de la causa. Con pigmento trabajamos debajo del ojo a propósito en pasos más pequeños, así que cuenta con más sesiones que para la misma mancha en la mejilla.",
  "Eerst weten": "Primero saber",
  "welk type je hebt.": "qué tipo tienes.",
  "We kijken onder vaste belichting welk van de drie het is. Blijkt het schaduw, dan hoor je dat en houdt het op. Blijkt het pigment, dan weet je meteen wat er mogelijk is.":
    "Miramos con una iluminación fija cuál de los tres es. Si resulta ser sombra, te lo decimos y ahí se queda. Si resulta ser pigmento, sabes enseguida qué es posible.",
  "Wat er na acne": "Lo que el acné deja",
  "op je huid achterblijft": "en tu piel",
  "Wat er na acne achterblijft, is meestal een rood vlekje, een bruine vlek of een kuiltje. Ze lijken op elkaar en vragen een andere behandeling: peelings bij verkleuring, microneedling en laser bij kuiltjes.":
    "Lo que el acné deja suele ser una manchita roja, una mancha marrón o un hoyito. Se parecen y piden tratamientos distintos: peelings para la decoloración, microneedling y láser para los hoyos.",
  "Tijdens de intake beoordeelt de huidtherapeut het onder licht dat van opzij valt. Alleen zo zie je of er een kuiltje in zit of dat het om kleur gaat.":
    "Durante la primera consulta la terapeuta de piel lo valora con luz que cae de lado. Solo así se ve si hay un hoyo o si es cuestión de color.",
  "De volgorde": "El orden",
  "Vier beelden en": "Cuatro cuadros y",
  "wat elk ervan vraagt": "lo que pide cada uno",
  "Deze vier dekken vrijwel alles wat er na acne achterblijft. Welke het bij jou is, stelt de huidtherapeut tijdens de intake vast.":
    "Estos cuatro cubren casi todo lo que deja el acné. Cuál es el tuyo lo determina la terapeuta de piel durante la primera consulta.",
  "Er zit nog actieve acne": "Todavía hay acné activo",
  "Er komen nog steeds nieuwe puistjes bij": "Siguen saliendo granos nuevos",
  "Rode of paarse vlekjes": "Manchitas rojas o moradas",
  "Platte rode plekjes waar een puistje zat":
    "Zonas rojas planas donde hubo un grano",
  "Bruine of donkere vlekken": "Manchas marrones u oscuras",
  "Donkere plekken die blijven staan waar de puistjes zaten":
    "Manchas oscuras que se quedan donde estaban los granos",
  "Kuiltjes of putjes": "Hoyitos o marcas hundidas",
  "Deukjes in je huid die je in zijlicht het beste ziet":
    "Hundimientos en tu piel que se ven mejor con luz lateral",
  "actieve acne": "acné activo",
  "Kwam er de afgelopen maand nog een nieuw ontstoken plekje bij? Dan is dit je antwoord, ook als je vooral naar de oude plekken kijkt.":
    "¿Ha salido algún grano inflamado nuevo el último mes? Entonces esta es tu respuesta, aunque estés mirando sobre todo las marcas antiguas.",
  "Zolang er nieuwe ontstekingen bij komen, komen er ook nieuwe plekken bij. Behandelen wat er al ligt terwijl de bron nog loopt is dweilen.":
    "Mientras sigan apareciendo inflamaciones nuevas, también salen marcas nuevas. Tratar lo que ya está mientras la fuente sigue abierta es achicar agua con el grifo puesto.",
  "Gaat het vanzelf weg": "Se va solo",
  "Niet zolang de acne actief is. De plekken die nu wegtrekken worden aangevuld door nieuwe.":
    "No mientras el acné esté activo. Las marcas que ahora se van se reponen con otras nuevas.",
  "Eerst de acne rustig krijgen. Pas daarna kijken we naar wat er is achtergebleven, en dan is dat vaak minder dan je nu denkt.":
    "Primero calmar el acné. Solo después miramos lo que ha quedado, y muchas veces es menos de lo que ahora crees.",
  "Dit is geen litteken": "Esto no es una cicatriz",
  "Er is geen weefsel verloren gegaan. Dat betekent een andere behandeling, en vaak een ander advies dan waar je voor kwam.":
    "No se ha perdido tejido. Eso significa otro tratamiento, y a menudo otro consejo distinto del que venías a buscar.",
  "Heb je er meerdere door elkaar? Dat is eerder regel dan uitzondering.":
    "¿Tienes varios a la vez? Eso es más la regla que la excepción.",
  "van behandelen": "de tratar",
  "Elke stap vraagt dat de vorige klaar is. Daarom begint een littekentraject zelden meteen met de laser.":
    "Cada paso pide que el anterior esté terminado. Por eso un tratamiento de cicatrices rara vez empieza directamente con el láser.",
  "Eerst de ontsteking": "Primero la inflamación",
  "Zolang er nieuwe puistjes bij komen, komen er nieuwe plekken bij. Elke littekenbehandeling in een ontstoken huid maakt de ontsteking bovendien erger.":
    "Mientras sigan saliendo granos nuevos, salen marcas nuevas. Y cualquier tratamiento de cicatrices en una piel inflamada empeora además la inflamación.",
  "Dan de kleur laten zakken": "Luego dejar que baje el color",
  "Rood en bruin trekken deels vanzelf weg. Wat je na een half jaar nog ziet, is pas wat er echt zit; daarvoor behandel je iets dat toch was verdwenen.":
    "El rojo y el marrón se van en parte solos. Lo que sigues viendo al cabo de medio año es lo que hay de verdad; antes estarías tratando algo que iba a desaparecer igualmente.",
  "Pas dan de putjes": "Y solo entonces los hoyos",
  "Wat overblijft is littekenweefsel. Dat is het enige type waar een reeks behandelingen op de lange termijn echt iets aan verandert.":
    "Lo que queda es tejido cicatricial. Es el único tipo en el que una serie de tratamientos cambia algo de verdad a largo plazo.",
  "Komen er nog nieuwe puistjes bij?": "¿Siguen saliendo granos nuevos?",
  "Dan begint het bij de acne en niet bij de littekens.":
    "Entonces se empieza por el acné y no por las cicatrices.",
  "Behandelen wat er ligt terwijl de bron nog loopt is dweilen, en in een ontstoken huid maakt het de ontsteking bovendien erger.":
    "Tratar lo que hay mientras la fuente sigue abierta es achicar agua con el grifo puesto, y en una piel inflamada empeora además la inflamación.",
  "De juiste volgorde levert hier vaak meer op dan de zwaarste behandeling.":
    "Aquí el orden correcto suele dar más que el tratamiento más potente.",
  "Eerst vaststellen of het littekenweefsel is of kleur, want dat scheelt vaak een heel traject":
    "Determinar primero si es tejido cicatricial o color, porque eso muchas veces ahorra un tratamiento entero",
  "Wachten tot de acne rustig is voordat er iets aan de littekens gebeurt":
    "Esperar a que el acné esté tranquilo antes de tocar las cicatrices",
  "Zonbescherming, elke dag. Bij bruine vlekken is dit geen aanvulling maar de kern":
    "Protección solar, todos los días. En las manchas marrones esto no es un añadido sino el núcleo",
  "Een huidanalyse in zijlicht, want in recht licht zie je putjes nauwelijks":
    "Un análisis de piel con luz lateral, porque con luz frontal apenas se ven los hoyos",
  "Zeggen wanneer afwachten meer oplevert dan behandelen, ook als je hier zat voor een behandeling":
    "Decir cuándo esperar da más que tratar, aunque hayas venido aquí a por un tratamiento",
  "Laseren of needlen in een huid met actieve ontstekingen. Dat verergert de acne en kan het litteken juist vastzetten":
    "Aplicar láser o needling en una piel con inflamaciones activas. Eso empeora el acné y puede fijar la cicatriz",
  "Een pigmentvlek behandelen alsof het een litteken is. Het is een andere laag en een andere aanpak":
    "Tratar una mancha de pigmento como si fuera una cicatriz. Es otra capa y otro enfoque",
  "Beloven dat putjes helemaal verdwijnen. Minder diep en minder zichtbaar is realistisch, weg niet":
    "Prometer que los hoyos desaparecen del todo. Menos profundos y menos visibles es realista; desaparecidos no",
  "Zelf uitknijpen vergroot de kans op diepere ontstekingen, verkleuringen en littekens":
    "Apretarte los granos aumenta el riesgo de inflamaciones más profundas, decoloraciones y cicatrices",
  "Putjes zie je alleen in zijlicht.": "Los hoyos solo se ven con luz lateral.",
  "Dat is de reden dat een foto van je telefoon hier niet volstaat en de spiegel in je badkamer ook niet: recht licht vult elk kuiltje op. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek.":
    "Por eso aquí una foto de tu móvil no basta, y el espejo de tu baño tampoco: la luz frontal rellena cualquier hoyo. El EVE-M registra tu piel con luz fija y desde un ángulo fijo.",
  "Daarmee is het verschil later te zien in plaats van te geloven, en dat is bij dit huidprobleem extra belangrijk: het gaat om maanden, en je eigen gezicht zie je elke dag.":
    "Así la diferencia se puede ver más adelante en vez de creerla, y en este problema eso importa aún más: se trata de meses, y tu propia cara la ves todos los días.",
  Reliëf: "Relieve",
  "Waar de huid is ingezakt, en hoe diep":
    "Dónde se ha hundido la piel, y cuánto",
  "De vaatreactie die na een ontsteking achterblijft":
    "La reacción de los vasos que queda después de una inflamación",
  "Bruine plekken, ook de vlekken die je nu nog niet ziet":
    "Manchas marrones, también las que todavía no ves",
  "Fractionele laser die dieper gaat, voor structuur, poriën en onregelmatigheden.":
    "Láser fraccionado que llega más profundo, para la textura, los poros y las irregularidades.",
  "Fotona Scar Repair": "Fotona Scar Repair",
  "Laser op littekens: acnelittekens, operatielittekens en striae.":
    "Láser sobre cicatrices: cicatrices de acné, cicatrices quirúrgicas y estrías.",
  "Fotona Resurfacing": "Fotona Resurfacing",
  "Huidvernieuwing met laser, voor poriën, textuur en een gladdere huid.":
    "Renovación de la piel con láser, para poros, textura y una piel más lisa.",
  "Deze komen uit Salonized en zijn niet door ons uitgezocht op inhoud: het zijn de reviews waarin littekens genoemd worden, meestal na een acnetraject.":
    "Estas vienen de Salonized y no las hemos elegido nosotros por su contenido: son las reseñas en las que se mencionan cicatrices, casi siempre después de un programa de acné.",
  "Hoe weet ik of het een litteken is of alleen kleur?":
    "¿Cómo sé si es una cicatriz o solo color?",
  "Met je vinger en met licht van opzij. Voel je een kuiltje of een randje, en zie je een schaduw als het licht schuin valt, dan is er weefsel verloren gegaan. Voelt het glad en zie je alleen kleur, dan is het rood of pigment en geen litteken.":
    "Con el dedo y con luz de lado. Si notas un hoyo o un borde, y ves una sombra cuando la luz cae en ángulo, es que se ha perdido tejido. Si se nota liso y solo ves color, es rojez o pigmento y no una cicatriz.",
  "Gaan acnelittekens vanzelf weg?": "¿Las cicatrices de acné se van solas?",
  "Rode en bruine plekken deels wel, in maanden. Kuiltjes niet: die zitten er over jaren nog net zo. Dat onderscheid bepaalt of afwachten verstandig is of juist zonde van de tijd.":
    "Las marcas rojas y marrones en parte sí, en meses. Los hoyos no: dentro de años seguirán igual. Esa distinción decide si esperar es sensato o si es perder el tiempo.",
  "Hoe lang moet ik wachten na mijn laatste puistje?":
    "¿Cuánto tengo que esperar después del último grano?",
  "Er is geen vaste termijn; het gaat erom dat er geen nieuwe ontstekingen meer bij komen en dat de huid rustig is. Bij de meting kijken we daarnaar, en soms is het antwoord dat we over een paar maanden opnieuw kijken.":
    "No hay un plazo fijo; lo que importa es que no salgan inflamaciones nuevas y que la piel esté tranquila. Eso lo miramos en la medición, y a veces la respuesta es que volvemos a mirar dentro de unos meses.",
  "Kunnen putjes helemaal verdwijnen?":
    "¿Los hoyos pueden desaparecer del todo?",
  "Nee. Wat wel kan is ze ondieper en minder zichtbaar maken, over een reeks van meerdere sessies. Wij beloven geen gladde huid, want dat kunnen we voor de meting niet weten en erna meestal ook niet.":
    "No. Lo que sí se puede es hacerlos menos profundos y menos visibles, a lo largo de una serie de varias sesiones. No prometemos una piel lisa, porque no lo podemos saber antes de la medición y normalmente tampoco después.",
  "In het huidconsult stellen we vast of het littekenweefsel is of kleur. Soms is de uitkomst dat je een half jaar niets hoeft te doen, en dan zeggen we dat.":
    "En la consulta de la piel determinamos si es tejido cicatricial o color. A veces el resultado es que no tienes que hacer nada durante medio año, y entonces lo decimos.",
  "die zichtbaar blijven": "que siguen viéndose",
  "Bij littekens en striae bepaalt de leeftijd wat er mogelijk is. Rode en paarse littekens reageren doorgaans het beste; bij witte littekens richten we ons op de structuur en het reliëf. Tijdens de intake beoordeelt de huidtherapeut in welk stadium het zit en welke behandeling daarbij hoort.":
    "En las cicatrices y las estrías, la edad decide qué es posible. Las cicatrices rojas y moradas suelen responder mejor; con las blancas nos centramos en la textura y el relieve. Durante la primera consulta la terapeuta de piel valora en qué fase está y qué tratamiento le corresponde.",
  "Zet de littekenklok": "Pon el reloj de las cicatrices",
  "Hoe oud is het": "Cuántos años tiene",
  "De littekenklok": "El reloj de las cicatrices",
  "Hoe oud het is,": "Cuántos años tiene",
  "bepaalt wat er kan.": "decide qué se puede hacer.",
  "Schuif naar hoe lang je het al hebt. De kleur in de tekening verandert mee, en het antwoord wordt eerlijker naarmate je verder komt. Littekens en striae volgen dezelfde as.":
    "Desliza hasta el tiempo que llevas con ella. El color del dibujo cambia contigo, y la respuesta se vuelve más franca cuanto más avanzas. Las cicatrices y las estrías siguen el mismo eje.",
  "Het venster staat open": "La ventana está abierta",
  "proliferatieve fase": "fase proliferativa",
  "Dit is de periode waarin je het meest kunt beïnvloeden.":
    "Este es el periodo en el que más puedes influir.",
  "De balk is geen meting maar een verhouding: hij laat zien hoe de ruimte om iets te veranderen krimpt naarmate een litteken ouder wordt.":
    "La barra no es una medición sino una proporción: enseña cómo se encoge el margen para cambiar algo a medida que una cicatriz envejece.",
  "Hoe lang heb je het al?": "¿Cuánto tiempo llevas con ella?",
  "Net ontstaan": "Recién salida",
  "3 tot 12 maanden": "De 3 a 12 meses",
  "1 tot 3 jaar": "De 1 a 3 años",
  "3 tot 5 jaar": "De 3 a 5 años",
  "Ouder dan 5 jaar": "Más de 5 años",
  "Wat er dan in je huid gebeurt": "Lo que pasa entonces en tu piel",
  "Het collageen wordt herschikt. Het litteken kan in deze periode nog alle kanten op: platter en lichter, of juist dikker als de aanmaak doorschiet.":
    "El colágeno se reorganiza. En este periodo la cicatriz todavía puede ir en cualquier dirección: más plana y más clara, o más gruesa si la producción se pasa.",
  "Dit is het venster. Hier is de meeste winst te halen, bij zowel littekens als bij rode striae. Wie hier komt, komt op het juiste moment.":
    "Esta es la ventana. Aquí es donde más hay que ganar, tanto en cicatrices como en estrías rojas. Quien viene ahora viene en el momento justo.",
  "Wat wij zouden doen": "Lo que haríamos nosotros",
  "Meten en dan gericht behandelen. Bij rood en verheven werken we vaak eerst op de bloedvaten, daarna op de structuur.":
    "Medir y después tratar de forma dirigida. En cicatrices rojas y elevadas solemos trabajar primero sobre los vasos sanguíneos, y después sobre la textura.",
  "Dit is het moment waarop het het meeste uitmaakt.":
    "Este es el momento en que más se nota.",
  "Weet je niet precies hoe oud het is? Kijk naar de kleur. Rood betekent jong, wit betekent oud. Dat is nauwkeuriger dan je geheugen.":
    "¿No sabes exactamente cuántos años tiene? Mira el color. Rojo significa joven, blanco significa viejo. Eso es más preciso que tu memoria.",
  "Welke soort litteken": "Qué tipo de cicatriz",
  "Kuiltjes reageren het beste. Verheven littekens en keloïd horen bij de arts. En bij striae is de kleur belangrijker dan de plek. Kies wat het dichtst bij jou komt.":
    "Los hoyos son los que mejor responden. Las cicatrices elevadas y los queloides van con un médico. Y en las estrías el color importa más que el sitio. Elige lo que más se acerque a lo tuyo.",
  "Kuiltjes in de huid": "Hoyos en la piel",
  "Putjes die je vooral ziet bij zijlicht":
    "Marcas hundidas que se ven sobre todo con luz lateral",
  "Verheven, stevige littekens": "Cicatrices elevadas y firmes",
  "Een bult of streng die boven de huid uitsteekt":
    "Un bulto o un cordón que sobresale de la piel",
  "Rode of paarse striae": "Estrías rojas o moradas",
  "Strepen die er nieuw uitzien en nog rood zijn":
    "Líneas que parecen nuevas y todavía están rojas",
  "Witte striae": "Estrías blancas",
  "Strepen die al lang wit en dun zijn":
    "Líneas que llevan mucho tiempo blancas y finas",
  "atrofische littekens": "cicatrices atróficas",
  "Kleine indeukingen, vaak op de wangen en slapen. Ze vallen op bij licht van opzij en veel minder recht van voren.":
    "Pequeños hundimientos, a menudo en las mejillas y las sienes. Destacan con luz de lado y mucho menos de frente.",
  "Er is weefsel verloren gegaan tijdens de genezing. De huid eromheen is normaal.":
    "Se perdió tejido durante la curación. La piel de alrededor es normal.",
  "Dit type reageert het beste van alle littekens. We werken op de rand van het kuiltje, niet op de bodem.":
    "Este tipo responde mejor que ninguna otra cicatriz. Trabajamos sobre el borde del hoyo, no sobre su fondo.",
  "Dit zijn geen grote poriën. Een porie is rond en heeft een opening; een kuiltje heeft dat niet.":
    "Esto no son poros grandes. Un poro es redondo y tiene una abertura; un hoyo no la tiene.",
  "Twijfel je? Dan kijken we er samen naar.":
    "¿Dudas? Entonces lo miramos juntos.",
  "De stap die iedereen": "El paso que todo el mundo",
  "wil overslaan.": "quiere saltarse.",
  "Bijna niemand komt hier voor stap één. Toch bepaalt die of de rest zin heeft, want littekens behandelen in een ontstoken huid levert nieuwe littekens op.":
    "Casi nadie viene aquí a por el paso uno. Y sin embargo ese decide si el resto tiene sentido, porque tratar cicatrices en una piel inflamada produce cicatrices nuevas.",
  "Eerst rustig": "Primero, calma",
  "Zolang er nog actieve acne of ontsteking is, maak je er littekens bij in plaats van weg. Dit is de stap die mensen willen overslaan.":
    "Mientras haya acné activo o inflamación, estás añadiendo cicatrices en vez de quitarlas. Este es el paso que la gente quiere saltarse.",
  "Dan meten": "Después, medir",
  "We leggen vast hoe diep en hoe uitgebreid het is. Littekens veranderen traag, dus zonder meting is later niet te zien of het werkte.":
    "Registramos cómo de profunda y cómo de extensa es. Las cicatrices cambian despacio, así que sin medición después no se puede ver si funcionó.",
  "Dan behandelen": "Después, tratar",
  "Gericht behandelen, met een afgesproken aantal sessies en een moment waarop we opnieuw kijken. Werkt het niet, dan stoppen we ermee.":
    "Tratamiento dirigido, con un número de sesiones acordado y un momento para volver a mirar. Si no funciona, lo dejamos.",
  "En dan beschermen": "Y después, proteger",
  "Een behandeld litteken blijft een tijd lang gevoeliger voor de zon. Zonder bescherming ruil je het litteken in voor een donkere vlek.":
    "Una cicatriz tratada se queda un tiempo más sensible al sol. Sin protección cambias la cicatriz por una mancha oscura.",
  "Heb je nog actieve acne? Dan hoort stap één op de acnepagina, en pas daarna hier. Dat is geen omweg maar de kortste route naar minder littekens.":
    "¿Todavía tienes acné activo? Entonces el paso uno está en la página del acné, y solo después aquí. No es un rodeo sino el camino más corto hacia menos cicatrices.",
  "Het eerste kruisje rechts is de duurste fout van deze pagina, en hij kost niets om te vermijden: wachten tot het wit is.":
    "La primera cruz de la derecha es el error más caro de esta página, y evitarlo no cuesta nada: esperar a que esté blanca.",
  "Bij een vers litteken: uit de zon, elke dag, een jaar lang. Dit is de goedkoopste behandeling die bestaat":
    "Con una cicatriz reciente: fuera del sol, todos los días, durante un año. Es el tratamiento más barato que existe",
  "Op tijd komen. Rood en jong reageert beter dan wit en oud, en dat scheelt meer dan de keuze van de behandeling":
    "Venir a tiempo. Lo rojo y joven responde mejor que lo blanco y viejo, y eso importa más que la elección del tratamiento",
  "Eerst de acne of het onderliggende probleem rustig krijgen, dan pas het litteken":
    "Calmar primero el acné o el problema de fondo, y solo después la cicatriz",
  "Meten voordat we starten, want littekens veranderen traag en je oog went eraan":
    "Medir antes de empezar, porque las cicatrices cambian despacio y tu ojo se acostumbra",
  "Bij striae in de zwangerschap: wachten tot na de borstvoeding en dan meten":
    "Con estrías del embarazo: esperar a después de la lactancia y medir entonces",
  "Wachten tot het wit is. Dat is de meest gemaakte fout, en dan is er weinig meer aan te doen":
    "Esperar a que esté blanca. Es el error que más se comete, y entonces ya queda poco por hacer",
  "Littekens behandelen terwijl de acne nog actief is. Dan maak je er nieuwe bij":
    "Tratar cicatrices mientras el acné sigue activo. Así estás creando nuevas",
  "Crèmes die beloven dat witte striae verdwijnen. Dat gebeurt niet, ongeacht de prijs":
    "Cremas que prometen que las estrías blancas desaparecen. Eso no pasa, cueste lo que cueste",
  "Zonnebank om het verschil weg te camoufleren. Litteken weefsel wordt niet bruin, dus het verschil wordt juist groter":
    "Los rayos UVA para disimular la diferencia. El tejido cicatricial no se broncea, así que la diferencia solo aumenta",
  "Zelf schuren of prikken. Je maakt een nieuwe wond op de plek van de oude":
    "Lijarte o pincharte tú. Estás haciendo una herida nueva donde estaba la vieja",
  "Bij littekens telt diepte.": "En las cicatrices cuenta la profundidad.",
  "Littekens veranderen langzaam. Daarom leggen we de beginsituatie vast en vergelijken we die na verloop van tijd met een nieuwe beoordeling.":
    "Las cicatrices cambian despacio. Por eso registramos la situación de partida y la comparamos al cabo de un tiempo con una nueva valoración.",
  "Bij striae meten we ook de kleur, want die vertelt in welke fase ze zitten en dus wat er nog mogelijk is.":
    "En las estrías medimos también el color, porque nos dice en qué fase están y, por tanto, qué es todavía posible.",
  "Hoe diep de kuiltjes zijn en hoe uitgebreid":
    "Cómo de profundos son los hoyos y cómo de extensos",
  "Rood, roze of wit: dat bepaalt de fase":
    "Rojo, rosa o blanco: eso decide la fase",
  Oppervlak: "Superficie",
  "Hoe groot het gebied is dat we behandelen":
    "Cómo de grande es la zona que tratamos",
  "Vijftien behandelingen op een apparaat, van een lichte laserpeel tot de complete 4D. Elk met een eigen doel.":
    "Quince tratamientos en un solo equipo, desde un peeling láser suave hasta el 4D completo. Cada uno con su propio objetivo.",
  Littekentherapie: "Terapia de cicatrices",
  "Voor littekens na een operatie of keizersnede. De prijs volgt de lengte van het litteken.":
    "Para cicatrices después de una operación o una cesárea. El precio sigue la longitud de la cicatriz.",
  "Deze komen uit Salonized en zijn niet door ons uitgezocht op inhoud: het zijn de reviews waarin littekens genoemd worden. Ze gaan over trajecten van maanden, en dat hoor je erin terug.":
    "Estas vienen de Salonized y no las hemos elegido nosotros por su contenido: son las reseñas en las que se mencionan cicatrices. Hablan de tratamientos de meses, y eso se nota al leerlas.",
  "Gaan mijn littekens helemaal weg?": "¿Mis cicatrices desaparecen del todo?",
  "Nee. Een litteken is blijvend weefsel; wat we doen is het minder opvallend maken. Bij verse littekens is dat verschil groot, bij oude klein. We zeggen vooraf in welke categorie het jouwe valt.":
    "No. Una cicatriz es tejido permanente; lo que hacemos es hacerla menos llamativa. En cicatrices recientes esa diferencia es grande; en antiguas, pequeña. Antes de empezar te decimos en qué categoría entra la tuya.",
  "Ik heb striae van de zwangerschap. Kan ik nu al komen?":
    "Tengo estrías del embarazo. ¿Puedo venir ya?",
  "Komen kan altijd, meten ook. Behandelen doen we liever na de borstvoeding. Zijn je striae nog rood, dan is het wel het beste moment om het gesprek te voeren, want dat venster sluit.":
    "Venir siempre puedes, y medir también. Preferimos tratar después de la lactancia. Si tus estrías siguen rojas, este sí es el mejor momento para tener la conversación, porque esa ventana se cierra.",
  "Waarom moet mijn acne eerst rustig zijn?":
    "¿Por qué mi acné tiene que estar tranquilo primero?",
  "Omdat behandelen in een ontstoken huid nieuwe littekens kan geven. Je betaalt dan voor een behandeling die het beeld slechter maakt. Dat is de reden dat we soms nee zeggen tegen iemand die er speciaal voor komt.":
    "Porque tratar una piel inflamada puede dejar cicatrices nuevas. Estarías pagando por un tratamiento que empeora el cuadro. Por eso a veces decimos que no a alguien que ha venido justo a por eso.",
  "Werken die littekencrèmes uit de drogist?":
    "¿Funcionan esas cremas para cicatrices de la farmacia?",
  "Bij verse littekens kan siliconen iets doen, vooral bij verheven littekens. Bij witte striae en oude littekens niet. De prijs zegt daar niets over.":
    "En cicatrices recientes la silicona puede hacer algo, sobre todo en las elevadas. En estrías blancas y cicatrices antiguas no. El precio no dice nada al respecto.",
  "Ik schaam me voor mijn striae bij het zwemmen.":
    "Me da vergüenza enseñar mis estrías cuando voy a nadar.",
  "Dat horen we vaak, en het is een echte reden om te komen. We gaan alleen niet doen alsof we ze kunnen wegtoveren. Wat we wel doen is eerlijk zeggen hoeveel verschil er in jouw geval te verwachten is.":
    "Lo oímos a menudo, y es un motivo de verdad para venir. Solo que no vamos a hacer como si pudiéramos hacerlas desaparecer por arte de magia. Lo que sí hacemos es decirte con honestidad cuánta diferencia se puede esperar en tu caso.",
  "Dat hangt af van de leeftijd van het litteken en het type. Na de meting krijg je een aantal en een prijs, en een moment waarop we opnieuw kijken of het werkt.":
    "Depende de la edad de la cicatriz y del tipo. Después de la medición recibes un número y un precio, y un momento en el que volvemos a mirar si funciona.",
  "Jonge littekens": "Las cicatrices jóvenes",
  "reageren het best": "son las que mejor responden",
  "Bij een rood litteken of rode striae is dit het moment waarop het het meeste uitmaakt. Bij oude littekens rekenen we eerlijk voor of het genoeg oplevert.":
    "Con una cicatriz roja o con estrías rojas, este es el momento en que más se nota. Con cicatrices antiguas calculamos con honestidad si da lo suficiente.",
  "Striae behandelen we met microneedling en laser, die de aanmaak van collageen in het gescheurde bindweefsel op gang brengen. Zo worden ze vlakker en minder zichtbaar.":
    "Las estrías las tratamos con microneedling y láser, que ponen en marcha la producción de colágeno en el tejido conectivo desgarrado. Así se vuelven más planas y menos visibles.",
  "Het stadium bepaalt wat er haalbaar is. Rode en paarse striae reageren het beste; bij witte werken we op de structuur. Tijdens de intake stelt de behandelaar vast waar jij staat.":
    "La fase decide qué se puede conseguir. Las estrías rojas y moradas son las que mejor responden; en las blancas trabajamos sobre la textura. Durante la primera consulta la terapeuta determina en qué punto estás.",
  "Twee stadia": "Dos fases",
  "Kleur, ouderdom en reliëf bepalen samen wat er te halen valt. De behandelaar loopt die drie langs voordat er een plan komt.":
    "El color, la edad y el relieve deciden juntos qué hay que ganar. La terapeuta repasa esos tres antes de que haya un plan.",
  "De kleur": "El color",
  "Rood of paars betekent dat er nog doorbloeding in zit en dat het weefsel jong is. Wit betekent dat het is uitgerijpt.":
    "Rojo o morado significa que todavía hay riego dentro y que el tejido es joven. Blanco significa que ya ha madurado.",
  "Hoe lang ze er zitten": "Cuánto tiempo llevan ahí",
  "De behandelaar vraagt sinds wanneer je ze hebt. Bij striae na een zwangerschap of groeispurt is dat meestal goed te dateren.":
    "La terapeuta pregunta desde cuándo las tienes. En estrías tras un embarazo o un estirón eso suele ser fácil de fechar.",
  "Het reliëf": "El relieve",
  "Liggen ze gelijk met de huid of zijn ze ingezonken? Dat bepaalt of we op kleur werken of op structuur.":
    "¿Están al mismo nivel que la piel o están hundidas? Eso decide si trabajamos sobre el color o sobre la textura.",
  "Rood of": "Rojas o",
  wit: "blancas",
  "Striae doorlopen twee fasen. Welke van de twee je hebt, bepaalt wat een behandeling oplevert en hoe snel je erbij moet zijn.":
    "Las estrías pasan por dos fases. Cuál de las dos tienes decide qué da un tratamiento y con qué rapidez tienes que actuar.",
  "Nog rood of paars, meestal recent ontstaan":
    "Todavía rojas o moradas, normalmente recientes",
  "striae rubrae": "striae rubrae",
  "De huid is uitgerekt en het bindweefsel eronder is gescheurd. De rode kleur komt van de bloedvaten die er nog doorheen lopen.":
    "La piel se ha estirado y el tejido conectivo de debajo se ha desgarrado. El color rojo viene de los vasos sanguíneos que todavía lo recorren.",
  "Microneedling en laser brengen de aanmaak van collageen op gang in het weefsel dat nog reageert. Dit is het stadium waarin de meeste winst zit.":
    "El microneedling y el láser ponen en marcha la producción de colágeno en un tejido que todavía responde. Esta es la fase en la que más hay que ganar.",
  "Bij rode striae is er ruimte voor verbetering van kleur en structuur. Hoeveel, hoor je na de beoordeling.":
    "En las estrías rojas hay margen para mejorar el color y la textura. Cuánto, lo sabes después de la valoración.",
  "Wit of zilverachtig, vaak al jaren aanwezig":
    "Blancas o plateadas, muchas veces presentes desde hace años",
  "striae albae": "striae albae",
  "Het weefsel is uitgerijpt. Er lopen geen actieve bloedvaten meer doorheen en er zitten minder pigmentcellen in dan in de huid eromheen.":
    "El tejido ha madurado. Ya no lo recorren vasos sanguíneos activos y contiene menos células de pigmento que la piel de alrededor.",
  "Microneedling verbetert de structuur en maakt de striae minder voelbaar. De kleur terugbrengen lukt niet.":
    "El microneedling mejora la textura y hace que las estrías se noten menos al tacto. Recuperar el color no es posible.",
  "Bij witte striae werken we op structuur en niet op kleur. Dat hoor je vooraf, zodat je weet waar je aan begint.":
    "En las estrías blancas trabajamos sobre la textura y no sobre el color. Eso lo sabes antes, para que sepas en qué te metes.",
  "Bij striae telt het moment zwaarder dan de techniek. Wie begint zolang ze nog rood zijn, houdt de meeste ruimte over.":
    "En las estrías, el momento cuenta más que la técnica. Quien empieza mientras siguen rojas se queda con el mayor margen.",
  "Beginnen zolang ze nog rood of paars zijn, want dan zit er nog wat te winnen":
    "Empezar mientras siguen rojas o moradas, porque entonces todavía hay algo que ganar",
  "Bij striae in de zwangerschap wachten tot na de borstvoeding, en dan laten beoordelen":
    "Con estrías del embarazo, esperar a después de la lactancia y hacerlas valorar entonces",
  "De huid soepel houden met een verzorging die je volhoudt":
    "Mantener la piel flexible con un cuidado que puedas sostener",
  "Een reeks afspreken met een moment waarop we opnieuw kijken":
    "Acordar una serie con un momento en el que volvemos a mirar",
  "Zonbescherming op de plek, want vers weefsel verkleurt sneller":
    "Protección solar en la zona, porque el tejido reciente se decolora más rápido",
  "Wachten tot ze wit zijn. Dat is het moment waarop er het minst overblijft":
    "Esperar a que estén blancas. Es el punto en el que queda menos",
  "Zonnebank of zon op verse striae. Het verschil in kleur wordt daar groter van":
    "Los rayos UVA o el sol sobre estrías recientes. Con eso la diferencia de color solo aumenta",
  "Elke week in de spiegel vergelijken. Striae veranderen in maanden, niet in weken":
    "Compararte en el espejo cada semana. Las estrías cambian en meses, no en semanas",
  "Gaan striae ooit helemaal weg?": "¿Las estrías se van alguna vez del todo?",
  "Nee. Wat wel kan, is dat ze minder opvallen: minder rood, vlakker en minder voelbaar. Bij rode striae is er meer te halen dan bij witte.":
    "No. Lo que sí puede pasar es que llamen menos la atención: menos rojas, más planas y menos perceptibles al tacto. En las estrías rojas hay más que ganar que en las blancas.",
  "Waarom heb ik ze en mijn zus niet?":
    "¿Por qué las tengo yo y mi hermana no?",
  "Aanleg speelt de grootste rol. Hoe snel je huid rekt en hoeveel elastine erin zit, verschilt per persoon. Striae komen ook voor bij mensen die nooit zijn aangekomen.":
    "La predisposición es lo que más influye. Con qué rapidez se estira tu piel y cuánta elastina tiene cambia de una persona a otra. También salen estrías a gente que nunca ha engordado.",
  "Kan ik behandelen tijdens de zwangerschap?":
    "¿Puedo tratarme durante el embarazo?",
  "Nee. We wachten tot na de bevalling en de borstvoeding, en beoordelen dan opnieuw. Vaak zijn ze op dat moment ook al lichter geworden.":
    "No. Esperamos a después del parto y de la lactancia, y entonces volvemos a valorar. Muchas veces para ese momento ya se han aclarado.",
  "Hoeveel afspraken heb ik nodig?": "¿Cuántas citas necesito?",
  "Dat hangt af van het stadium en van hoe groot het gebied is. Tijdens de intake hoor je wat er in jouw geval nodig is en wat het kost.":
    "Depende de la fase y de lo grande que sea la zona. Durante la primera consulta sabes qué hace falta en tu caso y cuánto cuesta.",
  "Helpt een crème?": "¿Ayuda una crema?",
  "Een goede verzorging houdt de huid soepel en dat is nuttig. Striae zelf zitten in de laag eronder, en daar komt een crème niet.":
    "Un buen cuidado mantiene la piel flexible y eso es útil. Las estrías en sí están en la capa de debajo, y ahí una crema no llega.",
  "De behandelaar beoordeelt in welk stadium je striae zijn en wat een reeks in jouw geval kan opleveren. Je hoort meteen wat je ervan kunt verwachten en wat het kost.":
    "La terapeuta valora en qué fase están tus estrías y qué puede dar una serie en tu caso. Sabes enseguida qué puedes esperar y cuánto cuesta.",
  "van 5 sterren": "de 5 estrellas",
  "Behandeling Diba Clinics": "Tratamiento en Diba Clinics",
  "Consult Diba Clinics": "Consulta en Diba Clinics",
  Gezichtsbehandeling: "Tratamiento facial",
  "Gezichtsbehandeling bij Iris": "Tratamiento facial con Iris",
  "Behandeling bij Andres": "Tratamiento con Andres",
  "Behandeling bij Iris": "Tratamiento con Iris",
  "Behandeling & productadvies": "Tratamiento y asesoramiento de productos",
  "Advies & behandeling": "Asesoramiento y tratamiento",
  "Diverse behandelingen": "Varios tratamientos",
  Skinbehandeling: "Tratamiento de la piel",
  Peeling: "Peeling",
  "Consult peeling": "Consulta de peeling",
  "Consult bij Grissel": "Consulta con Grissel",
  "Consult & behandeling": "Consulta y tratamiento",
  "Huidscan & consult bij Andres": "Escáner de piel y consulta con Andres",
  "Laserontharing bij Demi": "Depilación láser con Demi",
  Laserbehandeling: "Tratamiento láser",
  "Laserbehandeling bij Demi": "Tratamiento láser con Demi",
  Lasertraject: "Programa de láser",
  "Laser & gezichtsbehandeling": "Láser y tratamiento facial",
  "Fotona bij Iris": "Fotona con Iris",
  "SkinPen traject": "Programa con SkinPen",
  "SkinPen bij Melanie": "SkinPen con Melanie",
  "SkinPen bij Iris": "SkinPen con Iris",
  "Hydrafacial & peeling": "HydraFacial y peeling",
  "IPL tegen roodheid": "IPL contra la rojez",
  "Fibromen verwijderen": "Extirpación de fibromas",
  "Acne traject": "Programa de acné",
  "Acne traject bij Iris": "Programa de acné con Iris",
  "Rimpels en": "Arrugas y",
  "fijne lijntjes": "líneas finas",
  "Rimpels en fijne lijntjes behandelen we met microneedling, laser en peelings. Die brengen de aanmaak van collageen op gang, waardoor de huid steviger wordt en lijnen minder diep.":
    "Las arrugas y las líneas finas las tratamos con microneedling, láser y peelings. Estos ponen en marcha la producción de colágeno, con lo que la piel gana firmeza y las líneas se hacen menos profundas.",
  "Een lijn kan in je huid zitten of in de spier eronder. De behandelaar stelt vast om welke van de twee het gaat, want dat bepaalt wat er werkt.":
    "Una línea puede estar en tu piel o en el músculo de debajo. La terapeuta determina de cuál de las dos se trata, porque eso decide qué funciona.",
  "Welke lijn heb je": "Qué línea tienes",
  "Huid of spier": "Piel o músculo",
  "Huid of": "Piel o",
  spier: "músculo",
  "Een lijn in de spier en een lijn in de huid zien er hetzelfde uit en vragen iets anders. De behandelaar kijkt in rust en in beweging.":
    "Una línea en el músculo y una línea en la piel se ven igual y piden cosas distintas. La terapeuta mira en reposo y en movimiento.",
  "Eerst in rust": "Primero en reposo",
  "De behandelaar kijkt naar je gezicht in volledige rust. De lijnen die er dan staan, staan in je huid; die verdwijnen niet als je stilzit.":
    "La terapeuta mira tu cara en reposo completo. Las líneas que hay entonces están en tu piel; esas no desaparecen si te quedas quieto.",
  "Dan in beweging": "Después en movimiento",
  "Lachen, fronsen, wenkbrauwen op. De lijnen die alleen dan verschijnen komen uit de spier eronder, en niet uit de huid zelf.":
    "Reír, fruncir el ceño, subir las cejas. Las líneas que solo aparecen entonces vienen del músculo de debajo, y no de la piel misma.",
  "Waarom dat verschil telt": "Por qué cuenta esa diferencia",
  "Een lijn in de huid behandelen we met microneedling, laser of een peeling. Een lijn in de spier vraagt om iets anders; daar werken wij niet mee.":
    "Una línea en la piel la tratamos con microneedling, láser o un peeling. Una línea en el músculo pide otra cosa; con eso nosotros no trabajamos.",
  "Gaat het om meer dan lijnen?": "¿Va de más que de líneas?",
  "Dan kijk je breder dan deze pagina.":
    "Entonces estás mirando más allá de esta página.",
  "Pigment, textuur, elasticiteit en verslapping lopen bij huidveroudering door elkaar. Zit je daarmee, dan is de bredere pagina de betere ingang.":
    "En el envejecimiento cutáneo, la pigmentación, la textura, la elasticidad y la flacidez se entremezclan. Si es eso lo que tienes, la página más amplia es la mejor entrada.",
  "Naar huidveroudering": "Al envejecimiento",
  "Vier soorten lijn": "Cuatro tipos de línea",
  lijnen: "líneas",
  "Vier soorten lijnen die er hetzelfde uitzien. Of een lijn in de huid of in de spier zit, bepaalt welke behandeling werkt.":
    "Cuatro tipos de línea que se ven igual. Que una línea esté en la piel o en el músculo decide qué tratamiento funciona.",
  Droogtelijntjes: "Líneas de deshidratación",
  "Fijne streepjes die er 's ochtends zijn en later minder":
    "Rayitas finas que están por la mañana y después menos",
  Mimieklijnen: "Líneas de expresión",
  "Lijnen die je ziet als je lacht of fronst, en anders niet":
    "Líneas que ves al reír o al fruncir el ceño, y el resto del tiempo no",
  "Lijnen die blijven staan": "Líneas que se quedan",
  "Lijnen die er ook zijn als je gezicht in rust is":
    "Líneas que están también con la cara en reposo",
  Verslapping: "Flacidez",
  "Je gezicht zakt en de contour van je kaaklijn wordt vager":
    "Tu cara cae y el contorno de la mandíbula se vuelve más difuso",
  dehydratielijnen: "líneas de deshidratación",
  "Hoe je het herkent": "Cómo lo reconoces",
  "Ze verdwijnen al als je je huid goed verzorgt, en verschillen per dag en per seizoen.":
    "Desaparecen en cuanto cuidas bien tu piel, y cambian según el día y la estación.",
  "Geen rimpel maar een huid met te weinig vocht. De bovenste laag ligt dan niet glad en vangt licht in kleine streepjes.":
    "No es una arruga sino una piel con poca agua. La capa de arriba no queda lisa y atrapa la luz en rayitas pequeñas.",
  "Vaak niets ingrijpends. Barrière herstellen en hydrateren, en dan opnieuw kijken. Dit is het beeld waarbij mensen het vaakst te veel kopen.":
    "Muchas veces nada drástico. Reparar la barrera e hidratar, y luego volver a mirar. Este es el cuadro en el que la gente compra de más con más frecuencia.",
  "Hier zijn wij aan zet": "Aquí nos toca a nosotros",
  "Dit werkt op de huid, en dat is wat wij doen. Reken op een reeks over maanden en niet op een sessie.":
    "Esto actúa sobre la piel, y eso es lo que hacemos. Cuenta con una serie de meses y no con una sesión.",
  "Bij lijnen zit de winst in de juiste keuze en in geduld. Collageen bouwt in maanden op, en dat is niet te versnellen door vaker te komen.":
    "En las líneas lo que se gana está en la elección correcta y en la paciencia. El colágeno se construye en meses, y venir más a menudo no lo acelera.",
  "Eerst vaststellen of de lijn in de huid of in de spier zit, want die twee vragen om iets anders":
    "Determinar primero si la línea está en la piel o en el músculo, porque esas dos piden cosas distintas",
  "Collageenopbouw op gang brengen, in een reeks over maanden en niet in een sessie":
    "Poner en marcha la construcción de colágeno, en una serie de meses y no en una sesión",
  "Zonbescherming, elke dag. Dit is verreweg de grootste factor in hoe snel er nieuwe lijnen bij komen":
    "Protección solar, todos los días. Es con mucha diferencia el mayor factor en la rapidez con que salen líneas nuevas",
  "Een huidanalyse, want bij dit huidprobleem gaat het om maanden en je ziet je eigen gezicht elke dag":
    "Un análisis de piel, porque en este problema se trata de meses y tu propia cara la ves todos los días",
  "Zeggen wanneer verzorging meer oplevert dan een behandeling":
    "Decir cuándo el cuidado da más que un tratamiento",
  "Injectables. Wij werken er niet mee, en voor sommige lijnen is dat juist wel de logische route":
    "Los inyectables. Nosotros no trabajamos con ellos, y para algunas líneas esa es justamente la vía lógica",
  "Beloven dat lijnen verdwijnen. Minder diep en minder zichtbaar is realistisch":
    "Prometer que las líneas desaparecen. Menos profundas y menos visibles es realista",
  "Een reeks starten voor lijntjes die door droogte komen. Die zijn met verzorging weg":
    "Empezar una serie por líneas que vienen de la sequedad. Esas se van con el cuidado",
  "Losgelaten huid behandelen alsof het verslapping is. Dat is chirurgie":
    "Tratar una piel que ya se ha descolgado como si fuera flacidez. Eso es cirugía",
  "Waarom we vooraf vastleggen": "Por qué lo registramos de antemano",
  "Bij lijnen gaat het om maanden, en in die maanden zie je jezelf elke dag. Daardoor merk je een geleidelijke verandering nauwelijks op, in beide richtingen. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek.":
    "En las líneas se trata de meses, y en esos meses te ves todos los días. Por eso apenas notas un cambio gradual, en ninguna de las dos direcciones. El EVE-M registra tu piel con luz fija y desde un ángulo fijo.",
  "Dat maakt het verschil later zichtbaar in plaats van dat je het moet geloven. En het werkt ook andersom: blijkt er na een reeks weinig veranderd, dan is dat een reden om iets anders te doen en niet om door te gaan.":
    "Eso hace la diferencia visible después en vez de algo que tienes que creerte. Y funciona también al revés: si después de una serie ha cambiado poco, ese es un motivo para hacer otra cosa y no para seguir.",
  "Hoe fijn of grof het oppervlak van je huid is":
    "Cómo de fina o de gruesa es la superficie de tu piel",
  Elasticiteit: "Elasticidad",
  "Hoe snel de huid terugveert, en waar niet meer":
    "Con qué rapidez vuelve la piel a su sitio, y dónde ya no lo hace",
  "Wat er onder de oppervlakte al is opgebouwd":
    "Lo que ya se ha construido por debajo de la superficie",
  "Fotona 4D": "Fotona 4D",
  "Vier laserbehandelingen in een sessie. Van binnenuit door de wang tot een afsluitende peeling.":
    "Cuatro tratamientos láser en una sesión. Desde dentro, a través de la mejilla, hasta un peeling final.",
  SmoothLiftin: "SmoothLiftin",
  "Collageenstimulatie van binnenuit, door het slijmvlies van je wang.":
    "Estimulación de colágeno desde dentro, a través de la mucosa de la mejilla.",
  SmoothEye: "SmoothEye",
  "Laser rond de oogcontour, voor kraaienpootjes en fijne lijntjes.":
    "Láser alrededor del contorno de ojos, para las patas de gallo y las líneas finas.",
  LipLase: "LipLase",
  "Vollere en gladdere lippen zonder filler, met laser van binnen en buiten.":
    "Labios más llenos y lisos sin relleno, con láser por dentro y por fuera.",
  VectorLift: "VectorLift",
  "Laser wenkbrauwlift en versteviging van het voorhoofd, zonder naalden.":
    "Lifting de cejas con láser y reafirmación de la frente, sin agujas.",
  "Hoe weet ik of het een rimpel is of een droogtelijntje?":
    "¿Cómo sé si es una arruga o una línea de deshidratación?",
  "Kijk een week lang op verschillende momenten. Een droogtelijntje verandert met de dag, het seizoen en je verzorging; een echte rimpel staat er elke ochtend hetzelfde bij.":
    "Mírate en distintos momentos durante una semana. Una línea de deshidratación cambia con el día, la estación y tu cuidado; una arruga de verdad está igual cada mañana.",
  "Doen jullie botox?": "¿Ponéis bótox?",
  "Nee. Wij werken op de huid en niet op de spier. Voor een lijn die alleen zichtbaar is bij beweging is een injectable vaak de logische route, en dan verwijzen we je liever door dan dat we je een reeks verkopen die daar weinig aan verandert.":
    "No. Nosotros trabajamos sobre la piel y no sobre el músculo. Para una línea que solo se ve en movimiento, un inyectable suele ser la vía lógica, y entonces preferimos derivarte a venderte una serie que poco va a cambiar eso.",
  "Op welke leeftijd moet ik hiermee beginnen?":
    "¿A qué edad debería empezar con esto?",
  "Er is geen leeftijd. Wat er wel toe doet is of er iets te winnen valt: bij een huid die nog stevig is levert een reeks weinig op, en dan is zonbescherming de hele behandeling.":
    "No hay una edad. Lo que sí importa es si hay algo que ganar: en una piel que todavía está firme una serie da poco, y entonces la protección solar es todo el tratamiento.",
  "Collageenopbouw is een kwestie van maanden en niet van weken. Daarom meten we vooraf: over die termijn is je eigen indruk geen betrouwbare maat.":
    "Construir colágeno es cuestión de meses y no de semanas. Por eso medimos de antemano: en ese plazo tu propia impresión no es una medida fiable.",
  "Zie je vooruitgang": "Ve el avance",
  "in plaats van te gokken": "en vez de adivinarlo",
  "Bij lijnen gaat het om maanden, en je eigen gezicht zie je elke dag. De huidanalyse legt onder vaste belichting vast waar je begon, zodat je bij een volgende afspraak het verschil naast elkaar ziet.":
    "En las líneas se trata de meses, y tu propia cara la ves todos los días. El análisis de piel registra con una iluminación fija de dónde partiste, para que en una cita posterior veas la diferencia una al lado de la otra.",
  "Het grootste deel van wat je huid ouder maakt, komt door zonlicht en niet door je leeftijd. Juist dat deel is goed te behandelen. De huidtherapeut kiest uit medische peelings, microneedling met de":
    "La mayor parte de lo que envejece tu piel viene de la luz solar y no de tu edad. Y esa es justo la parte que responde bien al tratamiento. La terapeuta de piel elige entre peelings médicos, microneedling con el",
  "of de": "o el",
  ", fractionele laser op de": ", láser fraccionado con el",
  ", IPL bij pigment en vaatjes, en mesotherapie.":
    ", IPL para el pigmento y los vasos, y mesoterapia.",
  "Wat het bij jou wordt hangt af van je huid en van wat er precies speelt; meestal is het een combinatie over een aantal maanden. Tijdens de intake stelt de huidtherapeut vast wat door de zon komt en wat bij je leeftijd hoort.":
    "Lo que salga en tu caso depende de tu piel y de qué hay exactamente; normalmente es una combinación a lo largo de varios meses. Durante la primera consulta la terapeuta de piel determina qué viene del sol y qué corresponde a tu edad.",
  "Wat is welke veroudering": "Qué envejecimiento es cuál",
  "Tijd of zon": "Tiempo o sol",
  "Wat begint wanneer": "Qué empieza cuándo",
  "Zon of": "Sol o",
  leeftijd: "edad",
  "De behandelaar vergelijkt een stuk huid dat weinig zon zag met je gezicht. Dat verschil laat zien welk deel door zonschade komt.":
    "La terapeuta compara un trozo de piel que ha visto poco sol con tu cara. Esa diferencia enseña qué parte viene del daño solar.",
  "Zon of leeftijd": "Sol o edad",
  "Je binnenarm is even oud als je gezicht.":
    "La cara interna de tu brazo tiene exactamente la misma edad que tu cara.",
  "Toch ziet hij er jonger uit.": "Y aun así se ve más joven.",
  "Alles wat je op je gezicht extra ziet, is er dus bij gekomen en niet meegegroeid. Dat is het deel waar een behandeling iets aan doet. Zet je leeftijd hieronder in en zie hoe de twee zich verhouden.":
    "Todo lo que ves de más en tu cara se ha ido añadiendo, no ha crecido contigo. Esa es la parte sobre la que un tratamiento hace algo. Pon tu edad abajo y mira cómo se comparan las dos.",
  "Hoe oud ben je?": "¿Cuántos años tienes?",
  jaar: "años",
  "Wat er gelijk is": "Lo que es igual",
  "Binnenkant bovenarm": "Cara interna del brazo",
  "Je gezicht en handen": "Tu cara y tus manos",
  Leeftijd: "Edad",
  dagen: "días",
  Genen: "Genes",
  "Dezelfde persoon": "La misma persona",
  "Voeding en slaap": "Alimentación y sueño",
  "Hetzelfde lijf, dezelfde jaren": "El mismo cuerpo, los mismos años",
  Dezelfde: "Los mismos",
  "Roken en alcohol": "Tabaco y alcohol",
  Hetzelfde: "Lo mismo",
  "Dagen dat de huid buiten kwam": "Días que la piel pasó al aire libre",
  "Bijna nul": "Casi ninguno",
  "Bijna allemaal": "Casi todos",
  "En dat terwijl het gezicht meestal juist de meeste verzorging krijgt van de twee. De variabele die overblijft is niet je routine.":
    "Y eso que la cara suele ser la que más cuidados recibe de las dos. La variable que queda no es tu rutina.",
  "Vrijwel nooit zon gezien": "Casi nunca ha visto el sol",
  "Gladder, egaler, weinig vlekken. Dit is wat tijd alleen met je huid doet: hij wordt dunner en droger, maar blijft gelijkmatig.":
    "Más lisa, más uniforme, pocas manchas. Esto es lo que el tiempo solo le hace a tu piel: se vuelve más fina y más seca, pero sigue siendo uniforme.",
  "Elke dag zon, ook in de winter": "Sol todos los días, también en invierno",
  "Fijne lijntjes, ongelijke kleur, verwijde vaatjes, ruwere structuur. Dit is tijd plus tienduizenden uren UV.":
    "Líneas finas, color desigual, vasos dilatados, textura más áspera. Esto es el tiempo más decenas de miles de horas de UV.",
  "Aan opgebouwd zit een knop. Aan meegegroeid niet.":
    "Lo que se ha acumulado tiene un mando. Lo que creció contigo, no.",
  "Het deel dat door de zon is opgebouwd, is het deel dat we kunnen behandelen. Tijdens de intake stelt de huidtherapeut vast hoe groot dat deel bij jou is, en welke behandeling daarbij past.":
    "La parte que ha construido el sol es la parte que podemos tratar. Durante la primera consulta la terapeuta de piel determina cómo de grande es esa parte en tu caso, y qué tratamiento le corresponde.",
  "Vijf sporen": "Cinco vías",
  "Wat er bij veroudering": "Lo que el envejecimiento cambia",
  "in je huid verandert": "en tu piel",
  "Huidveroudering is geen schakelaar die op een leeftijd omgaat. Er lopen meerdere dingen naast elkaar, ze beginnen niet tegelijk en ze hebben niet dezelfde oorzaak. Kies een levensfase en kijk wat er dan speelt.":
    "El envejecimiento cutáneo no es un interruptor que se activa a cierta edad. Hay varias cosas en marcha a la vez, no empiezan al mismo tiempo y no tienen la misma causa. Elige una etapa de la vida y mira qué pasa entonces.",
  "20 tot 30 jaar": "De 20 a 30 años",
  "30 tot 40 jaar": "De 30 a 40 años",
  "40 tot 55 jaar": "De 40 a 55 años",
  "55 jaar en ouder": "55 años o más",
  "Collageen loopt terug": "El colágeno baja",
  "Tijd en zon": "Tiempo y sol",
  "Loopt, meestal nog onzichtbaar": "En marcha, normalmente aún invisible",
  "De aanmaak zakt geleidelijk vanaf je twintiger jaren. UV versnelt het en breekt bestaand collageen ook af, dus dit spoor loopt bij iedereen maar niet even snel.":
    "La producción baja poco a poco a partir de los veinte. El UV lo acelera y además destruye el colágeno que ya hay, así que esta vía corre en todo el mundo pero no a la misma velocidad.",
  collageenafname: "pérdida de colágeno",
  "Vlekken komen op": "Salen manchas",
  "Dit is bijna volledig een zonspoor. Wat je nu ziet is opgebouwd in jaren die al geweest zijn, en wat je vandaag doet bepaalt de vlekken van over tien jaar.":
    "Esta es casi por completo una vía solar. Lo que ves ahora se ha construido en años que ya pasaron, y lo que hagas hoy decide las manchas de dentro de diez años.",
  "lentigines, hyperpigmentatie": "léntigos, hiperpigmentación",
  "Vaatjes worden zichtbaar": "Los vasos se hacen visibles",
  "Kleine verwijde bloedvaatjes, vooral op neus en wangen. Zon en warmte zijn de grootste aanjagers.":
    "Pequeños vasos sanguíneos dilatados, sobre todo en la nariz y las mejillas. El sol y el calor son los mayores impulsores.",
  "Structuur wordt ruwer": "La textura se vuelve más áspera",
  "De celvernieuwing vertraagt, waardoor de huid doffer oogt en licht anders weerkaatst. Dit is het onderdeel dat het snelst reageert op behandeling.":
    "La renovación celular se ralentiza, con lo que la piel se ve más apagada y refleja la luz de otra manera. Esta es la parte que más rápido responde al tratamiento.",
  "verhoornings- en textuurverandering": "cambios de queratinización y textura",
  "Volume verplaatst zich": "El volumen se desplaza",
  Tijd: "Tiempo",
  "Nog niet aan de orde": "Todavía no entra en juego",
  "Vetkussentjes worden kleiner en zakken, en ook het bot eronder verandert. Dit is het meest zuivere tijdspoor, en precies het onderdeel waar wij niets aan doen.":
    "Las bolsas de grasa se encogen y bajan, y también cambia el hueso de debajo. Esta es la vía más puramente temporal, y justo la parte sobre la que nosotros no hacemos nada.",
  "vet- en botremodellering": "remodelación de grasa y hueso",
  "Wat wij hier zouden zeggen": "Lo que diríamos aquí",
  "Nu wordt meten zinvol": "Ahora medir tiene sentido",
  "De eerste zonschade wordt zichtbaar terwijl er nog niets vastligt. Een huidanalyse nu geeft je een vergelijkingspunt, zodat je later weet of iets werkte of dat je het je verbeeldde.":
    "El primer daño solar se hace visible mientras todavía no hay nada fijo. Un análisis de piel ahora te da un punto de comparación, para que más adelante sepas si algo funcionó o si te lo imaginaste.",
  "Waarom de kleur ertoe doet": "Por qué importa el color",
  "Tel de okeren balkjes. Dat is het deel van wat je ziet dat door zon komt, en daarmee het deel waar vandaag nog iets aan te doen valt. De groene balkjes lopen door wat je ook kiest.":
    "Cuenta las barras ocres. Esa es la parte de lo que ves que viene del sol, y por tanto la parte sobre la que hoy todavía se puede hacer algo. Las barras verdes siguen su curso elijas lo que elijas.",
  "Wat mensen": "Lo que la gente",
  "veroudering noemen": "llama envejecimiento",
  "Drie ervan behandelen we. Bij de vierde zeggen we nee, en dat staat er met dezelfde nadruk bij. Kies wat het dichtst bij jou komt.":
    "Tres de ellos los tratamos. Al cuarto le decimos que no, y eso está escrito con el mismo énfasis. Elige lo que más se acerque a lo tuyo.",
  "Fijne lijntjes": "Líneas finas",
  "Lijntjes rond ogen en mond die blijven staan":
    "Líneas alrededor de los ojos y la boca que se quedan",
  "Doffe, ongelijke huid": "Piel apagada y desigual",
  "Je huid ziet er moe uit terwijl je niet moe bent":
    "Tu piel parece cansada sin que tú lo estés",
  "Vlekken en verkleuring": "Manchas y decoloración",
  "Bruine plekjes die er tien jaar geleden niet zaten":
    "Manchitas marrones que hace diez años no estaban",
  "Minder strakke contouren": "Contornos menos definidos",
  "De kaaklijn en wangen zakken": "La mandíbula y las mejillas caen",
  "statische rimpels": "arrugas estáticas",
  "Lijnen die eerst alleen bij lachen of fronsen verschenen en nu ook in rust zichtbaar blijven.":
    "Líneas que al principio solo aparecían al reír o fruncir el ceño y que ahora se quedan visibles también en reposo.",
  "De huid heeft op die plek minder veerkracht en de vouw is ingesleten. Dat is deels beweging en deels opgebouwde zonschade.":
    "La piel tiene menos elasticidad en ese punto y el pliegue se ha marcado. Eso es en parte movimiento y en parte daño solar acumulado.",
  "We werken op de kwaliteit van de huid eromheen, niet op de vouw zelf. Verwacht een zachtere lijn, geen gladde huid.":
    "Trabajamos sobre la calidad de la piel de alrededor, no sobre el pliegue en sí. Espera una línea más suave, no una piel lisa.",
  "Een lijn die alleen verschijnt als je lacht is geen veroudering. Die hoort bij een gezicht dat beweegt.":
    "Una línea que solo aparece cuando ríes no es envejecimiento. Forma parte de una cara que se mueve.",
  "Gaat het je vooral om vlekken en niet om lijnen? Dan begint het verhaal ergens anders, want daar speelt het seizoen een grote rol in wanneer je moet beginnen.":
    "¿Lo tuyo son sobre todo las manchas y no las líneas? Entonces la historia empieza en otro sitio, porque ahí la estación tiene mucho que ver con cuándo hay que empezar.",
  "De eerste regel links is de goedkoopste behandeling op deze hele site, en de enige die aan alle vijf de sporen tegelijk werkt.":
    "La primera línea de la izquierda es el tratamiento más barato de toda esta web, y el único que actúa sobre las cinco vías a la vez.",
  "Gebruik dagelijks zonbescherming, ook in de winter en wanneer je veel achter glas zit.":
    "Usa protección solar a diario, también en invierno y cuando pasas mucho rato detrás de un cristal.",
  "Eén onderdeel tegelijk aanpakken en meten of het werkte, in plaats van een pakket kopen.":
    "Abordar una parte cada vez y medir si funcionó, en lugar de comprar un paquete.",
  "Beginnen bij kleur en structuur, want daar zie je het snelst of de richting klopt.":
    "Empezar por el color y la textura, porque ahí ves más rápido si la dirección es la correcta.",
  "Je verwachting vooraf op tafel leggen. Als die niet haalbaar is, hoor je dat vóór je betaalt.":
    "Poner tu expectativa sobre la mesa antes de empezar. Si no es alcanzable, lo sabes antes de pagar.",
  "Accepteren dat een deel niet met huidbehandelingen op te lossen is, en dat gewoon benoemen.":
    "Aceptar que una parte no se resuelve con tratamientos de la piel, y decirlo sin más.",
  "Wachten tot het je echt begint te storen. De sporen die je nu niet ziet lopen al wel.":
    "Esperar a que de verdad te moleste. Las vías que ahora no ves ya están en marcha.",
  "Een behandelpakket kopen zonder huidanalyse. Dan is achteraf niet vast te stellen of het iets deed.":
    "Comprar un paquete de tratamientos sin análisis de piel. Después no hay manera de determinar si sirvió de algo.",
  "Meerdere agressieve behandelingen kort na elkaar. Een geïrriteerde huid maakt méér pigment aan, geen minder.":
    "Varios tratamientos agresivos seguidos. Una piel irritada produce más pigmento, no menos.",
  "Sturen op een leeftijd in plaats van op een huid. Twee mensen van vijftig hebben zelden hetzelfde nodig.":
    "Guiarse por una edad en vez de por una piel. Dos personas de cincuenta rara vez necesitan lo mismo.",
  "Denken dat een dure crème zonbescherming vervangt. Een crème met SPF doet dat werk, een dagcrème zonder niet.":
    "Creer que una crema cara sustituye a la protección solar. Una crema con SPF hace ese trabajo; una crema de día sin SPF, no.",
  "Veroudering vraagt om een beginpunt.":
    "El envejecimiento pide un punto de partida.",
  "Dit is het onderwerp waarbij je oog je het hardst voor de gek houdt. De verandering gaat over jaren en je kijkt elke dag in dezelfde spiegel, dus je ziet het verschil niet, in geen van beide richtingen.":
    "Este es el tema en el que tu ojo más te engaña. El cambio se produce a lo largo de años y te miras cada día en el mismo espejo, así que no ves la diferencia, en ninguna de las dos direcciones.",
  "We leggen de beginsituatie vast, zodat we na verloop van tijd beter kunnen beoordelen of er iets is veranderd.":
    "Registramos la situación de partida, para que al cabo de un tiempo podamos valorar mejor si ha cambiado algo.",
  "Vlekken, egaliteit en verwijde vaatjes":
    "Manchas, uniformidad y vasos dilatados",
  Structuur: "Textura",
  "Hoe de huid licht weerkaatst en aanvoelt":
    "Cómo refleja la luz la piel y cómo se nota al tacto",
  Lijnen: "Líneas",
  "Waar ze staan en of ze in rust blijven":
    "Dónde están y si se quedan en reposo",
  Dermaplaning: "Dermaplaning",
  "Dode huidcellen en donshaartjes weg met een mesje. Werkt zonder zuren, dus ook bij een gevoelige huid.":
    "Células muertas y vello fino fuera con una cuchilla. Funciona sin ácidos, así que también sirve para una piel sensible.",
  "Dermaplaning in Rotterdam": "Dermaplaning en Rotterdam",
  "Fotona 4D Men": "Fotona 4D Men",
  "Hetzelfde protocol van vier, ingesteld op de doorgaans dikkere mannenhuid.":
    "El mismo protocolo de cuatro pasos, ajustado a la piel masculina, que suele ser más gruesa.",
  "PIANO skin tightening": "PIANO skin tightening",
  "Diepe, gelijkmatige verwarming voor versteviging van gezicht, kaaklijn en hals.":
    "Calentamiento profundo y uniforme para reafirmar la cara, la mandíbula y el cuello.",
  "RRS Hyalift": "RRS Hyalift",
  "Hyaluronzuur en vitamines in de huid brengen. Voor stevigheid en vocht, niet voor volume.":
    "Llevar ácido hialurónico y vitaminas dentro de la piel. Para firmeza e hidratación, no para volumen.",
  "Fotona 4D Full Package": "Fotona 4D Full Package",
  "Het volledige 4D-protocol met de hals en de kaaklijn erbij, in één afspraak.":
    "El protocolo 4D completo, con el cuello y la mandíbula incluidos, en una sola cita.",
  "Vanaf welke leeftijd is dit zinvol?":
    "¿A partir de qué edad tiene sentido esto?",
  "Er is geen leeftijd waarop het begint. Er is wel een moment waarop meten zinvol wordt, en dat is zodra je iets wilt veranderen. Zonder beginpunt weet je later niet of het werkte.":
    "No hay una edad en la que empiece. Sí hay un momento en el que medir tiene sentido, y es en cuanto quieres cambiar algo. Sin un punto de partida no sabrás después si funcionó.",
  "Kan ik zonschade van vroeger nog terugdraaien?":
    "¿Puedo revertir todavía el daño solar de antes?",
  "Deels. Kleur en structuur zijn goed te verbeteren, en dat is meestal wat mensen in de spiegel opvalt. Wat weg is aan volume komt niet terug, en dat zeggen we liever nu dan na vier sessies.":
    "En parte. El color y la textura se pueden mejorar bastante, y eso suele ser lo que la gente nota en el espejo. El volumen que se ha ido no vuelve, y preferimos decirlo ahora y no después de cuatro sesiones.",
  "Waarom beginnen jullie niet meteen met laser?":
    "¿Por qué no empezáis directamente con láser?",
  "Omdat we eerst willen weten waar we naar kijken. Dezelfde lijn kan uitdroging zijn of ingesleten zonschade, en dat vraagt iets anders. De meting kost je één afspraak en bespaart meestal meer.":
    "Porque primero queremos saber qué estamos mirando. La misma línea puede ser deshidratación o daño solar marcado, y eso pide cosas distintas. La medición te cuesta una cita y normalmente ahorra más.",
  "Mijn huid is donker. Geldt dit ook voor mij?":
    "Tengo la piel oscura. ¿Esto también vale para mí?",
  "Ja, maar anders. Een donkere huid vertoont minder snel lijntjes en meer pigmentverschuiving, en reageert feller op te agressieve behandeling. De instellingen en de volgorde zijn daarom anders.":
    "Sí, pero de otra manera. Una piel oscura muestra menos líneas y más desplazamiento de pigmento, y reacciona con más fuerza a un tratamiento demasiado agresivo. Por eso los ajustes y el orden son distintos.",
  "Hoe lang houdt het resultaat aan?": "¿Cuánto dura el resultado?",
  "Zolang de oorzaak niet doorloopt. Zonder bescherming bouwt de zonschade gewoon verder en dan zie je hetzelfde terugkomen; met bescherming houden mensen het meestal een tot twee jaar vol voordat er onderhoud nodig is. Dat is een ervaringsgetal en geen meting, en zo staat het er dan ook.":
    "Mientras la causa no siga. Sin protección, el daño solar sigue acumulándose y entonces ves volver lo mismo; con protección la gente suele aguantar uno o dos años antes de necesitar mantenimiento. Es una cifra de experiencia y no una medición, y así está escrita.",
  "Begin bij weten": "Empieza por saber",
  "wat er speelt.": "qué está pasando.",
  "We meten kleur, structuur en lijnen, en vertellen je welk deel door zon komt en welk deel niet. Daarna beslis jij of je iets wilt doen, en wat.":
    "Medimos el color, la textura y las líneas, y te contamos qué parte viene del sol y qué parte no. Después decides tú si quieres hacer algo, y qué.",
  "Een verslapte kaaklijn": "Una mandíbula que pierde firmeza",
  "en zakkende wangen": "y unas mejillas que caen",
  "Een zakkende kaaklijn en wangen behandelen we met technieken die de aanmaak van collageen op gang brengen: microneedling met de SkinPen of de Dermapen 4, fractionele laser met de Fotona, en radiofrequentie. Dat geeft steviger weefsel en een vastere lijn.":
    "Una mandíbula y unas mejillas que caen las tratamos con técnicas que ponen en marcha la producción de colágeno: microneedling con el SkinPen o el Dermapen 4, láser fraccionado con el Fotona, y radiofrecuencia. Eso da un tejido más firme y una línea más marcada.",
  "Welke techniek bij jou past hangt af van je huid en van het stadium waarin de verslapping zit. Dat stelt de huidtherapeut tijdens de intake vast, en meestal is het een combinatie.":
    "Qué técnica encaja contigo depende de tu piel y de la fase en la que está la flacidez. Eso lo determina la terapeuta de piel durante la primera consulta, y normalmente es una combinación.",
  "Waar het zichtbaar wordt": "Dónde se hace visible",
  "Welk stadium": "Qué fase",
  "Wat er te": "Lo que hay",
  "winnen valt": "que ganar",
  "De behandelaar bekijkt je huid staand en liggend. Het verschil tussen die twee beelden geeft aan wat een behandeling kan opleveren.":
    "La terapeuta mira tu piel de pie y tumbada. La diferencia entre esas dos imágenes indica qué puede dar un tratamiento.",
  "Staand beoordeeld": "Valorada de pie",
  "De huidtherapeut bekijkt je gezicht rechtop en in rust. Dat is hoe je eruitziet op de momenten waarop het je zelf opvalt, en daar rekenen we vanaf.":
    "La terapeuta de piel mira tu cara erguida y en reposo. Así es como te ves en los momentos en que a ti misma te llama la atención, y desde ahí contamos.",
  "Liggend vergeleken": "Comparada tumbada",
  "Daarna hetzelfde gezicht liggend, waar de zwaartekracht geen grip heeft. Het verschil tussen die twee beelden laat zien wat er aan stevigheid te winnen valt.":
    "Después la misma cara tumbada, donde la gravedad no tiene agarre. La diferencia entre esas dos imágenes enseña cuánta firmeza hay que ganar.",
  "Beide opnames leggen we onder vaste belichting vast. Bij een volgende afspraak zetten we ze naast elkaar, zodat je de verandering ziet in plaats van inschat.":
    "Las dos fotos las hacemos con una iluminación fija. En una cita posterior las ponemos una al lado de la otra, para que veas el cambio en vez de estimarlo.",
  "Vier stadia": "Cuatro fases",
  "De vier": "Las cuatro",
  stadia: "fases",
  "Verslapping, volumeverlies en losgelaten huid worden door elkaar gehaald en vragen om drie verschillende dingen. Alleen het eerste is ons vak.":
    "La flacidez, la pérdida de volumen y la piel que ya se ha descolgado se confunden y piden tres cosas distintas. Solo la primera es nuestro oficio.",
  "De huid veert langzamer terug": "La piel vuelve más despacio a su sitio",
  "Je knijpt in je wang en het duurt even voor het weer glad is":
    "Te pellizcas la mejilla y tarda un momento en quedarse lisa otra vez",
  "De kaaklijn wordt vager": "La mandíbula se vuelve más difusa",
  "De grens tussen je kaak en je hals is minder scherp dan vroeger":
    "El límite entre la mandíbula y el cuello está menos marcado que antes",
  "Je gezicht is smaller geworden": "Tu cara se ha estrechado",
  "Je wangen zijn platter en je gezicht oogt ingevallen":
    "Tus mejillas están más planas y la cara parece hundida",
  "Huid die echt hangt": "Piel que cuelga de verdad",
  "Een plooi die je kunt vastpakken en die blijft hangen":
    "Un pliegue que puedes coger y que se queda colgando",
  "verlies van elasticiteit": "pérdida de elasticidad",
  "Knijp voorzichtig een plooi op je wang of de rug van je hand en laat los. Blijft de plooi een tel staan, dan is dat wat je meet.":
    "Pellizca con cuidado un pliegue en la mejilla o en el dorso de la mano y suelta. Si el pliegue se queda un segundo, eso es lo que estás midiendo.",
  "Elastine en collageen nemen af, waardoor de huid trager terugveert. Dit is het vroegste stadium en het stadium waarin een behandeling het meeste oplevert.":
    "La elastina y el colágeno bajan, con lo que la piel vuelve más despacio a su sitio. Esta es la fase más temprana y la fase en la que un tratamiento da más.",
  "Herstel op gang brengen in de diepere lagen, met laser of needling, in een reeks over maanden. Hier is winst te boeken.":
    "Poner en marcha la reparación en las capas profundas, con láser o needling, en una serie de meses. Aquí sí hay algo que ganar.",
  "Er is nog structuur om op voort te bouwen. Reken op een reeks over maanden, en op scherper in plaats van strak.":
    "Todavía hay estructura sobre la que construir. Cuenta con una serie de meses, y con un contorno más definido en vez de tenso.",
  "Zit je vooral met lijnen?": "¿Lo tuyo son sobre todo las líneas?",
  "Dan is verslapping niet je onderwerp.":
    "Entonces la flacidez no es tu tema.",
  "Lijnen en verslapping komen samen voor maar zijn niet hetzelfde. Gaat het je om de lijnen zelf, dan begint het bij het verschil tussen huid en spier op de rimpelpagina.":
    "Las líneas y la flacidez aparecen juntas pero no son lo mismo. Si lo que te importa son las líneas en sí, todo empieza por la diferencia entre piel y músculo en la página de las arrugas.",
  "Naar rimpels": "A las arrugas",
  "Hier is geduld geen bijzaak. Collageen bouwt over maanden op, en dat is niet te versnellen door vaker te komen.":
    "Aquí la paciencia no es un detalle. El colágeno se construye a lo largo de meses, y venir más a menudo no lo acelera.",
  "Eerst vaststellen of het om stevigheid gaat, om volume, of om huid die echt is losgelaten":
    "Determinar primero si va de firmeza, de volumen, o de piel que ya se ha descolgado",
  "De diepere lagen aanspannen met laser, in een reeks met weken ertussen":
    "Tensar las capas profundas con láser, en una serie con semanas entre medias",
  "Een huidanalyse, want verandering over maanden zie je in de spiegel niet en op een meting wel":
    "Un análisis de piel, porque un cambio a lo largo de meses no se ve en el espejo y sí en una medición",
  "Dagelijkse zonbescherming, omdat uv-straling collageen en elastine afbreekt":
    "Protección solar diaria, porque la radiación UV destruye el colágeno y la elastina",
  "Zeggen wanneer het verschil te klein wordt om de investering waard te zijn":
    "Decir cuándo la diferencia se vuelve demasiado pequeña para que valga la inversión",
  "Chirurgie nabootsen. Wat is losgelaten wordt hier niet vastgezet":
    "Imitar a la cirugía. Lo que se ha descolgado aquí no se vuelve a fijar",
  "Volume opvullen. Wij werken niet met fillers, en bij een smaller geworden gezicht is dat vaak wel het antwoord":
    "Rellenar volumen. No trabajamos con rellenos, y en una cara que se ha estrechado esa suele ser la respuesta",
  "Een behandelreeks starten terwijl de beoordeling laat zien dat weinig verbetering te verwachten is":
    "Empezar una serie de tratamientos cuando la valoración enseña que hay poca mejora que esperar",
  "Resultaat beloven in weken. Collageenopbouw loopt over maanden":
    "Prometer resultado en semanas. La construcción de colágeno se cuenta en meses",
  "Behandelen op een gebruinde huid": "Tratar una piel bronceada",
  "Verslapping verandert traag, en jij kijkt elke dag. Daardoor merk je vooruitgang net zo min op als achteruitgang. De EVE-M legt je huid vast onder vast licht en vanuit een vaste hoek, voordat de eerste sessie plaatsvindt.":
    "La flacidez cambia despacio, y tú te miras todos los días. Por eso notas el avance tan poco como el retroceso. El EVE-M registra tu piel con luz fija y desde un ángulo fijo, antes de que haya una primera sesión.",
  "Dat werkt twee kanten op. Het maakt verschil aantoonbaar, en het maakt ook zichtbaar wanneer er weinig verandert. Dat laatste is een reden om te stoppen of iets anders te doen, en niet om door te gaan omdat er nog sessies in een pakket zaten.":
    "Eso funciona en los dos sentidos. Hace la diferencia demostrable, y también hace visible cuándo cambia poco. Esto último es un motivo para parar o hacer otra cosa, y no para seguir porque a un paquete le quedaran sesiones.",
  Contour: "Contorno",
  "De lijn langs kaak en hals, vastgelegd vanuit een vaste hoek":
    "La línea de la mandíbula y el cuello, registrada desde un ángulo fijo",
  "Het oppervlak, want dat verandert vaak eerder dan de vorm":
    "La superficie, porque suele cambiar antes que la forma",
  "Is dit een alternatief voor een facelift?":
    "¿Es esto una alternativa a un lifting?",
  "Nee. Aanspannen van de huid en het verwijderen van weefsel zijn twee verschillende dingen, en wij doen alleen het eerste. Wat wij doen werkt in het stadium daarvoor, en op het moment dat dat stadium voorbij is zeggen we dat.":
    "No. Tensar la piel y retirar tejido son dos cosas distintas, y nosotros solo hacemos lo primero. Lo que hacemos funciona en la fase anterior, y en cuanto esa fase ha pasado lo decimos.",
  "Vanaf welke leeftijd heeft dit zin?":
    "¿A partir de qué edad tiene sentido esto?",
  "Leeftijd zegt hier weinig. Waar het om gaat is hoeveel je huid nog terugveert, en dat stelt de behandelaar in het consult vast. Is er weinig te winnen, dan hoor je dat, en dan is dat het advies.":
    "La edad dice poco aquí. Lo que importa es cuánto vuelve todavía tu piel a su sitio, y eso lo determina la terapeuta en la consulta. Si hay poco que ganar, te lo decimos, y ese es el consejo.",
  "Het proces zelf gaat door, dus het is geen eindpunt maar een verschuiving. Hoe lang dat merkbaar blijft verschilt sterk per persoon; we spreken vooraf af wanneer we opnieuw meten in plaats van dat we een getal noemen.":
    "El proceso en sí continúa, así que no es un punto final sino un desplazamiento. Cuánto tiempo sigue notándose cambia mucho de una persona a otra; acordamos de antemano cuándo volvemos a medir en lugar de dar un número.",
  "Doet het pijn?": "¿Duele?",
  "Je voelt warmte en soms korte prikjes. De meeste mensen omschrijven het als goed te doen, en er is geen verdoving nodig. Wat je erna merkt hangt af van de behandeling en staat op de behandelpagina.":
    "Notas calor y a veces pinchazos cortos. La mayoría lo describe como llevadero, y no hace falta anestesia. Lo que notas después depende del tratamiento y está en la página del tratamiento.",
  "In het huidconsult kijkt de behandelaar hoeveel je huid nog terugveert en meet hij wat er nu is. Blijkt er weinig te winnen, dan hoor je dat, en dan is dat het advies.":
    "En la consulta de la piel la terapeuta mira cuánto vuelve todavía tu piel a su sitio y mide lo que hay ahora. Si resulta que hay poco que ganar, te lo decimos, y ese es el consejo.",
  "Wallen onder": "Bolsas debajo",
  "je ogen": "de los ojos",
  "Wallen komen door vocht, een vetkussen of schaduw door een groef. Bij vocht en bij een dunne huid rond de ogen kunnen we iets doen, met gerichte verzorging en behandelingen die de huid steviger maken.":
    "Las bolsas vienen de líquido, de una almohadilla de grasa o de la sombra de un surco. Con el líquido y con una piel fina alrededor de los ojos sí podemos hacer algo, con cuidados dirigidos y tratamientos que dan firmeza a la piel.",
  "Tijdens de intake stellen we vast waar het bij jou vandaan komt.":
    "Durante la primera consulta determinamos de dónde viene en tu caso.",
  "Vocht, vet of schaduw": "Líquido, grasa o sombra",
  "De huidtherapeut kijkt naar de stand van de huid onder je oog, naar het verloop over de dag en naar de dikte van de huid ter plaatse.":
    "La terapeuta de piel mira cómo está la piel debajo del ojo, cómo evoluciona a lo largo del día y qué grosor tiene la piel en esa zona.",
  "Het verloop over de dag": "Cómo evoluciona a lo largo del día",
  "Vocht zakt in de loop van de dag weg, een vetkussen en een groef blijven gelijk. Daar begint de beoordeling mee.":
    "El líquido baja durante el día; una almohadilla de grasa y un surco se quedan igual. Por ahí empieza la valoración.",
  "De dikte van de huid": "El grosor de la piel",
  "Onder je oog is de huid het dunst van je lichaam. Hoe dun precies, bepaalt wat een behandeling kan toevoegen.":
    "Debajo del ojo la piel es la más fina de tu cuerpo. Cómo de fina exactamente decide qué puede aportar un tratamiento.",
  "De stand van het bot eronder": "Cómo está el hueso de debajo",
  "Ligt de oogkas dieper, dan valt er schaduw. Dat ziet eruit als een wal en vraagt iets anders dan vocht.":
    "Si la cuenca del ojo está más hundida, cae una sombra. Eso parece una bolsa y pide algo distinto que el líquido.",
  "Vocht, vet, schaduw": "Líquido, grasa, sombra",
  "Wat er onder": "Lo que hay debajo",
  "je ogen zit": "de tus ojos",
  "Wallen komen door vocht, een vetkussen of schaduw door een groef. Welke van de drie het is, bepaalt wat een huidbehandeling kan toevoegen. En soms is het geen wal maar een gele plek op het ooglid.":
    "Las bolsas vienen de líquido, de una almohadilla de grasa o de la sombra de un surco. Cuál de las tres sea decide qué puede aportar un tratamiento de la piel. Y a veces no es una bolsa sino una mancha amarilla en el párpado.",
  Vocht: "Líquido",
  "'s Ochtends dik, in de loop van de dag minder":
    "Hinchado por la mañana, menos a lo largo del día",
  "Uitgezakt vet": "Grasa descolgada",
  "Een bolling die er altijd zit, ochtend en avond hetzelfde":
    "Un abultamiento que está siempre, igual de mañana que de noche",
  "Schaduw, geen zwelling": "Sombra, no hinchazón",
  "Een groef of holte onder je oog die donker oogt":
    "Un surco o un hueco debajo del ojo que se ve oscuro",
  "Gele plekjes op het ooglid": "Manchitas amarillas en el párpado",
  "Zachte, gelige bultjes op of rond je oogleden die niet weggaan":
    "Bultitos blandos y amarillentos en los párpados o alrededor que no se van",
  "peri-orbitaal oedeem": "edema periorbitario",
  "Is het bij het opstaan het ergst en tegen de middag een stuk minder? En verschilt het per nacht, na zout eten of een glas te veel?":
    "¿Está peor al levantarte y bastante menos hacia el mediodía? ¿Y cambia de una noche a otra, después de comer salado o de una copa de más?",
  "Vocht dat zich 's nachts ophoopt in het losse weefsel onder je ogen en overdag wegzakt. Dit is de enige van de drie die van dag tot dag verandert.":
    "Líquido que se acumula por la noche en el tejido suelto de debajo de los ojos y baja durante el día. Es la única de las tres que cambia de un día para otro.",
  "Hier valt iets te doen. Afvoer stimuleren, de huid steviger maken, en kijken wat er in je routine of je nachten meespeelt. Zit er ook bruine kleur onder het oog, een pigmentwal, dan hoort de eye peel erbij, vaak samen met RRS Eyes.":
    "Aquí sí hay algo que hacer. Estimular el drenaje, dar firmeza a la piel, y mirar qué influye en tu rutina o en tus noches. Si además hay color marrón debajo del ojo, una bolsa de pigmento, entra el eye peel, a menudo junto con RRS Eyes.",
  "Van de drie oorzaken is dit de enige die met een huidbehandeling te beïnvloeden is, en de enige die van dag tot dag verandert.":
    "De las tres causas esta es la única que se puede influir con un tratamiento de la piel, y la única que cambia de un día para otro.",
  "Gaat het bij jou om kleur?": "¿En tu caso va de color?",
  "Dan zoek je geen wal maar een kring.":
    "Entonces no buscas una bolsa sino una ojera.",
  "Een wal is volume: er zit iets. Een donkere kring is kleur: pigment of vaatjes die doorschijnen. Ze komen vaak samen voor en vragen om verschillende dingen.":
    "Una bolsa es volumen: hay algo ahí. Una ojera oscura es color: pigmento o vasos que se transparentan. Aparecen juntas a menudo y piden cosas distintas.",
  "Naar donkere kringen": "A las ojeras",
  "De huid onder je oog is de dunste van je lichaam. Dat bepaalt zowel wat er kan als hoe voorzichtig we werken.":
    "La piel de debajo del ojo es la más fina de tu cuerpo. Eso decide tanto lo que se puede hacer como con cuánto cuidado trabajamos.",
  "Eerst vaststellen of het vocht, vet of schaduw is, want twee daarvan lossen we hier niet op":
    "Determinar primero si es líquido, grasa o sombra, porque dos de esas no las resolvemos aquí",
  "Bij vocht: afvoer stimuleren en de huid rond het oog steviger maken, in een reeks":
    "Con líquido: estimular el drenaje y dar firmeza a la piel de alrededor del ojo, en una serie",
  "Bij een pigmentwal, een bruine kleur onder het oog: de eye peel, vaak samen met RRS Eyes":
    "Con una bolsa de pigmento, un color marrón debajo del ojo: el eye peel, a menudo junto con RRS Eyes",
  "Zonbescherming rond de ogen, want een dunnere huid laat alles eronder beter zien":
    "Protección solar alrededor de los ojos, porque una piel más fina deja ver mejor todo lo que hay debajo",
  "Meewegen wat er verder speelt: slaap, zout, alcohol, allergie":
    "Tener en cuenta lo demás: el sueño, la sal, el alcohol, la alergia",
  "Doorsturen naar een arts als het antwoord daar ligt, ook als je hier al zat":
    "Derivarte a un médico cuando la respuesta está ahí, aunque ya estuvieras sentada aquí",
  "Fillers onder het oog. Dat doen wij niet, en het is bij een echte wal ook zelden de oplossing":
    "Rellenos debajo del ojo. Eso no lo hacemos, y con una bolsa de verdad rara vez es la solución",
  "Agressieve behandelingen op de dunste huid van je gezicht":
    "Tratamientos agresivos sobre la piel más fina de tu cara",
  "Een crème adviseren tegen een vetkussen Een crème kan een uitgezakt vetkussen onder het oog niet verplaatsen.":
    "Recomendar una crema contra una almohadilla de grasa. Una crema no puede mover una almohadilla de grasa descolgada debajo del ojo.",
  "Beloven dat het weggaat als het van dag tot dag niet verandert":
    "Prometer que se irá cuando no cambia de un día para otro",
  "Wat is het verschil tussen wallen en donkere kringen?":
    "¿Cuál es la diferencia entre bolsas y ojeras?",
  "Een wal is volume: er zit iets, of het nu vocht of vet is. Een donkere kring is kleur: pigment of doorschijnende vaatjes in een dunne huid. Ze komen vaak samen voor en vragen om verschillende dingen. Gaat het bij jou vooral om kleur, lees dan verder op de pagina over donkere kringen.":
    "Una bolsa es volumen: hay algo ahí, sea líquido o grasa. Una ojera oscura es color: pigmento o vasos que se transparentan en una piel fina. Aparecen juntas a menudo y piden cosas distintas. Si lo tuyo es sobre todo el color, sigue leyendo en la página sobre las ojeras.",
  "Helpt beter slapen?": "¿Ayuda dormir mejor?",
  "Bij vocht scheelt het, net als minder zout en minder alcohol voor het slapen. Bij vet of schaduw verandert er niets van, hoe goed je ook slaapt. Dat is precies waarom we eerst willen weten wat je hebt.":
    "Con el líquido sí cambia algo, igual que menos sal y menos alcohol antes de dormir. Con la grasa o la sombra no cambia nada, por bien que duermas. Justo por eso queremos saber primero qué tienes.",
  "Kan ik er zelf iets aan doen?": "¿Puedo hacer algo yo?",
  "Met je hoofd iets hoger slapen en koelen in de ochtend helpt tegen vocht, tijdelijk. Wrijven in je ogen is het enige dat je echt moet laten: de huid daar is de dunste van je lichaam en rekt makkelijk op.":
    "Dormir con la cabeza un poco más alta y aplicar frío por la mañana ayuda contra el líquido, de forma temporal. Frotarte los ojos es lo único que de verdad tienes que dejar: la piel de ahí es la más fina de tu cuerpo y se estira con facilidad.",
  "In het huidconsult stellen we vast of het vocht, vet of schaduw is. Bij twee van de drie is ons advies om ergens anders te beginnen, en dat hoor je dan meteen.":
    "En la consulta de la piel determinamos si es líquido, grasa o sombra. En dos de las tres nuestro consejo es empezar por otro sitio, y eso lo sabes enseguida.",
  "Een doffe huid": "Una piel apagada",
  "zonder glans": "y sin brillo",
  "Een doffe huid kaatst het licht minder terug. Dat komt meestal door een opeenhoping van dode huidcellen, door te weinig vocht of door een combinatie daarvan. De huidtherapeut heeft er meerdere behandelingen voor: medische peelings, HydraFacial, OxyGeneo, dermaplaning en microneedling.":
    "Una piel apagada devuelve menos luz. Eso suele venir de una acumulación de células muertas, de poca agua o de una combinación de las dos. La terapeuta de piel tiene varios tratamientos para ello: peelings médicos, HydraFacial, OxyGeneo, dermaplaning y microneedling.",
  "Welke daarvan het wordt verschilt per persoon, want geen huid is hetzelfde. Tijdens de intake stelt de huidtherapeut vast waar het bij jou vandaan komt en stelt daar de aanpak op af.":
    "Cuál de ellos será cambia de una persona a otra, porque no hay dos pieles iguales. Durante la primera consulta la terapeuta de piel determina de dónde viene en tu caso y ajusta el enfoque a eso.",
  "Waar komt het vandaan": "De dónde viene",
  "De huidtherapeut beoordeelt je huid bij daglicht en onder vergroting. Dofheid is licht dat verstrooit in plaats van weerkaatst, en dat zie je alleen onder de juiste hoek.":
    "La terapeuta de piel valora tu piel con luz de día y con lupa. El aspecto apagado es luz que se dispersa en vez de reflejarse, y eso solo se ve desde el ángulo adecuado.",
  "Bij daglicht": "Con luz de día",
  "De huidtherapeut beoordeelt je huid bij daglicht van opzij. Onder een lamp van boven lijkt elke huid even vlak, en dan zie je juist niet waar het licht verstrooit.":
    "La terapeuta de piel valora tu piel con luz de día de lado. Bajo una lámpara desde arriba cualquier piel parece igual de plana, y justo entonces no ves dónde se dispersa la luz.",
  "Met vergroting is te zien of er een aaneengesloten glans over je jukbeen loopt of dat het overal even mat blijft. Dat onderscheid bepaalt de richting.":
    "Con lupa se ve si hay un brillo continuo por el pómulo o si se queda igual de mate en todas partes. Esa distinción decide la dirección.",
  "Meten met de EVE-M": "Medir con el EVE-M",
  "De meting laat zien of het om opgehoopte cellen gaat, om vochttekort of om kleur. Op die uitkomst kiest de huidtherapeut de behandeling.":
    "La medición enseña si se trata de células acumuladas, de falta de agua o de color. Sobre ese resultado elige la terapeuta el tratamiento.",
  "Vier oorzaken": "Cuatro causas",
  "van dofheid": "del aspecto apagado",
  "Twee van de vier oorzaken behandelen we in de kliniek. Bij de andere twee zit de winst in je verzorging, en dat hoor je van ons.":
    "Dos de las cuatro causas las tratamos en la clínica. En las otras dos lo que se gana está en tu propio cuidado, y eso te lo decimos.",
  "Opgehoopte dode cellen": "Células muertas acumuladas",
  "Je huid voelt ruw en ziet er grauw uit, ook net na het wassen":
    "Tu piel se nota áspera y se ve grisácea, incluso recién lavada",
  "Te weinig vocht": "Poca agua",
  "Fijne streepjes en een fletse tint, vooral 's ochtends":
    "Rayitas finas y un tono apagado, sobre todo por la mañana",
  "Ongelijke kleur": "Color desigual",
  "Je huid oogt vlekkerig en daardoor vermoeid, ook zonder losse vlekken":
    "Tu piel se ve irregular y por eso cansada, aunque no haya manchas sueltas",
  "Slaap, roken, uitdroging": "Sueño, tabaco, deshidratación",
  "Een grauwe tint die komt en gaat met je weken":
    "Un tono grisáceo que va y viene con tus semanas",
  "vertraagde desquamatie": "descamación retardada",
  "Voelt je huid onder je vingertoppen licht ruw, en blijft er op een washandje meer achter dan je zou verwachten?":
    "¿Se nota tu piel ligeramente áspera bajo las yemas de los dedos, y queda más de lo que esperarías en una toallita?",
  "De bovenste laag vernieuwt trager dan vroeger, waardoor er cellen blijven liggen die het licht verstrooien in plaats van weerkaatsen. Dit is de meest voorkomende oorzaak.":
    "La capa de arriba se renueva más despacio que antes, así que quedan células que dispersan la luz en vez de reflejarla. Es la causa más frecuente.",
  "De vernieuwing weer op gang helpen, met een gezichtsbehandeling of een lichte peeling. Hier is het effect direct zichtbaar.":
    "Volver a poner en marcha la renovación, con un tratamiento facial o un peeling suave. Aquí el efecto se ve al momento.",
  "Dit zit in de bovenste laag van je huid en is te beïnvloeden. Bij dofheid is het effect vaak al bij de eerste behandeling te zien.":
    "Esto está en la capa superior de tu piel y se puede influir. En una piel apagada el efecto suele verse ya en el primer tratamiento.",
  "Is het vooral ongelijke kleur?": "¿Es sobre todo color desigual?",
  "Dan is dofheid het gevolg en pigment de oorzaak.":
    "Entonces el aspecto apagado es la consecuencia y el pigmento la causa.",
  "Een ongelijke tint leest je oog als vermoeid, ook zonder dat er ergens een duidelijke vlek zit. Dat is met een gezichtsbehandeling niet op te lossen; daar hoort een pigmenttraject bij dat over maanden loopt.":
    "Tu ojo lee un tono desigual como cansancio, aunque no haya ninguna mancha clara. Eso no se resuelve con un tratamiento facial; con ello va un programa de pigmentación que dura meses.",
  "Naar pigmentvlekken": "A la pigmentación",
  "Bij dofheid is het effect vaak snel zichtbaar en houdt het een aantal weken aan. Daarom wordt deze behandeling vaak herhaald.":
    "En una piel apagada el efecto suele verse rápido y dura unas cuantas semanas. Por eso este tratamiento se repite a menudo.",
  "Eerst uitzoeken of het om cellen, vocht, kleur of leefstijl gaat, want dat scheelt een traject":
    "Averiguar primero si va de células, de agua, de color o de estilo de vida, porque eso ahorra un tratamiento entero",
  "De vernieuwing op gang helpen met een peeling of microneedling, in een tempo dat je huid aankan":
    "Poner en marcha la renovación con un peeling o microneedling, a un ritmo que tu piel aguante",
  "Eerlijk zeggen dat het effect van een gezichtsbehandeling op dofheid vaak tijdelijk is":
    "Decir con honestidad que el efecto de un tratamiento facial sobre el aspecto apagado suele ser temporal",
  "Zonbescherming, want ongelijke kleur is de traagste van de vier om terug te draaien":
    "Protección solar, porque el color desigual es el más lento de los cuatro en revertirse",
  "Benoemen wanneer slaap en water meer opleveren dan wat wij kunnen doen":
    "Señalar cuándo el sueño y el agua dan más que lo que podemos hacer nosotros",
  "Dagelijks scrubben. Je haalt de barrière weg, en een beschadigde barrière oogt doffer":
    "Exfoliar a diario. Quitas la barrera, y una barrera dañada se ve más apagada",
  "Een lang traject starten terwijl een aanpassing in verzorging of gewoonten voldoende kan zijn":
    "Empezar un programa largo cuando un ajuste en el cuidado o en los hábitos puede bastar",
  "Een vette huid uitdrogen om hem minder dof te maken. Die reageert met meer talg":
    "Resecar una piel grasa para que se vea menos apagada. Esa responde con más sebo",
  "Beloven dat glans blijft. Een gezichtsbehandeling geeft direct effect en dat effect zakt weer":
    "Prometer que el brillo se queda. Un tratamiento facial da un efecto inmediato y ese efecto vuelve a bajar",
  "Steeds sterker peelen omdat het vorige effect wegtrok":
    "Hacer peelings cada vez más fuertes porque el efecto anterior se fue",
  "Glans is te meten.": "El brillo se puede medir.",
  "Dat klinkt vreemd bij een klacht die geen vakterm heeft, en het is waarom het hier nuttig is: dof is een indruk, en indrukken schuiven mee met je humeur en het licht in de kamer. De EVE-M legt vast hoe je huid het licht terugkaatst, onder vast licht en vanuit een vaste hoek.":
    "Suena raro en un problema que no tiene término médico, y es justo por eso que aquí resulta útil: apagado es una impresión, y las impresiones se mueven con tu ánimo y con la luz de la habitación. El EVE-M registra cómo devuelve la luz tu piel, con luz fija y desde un ángulo fijo.",
  "Daarmee is na een reeks te zien of er werkelijk iets is veranderd of dat je een goede week had. Bij dit huidprobleem is dat verschil groter dan bij welk ander ook.":
    "Así, después de una serie, se puede ver si de verdad ha cambiado algo o si tuviste una buena semana. En este problema esa diferencia es mayor que en ningún otro.",
  "Hoe glad het oppervlak is, want daar begint de glans":
    "Cómo de lisa es la superficie, porque ahí empieza el brillo",
  "Wat de bovenste laag vasthoudt": "Lo que retiene la capa superior",
  Gelijkmatigheid: "Uniformidad",
  "Hoe egaal de kleur is over het hele vlak":
    "Cómo de uniforme es el color en toda la superficie",
  "Oxygeneo glow": "OxyGeneo glow",
  "Exfoliëren en zuurstof in de huid brengen, in één behandeling.":
    "Exfoliar y llevar oxígeno a la piel, en un solo tratamiento.",
  "OxyGeneo in Rotterdam": "OxyGeneo en Rotterdam",
  "SupErficial laserpeel": "Peeling láser SupErficial",
  "Een oppervlakkige laserpeeling voor een gladdere huid en meer glans.":
    "Un peeling láser superficial para una piel más lisa y con más brillo.",
  "Full Face Brushing": "Full Face Brushing",
  "Een lichte laserpas over het hele gezicht. Frisser vel zonder dat je eruit ligt.":
    "Una pasada suave de láser por toda la cara. Piel más fresca sin tener que quedarte en casa.",
  "Waarom ziet mijn huid er 's ochtends doffer uit?":
    "¿Por qué mi piel se ve más apagada por la mañana?",
  "In je slaap verlies je vocht via je huid en ligt de doorbloeding lager. In de loop van de ochtend trekt dat bij. Blijft het de hele dag, dan zit het niet in je nacht maar in je hoornlaag.":
    "Mientras duermes pierdes agua por la piel y el riego va más bajo. A lo largo de la mañana eso se recupera. Si se queda todo el día, no está en tu noche sino en tu capa córnea.",
  "Hoe lang blijft het effect van een gezichtsbehandeling?":
    "¿Cuánto dura el efecto de un tratamiento facial?",
  "Bij dofheid is het effect vaak direct zichtbaar en meestal een aantal weken merkbaar. Dat is geen tekortkoming zolang je het weet: eens in de zoveel weken glans kopen is een legitieme keuze. Het wordt pas een probleem als je denkt een oorzaak te behandelen.":
    "En una piel apagada el efecto suele verse al momento y notarse unas cuantas semanas. Eso no es un defecto mientras lo sepas: comprar brillo cada cierto número de semanas es una elección legítima. Solo se convierte en un problema cuando crees que estás tratando una causa.",
  "Helpt meer water drinken?": "¿Ayuda beber más agua?",
  "Als je structureel te weinig drinkt, ja. Boven een normale inname niet: extra water maakt je huid niet extra vochtig. Wat wel scheelt is wat je huid vasthoudt, en daar is met verzorging meer aan te doen dan met een fles.":
    "Si bebes poco de forma habitual, sí. Por encima de una ingesta normal, no: más agua no hace tu piel más hidratada. Lo que sí cambia es lo que tu piel retiene, y para eso hace más el cuidado que una botella.",
  "Is dof hetzelfde als droog?": "¿Apagada es lo mismo que seca?",
  "Nee. Droog gaat over te weinig vet, uitgedroogd over te weinig water, en dof over hoe je huid licht terugkaatst. Je kunt een vette huid hebben die dof is. Op de pagina over een droge huid staat dat onderscheid uitgewerkt.":
    "No. Seca va de poca grasa, deshidratada de poca agua, y apagada de cómo devuelve la luz tu piel. Puedes tener una piel grasa que esté apagada. En la página sobre la piel seca esa distinción está desarrollada.",
  "Uitzoeken welke van": "Averiguar cuál de",
  "de vier het bij jou is": "las cuatro es la tuya",
  "In het huidconsult zoeken we uit welke van de vier het bij jou is. Blijkt het vooral je nachten te zijn, dan hoor je dat, en dan is er niets te boeken.":
    "En la consulta de la piel averiguamos cuál de las cuatro es la tuya. Si resulta que son sobre todo tus noches, te lo decimos, y entonces no hay nada que reservar.",
  "Een droge of": "Una piel seca o",
  "vochtarme huid": "deshidratada",
  "Een droge huid maakt te weinig vet aan, een vochtarme huid houdt te weinig water vast. Dat zijn twee verschillende dingen, en je kunt ze allebei tegelijk hebben.":
    "Una piel seca produce poca grasa; una piel deshidratada retiene poca agua. Son dos cosas distintas, y puedes tener las dos a la vez.",
  "We behandelen beide met hydraterende behandelingen en een verzorgingsschema. Tijdens de intake stellen we vast welke van de twee bij jou speelt.":
    "Tratamos las dos con tratamientos hidratantes y una pauta de cuidado. Durante la primera consulta determinamos cuál de las dos es la tuya.",
  "Waar zit jij": "Dónde estás tú",
  "Wat mensen verwarren": "Lo que la gente confunde",
  "Twee assen": "Dos ejes",
  "Vet en": "Grasa y",
  vocht: "agua",
  "Vet en vocht zijn twee losse assen. De huidtherapeut beoordeelt ze allebei, want een vette huid kan tegelijk vochtarm zijn.":
    "La grasa y el agua son dos ejes separados. La terapeuta de piel valora los dos, porque una piel grasa puede estar deshidratada al mismo tiempo.",
  "Genoeg water": "Agua suficiente",
  "Genoeg vet": "Grasa suficiente",
  "In balans": "En equilibrio",
  Droog: "Seca",
  Uitgedroogd: "Deshidratada",
  "Droog én uitgedroogd": "Seca y deshidratada",
  "Weinig vet": "Poca grasa",
  "Weinig water": "Poca agua",
  Vet: "Grasa",
  "Deze as gaat over wat je huid zelf aanmaakt. Dat is grotendeels aanleg en verandert traag.":
    "Este eje va de lo que tu piel produce por sí misma. Eso es en gran parte predisposición y cambia despacio.",
  Water: "Agua",
  "Deze as gaat over hoeveel vocht er in de bovenste laag zit. Dat wisselt met het seizoen, met je routine en met hoe vaak je wast.":
    "Este eje va de cuánta agua hay en la capa superior. Eso cambia con la estación, con tu rutina y con la frecuencia con que te lavas.",
  "gestoorde barrièrefunctie": "función barrera alterada",
  "Hoe je dit herkent": "Cómo reconoces esto",
  "Ruw én trekkerig, snel rood, en je verdraagt steeds minder producten dan vroeger.":
    "Áspera y tirante a la vez, se pone roja enseguida, y cada vez toleras menos productos que antes.",
  "De barrière lekt water én mist het vet om dat tegen te houden. Vaak is er een aanjager: koud weer, te warm douchen, of een routine die te stevig is geworden.":
    "La barrera pierde agua y le falta la grasa para retenerla. Suele haber un detonante: frío, ducharse demasiado caliente, o una rutina que se ha vuelto demasiado dura.",
  "Wat er dan moet gebeuren": "Lo que hay que hacer entonces",
  "Hier levert weglaten meer op dan toevoegen. Je routine kleiner maken kost je niets en geeft de barrière de ruimte om zich te herstellen.":
    "Aquí quitar da más que añadir. Reducir tu rutina no te cuesta nada y le da a la barrera espacio para repararse.",
  "Laat meten waar je echt zit": "Deja que lo midamos",
  "Twijfel je tussen twee vakken? Kijk naar het seizoen. De wateras beweegt mee met de winter, de vetas nauwelijks.":
    "¿Dudas entre dos casillas? Mira la estación. El eje del agua se mueve con el invierno, el de la grasa casi nada.",
  "Drie misverstanden": "Tres malentendidos",
  "Dit horen we": "Esto es lo que oímos",
  "het vaakst.": "más a menudo.",
  "Alle drie komen ze voort uit het idee dat vet en vocht op één schaal liggen. Dat is niet zo.":
    "Los tres nacen de la idea de que la grasa y el agua están en una sola escala. No es así.",
  "Mijn huid glimt én trekt. Kan dat?":
    "Mi piel brilla y a la vez tira. ¿Es posible?",
  "Ja, en daarom deze twee assen los van elkaar staan. Een vette huid kan uitgedroogd zijn. Wie dan een matterende reiniger pakt, maakt het erger.":
    "Sí, y por eso estos dos ejes van separados. Una piel grasa puede estar deshidratada. Quien entonces coge un limpiador matificante lo empeora.",
  "Het is 's winters veel erger. Is mijn huidtype veranderd?":
    "En invierno está mucho peor. ¿Ha cambiado mi tipo de piel?",
  "Nee. Je zakt op de wateras. Koude lucht houdt minder vocht vast en binnen staat de verwarming aan, en dat samen droogt uit. In het voorjaar schuif je vanzelf terug.":
    "No. Estás bajando en el eje del agua. El aire frío retiene menos humedad y dentro está la calefacción puesta, y eso junto reseca. En primavera vuelves a subir sola.",
  "Ik gebruik al jaren een rijke crème en het helpt niet.":
    "Llevo años usando una crema rica y no ayuda.",
  "Dan zit je waarschijnlijk in het uitgedroogde kwadrant en niet in het droge. Vet erop smeren houdt water vast dat er niet is.":
    "Entonces seguramente estás en el cuadrante de la deshidratada y no en el de la seca. Ponerte grasa encima retiene un agua que no está.",
  "Verdraagt je huid steeds minder producten en wordt hij snel rood? Dan is een droge huid vaak het gevolg en niet de oorzaak, en begint het verhaal ergens anders.":
    "¿Tu piel tolera cada vez menos productos y se pone roja enseguida? Entonces la piel seca suele ser la consecuencia y no la causa, y la historia empieza en otro sitio.",
  "Naar de gevoelige huid": "A la piel sensible",
  "Meer producten gebruiken omdat het niet beter wordt, richt de meeste schade aan.":
    "Usar más productos porque no mejora es lo que más daño hace.",
  "Weten in welk kwadrant je zit voordat je iets koopt. Dat scheelt jaren aan producten die het verkeerde probleem oplossen.":
    "Saber en qué cuadrante estás antes de comprar nada. Eso ahorra años de productos que resuelven el problema equivocado.",
  "Douche kort en met lauw water, omdat heet water de huid verder kan uitdrogen.":
    "Dúchate corto y con agua templada, porque el agua caliente puede resecar más la piel.",
  "Reinigen dat je huid niet piepschoon achterlaat. Piepschoon betekent dat er ook vet weg is dat je nodig had.":
    "Una limpieza que no te deje la piel chirriando. Chirriar significa que también se ha ido grasa que necesitabas.",
  "Bij twijfel afbouwen: alles weg behalve reinigen en één verzorgend product, twee weken lang. Dan zie je wat het echt is.":
    "Si dudas, reduce: fuera todo excepto la limpieza y un producto de cuidado, durante dos semanas. Entonces ves qué es de verdad.",
  "Accepteren dat de vetas grotendeels aanleg is en dat de wateras wél te sturen valt.":
    "Aceptar que el eje de la grasa es en gran parte predisposición y que el eje del agua sí se puede dirigir.",
  "Meer actieve stoffen stapelen omdat het niet beter wordt. Dat is bij een lekkende barrière de snelste weg naar erger.":
    "Apilar más activos porque no mejora. Con una barrera que pierde agua, esa es la vía más rápida a peor.",
  "Scrubben tegen schilfers. Je haalt het laagje weg dat het water nog binnenhield.":
    "Exfoliar contra la descamación. Quitas la capita que todavía retenía el agua.",
  "Elke week iets nieuws proberen. Een huid heeft weken nodig, dus je meet steeds het vorige product.":
    "Probar algo nuevo cada semana. Una piel necesita semanas, así que siempre estás midiendo el producto anterior.",
  "Water drinken als oplossing zien voor een uitgedroogde huid. Het helpt je lichaam, het vult de bovenste huidlaag niet aan.":
    "Ver el beber agua como la solución para una piel deshidratada. Ayuda a tu cuerpo; no rellena la capa superior de la piel.",
  "Een behandeling boeken terwijl je barrière kapot is. Dan reageert je huid feller en levert dezelfde behandeling minder op.":
    "Reservar un tratamiento con la barrera estropeada. Tu piel reacciona entonces con más fuerza y el mismo tratamiento da menos.",
  "Twee assen, dus twee metingen.": "Dos ejes, así que dos mediciones.",
  "Je huid voelt de ene dag anders dan de andere, en daarom is een gevoel geen goed beginpunt. We meten daarom allebei de assen los van elkaar in plaats van te vragen of je huid droog aanvoelt.":
    "Tu piel se nota distinta de un día para otro, y por eso una sensación no es un buen punto de partida. Por eso medimos los dos ejes por separado en vez de preguntarte si notas la piel seca.",
  "Dat maakt ook zichtbaar welke as beweegt zodra je iets verandert. Meestal is dat de wateras binnen enkele weken, en dat vertelt je meteen waar je zat.":
    "Eso también hace visible qué eje se mueve en cuanto cambias algo. Normalmente es el eje del agua en pocas semanas, y eso te dice enseguida dónde estabas.",
  "Hoeveel de huid zelf aanmaakt": "Cuánto produce la piel por sí misma",
  "Hoeveel vocht er in de bovenste laag zit":
    "Cuánta agua hay en la capa superior",
  Lekkage: "Pérdida",
  "Hoe snel dat vocht weer verdwijnt": "Con qué rapidez vuelve a irse esa agua",
  "Wat is nou het verschil tussen droog en uitgedroogd?":
    "¿Cuál es entonces la diferencia entre seca y deshidratada?",
  "Droog gaat over vet en is grotendeels aanleg. Uitgedroogd gaat over water en is een toestand die komt en gaat. Ze voelen allebei ongemakkelijk en vragen het tegenovergestelde, en dat is de reden dat mensen jarenlang het verkeerde kopen.":
    "Seca va de grasa y es en gran parte predisposición. Deshidratada va de agua y es un estado que va y viene. Las dos se notan incómodas y piden lo contrario, y por eso la gente compra lo que no es durante años.",
  "Helpt veel water drinken?": "¿Ayuda beber mucha agua?",
  "Voor je lichaam wel, voor de bovenste huidlaag nauwelijks. Die haalt zijn vocht vooral uit wat je erop doet en uit hoe goed je barrière lekkage tegenhoudt.":
    "Para tu cuerpo sí, para la capa superior de la piel casi nada. Esa saca su agua sobre todo de lo que te pones encima y de lo bien que tu barrera frena la pérdida.",
  "Ik heb ook rode plekjes en jeuk. Hoort dat hierbij?":
    "También tengo manchitas rojas y picor. ¿Entra en esto?",
  "Kan, maar bij aanhoudende jeuk, kloofjes of plekken die niet weggaan hoort een huisarts mee te kijken. Dan kan het eczeem zijn, en dat vraagt iets anders dan een droge huid.":
    "Puede ser, pero con picor persistente, grietas o zonas que no se van, un médico de cabecera debería echar un vistazo. Podría ser eccema, y eso pide otra cosa que una piel seca.",
  "Hoe snel merk ik verschil?": "¿Cuándo noto la diferencia?",
  "Op de wateras vaak binnen twee weken, op de vetas veel langzamer omdat je daar tegen je aanleg in werkt. Reken op zes tot acht weken voordat je op die tweede as iets vaststelt. Dat verschil in tempo is meteen de beste test van waar je zat.":
    "En el eje del agua a menudo en dos semanas; en el de la grasa mucho más despacio, porque ahí trabajas contra tu predisposición. Cuenta con seis a ocho semanas antes de poder decir algo sobre ese segundo eje. Esa diferencia de ritmo es en sí la mejor prueba de dónde estabas.",
  "De meting kost vijftig euro en dat is meteen het hele consult. Wat er daarna volgt hangt af van wat eruit komt en staat per behandeling op de tarievenpagina. Blijkt uit de meting dat je in balans zit, dan is ons advies om niets te doen en houdt het daar op.":
    "La medición cuesta cincuenta euros y esa es la consulta entera. Lo que venga después depende de lo que salga y está por tratamiento en la página de precios. Si de la medición sale que estás en equilibrio, nuestro consejo es no hacer nada y ahí se queda.",
  "in welk vak je zit.": "en qué casilla estás.",
  "We meten vet en water apart, en vertellen je welke as bij jou beweegt. Zit je in balans, dan is ons advies om niets te doen en houdt het daar op.":
    "Medimos la grasa y el agua por separado, y te decimos qué eje se mueve en tu caso. Si estás en equilibrio, nuestro consejo es no hacer nada y ahí se queda.",
  "Mee-eters en": "Puntos negros y",
  "een onzuivere huid": "una piel con imperfecciones",
  "Mee-eters en verstopte poriën behandelen we met een HydraFacial, peelings en gerichte verzorging. Zo maken we de poriën leeg en houden we ze rustiger.":
    "Los puntos negros y los poros obstruidos los tratamos con un HydraFacial, peelings y cuidados dirigidos. Así vaciamos los poros y los mantenemos más tranquilos.",
  "Tijdens de intake kijken we mee onder vergroting en stellen we vast om welk type onzuiverheid het gaat.":
    "Durante la primera consulta miramos contigo con lupa y determinamos de qué tipo de imperfección se trata.",
  "De huidtherapeut kijkt onder vergroting naar je poriën en beoordeelt of het om normale porie-inhoud gaat of om echte mee-eters.":
    "La terapeuta de piel mira tus poros con lupa y valora si es contenido normal del poro o son puntos negros de verdad.",
  "Het licht van opzij": "La luz de lado",
  "De huidtherapeut beoordeelt je huid met licht dat van opzij valt. Recht licht verbergt oneffenheden, licht van opzij laat ze juist zien.":
    "La terapeuta de piel valora tu piel con luz que cae de lado. La luz frontal esconde las irregularidades; la luz de lado las enseña.",
  "De verdeling over je huid": "Cómo están repartidos por tu piel",
  "Zit er in vrijwel elke porie een grijs stipje, dan is dat normale porie-inhoud. Zitten ze verspreid en donkerder, dan zijn het mee-eters.":
    "Si casi cada poro tiene un puntito gris, eso es contenido normal del poro. Si están repartidos y más oscuros, son puntos negros.",
  "Wat je voelt maar niet ziet": "Lo que notas pero no ves",
  "Hobbeltjes op je voorhoofd en kaaklijn die je wel voelt maar niet ziet, zijn gesloten poriën. Die vragen een andere aanpak.":
    "Los bultitos en la frente y en la mandíbula que notas pero no ves son poros cerrados. Esos piden otro enfoque.",
  "Wat er in een porie": "Lo que puede haber",
  "kan zitten": "dentro de un poro",
  "Verstopte poriën, mee-eters en onzuiverheden lopen in de volksmond door elkaar. Het verschil bepaalt welke behandeling werkt.":
    "En el lenguaje corriente, los poros obstruidos, los puntos negros y las imperfecciones se mezclan. La diferencia decide qué tratamiento funciona.",
  "Grijze puntjes op je neus": "Puntitos grises en la nariz",
  "Kleine grijze stipjes in bijna elke porie van je neus":
    "Puntitos grises pequeños en casi cada poro de la nariz",
  "Zwarte puntjes": "Puntos negros",
  "Losse donkere stipjes die er echt in vast lijken te zitten":
    "Puntitos oscuros sueltos que parecen de verdad incrustados",
  "Bultjes zonder kopje": "Bultitos sin punta",
  "Kleine oneffenheden die je meer voelt dan ziet, vaak op je voorhoofd":
    "Pequeñas irregularidades que notas más de lo que ves, a menudo en la frente",
  "Rode, ontstoken plekjes": "Zonas rojas e inflamadas",
  "Puistjes die pijn doen en rood zijn, en die blijven terugkomen":
    "Granos que duelen y están rojos, y que siguen volviendo",
  talgfilamenten: "filamentos sebáceos",
  "Zit het gelijkmatig verdeeld over vrijwel elke porie, in plaats van hier en daar? En komt er bij zachte druk een kort, lichtgrijs draadje uit?":
    "¿Está repartido de forma uniforme por casi cada poro, y no aquí y allá? ¿Y al presionar suave sale un hilillo corto y gris claro?",
  "Geen mee-eter maar de normale inhoud van een werkende porie: talg met wat cellen. Iedereen heeft ze, en ze zijn binnen weken terug omdat ze horen terug te komen.":
    "No es un punto negro sino el contenido normal de un poro que funciona: sebo con algunas células. Todo el mundo los tiene, y vuelven en unas semanas porque tienen que volver.",
  "Hier zeggen we vooral wat je moet laten. Ze zijn tijdelijk minder zichtbaar te maken, niet weg te halen, en dat verschil scheelt mensen jaren vechten.":
    "Aquí sobre todo te decimos qué debes dejar en paz. Se pueden hacer menos visibles un tiempo, no quitar, y esa diferencia le ahorra a la gente años de pelea.",
  "Hier begint het ergens anders": "Aquí empieza en otro sitio",
  "Dit is normale huid, of het gaat al over acne. In het eerste geval valt er niets te behandelen; in het tweede hoort er een ander traject bij.":
    "Esto es piel normal, o ya va de acné. En el primer caso no hay nada que tratar; en el segundo va otro programa con ello.",
  "Komen er ontstoken plekken bij?": "¿Salen zonas inflamadas?",
  "Dan gaat het niet meer om onzuiverheden.":
    "Entonces ya no va de imperfecciones.",
  "Regelmatig rode, pijnlijke puistjes die vlekjes achterlaten is acne, en dat vraagt om een andere aanpak en een andere volgorde dan het ontlasten van poriën.":
    "Tener con regularidad granos rojos y dolorosos que dejan marcas es acné, y eso pide otro enfoque y otro orden que el de despejar poros.",
  "De winst zit hier vaker in wat je stopt dan in wat je erbij doet. Strenger reinigen levert bij een verstopte porie meestal niets op.":
    "Aquí lo que se gana está más veces en lo que dejas de hacer que en lo que añades. Con un poro obstruido, limpiar más fuerte no suele dar nada.",
  "Eerst het onderscheid maken tussen normale talgfilamenten en echte verstopte poriën":
    "Distinguir primero entre los filamentos sebáceos normales y los poros de verdad obstruidos",
  "De bovenlaag geleidelijk laten vernieuwen zodat volle poriën weer opengaan":
    "Dejar que la capa superior se renueve poco a poco para que los poros llenos se vuelvan a abrir",
  "Kijken wat je nu gebruikt, want een paar veelgebruikte producten houden het beeld in stand":
    "Mirar qué usas ahora, porque unos cuantos productos muy corrientes mantienen el cuadro",
  "Meewegen dat een vette huid niet uitgedroogd hoort te worden; die maakt dan méér talg":
    "Tener en cuenta que una piel grasa no debe resecarse; entonces produce más sebo",
  "Doorsturen naar het acnetraject zodra er structureel ontsteking bij zit":
    "Derivar al programa de acné en cuanto hay inflamación de forma estructural",
  "Poriestrips en zuigapparaten. Ze halen talgfilamenten weg die binnen weken terug zijn, en rekken intussen de porie op":
    "Las tiras de poros y los aparatos de succión. Sacan filamentos sebáceos que vuelven en semanas, y mientras tanto dilatan el poro",
  "Dagelijks scrubben. Je haalt de barrière weg en de huid reageert met meer talg":
    "Exfoliar a diario. Quitas la barrera y la piel responde con más sebo",
  "Alcoholtoners die je huid laten trekken. Een uitgedroogde huid maakt meer talg, niet minder":
    "Tónicos con alcohol que dejan la piel tirante. Una piel deshidratada produce más sebo, no menos",
  "Zelf uitknijpen. Een gesloten porie wordt zo een ontsteking, en een ontsteking wordt zo een vlek":
    "Apretarte los poros. Así un poro cerrado se convierte en una inflamación, y una inflamación en una mancha",
  "Beloven dat poriën kleiner worden. Ze kunnen leeg zijn en daardoor minder opvallen; hun formaat ligt vast":
    "Prometer que los poros se hacen más pequeños. Pueden estar vacíos y llamar menos la atención; su tamaño es fijo",
  "Deze komen uit Salonized en zijn niet door ons uitgezocht op inhoud: het zijn de reviews waarin onzuiverheden, puistjes of acne voorkomen.":
    "Estas vienen de Salonized y no las hemos elegido nosotros por su contenido: son las reseñas en las que aparecen imperfecciones, granos o acné.",
  "Waarom komen mee-eters op mijn neus altijd terug?":
    "¿Por qué los puntos negros de la nariz siempre vuelven?",
  "Omdat het in de meeste gevallen geen mee-eters zijn maar talgfilamenten. Die horen in een werkende porie thuis en vullen zich binnen enkele weken opnieuw. Dat is geen falen van je verzorging; het is hoe een porie werkt.":
    "Porque en la mayoría de los casos no son puntos negros sino filamentos sebáceos. Esos pertenecen a un poro que funciona y se vuelven a llenar en pocas semanas. No es un fallo de tu cuidado; es cómo funciona un poro.",
  "Werken poriestrips?": "¿Funcionan las tiras de poros?",
  "Ze halen er iets uit, en dat voelt bevredigend. Wat eruit komt is meestal normale porie-inhoud, die terugkomt, en het lostrekken rekt de porie-opening op. Dus: kortstondig zichtbaar effect, op de lange duur geen winst.":
    "Sacan algo, y eso da satisfacción. Lo que sale suele ser contenido normal del poro, que vuelve, y arrancarlo dilata la abertura. O sea: efecto visible y breve, ninguna ganancia a la larga.",
  "Is een onzuivere huid hetzelfde als acne?":
    "¿Una piel con imperfecciones es lo mismo que el acné?",
  "Nee, en dat onderscheid is niet cosmetisch. Bij onzuiverheden gaat het om verstopping zonder veel ontsteking; bij acne is de ontsteking het probleem. De aanpak en de volgorde zijn anders.":
    "No, y esa distinción no es cosmética. En las imperfecciones se trata de obstrucción sin mucha inflamación; en el acné el problema es la inflamación. El enfoque y el orden son distintos.",
  "Moet ik mijn huid strenger reinigen?":
    "¿Tengo que limpiarme la piel más a fondo?",
  "Bijna nooit. Wie een vette huid streng behandelt houdt een uitgedroogde huid over die meer talg maakt, en dan is het beeld na een maand slechter in plaats van beter.":
    "Casi nunca. Quien trata una piel grasa con dureza se queda con una piel deshidratada que produce más sebo, y entonces al cabo de un mes el cuadro está peor en vez de mejor.",
  "In het huidconsult kijken we onder vergroting mee. Blijkt het grotendeels normale porie-inhoud, dan hoor je dat, en dan is er niets te boeken.":
    "En la consulta de la piel miramos contigo con lupa. Si resulta que es en gran parte contenido normal del poro, te lo decimos, y entonces no hay nada que reservar.",
  "Grote poriën": "Poros dilatados",
  "in je gezicht": "en tu cara",
  "De doorsnede van een porie ligt vast in je aanleg, maar hoe opvallend ze zijn hangt af van de huid eromheen. Daar valt veel aan te doen.":
    "El diámetro de un poro viene fijado por tu constitución, pero lo mucho que se noten depende de la piel de alrededor. Sobre eso sí hay mucho que hacer.",
  "Met peelings, microneedling en een HydraFacial maken we de poriën leeg en de huid eromheen gladder. Samen zorgt dat ervoor dat ze een stuk minder opvallen.":
    "Con peelings, microneedling y un HydraFacial vaciamos los poros y alisamos la piel de alrededor. Juntas, esas dos cosas hacen que se noten bastante menos.",
  "Zet de drie knoppen aan": "Enciende los tres mandos",
  "Wat kun je veranderen": "Qué puedes cambiar",
  "Wat het bepaalt": "Qué lo decide",
  "poriën zichtbaar maken": "hacen visible un poro",
  "Drie dingen bepalen hoe zichtbaar een porie is, en die zijn alle drie te beïnvloeden met behandeling en verzorging.":
    "Tres cosas deciden cómo de visible es un poro, y las tres se pueden influir con tratamiento y cuidado.",
  "Let op wat er níet gebeurt: geen enkele opening wordt kleiner. Ze zijn in elke stand precies even groot.":
    "Fíjate en lo que no pasa: ninguna abertura se hace más pequeña. Son exactamente igual de grandes en cualquier posición.",
  "Wat je wel kunt veranderen": "Lo que sí puedes cambiar",
  "Inhoud eruit": "Vaciar el contenido",
  "Een gevulde porie leest als een donkere stip en lijkt daardoor groter.":
    "Un poro lleno se lee como un punto oscuro y por eso parece más grande.",
  "Huid eromheen steviger": "Piel de alrededor más firme",
  "Bij minder stevige huid zakt de opening uit tot een druppelvorm, vooral op de wangen.":
    "Con una piel menos firme, la abertura se descuelga hasta una forma de gota, sobre todo en las mejillas.",
  "Minder glans erop": "Menos brillo encima",
  "Een glanzend oppervlak zet elke porierand aan met een schaduwtje.":
    "Una superficie brillante subraya el borde de cada poro con una sombrita.",
  "Porie kleiner maken": "Hacer el poro más pequeño",
  "Deze schakelaar doet het niet. Druk erop als je wilt weten waarom.":
    "Este interruptor no funciona. Púlsalo si quieres saber por qué.",
  "0 van 3 aangepakt": "0 de 3 resueltos",
  "Zo ziet het eruit zonder iets": "Así se ve sin ninguno de ellos",
  "Gevuld, uitgerekt en glanzend. Dit is het beeld waarmee mensen naar binnen lopen en waarvan ze denken dat de porie zelf te groot is.":
    "Lleno, dilatado y brillante. Este es el cuadro con el que la gente entra por la puerta, pensando que el poro en sí es demasiado grande.",
  beelden: "cuadros",
  "Het vierde beeld wordt het vaakst verward met grote poriën, en dat kost mensen sessies aan de verkeerde behandeling.":
    "El cuarto cuadro es el que más se confunde con los poros dilatados, y eso le cuesta a la gente sesiones del tratamiento equivocado.",
  "Kleine donkere stipjes, vooral op de neus":
    "Puntitos oscuros pequeños, sobre todo en la nariz",
  "Kleine witte bultjes": "Bultitos blancos pequeños",
  "Bultjes onder de huid die je vooral voelt":
    "Bultitos bajo la piel que sobre todo notas",
  "Zichtbaar wijde poriën": "Poros visiblemente anchos",
  "Poriën die je van dichtbij duidelijk ziet, zonder dat er iets in zit":
    "Poros que ves claramente de cerca, sin que haya nada dentro",
  "Kuiltjes die op poriën lijken": "Hoyitos que parecen poros",
  "Putjes die je vooral bij zijlicht ziet":
    "Marcas hundidas que ves sobre todo con luz lateral",
  "open comedonen": "comedones abiertos",
  "Donkere puntjes in de poriën van neus, kin en soms het voorhoofd. Ze komen terug nadat je ze weghaalt.":
    "Puntitos oscuros en los poros de la nariz, la barbilla y a veces la frente. Vuelven después de que los quites.",
  "Een porie gevuld met talg en dode huidcellen. De donkere kleur is geen vuil maar oxidatie: het bovenste laagje kleurt in contact met lucht.":
    "Un poro lleno de sebo y células muertas. El color oscuro no es suciedad sino oxidación: la capita de arriba cambia de color en contacto con el aire.",
  "Leegmaken helpt zichtbaar, maar de porie vult zich weer. Het gaat er dus om hoe snel dat gaat, niet of het gebeurt.":
    "Vaciarlos se nota, pero el poro se vuelve a llenar. Así que se trata de con qué rapidez pasa eso, no de si pasa.",
  "Dit is geen vuil en het komt niet doordat je je gezicht niet goed wast. Harder schrobben maakt het meestal erger.":
    "Esto no es suciedad y no viene de lavarte mal la cara. Frotar más fuerte suele empeorarlo.",
  "Heb je er ook rode, ontstoken plekjes bij? Dan begint het verhaal daar, want werken aan poriën in een ontstoken huid is dweilen met de kraan open.":
    "¿Tienes además zonas rojas e inflamadas? Entonces la historia empieza ahí, porque trabajar los poros en una piel inflamada es achicar agua con el grifo puesto.",
  "Vier van deze gewoontes doen mensen thuis in de overtuiging dat ze helpen. Ermee stoppen kost niets en scheelt vaak het meest.":
    "Cuatro de estas costumbres las hace la gente en casa convencida de que ayudan. Dejarlas no cuesta nada y muchas veces es lo que más cambia.",
  "Accepteren dat de doorsnede vastligt en sturen op wat er wél verandert. Dat scheelt zichtbaar veel en spaart je een reeks teleurstellingen.":
    "Aceptar que el diámetro es fijo y apuntar a lo que sí cambia. Eso se nota bastante y te ahorra una ristra de decepciones.",
  "Consequent en mild reinigen. Twee keer per dag rustig werkt beter dan één keer per week grondig.":
    "Limpiar de forma constante y suave. Dos veces al día con calma funciona mejor que una vez por semana a fondo.",
  "Werken aan de stevigheid van de huid rondom, want die bepaalt de vorm van de opening.":
    "Trabajar la firmeza de la piel de alrededor, porque esa decide la forma de la abertura.",
  "Weten of je naar poriën kijkt of naar kuiltjes. Dat verschil bepaalt de hele aanpak.":
    "Saber si estás mirando poros o hoyitos. Esa diferencia decide todo el enfoque.",
  "Foto's onder hetzelfde licht vergelijken. Poriën zien er onder licht van opzij altijd erger uit.":
    "Comparar fotos con la misma luz. Los poros siempre se ven peor con luz de lado.",
  "Uitknijpen. Je maakt de opening wijder en de kans op een vlekje of littekentje groter.":
    "Apretarlos. Ensanchas la abertura y aumentas el riesgo de una mancha o una cicatriz pequeña.",
  "Stomen om poriën te openen. Ze hebben geen spier en gaan dus nergens open.":
    "Poner vapor para abrir los poros. No tienen músculo, así que no se abren en ningún sitio.",
  "Poriënstrips als vaste gewoonte. Je trekt het bovenste laagje mee en de porie vult zich gewoon weer.":
    "Las tiras de poros como costumbre fija. Te llevas la capita de arriba y el poro se vuelve a llenar igual.",
  "Sterk uitdrogende producten stapelen. Een uitgedroogde huid maakt meestal juist meer talg aan.":
    "Apilar productos que resecan mucho. Una piel deshidratada suele producir justo más sebo.",
  "Een behandeling boeken op belofte van kleinere poriën. Vraag wat er dan precies verandert.":
    "Reservar un tratamiento por la promesa de poros más pequeños. Pregunta qué cambia exactamente entonces.",
  "Waarom we onder vast licht meten": "Por qué medimos con luz fija",
  "Poriën zijn het gevoeligst van alle onderwerpen voor hoe je ernaar kijkt. In licht dat van opzij valt en van dichtbij ziet iedereen ze, in gewoon daglicht bijna niemand. Zonder vaste opstelling meet je dus vooral je lamp.":
    "Los poros son, de todos los temas, el más sensible a cómo los miras. Con luz que cae de lado y de cerca los ve todo el mundo; con luz de día normal, casi nadie. Así que sin un montaje fijo estarías midiendo sobre todo tu lámpara.",
  "Daarom leggen we ze vast onder dezelfde belichting en op dezelfde afstand. Dan is een verschil later echt een verschil en geen ander moment van de dag.":
    "Por eso los registramos con la misma iluminación y a la misma distancia. Entonces una diferencia más adelante es de verdad una diferencia y no otro momento del día.",
  Zichtbaarheid: "Visibilidad",
  "Hoe sterk de openingen afsteken onder vast licht":
    "Cuánto destacan las aberturas con luz fija",
  Vulling: "Relleno",
  "Hoeveel poriën een donkere kern hebben":
    "Cuántos poros tienen un núcleo oscuro",
  Glans: "Brillo",
  "Hoeveel het oppervlak weerkaatst": "Cuánto refleja la superficie",
  "Kunnen mijn poriën echt niet kleiner?":
    "¿De verdad mis poros no pueden hacerse más pequeños?",
  "De opening zelf niet blijvend, nee. Dat hangt samen met de talgklier eronder en met je aanleg. Wat wel verandert is hoe zichtbaar ze zijn, en dat is uiteindelijk wat je in de spiegel ziet.":
    "La abertura en sí, de forma permanente, no. Eso va unido a la glándula sebácea de debajo y a tu constitución. Lo que sí cambia es cómo de visibles son, y al final eso es lo que ves en el espejo.",
  "Waarom komen zwarte puntjes steeds terug?":
    "¿Por qué vuelven siempre los puntos negros?",
  "Omdat de porie blijft doen wat hij hoort te doen: talg produceren. Leegmaken is dus onderhoud en geen oplossing. De vraag die telt is hoe snel het teruggaat, en daar valt wel iets aan te sturen.":
    "Porque el poro sigue haciendo lo que tiene que hacer: producir sebo. Vaciarlo es por tanto mantenimiento y no una solución. La pregunta que cuenta es con qué rapidez vuelve, y sobre eso sí se puede actuar.",
  "Helpt stomen?": "¿Ayuda el vapor?",
  "Niet om poriën te openen, want daar zit geen spiertje. Warmte maakt talg wel vloeibaarder, waardoor leegmaken makkelijker gaat. Dat is iets anders dan wat er meestal beloofd wordt.":
    "Para abrir los poros no, porque ahí no hay ningún músculo. El calor sí vuelve el sebo más líquido, con lo que vaciarlo resulta más fácil. Eso es otra cosa que lo que se suele prometer.",
  "Ik heb ook acne. Waar begin ik?": "También tengo acné. ¿Por dónde empiezo?",
  "Bij de acne. Zolang er ontsteking is, is werken aan poriën dweilen met de kraan open, en behandelen in een ontstoken huid geeft meer kans op littekens.":
    "Por el acné. Mientras haya inflamación, trabajar los poros es achicar agua con el grifo puesto, y tratar una piel inflamada aumenta el riesgo de cicatrices.",
  "Werken poriënstrips?": "¿Funcionan las tiras de poros?",
  "Voor even. Je trekt het bovenste stukje van de prop mee en het ziet er direct beter uit. De porie vult zich daarna gewoon weer, en bij vaak gebruik raakt de huid eromheen geïrriteerd.":
    "Un rato. Te llevas la parte de arriba del tapón y se ve mejor al momento. Después el poro se vuelve a llenar igual, y con el uso frecuente la piel de alrededor se irrita.",
  "Minder zichtbaar": "Menos visibles",
  "is wel te doen.": "sí es posible.",
  "We kijken onder vast licht waar je naar kijkt, of het poriën zijn of iets anders, en wat er in jouw geval realistisch aan te veranderen valt.":
    "Con luz fija miramos qué estás mirando, si son poros o es otra cosa, y qué se puede cambiar de forma realista en tu caso.",
  "Een huid die": "Una piel que",
  "snel reageert": "reacciona enseguida",
  "Een huid die snel reageert, heeft meestal een verzwakte huidbarrière. We brengen die tot rust met milde behandelingen en een verzorgingsschema dat je huid aankan.":
    "Una piel que reacciona enseguida suele tener la barrera debilitada. La calmamos con tratamientos suaves y una pauta de cuidado que tu piel aguante.",
  "Tijdens de intake lopen we je huidverzorging langs. Vaak zitten er meerdere prikkelende producten in die samen te veel worden.":
    "Durante la primera consulta repasamos tu rutina de cuidado. A menudo hay varios productos irritantes que juntos se vuelven demasiado.",
  "Wat staat er aan": "Qué tienes encendido",
  "Als het dat niet is": "Si no es eso",
  doornemen: "por repasar",
  "We lopen je verzorging langs. Elk product kan op zichzelf prima zijn; het gaat om wat er samen op dezelfde barrière werkt.":
    "Repasamos tu rutina. Cada producto puede estar bien por sí solo; lo que importa es lo que actúa junto sobre la misma barrera.",
  "Retinol of vitamine A": "Retinol o vitamina A",
  "Ook in lage sterkte en ook als het maar twee keer per week is":
    "También en dosis baja y aunque sea solo dos veces por semana",
  Fruitzuren: "Ácidos de frutas",
  "Glycolzuur, melkzuur, mandelzuur, vaak in een toner of serum":
    "Ácido glicólico, láctico o mandélico, muchas veces en un tónico o un sérum",
  Salicylzuur: "Ácido salicílico",
  "Zit vaak in producten tegen onzuiverheden":
    "Está a menudo en productos contra las imperfecciones",
  Benzoylperoxide: "Peróxido de benzoílo",
  "Tegen acne, op recept of van de drogist":
    "Contra el acné, con receta o de farmacia",
  "Vitamine C in zure vorm": "Vitamina C en forma ácida",
  "Meestal een serum voor de ochtend": "Normalmente un sérum de mañana",
  "Scrubben of een reinigingsborstel": "Exfoliar o usar un cepillo de limpieza",
  "Korrels, doekjes met structuur, of een apparaatje":
    "Granos, toallitas con textura, o un aparatito",
  "Toner met alcohol": "Tónico con alcohol",
  "Herkenbaar aan het frisse, koude gevoel direct erna":
    "Se reconoce por la sensación fresca y fría justo después",
  "Parfum in je verzorging": "Perfume en tu cuidado",
  "Staat als parfum of fragrance op de verpakking":
    "Aparece como parfum o fragrance en el envase",
  "Vaker dan twee keer per dag reinigen": "Limpiarte más de dos veces al día",
  "Sporten en dan nog eens wassen telt mee":
    "Hacer deporte y volver a lavarte cuenta también",
  "Heet douchen of stomen": "Ducharte muy caliente o darte vapor",
  "Ook een lange warme douche in de winter":
    "Una ducha larga y caliente en invierno cuenta también",
  "Wat er samen op je huid werkt": "Lo que actúa junto sobre tu piel",
  "Soms ligt de oorzaak niet in je huidverzorging":
    "A veces la causa no está en tu rutina de cuidado",
  "Wat je aankruist is op zichzelf niet veel. Als je huid tóch overal op reageert, dan zoeken we de oorzaak liever ergens anders dan in je badkamerkastje.":
    "Lo que has marcado no es mucho en sí. Si tu piel reacciona igualmente a todo, preferimos buscar la causa en otro sitio y no en el armario del baño.",
  "Kijk hieronder of een van de aandoeningen je bekend voorkomt. Zo ja, dan begint het verhaal daar en niet bij je producten.":
    "Mira abajo si alguna de las afecciones te suena. Si es así, la historia empieza ahí y no en tus productos.",
  "Kijk dan hieronder verder": "Entonces sigue leyendo abajo",
  "Vier aandoeningen": "Cuatro afecciones",
  "die zo beginnen.": "que empiezan así.",
  "Een gevoelige huid is een klacht en geen diagnose. Deze vier aandoeningen beginnen vaak op dezelfde manier en vragen elk iets anders.":
    "Una piel sensible es una queja y no un diagnóstico. Estas cuatro afecciones empiezan a menudo de la misma manera y cada una pide algo distinto.",
  "Blijvende roodheid op wangen en neus, opvlammingen na warmte of alcohol, soms bultjes zonder mee-eters.":
    "Rojez permanente en mejillas y nariz, brotes tras el calor o el alcohol, a veces bultitos sin puntos negros.",
  "Jeuk die voorop staat, droge schilferende plekken die terugkomen op dezelfde plaatsen, soms kloofjes.":
    "El picor por delante de todo, zonas secas y descamadas que vuelven a los mismos sitios, a veces grietas.",
  "Naar de eczeempagina": "A la página del eccema",
  Contactallergie: "Alergia de contacto",
  "De reactie komt op een afgebakende plek en begint uren tot dagen na contact, vaak met een duidelijke vorm.":
    "La reacción aparece en un sitio delimitado y empieza de horas a días después del contacto, muchas veces con una forma clara.",
  "Naar huiduitslag": "A la erupción cutánea",
  "Een uitgedroogde barrière": "Una barrera deshidratada",
  "Een trekkerig gevoel na het wassen, producten die prikken terwijl ze vroeger prima waren, en 's winters erger.":
    "Una sensación de tirantez después de lavarte, productos que pican cuando antes iban bien, y peor en invierno.",
  "Naar de droge huid": "A la piel seca",
  "Wanneer je naar de huisarts gaat": "Cuándo ir al médico de cabecera",
  "Bij jeuk die je uit je slaap houdt, bij kloofjes of wondjes, bij plekken die niet weggaan of steeds terugkomen op dezelfde plaats. Dat is geen gevoelige huid meer en daar zijn wij niet de juiste plek voor.":
    "Con un picor que no te deja dormir, con grietas o heriditas, con zonas que no se van o que vuelven siempre al mismo sitio. Eso ya no es una piel sensible y para eso no somos el sitio adecuado.",
  "Prikken betekent niet dat een product werkt. Dat is het hardnekkigste misverstand in de huidverzorging.":
    "Que pique no significa que un producto funcione. Es el malentendido más persistente del cuidado de la piel.",
  "Afbouwen naar het minimum en van daaruit opbouwen, één product per twee weken. Anders weet je nooit welke het was.":
    "Reducir hasta el mínimo y construir desde ahí, un producto cada dos semanas. Si no, nunca sabrás cuál era.",
  "Alles nieuw eerst een paar dagen op één plekje proberen, bijvoorbeeld in je hals.":
    "Probar todo lo nuevo primero unos días en un puntito, por ejemplo en el cuello.",
  "Op de ingrediëntenlijst kijken en niet op de claim. Op de voorkant staat wat het merk wil, achterop staat wat erin zit.":
    "Mirar la lista de ingredientes y no la promesa. En la parte de delante está lo que quiere la marca; detrás está lo que lleva.",
  "Bijhouden wat er gebeurde en wanneer. Een gevoelige huid reageert vaak met vertraging, en dan is je geheugen geen goede getuige.":
    "Apuntar qué pasó y cuándo. Una piel sensible reacciona a menudo con retraso, y entonces tu memoria no es buen testigo.",
  "Behandelingen uitstellen tot je huid rustig is. Twee weken wachten levert meer op dan doorzetten.":
    "Posponer los tratamientos hasta que tu piel esté tranquila. Esperar dos semanas da más que insistir.",
  "Een product dat prikt toch blijven gebruiken omdat het zou moeten wennen. Prikken is geen werkzaamheid.":
    "Seguir con un producto que pica porque hay que acostumbrarse. Que pique no es eficacia.",
  "Meerdere dingen tegelijk veranderen. Dan werkt het misschien wel, maar weet je niet waardoor.":
    "Cambiar varias cosas a la vez. Puede que funcione, pero no sabrás por qué.",
  "Alles vervangen door producten met gevoelig op de verpakking. Dat woord is niet beschermd en zegt op zichzelf niets.":
    "Sustituirlo todo por productos que ponen «sensible» en el envase. Esa palabra no está protegida y por sí sola no dice nada.",
  "Je huid met scrubben opruimen als hij al geïrriteerd is.":
    "Poner orden en tu piel a base de exfoliar cuando ya está irritada.",
  "Aannemen dat het aanleg is voordat je de routine hebt uitgekleed. Bij veel mensen is de aanleg pas zichtbaar als de rest weg is.":
    "Dar por hecho que es predisposición antes de haber reducido la rutina. En mucha gente la predisposición solo se ve cuando el resto ha desaparecido.",
  "Waarom we eerst de oorzaak zoeken": "Por qué buscamos primero la causa",
  "Een gevoelige huid voelt de ene dag anders dan de andere, en achteraf weet niemand meer hoe het vorige maand was. Zonder vast beginpunt praat je dus over een herinnering.":
    "Una piel sensible se nota distinta de un día para otro, y después nadie se acuerda de cómo estaba el mes pasado. Así que sin un punto de partida fijo estás hablando de un recuerdo.",
  "We leggen daarom vast hoe rood het is, hoe snel vocht verdwijnt en hoe de bovenlaag erbij ligt. Dan is de vraag over twee maanden niet of het beter voelt, maar of het beter is.":
    "Por eso registramos cómo de roja está, con qué rapidez se va el agua y cómo está la capa superior. Entonces, dentro de dos meses, la pregunta no es si se nota mejor, sino si está mejor.",
  "Hoeveel er zichtbaar is in rust": "Cuánto se ve en reposo",
  "Hoe snel vocht door de barrière verdwijnt":
    "Con qué rapidez se va el agua a través de la barrera",
  "Hoe gelijkmatig de bovenlaag ligt": "Cómo de uniforme está la capa superior",
  "Is een gevoelige huid iets waarmee je geboren wordt?":
    "¿La piel sensible es algo con lo que se nace?",
  "Soms, maar lang niet altijd. Veel mensen krijgen het pas na jaren, en dan is er meestal iets veranderd in wat ze gebruiken of hoe vaak. Aanleg wordt vaak pas zichtbaar als de rest is weggehaald.":
    "A veces, pero ni mucho menos siempre. Mucha gente la desarrolla al cabo de los años, y entonces suele haber cambiado algo en lo que usa o en la frecuencia. La predisposición muchas veces solo se ve cuando el resto se ha quitado.",
  "Mijn huid prikt van bijna alles. Wat nu?":
    "Mi piel pica con casi todo. ¿Y ahora qué?",
  "Terug naar het minimum, twee weken. Reinigen en één verzorgend product, verder niets. Als het dan rustiger wordt was het de stapel; blijft het gelijk, dan zoeken we het ergens anders.":
    "Vuelta al mínimo, dos semanas. Limpieza y un producto de cuidado, nada más. Si entonces se calma, era la acumulación; si sigue igual, lo buscamos en otro sitio.",
  "Betekent prikken dat het werkt?": "¿Que pique significa que funciona?",
  "Nee. Dat is een hardnekkig verhaal en het klopt niet. Een lichte tinteling bij bepaalde stoffen kan normaal zijn, maar branden en aanhoudend prikken zijn een signaal om te stoppen.":
    "No. Es una historia persistente y no es cierta. Un hormigueo leve con ciertos ingredientes puede ser normal, pero el ardor y el picor que no cesa son una señal para parar.",
  "Kan ik met een gevoelige huid wel behandeld worden?":
    "¿Con una piel sensible me pueden tratar?",
  "Meestal wel, alleen rustiger en in kleinere stappen. Wat niet kan is behandelen terwijl je huid op dat moment geïrriteerd is, want dan reageert hij feller en levert het minder op.":
    "Normalmente sí, solo que con más calma y en pasos más pequeños. Lo que no se puede es tratar mientras tu piel está irritada en ese momento, porque entonces reacciona con más fuerza y da menos.",
  "De meting kost vijftig euro. Wat daarna volgt staat per behandeling op de tarievenpagina, en bij een gevoelige huid begint dat vaker met minder doen dan met meer. Als de uitkomst is dat je twee weken moet afbouwen, dan hoor je dat in het consult en kost het je verder niets.":
    "La medición cuesta cincuenta euros. Lo que venga después está por tratamiento en la página de precios, y con una piel sensible eso empieza más veces por hacer menos que por hacer más. Si el resultado es que tienes que reducir durante dos semanas, lo sabes en la consulta y no te cuesta nada más.",
  "Eerst uitzoeken": "Primero averiguar",
  "wat er aanstaat.": "qué tienes encendido.",
  "We lopen je routine langs, meten hoe je barrière ervoor staat en zeggen wat eruit kan. Vaak is dat het hele advies, en dan is de behandeling dat je twee weken minder doet.":
    "Repasamos tu rutina, medimos cómo está tu barrera y decimos qué puede salir. Muchas veces ese es todo el consejo, y entonces el tratamiento es que hagas menos durante dos semanas.",
  "Ruwe bultjes": "Bultitos ásperos",
  "op je bovenarmen": "en los brazos",
  "Keratosis pilaris is een onschuldige en vaak erfelijke huidaandoening. De bultjes kunnen met de jaren minder worden, maar verdwijnen niet bij iedereen vanzelf.":
    "La queratosis pilaris es una afección de la piel inofensiva y a menudo hereditaria. Los bultitos pueden ir a menos con los años, pero no desaparecen solos en todo el mundo.",
  "We behandelen het met peelings en gerichte verzorging die de verhoorning oplost. Schuren werkt hier niet: de propjes zitten rond het haarzakje en niet aan de oppervlakte.":
    "La tratamos con peelings y cuidados dirigidos que disuelven la acumulación de queratina. Frotar aquí no funciona: los tapones están alrededor del folículo del pelo y no en la superficie.",
  "Waar de huidtherapeut": "Lo que mira",
  "naar kijkt": "la terapeuta de piel",
  "Verhoorning en een droge huid lijken op elkaar en vragen een andere behandeling. Dit zijn de drie dingen waaraan de huidtherapeut ze uit elkaar houdt.":
    "La acumulación de queratina y la piel seca se parecen y piden tratamientos distintos. Estas son las tres cosas con las que la terapeuta de piel las distingue.",
  "Hoe de bultjes aanvoelen": "Cómo se notan los bultitos",
  "Verhoorning voelt als fijn schuurpapier en zit vast in de porie. Droogte voelt ruw, maar laat zich wegwrijven.":
    "La queratina se nota como papel de lija fino y está fija en el poro. La sequedad se nota áspera, pero se deja frotar.",
  "Of het aan beide kanten zit": "Si está en los dos lados",
  "Keratosis pilaris is vrijwel altijd symmetrisch. Zit het aan een kant of op geschoren zones, dan is het iets anders.":
    "La queratosis pilaris es casi siempre simétrica. Si está en un solo lado o en zonas que te afeitas, es otra cosa.",
  "Hoe het door het jaar loopt": "Cómo evoluciona a lo largo del año",
  "In de winter duidelijker en in de zomer rustiger past bij verhoorning. Bij droogte verdwijnt het ’s zomers vrijwel.":
    "Más claro en invierno y más tranquilo en verano encaja con la queratina. Con la sequedad prácticamente desaparece en verano.",
  "Vier beelden die": "Cuatro cuadros que",
  "ruw aanvoelen": "se notan ásperos",
  "Verhoorning, droogte en ingegroeide haren voelen onder je hand bijna gelijk. Waar het zit en of het symmetrisch is, maakt het verschil.":
    "La queratina acumulada, la sequedad y los pelos encarnados se notan casi igual bajo la mano. Dónde está y si es simétrico marca la diferencia.",
  "Ruwe bultjes op je bovenarmen": "Bultitos ásperos en los brazos",
  "Kippenvel dat niet weggaat, ook niet als je het warm hebt":
    "Piel de gallina que no se va, ni siquiera cuando tienes calor",
  "Rode wangen met kleine bultjes": "Mejillas rojas con bultitos pequeños",
  "Een blijvend rode blos op de wangen, vaak vanaf de kindertijd":
    "Un rubor rojo permanente en las mejillas, a menudo desde la infancia",
  "Ruw door droogte": "Áspera por sequedad",
  "Een schrale, ruwe huid die 's winters erger is en 's zomers weg":
    "Una piel reseca y áspera, peor en invierno y ausente en verano",
  "Bultjes met een haar erin": "Bultitos con un pelo dentro",
  "Bultjes op plekken die je scheert, met soms een donkere krul erin":
    "Bultitos en zonas que te afeitas, a veces con un rizo oscuro dentro",
  "keratosis pilaris": "queratosis pilaris",
  "Voelt een groot vlak als schuurpapier, zitten de bultjes vlak bij elkaar, en zit het aan beide armen ongeveer gelijk?":
    "¿Se nota una zona grande como papel de lija, están los bultitos muy juntos, y está más o menos igual en los dos brazos?",
  "Verhoorning rond de haarzakjes: er vormt zich een propje hoorncellen boven elk haartje. Onschuldig, grotendeels erfelijk, en het wordt bij veel mensen met de jaren minder.":
    "Queratina acumulada alrededor de los folículos: se forma un tapón de células córneas encima de cada pelito. Inofensivo, en gran parte hereditario, y en mucha gente va a menos con los años.",
  "De bovenlaag geleidelijk soepeler maken en de propjes losser, in een tempo dat je huid aankan. Onderhoud hoort erbij; dit is geen kuur met een eindpunt.":
    "Ir volviendo la capa superior más flexible y los tapones más sueltos, a un ritmo que tu piel aguante. El mantenimiento forma parte; esto no es una cura con un punto final.",
  "Dit verzachten wij": "Esto lo suavizamos",
  "Verhoorning rond de haarzakjes. Niet te genezen, wel soepeler en minder rood te maken, met onderhoud dat erbij hoort.":
    "Queratina acumulada alrededor de los folículos. No se cura, pero se puede volver más flexible y menos roja, con el mantenimiento que lleva.",
  "Zitten er haren in de bultjes?": "¿Hay pelos dentro de los bultitos?",
  "Dan is dit niet je pagina.": "Entonces esta no es tu página.",
  "Bultjes op geschoren zones met een donkere krul eronder zijn ingegroeide haren. Dat is een andere indicatie en een andere behandeling.":
    "Los bultitos en zonas afeitadas con un rizo oscuro debajo son pelos encarnados. Esa es otra indicación y otro tratamiento.",
  "Naar ingegroeide haren": "A los pelos encarnados",
  "Dit is een aandoening waar onderhoud bij hoort. Met een reeks behandelingen en de juiste verzorging houd je het rustig.":
    "Esta es una afección que lleva mantenimiento. Con una serie de tratamientos y el cuidado adecuado la mantienes tranquila.",
  "Eerlijk zeggen dat dit niet te genezen is, en wat er dan wel kan":
    "Decir con honestidad que esto no se cura, y qué sí se puede hacer",
  "De bovenlaag geleidelijk soepeler maken, met een tempo dat de huid aankan":
    "Volver la capa superior más flexible poco a poco, a un ritmo que la piel aguante",
  "Onderhoud dat je zelf volhoudt, want zonder dat komt het beeld terug":
    "Un mantenimiento que puedas sostener tú, porque sin él el cuadro vuelve",
  "De roodheid apart aanpakken, want die stoort vaak meer dan de bultjes zelf":
    "Tratar la rojez por separado, porque muchas veces molesta más que los propios bultitos",
  "Meewegen dat het in de winter erger is; dat is geen terugval maar het seizoen":
    "Tener en cuenta que en invierno está peor; eso no es una recaída sino la estación",
  "Schuren. De propjes zitten rond het haarzakje en niet aan de oppervlakte; je maakt alleen de roodheid erger":
    "Frotar. Los tapones están alrededor del folículo y no en la superficie; solo empeoras la rojez",
  "Uitknijpen of pulken. Daar houd je donkere vlekjes en soms kuiltjes aan over":
    "Apretar o rascar. Eso te deja manchitas oscuras y a veces hoyitos",
  "Een kuur als definitieve oplossing presenteren Keratosis pilaris vraagt meestal om blijvende verzorging en onderhoud.":
    "Presentar una cura como solución definitiva. La queratosis pilaris suele pedir cuidado y mantenimiento permanentes.",
  "Beloven dat de huid glad wordt. Soepeler en minder rood is realistisch":
    "Prometer que la piel se quedará lisa. Más flexible y menos roja es realista",
  "Het behandelen als acne. Er zit geen ontsteking en geen bacterie in":
    "Tratarla como acné. No hay ninguna inflamación ni ninguna bacteria dentro",
  "Gaat kippenvelhuid ooit weg?": "¿La piel de gallina se va alguna vez?",
  "Genezen kan niet, maar bij veel mensen wordt het met de jaren vanzelf minder, vaak vanaf een jaar of dertig. In de tussentijd is het beeld wel te verzachten. Dat is geen mooi verhaal, en het is wel het eerlijke.":
    "Curarla no se puede, pero en mucha gente va a menos sola con los años, a menudo a partir de los treinta. Mientras tanto el cuadro sí se puede suavizar. No es una historia bonita, y sí es la honesta.",
  "Waarom werkt scrubben niet?": "¿Por qué no funciona frotar?",
  "Omdat de verhoorning rond het haarzakje zit en niet op de oppervlakte. Je schuurt dus over de bultjes heen in plaats van erin. Wat je wel bereikt is meer roodheid en een beschadigde barrière.":
    "Porque la queratina está alrededor del folículo y no en la superficie. Así que frotas por encima de los bultitos en vez de dentro. Lo que sí consigues es más rojez y una barrera dañada.",
  "Komt het door iets dat ik doe?": "¿Viene de algo que hago yo?",
  "Nee. Het is grotendeels erfelijk en het heeft niets te maken met hygiëne, voeding of hoe je je huid verzorgt.":
    "No. Es en gran parte hereditario y no tiene nada que ver con la higiene, con la alimentación ni con cómo cuidas tu piel.",
  "Waarom is het 's winters erger?": "¿Por qué está peor en invierno?",
  "Koude lucht en binnenverwarming drogen de huid uit, en een drogere huid maakt de verhoorning zichtbaarder en ruwer. Bij bijna iedereen is het in de zomer minder. Dat is het seizoen en geen terugval.":
    "El aire frío y la calefacción resecan la piel, y una piel más seca hace la queratina más visible y más áspera. En casi todo el mundo está menos en verano. Eso es la estación y no una recaída.",
  "Wat we eerst": "Lo que determinamos",
  vaststellen: "primero",
  "Voor de meeste mensen is de nuttigste uitkomst dat het een naam heeft, onschuldig is en niet aan hen ligt. Wat er daarnaast te verzachten valt, bespreken we in hetzelfde gesprek.":
    "Para la mayoría de la gente el resultado más útil es que tiene un nombre, que es inofensiva y que no es culpa suya. Lo que además se puede suavizar lo hablamos en esa misma conversación.",
  "Foto bovenaan:": "Foto de arriba:",
  "na scheren of harsen": "después de afeitar o depilar con cera",
  "Bultjes in je nek, bikinilijn of benen lijken op elkaar en zijn het niet. Zit er een haar in, dan is ontharen de logische route: waar geen haar groeit kan ook niets ingroeien. Zit er geen haar in, dan verandert ontharen er niets aan.":
    "Los bultitos del cuello, la ingle o las piernas se parecen y no son lo mismo. Si hay un pelo dentro, la depilación es la vía lógica: donde no crece pelo tampoco puede encarnarse nada. Si no hay pelo dentro, depilar no cambia nada.",
  "Blijft het terugkomen, dan is laserontharing de oplossing die het bij de wortel aanpakt. Soms helpt een andere scheertechniek al, en dat hoor je dan ook van ons.":
    "Si sigue volviendo, la depilación láser es la solución que va a la raíz. A veces basta con otra técnica de afeitado, y eso también te lo decimos.",
  "Wat je precies ziet": "Qué ves exactamente",
  "De huidtherapeut kijkt onder vergroting of er een haar in het bultje zit. Dat onderscheid bepaalt of ontharen zin heeft of niet.":
    "La terapeuta de piel mira con lupa si hay un pelo dentro del bultito. Esa distinción decide si depilar tiene sentido o no.",
  "De huidtherapeut kijkt met vergroting of er een haar in het bultje zit. Dat onderscheid bepaalt of ontharen zin heeft of dat het om iets anders gaat.":
    "La terapeuta de piel usa lupa para ver si hay un pelo dentro del bultito. Esa distinción decide si depilar tiene sentido o si es otra cosa.",
  "De lus of de punt": "El bucle o la punta",
  "Zit er onder het velletje een donkere lus of punt, dan gaat het om ingroei. Is daar niets van te zien, dan kijken we verder naar wat het wel is.":
    "Si debajo de la piel hay un bucle o una punta oscura, se trata de un pelo encarnado. Si no se ve nada de eso, seguimos mirando qué es en realidad.",
  "Over een groter vlak": "En una zona más grande",
  "Daarna beoordelen we de hele zone. Zit het op een plek of over een groter gebied, want dat bepaalt of je een zone laat behandelen of een enkel plekje.":
    "Después valoramos toda la zona. Si está en un punto o en un área más amplia, porque eso decide si tratas una zona entera o un solo punto.",
  "Vier bultjes": "Cuatro bultitos",
  "Vier soorten bultjes": "Cuatro tipos de bultito",
  "na het scheren": "después del afeitado",
  "Nek, bikinilijn, benen en kaaklijn zijn de zones waar deze vier voorkomen. Twee ervan hebben baat bij ontharen en twee niet.":
    "El cuello, la ingle, las piernas y la mandíbula son las zonas donde aparecen estos cuatro. Dos de ellos se benefician de la depilación y dos no.",
  "Een haar die niet naar buiten komt": "Un pelo que no sale",
  "Een bultje met een donkere krul erin die je er niet uit krijgt":
    "Un bultito con un rizo oscuro dentro que no consigues sacar",
  "Rood, warm en met een puskopje": "Rojo, caliente y con pus",
  "Pijnlijke rode bultjes met een geel kopje, kort na het scheren":
    "Bultitos rojos y dolorosos con una punta amarilla, poco después de afeitarte",
  "Ruwe bultjes zonder haar": "Bultitos ásperos sin pelo",
  "Kippenvel dat niet weggaat, op je bovenarmen of dijen":
    "Piel de gallina que no se va, en los brazos o los muslos",
  "Donkere vlekjes zonder bultje": "Manchitas oscuras sin bultito",
  "Bruine puntjes op de plek waar de bultjes zaten":
    "Puntitos marrones en el sitio donde estaban los bultitos",
  "pseudofolliculitis barbae, ingegroeid haar":
    "pseudofoliculitis de la barba, pelo encarnado",
  "Zie je bij goed licht een donkere lus of punt onder het velletje zitten, en zit het bultje op een plek die je scheert of epileert?":
    "Con buena luz, ¿ves un bucle o una punta oscura bajo la piel, y está el bultito en una zona que te afeitas o depilas?",
  "Het haar krult terug de huid in in plaats van eruit, en je afweer reageert op iets dat er hoort te zijn. Komt vaker en heftiger voor bij krullend haar.":
    "El pelo se riza de vuelta hacia dentro de la piel en lugar de salir, y tus defensas reaccionan a algo que tiene que estar ahí. Pasa más a menudo y con más fuerza en el pelo rizado.",
  "Dit is het beeld waarbij ontharen met licht het meeste oplevert: geen haar, geen ingroei. Eerst kijken of je huidtype en haarkleur daarvoor geschikt zijn.":
    "Este es el cuadro en el que depilar con luz da más: sin pelo, no hay pelo encarnado. Primero miramos si tu fototipo y el color de tu pelo son adecuados.",
  "Hier heeft ontharen zin": "Aquí depilar tiene sentido",
  "Er zit een haar bij betrokken, en dat is waar licht op mikt. Reken op een reeks en niet op een sessie.":
    "Hay un pelo de por medio, y a eso es a lo que apunta la luz. Cuenta con una serie y no con una sesión.",
  "Zoek je vooral gladde benen?":
    "¿Lo que buscas son sobre todo unas piernas lisas?",
  "Dan begint het bij de behandeling en niet bij de klacht.":
    "Entonces empieza por el tratamiento y no por el problema.",
  "Gaat het je niet om de bultjes maar om het ontharen zelf, dan staan de zones, de tarieven en wat er per huidtype kan op de laserontharingspagina.":
    "Si no te importan los bultitos sino la depilación en sí, las zonas, los precios y lo que se puede hacer según el fototipo están en la página de depilación láser.",
  "Naar laserontharing": "A la depilación láser",
  "Strak scheren, pincetten en scrubben houden het probleem in stand. Ermee stoppen levert vaak meer op dan er iets bij doen.":
    "Afeitarse al ras, usar pinzas y exfoliar mantienen el problema. Dejar de hacerlo suele dar más que añadir algo.",
  "Eerst kijken of er werkelijk een haar in zit, want zonder haar doet ontharen niets":
    "Mirar primero si de verdad hay un pelo dentro, porque sin pelo la depilación no hace nada",
  "De haarwortel uitschakelen, want een haar dat er niet is kan ook niet ingroeien":
    "Desactivar la raíz del pelo, porque un pelo que no está tampoco puede encarnarse",
  "Kijken naar hoe je nu onthaart. Soms is anders scheren de hele oplossing, en dan zeggen we dat":
    "Mirar cómo te depilas ahora. A veces afeitarse de otra manera es toda la solución, y entonces lo decimos",
  "Instellingen aanpassen op je huidtype, want juist bij een donkerder huid moet dat nauwkeuriger":
    "Ajustar los parámetros a tu fototipo, porque justo con una piel más oscura eso tiene que ser más preciso",
  "Zonbescherming op de behandelde zone, anders blijven de donkere vlekjes staan":
    "Protección solar en la zona tratada, o si no las manchitas oscuras se quedan",
  "Laseren op een zone die op dit moment ontstoken is":
    "Aplicar láser en una zona que en ese momento está inflamada",
  "Zelf uitpeuteren met een pincet of een naald. Dat is de snelste route naar een donkere vlek of een kuiltje":
    "Sacártelos tú con unas pinzas o una aguja. Es la vía más rápida a una mancha oscura o a un hoyito",
  "Scrubben tegen ingegroeide haren. Op een geïrriteerde zone maakt het de ontsteking erger":
    "Exfoliar contra los pelos encarnados. En una zona irritada empeora la inflamación",
  "Beloven dat elk haartje weggaat. Lichte en grijze haren reageren nauwelijks op licht":
    "Prometer que se irá cada pelo. Los pelos claros y grises apenas responden a la luz",
  "Haar voor haar, ook grijs en blond. Voor wat de laser niet ziet zitten. De behandeltijd rekenen we per half uur.":
    "Pelo a pelo, también los grises y los rubios. Para lo que el láser no ve. El tiempo de tratamiento lo cobramos por media hora.",
  "Elektrische epilatie in Rotterdam": "Electrólisis en Rotterdam",
  "De haarwortel uitschakelen. Per zone of als pakket, voor dames en heren.":
    "Desactivar la raíz del pelo. Por zona o como paquete, para mujeres y hombres.",
  "Deze komen uit Salonized en zijn niet door ons uitgekozen op inhoud. Ze gaan over laserontharing, want dat is wat ingroei stopt.":
    "Estas vienen de Salonized y no las hemos elegido nosotros por su contenido. Hablan de depilación láser, porque eso es lo que detiene los pelos encarnados.",
  "Gaan ingegroeide haren weg van laserontharing?":
    "¿Los pelos encarnados se van con la depilación láser?",
  "Bij het merendeel wel, en om een logische reden: waar geen haar groeit kan ook niets ingroeien. Het gaat geleidelijk, over een reeks sessies, en het werkt alleen als het haar donker genoeg is om licht op te vangen.":
    "En la mayoría sí, y por un motivo lógico: donde no crece pelo tampoco puede encarnarse nada. Va poco a poco, a lo largo de una serie de sesiones, y solo funciona si el pelo es lo bastante oscuro para captar luz.",
  "Waarom krijg ik ze vooral in mijn nek en bikinilijn?":
    "¿Por qué me salen sobre todo en el cuello y la ingle?",
  "Daar groeit het haar vaker krullend en ligt de haarzak schuiner, waardoor een teruggroeiend haar sneller de huid weer in gaat. Kleding die wrijft en strak scheren maken het erger.":
    "Ahí el pelo crece rizado más a menudo y el folículo está más inclinado, con lo que un pelo que vuelve a crecer se mete antes en la piel. La ropa que roza y afeitarse al ras lo empeoran.",
  "Mag ik blijven scheren tijdens het traject?":
    "¿Puedo seguir afeitándome durante el tratamiento?",
  "Scheren mag en moet zelfs: de zone hoort kort te zijn op de dag van de behandeling. Wat niet mag is epileren, harsen of een epilator, want dan trek je precies de wortel weg waar het licht op mikt.":
    "Afeitarte se puede y de hecho hace falta: la zona tiene que estar corta el día del tratamiento. Lo que no se puede es depilarse con pinzas, con cera o con depiladora eléctrica, porque entonces arrancas justo la raíz a la que apunta la luz.",
  "En die donkere vlekjes die overblijven?":
    "¿Y esas manchitas oscuras que quedan?",
  "Dat is pigment en geen litteken. Zolang er nieuwe bultjes bij komen heeft behandelen weinig zin, want dan komen er ook nieuwe vlekjes bij. Eerst de oorzaak, dan de kleur.":
    "Eso es pigmento y no una cicatriz. Mientras sigan saliendo bultitos nuevos, tratarlas tiene poco sentido, porque también saldrán manchitas nuevas. Primero la causa, después el color.",
  "In het eerste gesprek stellen we vast of er haren bij betrokken zijn en of jouw huidtype en haarkleur geschikt zijn. Zo niet, dan hoor je dat voordat je iets afspreekt.":
    "En la primera conversación determinamos si hay pelos de por medio y si tu fototipo y el color de tu pelo son adecuados. Si no, lo sabes antes de acordar nada.",
  "en witte bultjes": "y bultitos blancos",
  "Gerstekorrel betekent in de volksmond en in de spreekkamer twee verschillende dingen. Wat mensen meestal bedoelen is een milium: een hard wit bolletje dat er maanden zit, geen pijn doet en niet uit te knijpen is. Dat is in seconden weg.":
    "En el lenguaje corriente y en la consulta, «grano de sebo» significa dos cosas distintas. Lo que la gente suele querer decir es un milium: una bolita blanca y dura que lleva meses ahí, no duele y no se puede apretar. Eso se quita en segundos.",
  "Een milium halen we weg met een fijne naald, in een paar seconden per bolletje. Is het rood, warm en pijnlijk, dan gaat het om een ontsteking; kom dan langs, want de aanpak is dan een andere.":
    "Un milium lo quitamos con una aguja fina, en unos segundos por bolita. Si está rojo, caliente y duele, se trata de una inflamación; pásate entonces, porque el enfoque es otro.",
  "In de behandelkamer": "En la sala de tratamiento",
  "Hoe we": "Cómo",
  "milia weghalen": "quitamos los milia",
  weghalen: "quitados",
  "Een fijne naald opent het bolletje en de inhoud komt eruit. Per milium duurt dat een paar seconden, en er blijft geen wondje.":
    "Una aguja fina abre la bolita y el contenido sale. Por milium eso dura unos segundos, y no queda ninguna herida.",
  "Eerst kijken, met vergroting": "Primero mirar, con lupa",
  "De huidtherapeut bekijkt elk bolletje van dichtbij. Zit er iets tussen dat geen milium is, dan hoor je dat meteen en niet halverwege.":
    "La terapeuta de piel mira cada bolita de cerca. Si entre ellas hay algo que no es un milium, lo sabes enseguida y no a mitad de camino.",
  "Een prikje per bolletje": "Un pinchacito por bolita",
  "De huid erboven wordt met een steriele naald geopend en de inhoud eruit gelicht. Per bolletje enkele seconden, en je voelt een prikje zoals bij een splinter.":
    "La piel de encima se abre con una aguja estéril y el contenido se extrae. Unos segundos por bolita, y notas un pinchazo como cuando te sacan una astilla.",
  "Klaar, en je kunt weg": "Listo, y te puedes ir",
  "Er is geen verdoving, geen pleister en geen hersteltijd. Soms is er een paar uur een rood puntje te zien, en daarna niets meer.":
    "No hay anestesia, ni tirita, ni tiempo de recuperación. A veces se ve un puntito rojo durante unas horas, y después nada.",
  "Zitten er ook mee-eters bij?": "¿Hay también puntos negros entre ellos?",
  "Dan is dit maar de helft van je verhaal.":
    "Entonces esto es solo la mitad de tu historia.",
  "Losse witte bolletjes zijn een ding op zich. Zie je daarnaast verstopte poriën, puistjes of een glimmende T-zone, dan gaat het om onzuiverheden en is de acnepagina de betere ingang.":
    "Las bolitas blancas sueltas son una cosa aparte. Si además ves poros obstruidos, granos o una zona T brillante, se trata de imperfecciones y la página del acné es la mejor entrada.",
  "Wit bolletje of": "¿Bolita blanca o",
  "ontstoken kliertje?": "glándula inflamada?",
  "Wit en hard aan de ene kant, rood en pijnlijk aan de andere: dat verschil bepaalt of het hier weg kan of naar de huisarts gaat.":
    "Blanco y duro por un lado, rojo y doloroso por otro: esa diferencia decide si se puede quitar aquí o va al médico de cabecera.",
  "Hard wit bolletje": "Una bolita blanca y dura",
  "Een wit korreltje onder je oog of op je wang dat er al maanden zit":
    "Un granito blanco debajo del ojo o en la mejilla que lleva meses ahí",
  "Rood, pijnlijk bultje op de ooglidrand":
    "Bultito rojo y doloroso en el borde del párpado",
  "Een pijnlijke rode zwelling aan de rand van je ooglid":
    "Una hinchazón roja y dolorosa en el borde del párpado",
  "Vast knobbeltje in het ooglid": "Un bultito firme en el párpado",
  "Een stevig bultje in je ooglid dat weken blijft zitten":
    "Un bultito firme en el párpado que se queda semanas",
  "Zwart of donker puntje": "Un puntito negro u oscuro",
  "Een klein donker puntje in een porie":
    "Un puntito oscuro y pequeño dentro de un poro",
  "milium, meervoud milia": "milium, en plural milia",
  "Is het wit of geelwit, niet rood, doet het geen pijn, en lukt het niet om er iets uit te knijpen?":
    "¿Es blanco o blanco amarillento, no está rojo, no duele, y no consigues sacar nada apretando?",
  "Een piepklein cystje met keratine, ingesloten onder de opperhuid. Er zit geen opening naartoe, en daarom knijpen niet werkt.":
    "Un quiste diminuto de queratina, encerrado bajo la epidermis. No hay ninguna abertura hacia él, y por eso apretar no funciona.",
  "Openen met een steriele naald en de inhoud eruit lichten. Dat duurt per bolletje enkele seconden en er blijft niets van te zien.":
    "Abrirlo con una aguja estéril y sacar el contenido. Eso dura unos segundos por bolita y no queda nada a la vista.",
  "Een steriele naald, enkele seconden per bolletje, en er blijft niets van te zien. Bijna altijd een eenmalige behandeling.":
    "Una aguja estéril, unos segundos por bolita, y no queda nada a la vista. Casi siempre un tratamiento único.",
  "Bij milia is het antwoord meestal kort: als het het juiste bultje is, is het in een afspraak klaar.":
    "Con los milia la respuesta suele ser corta: si es el bultito correcto, se resuelve en una cita.",
  "Eerst vaststellen of het een wit korreltje is of een ontsteking, want dat scheelt de huisarts of ons":
    "Determinar primero si es un granito blanco o una inflamación, porque eso decide entre tu médico de cabecera y nosotros",
  "Milia openen met een steriele naald, per stuk, in een behandeling van minuten":
    "Abrir los milia con una aguja estéril, uno a uno, en un tratamiento de minutos",
  "Kijken of er een aanleiding is: te rijke oogcrème, zonschade, of iets dat de huid heeft beschadigd":
    "Mirar si hay un desencadenante: una crema de ojos demasiado rica, daño solar, o algo que haya dañado la piel",
  "Doorsturen naar de huisarts bij alles wat rood, pijnlijk of warm is":
    "Derivar al médico de cabecera con todo lo que esté rojo, doloroso o caliente",
  "Prikken in iets dat ontstoken is. Rond het oog is dat een risico dat nergens voor nodig is":
    "Pinchar algo que está inflamado. Alrededor del ojo eso es un riesgo que no hace ninguna falta",
  "Zelf uitknijpen. Er zit geen opening in, dus je duwt alleen de huid eromheen kapot":
    "Apretarlo tú. No tiene ninguna abertura, así que solo revientas la piel de alrededor",
  "Een crème adviseren als verwijdering Een crème opent een ingesloten gerstekorrel niet.":
    "Recomendar una crema como método de extracción. Una crema no abre un milium encerrado.",
  "Onnodig meerdere afspraken plannen Een gerstekorrel verwijderen is meestal een eenmalige behandeling.":
    "Programar varias citas sin necesidad. Quitar un milium suele ser un tratamiento único.",
  "Waarom kan ik een milium niet uitdrukken?":
    "¿Por qué no puedo apretar un milium?",
  "Omdat er geen opening naartoe is. Een mee-eter heeft een poriegang naar buiten; een milium zit volledig ingesloten onder een laagje huid. Knijpen beschadigt daarom alleen het weefsel eromheen.":
    "Porque no hay ninguna abertura hacia él. Un punto negro tiene un canal de poro hacia fuera; un milium está completamente encerrado bajo una capita de piel. Por eso apretar solo daña el tejido de alrededor.",
  "Doet het pijn om ze te laten verwijderen?": "¿Duele que te los quiten?",
  "Je voelt een prikje per bolletje, vergelijkbaar met een splinter eruit halen. Er is geen verdoving nodig en je kunt daarna gewoon weg.":
    "Notas un pinchazo por bolita, parecido a cuando te sacan una astilla. No hace falta anestesia y después te puedes ir sin más.",
  "Komen ze terug?": "¿Vuelven?",
  "De behandelde bolletjes niet. Wel kunnen er nieuwe ontstaan, en dan kijken we of er een aanleiding is: bij sommige mensen is dat een te rijke oogcrème, bij anderen jarenlange zonschade.":
    "Las bolitas tratadas no. Sí pueden salir nuevas, y entonces miramos si hay un desencadenante: en algunas personas es una crema de ojos demasiado rica, en otras años de daño solar.",
  "Hoeveel kunnen er in een keer?": "¿Cuántos se pueden hacer de una vez?",
  "Meestal alles wat er zit, in een afspraak. Zijn het er veel, dan spreiden we het soms om de huid rust te geven. Dat hoor je vooraf en niet halverwege.":
    "Normalmente todos los que haya, en una cita. Si son muchos, a veces lo repartimos para dar descanso a la piel. Eso lo sabes antes y no a mitad de camino.",
  "Even laten kijken.": "Déjanos echar un vistazo.",
  "Vaak is het zo klaar.": "Muchas veces se resuelve en nada.",
  "Bij milia is de afspraak kort en eenmalig. Blijkt het iets anders, dan hoor je dat meteen en sturen we je door in plaats van dat we het proberen.":
    "Con los milia la cita es corta y única. Si resulta ser otra cosa, lo sabes enseguida y te derivamos en vez de intentarlo.",
  "Eczeem: jeuk die": "Eccema: un picor que",
  "blijft terugkomen": "sigue volviendo",
  "Eczeem is een kringloop: jeuk geeft krabben, krabben breekt je huidbarrière, en een kapotte barrière laat meer prikkels door.":
    "El eccema es un círculo: el picor lleva a rascarse, rascarse rompe la barrera de la piel, y una barrera rota deja pasar más irritantes.",
  "Wij werken aan die barrière, met behandelingen en verzorging die hem herstellen. De medicatie loopt via je huisarts, en we stemmen onze aanpak daarop af.":
    "Nosotros trabajamos esa barrera, con tratamientos y cuidados que la reparan. La medicación va por tu médico de cabecera, y ajustamos nuestro enfoque a ella.",
  "Bekijk de cirkel": "Mira el círculo",
  "Het korte antwoord": "La respuesta corta",
  "Jeuk die je uit je slaap houdt, kloofjes, of plekken die steeds terugkomen op dezelfde plaats: dat is een reden voor de huisarts.":
    "Un picor que no te deja dormir, grietas, o zonas que vuelven siempre al mismo sitio: eso es motivo para ir al médico de cabecera.",
  "Er bestaat behandeling voor, en die begint daar. Hoe langer de cirkel draait, hoe moeilijker hij te doorbreken is.":
    "Existe tratamiento, y empieza ahí. Cuanto más tiempo gire el círculo, más difícil es romperlo.",
  "De krabcirkel": "El círculo del rascado",
  "Of is het iets anders": "O si es otra cosa",
  schakels: "eslabones",
  "Elk punt in deze kringloop houdt de volgende in stand. Wij werken aan de barrière, want dat is de schakel die we kunnen herstellen.":
    "Cada punto de este círculo mantiene al siguiente. Nosotros trabajamos la barrera, porque ese es el eslabón que podemos reparar.",
  "Draait door tot je hem breekt": "Sigue girando hasta que lo rompas",
  Jeuk: "Picor",
  Krabben: "Rascarse",
  Prikkels: "Irritantes",
  "Tik een schakel aan. Elk punt heeft iemand die hem kan doorbreken, en dat is lang niet altijd dezelfde.":
    "Toca un eslabón. Cada punto tiene a alguien que puede romperlo, y ni mucho menos es siempre el mismo.",
  "Dit doet je huisarts": "Esto le toca a tu médico de cabecera",
  "De huid geeft een prikkel af die je bijna niet kunt negeren, en die 's avonds en 's nachts het sterkst is.":
    "La piel manda una señal que casi no puedes ignorar, y que es más fuerte por la tarde y por la noche.",
  "Hier valt de cirkel te breken": "Aquí es donde se puede romper el círculo",
  "Dit is het punt waar medicatie het meest uitmaakt. Een ontstekingsremmende zalf op het juiste moment breekt de lus vaak in dagen, en dat schrijft je huisarts voor.":
    "Este es el punto donde la medicación más cuenta. Una pomada antiinflamatoria en el momento adecuado rompe el bucle muchas veces en días, y eso lo receta tu médico de cabecera.",
  "Twee van de vier punten liggen buiten onze deur, en dat is geen bescheidenheid maar de verdeling zoals hij is. Wie je vertelt dat een huidbehandeling eczeem oplost, kijkt naar één punt van een cirkel die daarna gewoon doordraait.":
    "Dos de los cuatro puntos quedan fuera de nuestra puerta, y eso no es modestia sino el reparto tal como es. Quien te diga que un tratamiento de la piel resuelve el eccema está mirando un punto de un círculo que después sigue girando igual.",
  "hierop lijken.": "se parecen a esto.",
  "Eczeem wordt vaak gebruikt als verzamelnaam voor alles wat rood en schilferig is. Deze drie lijken erop en vragen iets anders.":
    "El eccema se usa a menudo como nombre paraguas para todo lo que está rojo y descamado. Estos tres se le parecen y piden otra cosa.",
  "Trekkerig en ruw, maar zonder de jeuk die je uit je slaap houdt en zonder plekken die steeds op dezelfde plaats terugkomen.":
    "Tirante y áspera, pero sin el picor que no te deja dormir y sin zonas que vuelvan siempre al mismo sitio.",
  "De reactie zit op een afgebakende plek met een duidelijke vorm en begint uren tot dagen na contact met iets.":
    "La reacción está en un sitio delimitado con una forma clara y empieza de horas a días después del contacto con algo.",
  "Dikkere, scherp begrensde plekken met zilverwitte schilfers, vaak op ellebogen, knieën en hoofdhuid, en meestal minder jeuk.":
    "Zonas más gruesas y de borde nítido con escamas blanco plateadas, a menudo en codos, rodillas y cuero cabelludo, y normalmente con menos picor.",
  "Naar psoriasis": "A la psoriasis",
  "Wachten met de huisarts omdat je eerst zelf iets wilt proberen, kost meestal de meeste tijd.":
    "Aplazar al médico de cabecera porque primero quieres probar algo tú suele ser lo que más tiempo cuesta.",
  "Naar de huisarts bij aanhoudende jeuk, kloofjes of plekken die terugkomen. Dit is een aandoening met behandeling, en die begint daar.":
    "Al médico de cabecera con picor persistente, grietas o zonas que vuelven. Es una afección con tratamiento, y ese empieza ahí.",
  "Dagelijks blijven insmeren, ook op de dagen dat er niets te zien is. Dat is bij eczeem de basis en geen bijzaak.":
    "Seguir aplicando crema a diario, también los días en que no se ve nada. En el eccema esa es la base y no un detalle.",
  "Lauw en kort douchen, en daarna binnen enkele minuten insmeren.":
    "Ducharte templado y corto, y aplicarte la crema en los minutos siguientes.",
  "Nagels kort houden en 's nachts iets tussen je nagels en je huid. Het meeste krabben gebeurt in je slaap.":
    "Llevar las uñas cortas y algo entre tus uñas y tu piel por la noche. La mayor parte del rascado ocurre durmiendo.",
  "Bijhouden wanneer het opvlamt. Prikkels zijn persoonlijk en een patroon zie je alleen achteraf.":
    "Apuntar cuándo hay brote. Los desencadenantes son personales y el patrón solo se ve después.",
  "Wachten met de huisarts omdat je eerst een crème wilt proberen. Hoe langer de cirkel draait, hoe moeilijker hij te doorbreken is.":
    "Aplazar al médico de cabecera porque primero quieres probar una crema. Cuanto más tiempo gire el círculo, más difícil es romperlo.",
  "Stoppen met een voorgeschreven zalf zodra het beter gaat, zonder dat met je arts te overleggen.":
    "Dejar una pomada recetada en cuanto va mejor, sin consultarlo con tu médico.",
  "Zeep en heet water gebruiken op een plek die al kapot is.":
    "Usar jabón y agua caliente en una zona que ya está rota.",
  "Zelf diëten schrappen op verdenking van allergie. Dat kost je voedingsstoffen en levert zelden een antwoord op.":
    "Quitarte alimentos por tu cuenta sospechando de una alergia. Eso te cuesta nutrientes y rara vez da una respuesta.",
  "Een cosmetische behandeling boeken op actief eczeem. Daar wordt het erger van en wij doen het dus niet.":
    "Reservar un tratamiento estético sobre un eccema activo. Eso lo empeora, así que no lo hacemos.",
  "Kan ik met eczeem bij jullie terecht?": "¿Puedo ir a vosotros con eccema?",
  "Voor het eczeem zelf niet, dat gaat naar de huisarts. Voor de huid eromheen soms wel, als die rustig is en je iets anders wilt aanpakken. We kijken dan of het verstandig is en zeggen het als het dat niet is.":
    "Para el eccema en sí no, eso va al médico de cabecera. Para la piel de alrededor a veces sí, si está tranquila y quieres tratar otra cosa. Entonces miramos si es sensato y lo decimos cuando no lo es.",
  "Gaat eczeem ooit over?": "¿El eccema se va alguna vez?",
  "Bij kinderen verdwijnt het vaak grotendeels. Bij volwassenen gaat het meestal in periodes, met rustige tijden en opvlammingen. Dat betekent niet dat er niets aan te doen is, wel dat het beheerd wordt.":
    "En los niños muchas veces desaparece en gran parte. En los adultos suele ir por periodos, con épocas tranquilas y brotes. Eso no significa que no se pueda hacer nada, solo que se maneja.",
  "Is het besmettelijk?": "¿Es contagioso?",
  "Nee. Eczeem is niet overdraagbaar.": "No. El eccema no se transmite.",
  "Waarom is het 's nachts erger?": "¿Por qué está peor por la noche?",
  "Je bent overdag afgeleid en 's avonds niet, en de huid is dan ook warmer. Daar komt bij dat je in je slaap krabt zonder het te merken.":
    "De día estás distraído y por la tarde no, y además la piel está más caliente entonces. A eso se suma que te rascas durmiendo sin darte cuenta.",
  "Helpt zonlicht?": "¿Ayuda la luz del sol?",
  "Bij sommige mensen wel en bij anderen niet, en verbranden maakt het altijd erger. Lichttherapie bestaat als behandeling maar die hoort bij de dermatoloog en niet bij een huidkliniek.":
    "En algunas personas sí y en otras no, y quemarse siempre lo empeora. La fototerapia existe como tratamiento pero corresponde al dermatólogo y no a una clínica de la piel.",
  "Waar je wel heen gaat": "A dónde sí vas",
  "Samen met": "Junto con",
  "je huisarts": "tu médico de cabecera",
  "De diagnose en de medicatie lopen via je huisarts. Wij werken daarnaast aan je huidbarrière, met behandelingen en verzorging die hem herstellen. Is je huid op dat moment rustig, dan kunnen we beginnen.":
    "El diagnóstico y la medicación van por tu médico de cabecera. Además de eso nosotros trabajamos tu barrera cutánea, con tratamientos y cuidados que la reparan. Si tu piel está tranquila en ese momento, podemos empezar.",
  "Misschien is het een droge huid": "Quizá sea una piel seca",
  "Of laat eerst je huid beoordelen": "O deja que valoremos primero tu piel",
  "De diagnose en de medicatie lopen via je huisarts. Wat je huid daarnaast nodig heeft, bekijken wij: welke verzorging de barriere herstelt en welke behandeling kan als je huid rustig is. Is dat op dat moment niets, dan zeggen we dat.":
    "El diagnóstico y la medicación van por tu médico de cabecera. Lo que tu piel necesita además lo miramos nosotros: qué cuidado repara la barrera y qué tratamiento se puede hacer cuando tu piel está tranquila. Si en ese momento es nada, lo decimos.",
  "Psoriasis en": "La psoriasis y",
  "je huid": "tu piel",
  "Psoriasis is een aandoening van je afweersysteem die zich in de huid laat zien. De behandeling loopt via je huisarts of dermatoloog, en wij werken daarnaast aan je huidbarrière.":
    "La psoriasis es una afección de tu sistema inmunitario que se manifiesta en la piel. El tratamiento va por tu médico de cabecera o tu dermatólogo, y además de eso nosotros trabajamos tu barrera cutánea.",
  "Ook je nagels en gewrichten kunnen meedoen. Vooral bij gewrichten is het belangrijk dat er op tijd naar gekeken wordt.":
    "También pueden participar tus uñas y tus articulaciones. Sobre todo con las articulaciones importa que se miren a tiempo.",
  "Bekijk waar het zit": "Mira dónde está",
  "Waar je niet mee wacht": "Con qué no esperas",
  "Stijve gewrichten in de ochtend, gezwollen vingers of tenen, of rugpijn die beter wordt van bewegen. Noem dat bij je huisarts, ook als je huidplekken meevallen.":
    "Articulaciones rígidas por la mañana, dedos de las manos o de los pies hinchados, o dolor de espalda que mejora al moverte. Menciónalo a tu médico de cabecera, aunque tus zonas de piel sean leves.",
  "Schade aan een gewricht is blijvend. Dit is het enige onderdeel waar op tijd zijn echt iets verandert.":
    "El daño en una articulación es permanente. Esta es la única parte donde llegar a tiempo cambia algo de verdad.",
  "Meer dan huid": "Más que piel",
  plekken: "zonas",
  "Ze spelen niet altijd tegelijk op maar horen wel bij elkaar. Nagels en gewrichten worden het vaakst voor iets anders aangezien.":
    "No siempre brotan a la vez, pero sí van juntas. Las uñas y las articulaciones son las que más se confunden con otra cosa.",
  "Van boven naar beneden": "De arriba abajo",
  "Ze horen bij dezelfde aandoening, ook als ze niet tegelijk opspelen.":
    "Pertenecen a la misma afección, aunque no broten a la vez.",
  Hoofdhuid: "Cuero cabelludo",
  "Ellebogen en knieën": "Codos y rodillas",
  Nagels: "Uñas",
  Gewrichten: "Articulaciones",
  "Niet mee wachten": "No esperes",
  "Wat hier bij hoort": "Lo que va con esto",
  "psoriasis capitis": "psoriasis capitis",
  "Wat je ziet of voelt": "Lo que ves o notas",
  "Dikke schilfers die vastzitten aan het haar, vaak tot net over de haargrens op je voorhoofd of achter je oren.":
    "Escamas gruesas pegadas al pelo, a menudo justo pasada la línea del pelo en la frente o detrás de las orejas.",
  "Waarom dit telt": "Por qué cuenta",
  "Dit wordt het vaakst aangezien voor hardnekkige roos. Het verschil zit in de dikte en in de scherpe rand.":
    "Esto es lo que más se confunde con una caspa persistente. La diferencia está en el grosor y en el borde nítido.",
  "Psoriasis kan op verschillende plekken voorkomen. Dat is de reden dat een crème de plek aanpakt en niet de oorzaak: de diagnose en de medische behandeling horen bij de huisarts of dermatoloog. Wij beoordelen de huid en adviseren over ondersteunende verzorging.":
    "La psoriasis puede aparecer en varios sitios. Por eso una crema trata la zona y no la causa: el diagnóstico y el tratamiento médico corresponden al médico de cabecera o al dermatólogo. Nosotros valoramos la piel y asesoramos sobre cuidados de apoyo.",
  "Gewrichtsklachten laat je op tijd beoordelen. Uitstel kost daar schade die niet meer terugkomt.":
    "Haz que valoren a tiempo las molestias articulares. Retrasarlo ahí cuesta un daño que ya no vuelve.",
  "Naar de huisarts bij scherp begrensde, schilferende plekken die niet weggaan. Er bestaat behandeling voor en die begint daar.":
    "Al médico de cabecera con zonas descamadas de borde nítido que no se van. Existe tratamiento y empieza ahí.",
  "Gewrichtsklachten meteen noemen, ook als je huid meevalt. Dit is het enige onderdeel waar wachten blijvende schade kan geven.":
    "Mencionar las molestias articulares enseguida, aunque tu piel esté leve. Esta es la única parte donde esperar puede dejar daño permanente.",
  "Je nagels laten zien tijdens dat gesprek. Ze worden vaak vergeten en ze zeggen iets.":
    "Enseñar tus uñas durante esa conversación. Se olvidan a menudo y dicen algo.",
  "Blijven insmeren op rustige dagen. Een soepele huid scheurt minder snel open, en beschadiging kan een nieuwe plek uitlokken.":
    "Seguir aplicando crema los días tranquilos. Una piel flexible se abre menos, y una lesión puede provocar una zona nueva.",
  "Weten dat het in periodes gaat. Dat maakt een rustige periode geen genezing en een opvlamming geen falen.":
    "Saber que va por periodos. Eso hace que una época tranquila no sea una curación ni un brote un fracaso.",
  "Schilfers wegkrabben of schrobben. Beschadiging op een plek kan daar juist nieuwe psoriasis uitlokken.":
    "Rascar o frotar las escamas. Una lesión en un punto puede provocar ahí psoriasis nueva.",
  "Nagelafwijkingen op eigen houtje als schimmel behandelen. Dat is de meest gemaakte fout en het duurt maanden voor je weet dat het niet werkt.":
    "Tratar por tu cuenta las alteraciones de las uñas como si fueran hongos. Es el error más frecuente y tardas meses en saber que no funciona.",
  "Een cosmetische behandeling boeken op actieve plekken.":
    "Reservar un tratamiento estético sobre zonas activas.",
  "Stoppen met voorgeschreven medicatie zodra het beter gaat, zonder overleg.":
    "Dejar la medicación recetada en cuanto va mejor, sin consultarlo.",
  "Aannemen dat het besmettelijk is of dat het aan hygiëne ligt. Geen van beide klopt.":
    "Dar por hecho que es contagiosa o que es cuestión de higiene. Ninguna de las dos cosas es cierta.",
  "Is psoriasis besmettelijk?": "¿La psoriasis es contagiosa?",
  "Nee. Het is een aandoening van je eigen afweersysteem en niet overdraagbaar, ook niet bij aanraking.":
    "No. Es una afección de tu propio sistema inmunitario y no se transmite, ni siquiera por contacto.",
  "Wat kunnen jullie bij psoriasis wel doen?":
    "¿Qué podéis hacer con la psoriasis?",
  "Bij psoriasis kunnen wij de huid beoordelen en adviseren over ondersteunende huidverzorging. Voor de diagnose en medische behandeling werken we waar nodig samen met of verwijzen we naar de huisarts of dermatoloog. Actieve psoriasisplekken behandelen wij niet met huidbeschadigende of intensief exfoliërende behandelingen.":
    "Con la psoriasis podemos valorar la piel y asesorar sobre cuidados de apoyo. Para el diagnóstico y el tratamiento médico colaboramos con, o derivamos a, tu médico de cabecera o tu dermatólogo cuando hace falta. No tratamos las zonas de psoriasis activa con tratamientos que dañen la piel o exfolien de forma intensa.",
  "Ik heb alleen putjes in mijn nagels. Telt dat?":
    "Solo tengo hoyitos en las uñas. ¿Cuenta eso?",
  "Dat is genoeg reden om het te laten bekijken. Nagelafwijkingen zijn vaak het eerste of enige teken en worden bijna altijd voor schimmel aangezien.":
    "Es motivo suficiente para que lo miren. Las alteraciones de las uñas son a menudo el primer o el único signo y casi siempre se confunden con hongos.",
  "Mijn gewrichten zijn 's ochtends stijf. Hoort dat erbij?":
    "Mis articulaciones están rígidas por la mañana. ¿Entra en esto?",
  "Dat kan, en het is het onderdeel waarmee je niet moet wachten. Ochtendstijfheid die langer dan een halfuur duurt hoort besproken te worden, ook als je huidplekken klein zijn.":
    "Puede ser, y es la parte con la que no debes esperar. Una rigidez matutina que dura más de media hora debe comentarse, aunque tus zonas de piel sean pequeñas.",
  "Kan ik bij jullie wel voor iets anders terecht?":
    "¿Puedo ir a vosotros por otra cosa?",
  "Als je huid op dat moment rustig is en het gaat om een ander onderwerp, dan kijken we mee. We behandelen niet over plekken heen en we zeggen het als we het niet verstandig vinden.":
    "Si tu piel está tranquila en ese momento y se trata de otro tema, lo miramos contigo. No tratamos por encima de las zonas y lo decimos cuando no nos parece sensato.",
  "Wanneer je bij": "Cuándo te corresponde",
  "de huisarts hoort": "el médico de cabecera",
  "Noem je nagels en je gewrichten in dat gesprek, ook als je er zelf weinig van merkt. Die twee worden het vaakst overgeslagen. Naast de behandeling van je arts werken wij aan je huidbarrière.":
    "Menciona tus uñas y tus articulaciones en esa conversación, aunque tú apenas las notes. Esas dos son las que más se saltan. Además del tratamiento de tu médico, nosotros trabajamos tu barrera cutánea.",
  "Misschien is het eczeem": "Quizá sea eccema",
  "naast je behandeling": "junto a tu tratamiento",
  "De medicatie loopt via je huisarts of dermatoloog. Wij kijken naar je huidbarriere en naar wat er tussen de opvlammingen door mogelijk is, in overleg met je arts.":
    "La medicación va por tu médico de cabecera o tu dermatólogo. Nosotros miramos tu barrera cutánea y lo que es posible entre brote y brote, de acuerdo con tu médico.",
  "Huiduitslag, en wanneer": "Erupción cutánea, y cuándo",
  "het haast heeft": "hay prisa",
  "Huiduitslag is een symptoom en geen aandoening. De oorzaken lopen uiteen van onschuldig tot spoedeisend, en een diagnose hoort bij je huisarts.":
    "Una erupción cutánea es un síntoma y no una afección. Las causas van de inofensivas a urgentes, y un diagnóstico corresponde a tu médico de cabecera.",
  "Op deze pagina staan de signalen waarbij je vandaag nog belt, en de veelvoorkomende soorten uitslag met wat eraan te doen is.":
    "En esta página están las señales con las que llamas hoy mismo, y los tipos de erupción más frecuentes con lo que se puede hacer.",
  "Kijk eerst naar de alarmsignalen": "Mira primero las señales de alarma",
  "Wanneer je nu belt": "Cuándo llamas ya",
  "Gewone oorzaken": "Causas corrientes",
  "Wanneer je niet afwacht": "Cuándo no esperas",
  "Zes signalen waarbij": "Seis señales con las que",
  "je vandaag belt.": "llamas hoy mismo.",
  "Koorts, rillingen of je voelt je snel zieker worden":
    "Fiebre, escalofríos o notas que empeoras rápido",
  "De uitslag breidt zich binnen uren duidelijk uit":
    "La erupción se extiende claramente en cuestión de horas",
  "Zwelling van lippen, tong of keel, of moeite met ademen of slikken":
    "Hinchazón de labios, lengua o garganta, o dificultad para respirar o tragar",
  "Sufheid, verwardheid, nekpijn of felle hoofdpijn bij licht":
    "Somnolencia, confusión, dolor de cuello o dolor de cabeza fuerte con la luz",
  "Blaren of loslatende huid, of plekken in je mond of ogen":
    "Ampollas o piel que se desprende, o lesiones en la boca o en los ojos",
  "Uitslag bij een baby, of bij iemand met een verminderde afweer":
    "Una erupción en un bebé, o en alguien con las defensas bajas",
  "Herken je hier iets van, dan is bellen het enige goede antwoord. Hoe de uitslag eruitziet weegt dan niet meer mee.":
    "Si reconoces algo de esto, llamar es la única respuesta correcta. El aspecto de la erupción ya no cuenta entonces.",
  "Waar je dan naartoe belt": "A quién llamar entonces",
  "Binnen kantooruren": "En horario de consulta",
  "Je eigen huisarts": "Tu propio médico de cabecera",
  "Avond, nacht of weekend": "Tarde, noche o fin de semana",
  "De huisartsenpost": "El servicio de urgencias de atención primaria",
  "Iemand maakt een zieke indruk en wachten voelt niet goed":
    "Alguien da la impresión de estar enfermo y esperar no da buena sensación",
  "Hoe een uitslag": "Cómo se comporta",
  "zich gedraagt": "una erupción",
  "Niet wat je ziet maar wat het doet, zegt het meeste. Dit is ook de eerste vraag die je krijgt, bij ons en bij de huisarts.":
    "Lo que más dice no es lo que ves sino lo que hace. Esta es también la primera pregunta que te van a hacer, aquí y en el médico de cabecera.",
  "Binnen uren weg": "Desaparece en horas",
  "Bulten die opkomen en binnen een dag verdwijnen, soms elders terug. Dat patroon hoort bij galbulten, en dan telt wat eraan voorafging.":
    "Ronchas que salen y desaparecen en un día, a veces volviendo en otro sitio. Ese patrón encaja con la urticaria, y entonces cuenta lo que vino antes.",
  "Weken hetzelfde": "Igual durante semanas",
  "Plekken die blijven staan en langzaam veranderen. Dat wijst eerder op iets met de huidbarrière dan op een reactie van dat moment.":
    "Zonas que se quedan y cambian despacio. Eso apunta más a algo de la barrera cutánea que a una reacción del momento.",
  "Precies waar iets raakte": "Justo donde algo tocó",
  "Een scherpe rand die de vorm volgt van een bandje, een sieraad of een boord. De vorm verraadt dan de oorzaak, en die is meestal contact.":
    "Un borde nítido que sigue la forma de una correa, una joya o un cuello. La forma delata entonces la causa, y suele ser el contacto.",
  "Vanaf een plek naar buiten": "Hacia fuera desde un punto",
  "Begonnen op een punt en van daaruit uitgebreid. Dat verloop hoort bij een andere groep oorzaken dan iets wat overal tegelijk opkwam.":
    "Empezó en un punto y desde ahí se extendió. Ese curso pertenece a otro grupo de causas que algo que salió en todas partes a la vez.",
  "Vier die veel": "Cuatro que son",
  "voorkomen.": "frecuentes.",
  "Deze vier komen het vaakst voor. Ze helpen je beschrijven wat je ziet, en dat maakt het gesprek met de huisarts korter.":
    "Estas cuatro son las más frecuentes. Te ayudan a describir lo que ves, y eso acorta la conversación con el médico de cabecera.",
  Contactreactie: "Reacción de contacto",
  "Een afgebakende plek met een duidelijke vorm, precies waar iets je huid raakte. Begint uren tot dagen erna.":
    "Una zona delimitada con una forma clara, justo donde algo tocó tu piel. Empieza de horas a días después.",
  "Waar je heen gaat": "A dónde vas",
  "Huisarts, en die kan allergietesten aanvragen als dat nodig is.":
    "Al médico de cabecera, que puede pedir pruebas de alergia si hace falta.",
  "Jeuk staat voorop, droge schilferende plekken die steeds op dezelfde plaats terugkomen.":
    "El picor va por delante, zonas secas y descamadas que vuelven siempre al mismo sitio.",
  "Huisarts. Er bestaat behandeling voor en die begint daar.":
    "Al médico de cabecera. Existe tratamiento y empieza ahí.",
  Netelroos: "Urticaria",
  "Verheven, jeukende bulten die van plaats veranderen en binnen een dag weer weg zijn, om elders terug te komen.":
    "Ronchas elevadas y con picor que cambian de sitio y desaparecen en un día, para volver en otro lado.",
  "Huisarts. Bij zwelling van lippen of keel: bel 112.":
    "Al médico de cabecera. Con hinchazón de labios o garganta: llama al número de emergencias.",
  "Een virus": "Un virus",
  "Uitslag samen met koorts of ziek zijn, vaak vrij plotseling en verspreid over het lichaam.":
    "Erupción junto con fiebre o malestar, a menudo bastante repentina y repartida por el cuerpo.",
  "Huisarts, en met spoed als iemand er ziek bij uitziet.":
    "Al médico de cabecera, y con urgencia si la persona tiene aspecto de estar enferma.",
  "Zalf op onbekende uitslag verandert het beeld dat de arts moet beoordelen.":
    "Una pomada sobre una erupción desconocida cambia el cuadro que el médico tiene que valorar.",
  "Letten op hoe ziek iemand zich voelt. Dat weegt zwaarder dan hoe de uitslag eruitziet, en het bepaalt of je vandaag belt of morgen.":
    "Fijarte en lo enferma que se siente la persona. Eso pesa más que el aspecto de la erupción, y decide si llamas hoy o mañana.",
  "Een foto maken bij het begin. Uitslag verandert snel en de arts ziet zelden de eerste dag.":
    "Hacer una foto al principio. Una erupción cambia rápido y el médico rara vez ve el primer día.",
  "Opschrijven wanneer het begon en wat eraan voorafging: nieuw product, nieuw medicijn, iets gegeten, ergens gelopen.":
    "Apuntar cuándo empezó y qué hubo antes: un producto nuevo, un medicamento nuevo, algo que comiste, algún sitio por donde pasaste.",
  "Neem bij twijfel contact op met de huisarts of huisartsenpost. Zij kunnen beoordelen hoe snel je gezien moet worden.":
    "Si dudas, contacta con tu médico de cabecera o con el servicio de urgencias. Ellos pueden valorar con qué rapidez te tienen que ver.",
  "Koelen bij jeuk, en verder afblijven tot je weet wat het is.":
    "Aplicar frío para el picor, y por lo demás no tocarlo hasta saber qué es.",
  "Zalf of crème op onbekende uitslag smeren voordat een arts heeft gekeken. Je verandert er het beeld mee.":
    "Ponerte pomada o crema sobre una erupción desconocida antes de que un médico la haya visto. Con eso cambias el cuadro.",
  "Afwachten bij koorts, snelle uitbreiding of vlekjes die niet wegdrukken.":
    "Esperar a ver con fiebre, con una extensión rápida o con manchitas que no palidecen al presionar.",
  "Op internet zoeken naar een foto die erop lijkt. Uitslag ziet er bij iedereen anders uit en daarom een arts kijkt.":
    "Buscar en internet una foto que se parezca. Una erupción se ve distinta en cada persona, y por eso mira un médico.",
  "Een cosmetische behandeling boeken zolang er onbegrepen uitslag is.":
    "Reservar un tratamiento estético mientras haya una erupción sin explicar.",
  "Krabben, ook al is het moeilijk. Krabben maakt het beeld onduidelijker en de huid kwetsbaarder.":
    "Rascarse, por difícil que sea. Rascarse enturbia el cuadro y deja la piel más vulnerable.",
  "Kan ik aan de uitslag zien of het ernstig is?":
    "¿Puedo ver por la erupción si es grave?",
  "Niet betrouwbaar. Uitslag die er onschuldig uitziet kan alsnog ernstig zijn, en op een donkere huid is het verschil sowieso moeilijk te zien. Hoe ziek iemand zich voelt weegt zwaarder: koorts, sufheid, nekpijn of benauwdheid zijn redenen om direct te bellen.":
    "No de forma fiable. Una erupción de aspecto inofensivo puede ser grave igualmente, y en una piel oscura la diferencia es difícil de ver de todos modos. Cuenta más lo enferma que se siente la persona: fiebre, somnolencia, dolor de cuello o falta de aire son motivos para llamar de inmediato.",
  "Mijn uitslag jeukt hevig maar ik voel me verder goed.":
    "Mi erupción pica mucho pero por lo demás estoy bien.",
  "Dan is er meestal geen haast, en blijft het wel een vraag voor de huisarts. Bij zwelling van lippen, tong of keel of bij benauwdheid geldt dat niet en bel je direct.":
    "Entonces normalmente no hay prisa, y sigue siendo una pregunta para el médico de cabecera. Con hinchazón de labios, lengua o garganta, o con falta de aire, eso no vale y llamas de inmediato.",
  "Kan het van een nieuw product komen?": "¿Puede venir de un producto nuevo?",
  "Dat kan, zeker als de plek de vorm heeft van waar het product zat. Stop ermee, bewaar de verpakking en neem die mee naar je afspraak.":
    "Puede ser, sobre todo si la zona tiene la forma de donde estaba el producto. Deja de usarlo, guarda el envase y llévalo a tu cita.",
  "Waarom staat hier geen lijst met foto's?":
    "¿Por qué no hay aquí una lista de fotos?",
  "Omdat je daarmee gaat zoeken naar de foto die het meest op jou lijkt, en dat is precies de verkeerde manier. Uitslag ziet er bij iedereen anders uit, en op een donkere huid vaak heel anders dan op de foto's die je online vindt.":
    "Porque entonces te pondrías a buscar la foto que más se parece a la tuya, y eso es justo al revés. Una erupción se ve distinta en cada persona, y en una piel oscura a menudo muy distinta de las fotos que encuentras en internet.",
  "Kan ik hiervoor bij jullie terecht?": "¿Puedo ir a vosotros con esto?",
  "Bij onbegrepen uitslag stelt je huisarts eerst de diagnose. Weet je eenmaal wat het is, dan kun je bij ons terecht voor het herstel van je huidbarrière, in overleg met je arts.":
    "Con una erupción sin explicar, tu médico de cabecera hace primero el diagnóstico. Una vez que sabes qué es, puedes venir a nosotros para la reparación de tu barrera cutánea, de acuerdo con tu médico.",
  "Naar je huisarts.": "A tu médico de cabecera.",
  "Bij twijfel vandaag nog.": "Si dudas, hoy mismo.",
  "Bij onbegrepen uitslag hoort een arts de diagnose te stellen. Weet je eenmaal wat het is, dan kunnen wij daarnaast aan je huidbarrière werken, in overleg met je arts.":
    "Con una erupción sin explicar, un médico debe hacer el diagnóstico. Una vez que sabes qué es, nosotros podemos trabajar además tu barrera cutánea, de acuerdo con tu médico.",
  "Of reageert je huid op je routine":
    "O tu piel está reaccionando a tu rutina",
  "als je weet wat het is": "cuando sepas qué es",
  "Bij onbegrepen uitslag stelt een arts eerst de diagnose. Daarna kijken wij wat er aan je huidbarriere te doen valt. Weet je het nog niet, bel dan gerust; dan hoor je of het bij ons hoort of niet.":
    "Con una erupción sin explicar, un médico hace primero el diagnóstico. Después miramos nosotros qué se puede hacer con tu barrera cutánea. Si todavía no lo sabes, llama sin problema; así sabes si nos corresponde a nosotros o no.",
  Keloid: "Queloide",
  "Keloid en": "Queloides y",
  "verdikte littekens": "cicatrices engrosadas",
  "Een verdikt litteken dat binnen de wondranden blijft, behandelen we met microneedling en laser. Daarmee wordt het vlakker en minder rood.":
    "Una cicatriz engrosada que se queda dentro de los bordes de la herida la tratamos con microneedling y láser. Así se vuelve más plana y menos roja.",
  "Groeit het over de wondrand heen, dan is het een keloid en loopt de behandeling via je arts. Wij beoordelen mee en stemmen af, want een te stevige prikkel maakt een keloid groter.":
    "Si crece más allá del borde de la herida es un queloide y el tratamiento va por tu médico. Nosotros valoramos con él y nos coordinamos, porque un estímulo demasiado fuerte agranda un queloide.",
  "Twee soorten": "Dos tipos",
  "Het verschil tussen een keloid en een verdikt litteken zie je aan drie dingen. Die bepalen ook wie de behandeling doet.":
    "Un queloide se distingue de una cicatriz engrosada por tres cosas. Esas también deciden quién hace el tratamiento.",
  "Of het over de wondrand heen groeit":
    "Si crece más allá del borde de la herida",
  "Een hypertrofisch litteken blijft binnen de oorspronkelijke wond. Een keloid groeit eroverheen, de gezonde huid in.":
    "Una cicatriz hipertrófica se queda dentro de la herida original. Un queloide crece más allá, hacia la piel sana.",
  "Hoe oud het is en wat het doet": "Cuántos años tiene y qué hace",
  "Een hypertrofisch litteken wordt na maanden tot een jaar vaak vlakker. Een keloid blijft of groeit door, en dat verschil telt.":
    "Una cicatriz hipertrófica se aplana a menudo al cabo de meses o un año. Un queloide se queda o sigue creciendo, y esa diferencia cuenta.",
  "Waar het zit en of het jeukt": "Dónde está y si pica",
  "Borstbeen, schouders en oorlellen zijn de plekken waar keloid het vaakst ontstaat. Jeuk en pijn horen erbij en zeggen iets over de activiteit.":
    "El esternón, los hombros y los lóbulos de las orejas son los sitios donde más se forman queloides. El picor y el dolor forman parte y dicen algo sobre lo activo que está.",
  "Binnen of": "Dentro o",
  "over de rand": "fuera del borde",
  "Ze lijken op elkaar en vragen een andere route. Het verschil zit in de vraag of het weefsel binnen de oorspronkelijke wond blijft.":
    "Se parecen y piden rutas distintas. La diferencia está en si el tejido se queda dentro de la herida original.",
  "Verhoogd en rood, maar niet groter dan het litteken zelf":
    "Elevada y roja, pero no más grande que la propia cicatriz",
  "Verdikt litteken binnen de wondrand":
    "Cicatriz engrosada dentro del borde de la herida",
  "hypertrofisch litteken": "cicatriz hipertrófica",
  "De aanmaak van collageen is doorgeschoten tijdens de genezing, maar het weefsel blijft binnen de grenzen van de oorspronkelijke wond.":
    "La producción de colágeno se pasó durante la curación, pero el tejido se queda dentro de los límites de la herida original.",
  "Dit behandelen we, met microneedling en laser die het weefsel gelijkmatiger maken. Vaak in overleg met je arts.":
    "Esto sí lo tratamos, con microneedling y láser que uniforman el tejido. A menudo de acuerdo con tu médico.",
  "Vlakker en minder rood is haalbaar. Hoeveel en in hoeveel afspraken, hoor je na de beoordeling.":
    "Más plana y menos roja es alcanzable. Cuánto y en cuántas citas, lo sabes después de la valoración.",
  "Groeit door tot buiten het oorspronkelijke wondje":
    "Sigue creciendo fuera de la herida original",
  "Litteken dat over de rand heen groeit": "Cicatriz que crece fuera del borde",
  keloid: "queloide",
  "Het weefsel groeit over de wondranden heen, de gezonde huid in. Keloid komt vaker voor bij een donkere huid; dat hangt samen met aanleg.":
    "El tejido crece más allá de los bordes de la herida, hacia la piel sana. El queloide es más frecuente en pieles oscuras; eso va unido a la predisposición.",
  "Hier loopt de behandeling via je arts of dermatoloog. Wij beoordelen mee en stemmen af, want een te stevige prikkel maakt een keloid groter.":
    "Aquí el tratamiento va por tu médico o tu dermatólogo. Nosotros valoramos con él y nos coordinamos, porque un estímulo demasiado fuerte agranda un queloide.",
  "Met een verwijzing kijken we wat er naast de medische behandeling mogelijk is.":
    "Con un volante miramos qué es posible junto al tratamiento médico.",
  "Bij keloid telt de aanleg zwaarder dan de verzorging. Wat je wel in de hand hebt, is hoe vroeg er iemand naar kijkt.":
    "En el queloide la predisposición cuenta más que el cuidado. Lo que sí tienes en la mano es con qué antelación lo mira alguien.",
  "Een nieuw litteken beschermen tegen zon en spanning, zeker het eerste jaar":
    "Proteger una cicatriz nueva del sol y de la tensión, sobre todo el primer año",
  "Bij aanleg voor keloid dat vooraf melden bij elke ingreep, ook bij een piercing":
    "Si tienes tendencia al queloide, avisarlo antes de cualquier intervención, un piercing incluido",
  "Laten beoordelen zodra het verhoogd blijft of begint te groeien":
    "Hacerla valorar en cuanto se queda elevada o empieza a crecer",
  "Jeuk en pijn benoemen, want die zeggen iets over hoe actief het weefsel is":
    "Mencionar el picor y el dolor, porque dicen algo sobre lo activo que está el tejido",
  "Zelf krabben, knijpen of er een pleister strak overheen trekken":
    "Rascarte, apretar o pegar una tirita tirante por encima tú",
  "Een keloid laten behandelen zonder dat een arts ernaar heeft gekeken":
    "Hacer tratar un queloide sin que un médico lo haya visto",
  "Wachten tot het vanzelf overgaat. Een keloid doet dat meestal niet":
    "Esperar a que se pase solo. Un queloide normalmente no lo hace",
  "Een nieuwe piercing of tatoeage op een plek waar eerder keloid ontstond":
    "Un piercing o un tatuaje nuevo en un sitio donde antes salió un queloide",
  "Wat is het verschil met een gewoon dik litteken?":
    "¿En qué se diferencia de una cicatriz gruesa normal?",
  "Een hypertrofisch litteken blijft binnen de oorspronkelijke wond en wordt na verloop van tijd vaak vlakker. Een keloid groeit eroverheen en blijft.":
    "Una cicatriz hipertrófica se queda dentro de la herida original y con el tiempo se aplana a menudo. Un queloide crece más allá y se queda.",
  "Behandelen jullie keloid?": "¿Tratáis el queloide?",
  "De behandeling van een keloid loopt via je arts of dermatoloog. Wij beoordelen mee en stemmen af over wat er daarnaast mogelijk is, want een te stevige prikkel maakt een keloid groter.":
    "El tratamiento de un queloide va por tu médico o tu dermatólogo. Nosotros valoramos con él y nos coordinamos sobre lo que además es posible, porque un estímulo demasiado fuerte agranda un queloide.",
  "Waarom krijg ik ze en anderen niet?": "¿Por qué me salen a mí y a otros no?",
  "Aanleg speelt de grootste rol, en keloid komt vaker voor bij een donkere huid. Het zegt niets over hoe je een wond hebt verzorgd.":
    "La predisposición es lo que más influye, y el queloide es más frecuente en pieles oscuras. No dice nada sobre cómo cuidaste una herida.",
  "Kan ik nog een piercing of tatoeage nemen?":
    "¿Puedo hacerme todavía un piercing o un tatuaje?",
  "Op een plek waar eerder keloid ontstond is dat af te raden. Bespreek het met je arts voordat je iets laat zetten.":
    "En un sitio donde antes salió un queloide es desaconsejable. Háblalo con tu médico antes de hacerte nada.",
  "Komt het terug na behandeling?": "¿Vuelve después del tratamiento?",
  "Bij keloid is de kans daarop reeel, en dat is precies waarom het bij een arts hoort. Wat de kans is in jouw geval, hoor je daar.":
    "En el queloide esa posibilidad es real, y justo por eso corresponde a un médico. Cuál es esa posibilidad en tu caso, lo sabes ahí.",
  "De behandelaar stelt vast of het om een verdikt litteken of om een keloid gaat, en wat daar in jouw geval bij past. Bij een keloid overleggen we met je arts.":
    "La terapeuta determina si se trata de una cicatriz engrosada o de un queloide, y qué encaja con eso en tu caso. Con un queloide lo consultamos con tu médico.",
  "Zit hij in de weg bij het scheren, blijft hij haken achter je kraag of vind je hem gewoon lelijk: dan kijken we ernaar. Onze huidtherapeut beoordeelt het plekje, en na verwijzing van je arts coaguleren we het waar dat kan.":
    "Si te estorba al afeitarte, se engancha en el cuello de la camisa o simplemente te parece feo: lo miramos. Nuestra terapeuta de piel valora la lesión, y con un volante de tu médico la coagulamos donde se pueda.",
  "De verwijzing is geen formaliteit: alleen een arts kan weefsel laten onderzoeken, en dat kan achteraf niet meer. Met die verwijzing in de hand doen wij de rest.":
    "El volante no es un formalismo: solo un médico puede mandar analizar el tejido, y eso después ya no se puede. Con ese volante en la mano nosotros hacemos el resto.",
  "Eerst de ABCDE-check": "Primero la comprobación ABCDE",
  "Wij beoordelen het plekje en coaguleren het na verwijzing van je arts.":
    "Valoramos la lesión y la coagulamos con un volante de tu médico.",
  "Coaguleren is wegnemen met warmte, in een korte handeling per plekje. De verwijzing halen kost je een consult bij je huisarts; daarna kun je bij ons terecht.":
    "Coagular es retirar con calor, en una intervención corta por lesión. Conseguir el volante te cuesta una consulta con tu médico de cabecera; después puedes venir a nosotros.",
  "De ABCDE-check": "La comprobación ABCDE",
  "Wat er eerst gebeurt": "Lo que pasa primero",
  "Zes dingen": "Seis cosas",
  "om naar te kijken.": "en las que fijarte.",
  "Vijf letters die dermatologen gebruiken, plus een zesde die op de meeste sites ontbreekt. Loop hem langs voordat je een afspraak maakt. Hij geeft geen uitslag en kan niets uitsluiten; hij helpt je bepalen of er eerst een arts naar moet kijken.":
    "Cinco letras que usan los dermatólogos, más una sexta que en la mayoría de las webs falta. Repásala antes de pedir cita. No da ningún veredicto y no puede descartar nada; te ayuda a decidir si primero tiene que mirarlo un médico.",
  "A: Asymmetrie": "A: Asimetría",
  "Vouw het plekje in gedachten dubbel. Passen de twee helften op elkaar?":
    "Dobla la lesión por la mitad mentalmente. ¿Encajan las dos mitades?",
  "De helften lijken op elkaar": "Las dos mitades se parecen",
  "De ene helft is duidelijk anders dan de andere":
    "Una mitad es claramente distinta de la otra",
  "Een rustige moedervlek groeit gelijkmatig uit één punt en is daardoor meestal ongeveer symmetrisch.":
    "Un lunar tranquilo crece de forma uniforme desde un punto y por eso suele ser más o menos simétrico.",
  "B: Begrenzing": "B: Bordes",
  "Kijk naar de rand. Is die glad en duidelijk, of rafelig en vaag?":
    "Mira el borde. ¿Es liso y claro, o irregular y difuso?",
  "Een gladde, duidelijke rand": "Un borde liso y claro",
  "Rafelig, hoekig of uitlopend in de huid":
    "Irregular, anguloso o que se difumina en la piel",
  "De overgang naar de gewone huid zegt iets over hoe de vlek zich gedraagt aan de randen.":
    "La transición hacia la piel normal dice algo sobre cómo se comporta la lesión en sus bordes.",
  "C: Kleur": "C: Color",
  "Heeft het plekje één kleur, of meerdere tinten door elkaar?":
    "¿La lesión tiene un solo color, o varios tonos mezclados?",
  "Overal ongeveer dezelfde kleur": "Más o menos el mismo color en todo",
  "Meerdere tinten, of zwart, rood of wit erin":
    "Varios tonos, o negro, rojo o blanco dentro",
  "Verschillende kleuren binnen één plekje zijn een van de bekendste redenen om het te laten nakijken.":
    "Tener colores distintos dentro de una misma lesión es uno de los motivos más conocidos para hacerla revisar.",
  "D: Doorsnede": "D: Diámetro",
  "Is het plekje groter dan een gum op een potlood, ongeveer zes millimeter?":
    "¿La lesión es más grande que la goma de un lápiz, unos seis milímetros?",
  "Kleiner dan ongeveer zes millimeter": "Menor de unos seis milímetros",
  "Groter dan ongeveer zes millimeter": "Mayor de unos seis milímetros",
  "Grootte op zichzelf zegt weinig. Het telt vooral mee naast de andere punten, en een klein plekje dat verandert is belangrijker dan een groot plekje dat al jaren hetzelfde is.":
    "El tamaño por sí solo dice poco. Cuenta sobre todo junto a los demás puntos, y una lesión pequeña que cambia importa más que una grande que lleva años igual.",
  "E: Evolutie": "E: Evolución",
  "Is er de afgelopen maanden iets veranderd aan vorm, kleur, grootte of gevoel? Denk ook aan jeuk, bloeden of een korstje dat niet weggaat.":
    "¿Ha cambiado algo en los últimos meses en la forma, el color, el tamaño o el tacto? Piensa también en picor, sangrado o una costra que no se va.",
  "Zover ik weet niets veranderd": "Que yo sepa, no ha cambiado nada",
  "Ja, er is iets veranderd": "Sí, algo ha cambiado",
  "Dit is het belangrijkste punt van de vijf. Verandering weegt zwaarder dan hoe het plekje eruitziet, ook als de andere vier je niets opvallends laten zien.":
    "Este es el punto más importante de los cinco. El cambio pesa más que el aspecto de la lesión, incluso cuando los otros cuatro no te enseñan nada raro.",
  "Het lelijke eendje": "El patito feo",
  "Leg dit plekje naast je andere moedervlekken. Lijkt het op de rest, of valt het eruit?":
    "Pon esta lesión al lado de tus otros lunares. ¿Se parece al resto, o se sale?",
  "Het lijkt op mijn andere plekjes": "Se parece a mis otras lesiones",
  "Het wijkt duidelijk af van de rest": "Se aparta claramente del resto",
  "De moedervlekken van één persoon lijken meestal op elkaar. Eentje die er duidelijk uitspringt is daarom de moeite van het nakijken waard, ook als hij op zichzelf niets bijzonders lijkt.":
    "Los lunares de una misma persona suelen parecerse. Por eso uno que se sale claramente merece una revisión, aunque por sí solo no parezca nada especial.",
  "0 van 6 beantwoord": "0 de 6 respondidas",
  "Loop de punten hierboven langs. Wat je ook invult, de uitkomst van deze check is nooit een oordeel over jouw plekje: hij helpt je alleen te bepalen of je ermee naar de huisarts gaat.":
    "Repasa los puntos de arriba. Marques lo que marques, el resultado de esta comprobación nunca es un veredicto sobre tu lesión: solo te ayuda a decidir si vas con ella al médico de cabecera.",
  "Deze check is voorlichting en geen medisch onderzoek. Hij kan niet zien wat een arts met een dermatoscoop wel ziet, en hij kan dus ook niets uitsluiten. Bij twijfel geldt altijd hetzelfde advies: laat het nakijken.":
    "Esta comprobación es información y no un examen médico. No puede ver lo que un médico sí ve con un dermatoscopio, así que tampoco puede descartar nada. Si dudas, el consejo es siempre el mismo: haz que la revisen.",
  "Het eerste kruisje rechts is de enige op deze site die niet over geld gaat: iets laten weghalen dat verandert, betekent dat er niets meer te onderzoeken valt.":
    "La primera cruz de la derecha es la única de esta web que no va de dinero: hacer quitar algo que está cambiando significa que ya no queda nada que analizar.",
  "Eén keer per maand zelf kijken, het liefst op hetzelfde moment. Het gaat om verandering, en die zie je alleen als je een beeld in je hoofd hebt.":
    "Mirarte tú una vez al mes, mejor en el mismo momento. Se trata del cambio, y eso solo lo ves si tienes una imagen en la cabeza.",
  "Foto's maken van plekjes die je in de gaten houdt, van dichtbij en met iets ernaast voor de schaal.":
    "Hacer fotos de las lesiones que vigilas, de cerca y con algo al lado para la escala.",
  "Ook kijken waar je niet vanzelf kijkt: je rug, je hoofdhuid, tussen je tenen en onder je nagels.":
    "Mirar también donde no miras sin querer: la espalda, el cuero cabelludo, entre los dedos de los pies y bajo las uñas.",
  "Bij twijfel naar de huisarts. Daar is die spreekuur voor.":
    "Si dudas, al médico de cabecera. Para eso está la consulta.",
  "Zonbescherming serieus nemen, want dit is het onderwerp waarbij het niet om je uiterlijk gaat.":
    "Tomarte en serio la protección solar, porque este es el tema que no va de tu aspecto.",
  "Iets laten weghalen dat verandert, waar dan ook. Wat weg is kan niet meer onderzocht worden. Dat is de enige stap die je niet kunt inhalen.":
    "Hacer quitar algo que está cambiando, donde sea. Lo que ya no está no se puede analizar. Es el único paso que no puedes recuperar después.",
  "Zelf wegbranden of wegvriezen met iets uit de winkel. Hetzelfde bezwaar, met meer schade.":
    "Quemártelo o congelártelo tú con algo de una tienda. La misma objeción, con más daño.",
  "Wachten tot het pijn doet. De meeste verdachte plekjes doen nergens pijn.":
    "Esperar a que duela. La mayoría de las lesiones sospechosas no duelen nada.",
  "Afgaan op een foto-app of een oordeel van internet. Een scherm ziet geen diepte en geen verandering.":
    "Fiarte de una aplicación de fotos o de un veredicto de internet. Una pantalla no ve profundidad ni cambio.",
  "Denken dat het alleen om je gezicht gaat. Plekjes op rug, benen en voetzolen worden het vaakst over het hoofd gezien.":
    "Creer que solo va de tu cara. Las lesiones de la espalda, las piernas y las plantas de los pies son las que más se pasan por alto.",
  "Voordat we": "Antes de",
  "iets weghalen": "quitar nada",
  "Op de andere pagina's staan hier de dingen die we niet doen. Hier staan de drie stappen die aan een behandeling voorafgaan, en de eerste is de enige op deze site die je later niet kunt inhalen.":
    "En las otras páginas aquí van las cosas que no hacemos. Aquí van los tres pasos previos a un tratamiento, y el primero es el único de esta web que después no puedes recuperar.",
  "We beoordelen het plekje": "Valoramos la lesión",
  "Onze huidtherapeut kijkt naar vorm, kleur, begrenzing en of er iets aan verandert. Je hoort meteen wat we zien en wat de vervolgstap is.":
    "Nuestra terapeuta de piel mira la forma, el color, el borde y si algo está cambiando. Sabes enseguida qué vemos y cuál es el paso siguiente.",
  "Coaguleren gaat na verwijzing van je arts":
    "Coagular se hace con un volante de tu médico",
  "Met een verwijzing in de hand nemen we het plekje weg met warmte, in een korte handeling. Die volgorde staat vast: alleen een arts kan weefsel laten onderzoeken, en dat kan achteraf niet meer.":
    "Con un volante en la mano quitamos la lesión con calor, en una intervención corta. Ese orden es fijo: solo un médico puede mandar analizar el tejido, y eso después ya no se puede.",
  "We dekken moedervlekken af": "Tapamos los lunares",
  "Laseren we vlakbij, dan gaat er een dekje overheen. Licht op pigment kan het beeld veranderen, en dan klopt een latere beoordeling niet meer.":
    "Si aplicamos láser cerca, va una tapita encima. La luz sobre el pigmento puede cambiar el cuadro, y entonces una valoración posterior ya no vale.",
  "Steelwratjes weghalen, meestal in één afspraak. De behandeltijd rekenen we per kwartier.":
    "Quitar acrocordones, normalmente en una cita. El tiempo de tratamiento lo cobramos por cuarto de hora.",
  "Waarom staat deze pagina er dan überhaupt?":
    "¿Y entonces por qué existe esta página?",
  "Omdat mensen ons dit vragen tijdens een behandeling, en omdat je bij ons op de behandelstoel ligt met je huid in beeld. Wij willen dat je weet waar je op let en waar je heen moet, ook al zijn wij het niet.":
    "Porque la gente nos pregunta esto durante un tratamiento, y porque estás tumbada en nuestra camilla con la piel a la vista. Queremos que sepas en qué fijarte y a dónde ir, aunque no seamos nosotros.",
  "Kan ik bij jullie een moedervlek laten weghalen?":
    "¿Me podéis quitar un lunar?",
  "Nee. Niet bij een verdacht plekje en ook niet bij eentje waar je alleen maar vanaf wilt. Dat gaat naar de huisarts, die kan het zelf doen of doorverwijzen.":
    "No. Ni una lesión sospechosa ni una de la que simplemente quieras librarte. Eso va al médico de cabecera, que puede hacerlo o derivarte.",
  "Ik heb een behandeling gepland en er zit een moedervlek in het gebied.":
    "Tengo un tratamiento reservado y hay un lunar en la zona.",
  "Dan dekken we die af. Dat kost een halve minuut en het scheelt dat een arts later nog kan beoordelen wat er zit.":
    "Entonces lo tapamos. Eso cuesta medio minuto y hace que un médico pueda valorar después lo que hay.",
  "Krijg ik nieuwe moedervlekken van zonnen?":
    "¿Me salen lunares nuevos por tomar el sol?",
  "Zonlicht speelt een rol bij het ontstaan van nieuwe plekjes en bij het risico op huidkanker. Hoe groot die rol precies is verschilt per persoon en dat is niet iets waar wij een getal aan hangen.":
    "La luz solar influye en la aparición de lesiones nuevas y en el riesgo de cáncer de piel. Cuánto exactamente cambia de una persona a otra y no es algo a lo que le pongamos un número.",
  "Hoe vaak moet ik zelf kijken?": "¿Cada cuánto tengo que mirarme?",
  "Eén keer per maand is een veelgebruikt advies en vooral praktisch: vaak genoeg om verandering op te merken, zeldzaam genoeg om vol te houden. Vraag je huisarts wat in jouw geval verstandig is.":
    "Una vez al mes es un consejo habitual y sobre todo práctico: bastante a menudo para notar un cambio, bastante raro para poder mantenerlo. Pregunta a tu médico de cabecera qué es sensato en tu caso.",
  "Hoe het gaat": "Cómo va",
  "Het begint met": "Empieza por",
  kijken: "mirar",
  "Kom je voor iets anders en zit er een moedervlek in het gebied, dan dekken we die af en gaan we verder. Kom je voor de moedervlek zelf, dan begint het met kijken.":
    "Si vienes por otra cosa y hay un lunar en la zona, lo tapamos y seguimos. Si vienes por el lunar en sí, empieza por mirar.",
  "Ik zoek pigmentvlekken": "Busco manchas de pigmentación",
  "Verandert het?": "¿Está cambiando?",
  "Dan eerst je huisarts. Die kan weefsel laten onderzoeken en wij niet.":
    "Entonces primero tu médico de cabecera. Ellos pueden mandar analizar el tejido y nosotros no.",
  "Verandert het niet?": "¿No está cambiando?",
  "Dan kijken we er samen naar en hoor je wat er kan en wat het kost.":
    "Entonces lo miramos juntos y sabes qué se puede hacer y cuánto cuesta.",
  Weghalen: "Extracción",
  "Een korte handeling per plekje. Daarna een korstje dat vanzelf loslaat.":
    "Una intervención corta por lesión. Después una costra que se cae sola.",
  "laten verwijderen": "quitar",
  "Een zacht, huidkleurig velletje aan een smal steeltje in je hals, oksel of lies is een fibroom. Onschuldig, het gaat niet vanzelf weg, en het is meestal in een afspraak verholpen.":
    "Un colgajo blando del color de la piel en un tallito estrecho en el cuello, la axila o la ingle es un acrocordón. Inofensivo, no se va solo, y normalmente se resuelve en una cita.",
  "We rekenen per kwartier en niet per wratje, dus meerdere in een afspraak is meestal voordeliger. De huidtherapeut beoordeelt eerst elk plekje, want er hangt van alles aan een hals dat erop lijkt.":
    "Cobramos por cuarto de hora y no por acrocordón, así que varios en una cita suele salir mejor. La terapeuta de piel valora primero cada lesión, porque de un cuello cuelgan cosas muy distintas que se le parecen.",
  "De steeltjescheck": "La comprobación del tallito",
  "Wat hangt er": "Qué es lo que cuelga",
  "De huidtherapeut beoordeelt de vorm, de kleur en of het plekje aan een steeltje hangt. Dat bepaalt of het hier weg kan.":
    "La terapeuta de piel valora la forma, el color y si la lesión cuelga de un tallito. Eso decide si se puede quitar aquí.",
  "Kijk of er een steeltje is": "Mira si hay un tallito",
  "Hangt het los aan een smaller stukje huid, of zit het met een breed vlak vast? Een steeltje wijst op een fibroom, een breed vlak eerder op iets anders dat we apart bekijken.":
    "¿Cuelga suelto de un trozo de piel más estrecho, o está pegado con una base ancha? Un tallito apunta a un acrocordón; una base ancha apunta más bien a otra cosa que miramos aparte.",
  "Kijk naar de kleur": "Mira el color",
  "Huidkleurig of lichtbruin en overal gelijk is gewoon. Ongelijk bruin, zwart, of meerdere kleuren door elkaar is een reden om er eerst iemand anders naar te laten kijken.":
    "Del color de la piel o marrón claro y uniforme en todo es lo corriente. Marrón desigual, negro, o varios colores mezclados es motivo para que lo mire antes otra persona.",
  "Denk terug": "Haz memoria",
  "Zat het er een half jaar geleden precies zo bij? Onveranderd is geruststellend. Groeit het, jeukt het of bloedt het, dan gaat het naar de huisarts en niet naar ons.":
    "¿Estaba exactamente igual hace medio año? Sin cambios es tranquilizador. Si crece, pica o sangra, va al médico de cabecera y no a nosotros.",
  "Vier uitsteeksels": "Cuatro salientes",
  uitsteeksels: "salientes",
  "Ze zitten op dezelfde plekken en voelen bijna hetzelfde. Het verschil bepaalt of het hier in een kwartier klaar is.":
    "Están en los mismos sitios y se notan casi igual. La diferencia decide si aquí se resuelve en un cuarto de hora.",
  "Een velletje aan een steeltje": "Un colgajo en un tallito",
  "Een zacht hangend velletje in je hals, oksel of lies":
    "Un colgajo blando que cuelga del cuello, la axila o la ingle",
  "Een ruwe bruine bult": "Un bulto marrón rugoso",
  "Een verheven moedervlek": "Un lunar elevado",
  "Een bruine bult die er al jaren zit, soms met een haartje erin":
    "Un bulto marrón que lleva años ahí, a veces con un pelito dentro",
  "Iets dat verandert": "Algo que cambia",
  "Een plekje dat groeit, kleurt, jeukt of bloedt":
    "Una lesión que crece, cambia de color, pica o sangra",
  "fibroma pendulans, acrochordon": "fibroma pendulans, acrocordón",
  "Hangt het aan een smaller steeltje, is het zacht, huidkleurig tot lichtbruin, en zit het er al maanden onveranderd bij?":
    "¿Cuelga de un tallito más estrecho, es blando, del color de la piel o marrón claro, y lleva meses ahí sin cambiar?",
  "Een goedaardig uitstulpinkje van huid en bindweefsel, meestal op plekken waar huid over huid schuurt. Onschuldig, en het gaat niet vanzelf weg.":
    "Un pequeño saliente benigno de piel y tejido conectivo, normalmente donde la piel roza con la piel. Inofensivo, y no se va solo.",
  "Beoordelen en daarna weghalen, meestal in één afspraak. Er wordt per kwartier gerekend, dus meerdere kleine plekjes tegelijk kost niet meer per stuk.":
    "Valorar y después quitar, normalmente en una cita. Se cobra por cuarto de hora, así que varias lesiones pequeñas a la vez no cuestan más por unidad.",
  "Dit halen wij weg": "Esto sí lo quitamos",
  "Goedaardig, aan een steeltje, en onveranderd. Meestal in een afspraak klaar, en per kwartier gerekend zodat meerdere plekjes samen niet duurder uitvallen.":
    "Benigno, en un tallito, y sin cambios. Normalmente listo en una cita, y cobrado por cuarto de hora para que varias lesiones juntas no salgan más caras.",
  "Gaat het om een moedervlek?": "¿Se trata de un lunar?",
  "Dan is dit niet de plek.": "Entonces este no es el sitio.",
  "Pigmentplekjes beoordelen en verwijderen hoort bij een arts, die het weefsel kan laten onderzoeken. Wij halen ze niet weg, ook niet als ze storen.":
    "Valorar y quitar lesiones pigmentadas corresponde a un médico, que puede mandar analizar el tejido. Nosotros no las quitamos, ni siquiera cuando molestan.",
  "Naar moedervlekken": "A los lunares",
  "Bij een steelwratje is het antwoord meestal kort: als het het juiste plekje is, is het in een afspraak klaar.":
    "Con un acrocordón la respuesta suele ser corta: si es la lesión correcta, se resuelve en una cita.",
  "Elk plekje beoordelen voordat er iets mee gebeurt, ook als je precies weet wat je wil":
    "Valorar cada lesión antes de tocarla, aunque sepas exactamente lo que quieres",
  "Goedaardige steelwratjes weghalen, meestal in één afspraak":
    "Quitar acrocordones benignos, normalmente en una cita",
  "Per kwartier rekenen, zodat meerdere kleine plekjes tegelijk niet per stuk duurder worden":
    "Cobrar por cuarto de hora, para que varias lesiones pequeñas a la vez no salgan más caras por unidad",
  "Doorsturen naar de huisarts bij alles wat verandert of niet duidelijk is":
    "Derivar al médico de cabecera con todo lo que cambie o no esté claro",
  "Uitleggen waarom ze op die plekken zitten, want dan snap je waarom er nieuwe bij komen":
    "Explicar por qué salen en esos sitios, porque así entiendes por qué aparecen nuevos",
  "Iets weghalen dat verandert. Dat hoort eerst door een arts beoordeeld te worden":
    "Quitar algo que está cambiando. Eso lo tiene que valorar antes un médico",
  "Iets weghalen dat verandert. Dan is er niets meer over om te onderzoeken":
    "Quitar algo que está cambiando. Entonces no queda nada que analizar",
  "Zelf afbinden met een draadje of afknippen met een nagelschaar. Dat gaat vaak lang goed en één keer niet":
    "Atártelo tú con un hilo o cortártelo con unas tijeras de uñas. Eso sale bien mucho tiempo y una vez no",
  "Beloven dat er nooit meer nieuwe bij komen. De aanleg en de wrijving blijven":
    "Prometer que no volverán a salir nuevos. La predisposición y el roce siguen ahí",
  "Waarom krijg ik ze in mijn hals en oksels?":
    "¿Por qué me salen en el cuello y las axilas?",
  "Op die plekken schuurt huid over huid, en dat is de plek waar dit soort uitstulpinkjes ontstaan. Kleding, een ketting of een bh-bandje versnellen het. Aanleg speelt ook mee: bij sommige mensen komen ze met tientallen tegelijk.":
    "En esos sitios la piel roza con la piel, y ahí es donde se forman estos pequeños salientes. La ropa, un collar o el tirante del sujetador lo aceleran. La predisposición también influye: a algunas personas les salen por decenas.",
  "Mag ik ze zelf afbinden?": "¿Me los puedo atar yo?",
  "Liever niet, en dat is geen omzetargument. Het gaat vaak lang goed en één keer niet, en die ene keer is een ontsteking in een hals of een litteken op een ooglid. Bovendien knip je dan iets weg dat niemand meer heeft bekeken.":
    "Mejor que no, y no es un argumento comercial. Sale bien mucho tiempo y una vez no, y esa vez es una infección en un cuello o una cicatriz en un párpado. Además estarías cortando algo que nadie ha mirado.",
  "Een verwijderd steelwratje komt niet terug, maar er kunnen nieuwe ontstaan op andere plekken. De aanleg en de wrijving veranderen niet door een behandeling.":
    "Un acrocordón quitado no vuelve, pero pueden salir nuevos en otros sitios. Un tratamiento no cambia la predisposición ni el roce.",
  "Blijft er een litteken achter?": "¿Queda cicatriz?",
  "Bij een klein steelwratje meestal een rood puntje dat in weken wegtrekt. Hoe groter de basis, hoe meer kans dat er iets zichtbaar blijft. Dat bespreken we vooraf per plekje en niet achteraf.":
    "Con un acrocordón pequeño, normalmente un puntito rojo que se va en semanas. Cuanto más ancha es la base, más posibilidades de que quede algo visible. Eso lo hablamos antes por lesión y no después.",
  "Bij goedaardige steelwratjes is het een korte afspraak, per kwartier gerekend. Blijkt er iets tussen te zitten dat beoordeeld moet worden, dan hoor je dat voordat we beginnen.":
    "Con acrocordones benignos es una cita corta, cobrada por cuarto de hora. Si entre ellos hay algo que haya que valorar, lo sabes antes de empezar.",
  "Voor wie": "Para quién es",
  "Waar we zitten": "Dónde estamos",
  "Meer uitgezocht": "Más explicado",
  "Ook uitgezocht": "También explicado",
  "Ook bij ons in Rotterdam": "También con nosotros en Rotterdam",
  "Plan een afspraak": "Pide una cita",
  "Bekijk de tarieven": "Ver los precios",
  "Alle tarieven van de kliniek": "Todos los precios de la clínica",
  "Lees verder": "Sigue leyendo",
  vanaf: "desde",
  "De kliniek": "La clínica",
  "Waar je ons vindt": "Dónde encontrarnos",
  "Aan de noordkant van de stad, in een woonwijk en niet in een winkelstraat. Dat scheelt bij het parkeren en het is rustiger als je net behandeld bent.":
    "En el lado norte de la ciudad, en un barrio residencial y no en una calle comercial. Eso ayuda con el aparcamiento y es más tranquilo cuando acabas de tratarte.",
  Adres: "Dirección",
  "Je parkeert in de straat. De route vanaf de ring en met het openbaar vervoer staat op de contactpagina.":
    "Se aparca en la calle. La ruta desde la circunvalación y en transporte público está en la página de contacto.",
  "Route en contact": "Ruta y contacto",
  Openingstijden: "Horario",
  Maandag: "Lunes",
  Dinsdag: "Martes",
  Woensdag: "Miércoles",
  Donderdag: "Jueves",
  Vrijdag: "Viernes",
  Zaterdag: "Sábado",
  Zondag: "Domingo",
  Gesloten: "Cerrado",
  "De agenda is actueler dan dit rijtje: binnen openingstijden staat niet elk uur een behandelaar vrij.":
    "La agenda está más al día que esta lista: dentro del horario no hay una terapeuta libre a cada hora.",
  "Wie er werkt, met welke titel en wat die titel precies inhoudt, staat met foto en al op de teampagina.":
    "Quién trabaja aquí, con qué título y qué significa ese título exactamente, está con foto y todo en la página del equipo.",
  "Onze registraties": "Nuestros registros",
  "Twijfel je": "¿Dudas?",
  "Weet je al wel wat je zoekt maar twijfel je over het moment of de combinatie met iets anders, stel je vraag dan via WhatsApp. Daar zit een behandelaar aan de andere kant en geen formulier.":
    "Si ya sabes lo que buscas pero dudas del momento o de la combinación con otra cosa, haz tu pregunta por WhatsApp. Ahí hay una terapeuta al otro lado y no un formulario.",
  "Waar in Rotterdam zitten jullie?": "¿Dónde estáis en Rotterdam?",
  "Aan de Weissenbruchlaan 166 in Rotterdam, aan de noordkant van de stad in een woonwijk. Je parkeert in de straat. De route en de openingstijden staan op onze contactpagina.":
    "En Weissenbruchlaan 166 en Rotterdam, en el lado norte de la ciudad, en un barrio residencial. Se aparca en la calle. La ruta y el horario están en nuestra página de contacto.",
  "Laatst bijgewerkt op": "Última actualización el",
  ". Tarieven en behandeltijden worden bij elke wijziging nagelopen.":
    ". Los precios y los tiempos de tratamiento se revisan en cada cambio.",
  "Wordt er in dezelfde afspraak behandeld, dan vervallen de intakekosten en betaal je alleen de behandeling. Gaat de behandeling niet door, dan kost de intake € 50. Een losse intake zonder behandeling duurt maximaal 30 minuten en kost altijd € 50.":
    "Si te tratas en esa misma cita, la tarifa de la primera consulta se anula y pagas solo el tratamiento. Si el tratamiento no se hace, la consulta cuesta € 50. Una consulta suelta sin tratamiento dura como máximo 30 minutos y cuesta siempre € 50.",
  "Wat het kost": "Lo que cuesta",
  "Wat de intake kost": "Lo que cuesta la primera consulta",
  "Kom je voor het eerst": "¿Vienes por primera vez?",
  "Ben je hier al eerder geweest": "¿Has estado aquí antes?",
  "Naast elkaar": "Uno al lado del otro",
  Vergelijking: "Comparación",
  "Waarin het verschilt": "En qué se diferencia",
  "De werking": "Cómo actúa",
  Behandeling: "Tratamiento",
  Tarief: "Precio",
  Duur: "Duración",
  Hersteltijd: "Tiempo de recuperación",
  "bij ons kost": "cuesta con nosotros",
  "Wie de behandeling doet": "Quién hace el tratamiento",
  plannen: "reservar",
  "met je huid doet": "le hace a tu piel",
  "de alternatieven": "las alternativas",
  "Welk huidtype heb je": "Qué fototipo tienes",
  "Zwanger of borstvoeding": "Embarazo o lactancia",
  "Zon, vakantie en je huid": "El sol, las vacaciones y tu piel",
  "Hoe kies je een huidkliniek": "Cómo elegir una clínica de la piel",
  "Hoeveel sessies heb je nodig": "Cuántas sesiones necesitas",
  "Huidtherapeut in Rotterdam": "Terapeuta de piel en Rotterdam",
  "Huidanalyse in Rotterdam": "Análisis de piel en Rotterdam",
  "Cosmelan en Dermamelan": "Cosmelan y Dermamelan",
  "HydraFacial in": "HydraFacial en",
  "Een HydraFacial is een gezichtsbehandeling waarbij één mondstuk tegelijk reinigt, de bovenste huidlaag losmaakt, poriën leegzuigt en er werkzame stoffen in brengt. Bij Diba Clinics aan de Weissenbruchlaan in Rotterdam duurt de behandeling 60 minuten, kost hij 170 tot 220 euro en is er geen hersteltijd.":
    "Un HydraFacial es un tratamiento facial en el que un solo cabezal limpia, suelta la capa superior de la piel, vacía los poros y mete principios activos, todo a la vez. En Diba Clinics, en Weissenbruchlaan en Rotterdam, el tratamiento dura 60 minutos, cuesta de 170 a 220 euros y no tiene tiempo de recuperación.",
  "60 minuten": "60 minutos",
  "€ 170 tot € 220": "€ 170 a € 220",
  Geen: "Ninguno",
  "Geen.": "Ninguno.",
  Apparaat: "Equipo",
  "Het apparaat": "El equipo",
  "Wat een HydraFacial": "Lo que un HydraFacial",
  "Het begint niet bij het apparaat maar bij wat er in je huid speelt, want dat bepaalt of deze behandeling er iets aan doet.":
    "No empieza por el aparato sino por lo que pasa en tu piel, porque eso decide si este tratamiento hace algo al respecto.",
  "Je huid maakt voortdurend nieuwe cellen aan en laat de oude aan de buitenkant los. Dat loslaten gaat niet bij iedereen even vlot. Blijven die cellen te lang zitten, dan hopen ze zich samen met talg en resten van make-up op in je poriën. Dat is wat je ziet als je huid dof staat en je poriën groter lijken dan ze zijn: er zit iets in, en het licht weerkaatst niet meer op een gladde laag maar op een onregelmatige.":
    "Tu piel produce células nuevas sin parar y suelta las viejas por fuera. Ese soltar no va igual de fluido en todo el mundo. Si esas células se quedan demasiado tiempo, se acumulan en tus poros junto con el sebo y los restos de maquillaje. Eso es lo que ves cuando tu piel está apagada y tus poros parecen más grandes de lo que son: hay algo dentro, y la luz ya no rebota en una capa lisa sino en una irregular.",
  "Een HydraFacial haalt dat weg, en doet het in één beweging. In het mondstuk zit een spiraalvormig kanaal waar tegelijk onderdruk op staat en vloeistof doorheen loopt. Die twee samen maken een wervelende beweging over je huid. De vloeistof maakt de verbinding tussen de buitenste cellen los, de onderdruk trekt ze mee naar buiten samen met wat er in de porie zat, en via hetzelfde kanaal gaat er in dezelfde doorgang een serum naar binnen.":
    "Un HydraFacial se lleva eso, y lo hace en un solo movimiento. Dentro del cabezal hay un canal en espiral con succión y con líquido pasando a la vez. Los dos juntos hacen un movimiento en remolino sobre tu piel. El líquido suelta la unión entre las células exteriores, la succión las arrastra hacia fuera junto con lo que hubiera en el poro, y por ese mismo canal, en esa misma pasada, entra un sérum.",
  "De behandeling blijft aan de oppervlakte, in de hoornlaag en de bovenste opperhuid. Dat is precies de reden dat je het resultaat meteen ziet en er verder niets van merkt: er wordt niets beschadigd dat daarna moet herstellen. Het is ook de reden dat het effect tijdelijk is. Je hoornlaag vernieuwt zichzelf, dus wat je nu weghaalt bouwt zich in de weken erna weer op.":
    "El tratamiento se queda en la superficie, en la capa córnea y en la epidermis superior. Justo por eso ves el resultado al momento y no notas nada más: no se daña nada que después tenga que curarse. También es la razón de que el efecto sea temporal. Tu capa córnea se renueva sola, así que lo que quitas ahora se vuelve a acumular en las semanas siguientes.",
  "Hoe het mondstuk precies is opgebouwd en waarom de tips verschillen, staat op de pagina over de":
    "Cómo está construido el cabezal y por qué los cabezales cambian está en la página sobre el",
  ". De behandeling zelf, los van de plaats, staat op":
    ". El tratamiento en sí, al margen del lugar, está en",
  "de behandelpagina": "la página del tratamiento",
  ". Of een gezichtsbehandeling tijdens een zwangerschap kan, staat bij":
    ". Si un tratamiento facial se puede hacer durante el embarazo está en",
  "zwanger of borstvoeding": "embarazo o lactancia",
  "Merk en apparaat": "Marca y equipo",
  "HydraFacial en": "HydraFacial e",
  hydradermabrasie: "hidrodermoabrasión",
  "De namen worden door elkaar gebruikt, maar het is niet hetzelfde apparaat. Dat is de moeite waard zodra je tarieven naast elkaar legt, en niet alleen bij ons.":
    "Los nombres se usan indistintamente, pero no es el mismo equipo. Eso vale la pena saberlo en cuanto pones precios uno al lado del otro, y no solo los nuestros.",
  "HydraFacial is een merknaam en geen soort behandeling. Er bestaan meer apparaten die met onderdruk en vloeistof werken; die heten hydradermabrasie. Ze werken volgens hetzelfde principe en het resultaat gaat dezelfde kant op, maar het mondstuk, de vloeistoffen en de tips verschillen per fabrikant.":
    "HydraFacial es una marca y no un tipo de tratamiento. Existen más equipos que funcionan con succión y líquido; esos se llaman hidrodermoabrasión. Funcionan con el mismo principio y el resultado va en la misma dirección, pero el cabezal, los líquidos y las puntas cambian según el fabricante.",
  "Wij werken met de HydraFacial Syndeo, het huidige model van het merk zelf. De tips zijn wegwerpartikelen en gaan per behandeling; welke er gebruikt wordt hangt af van je huid en van het doel. Dat is geen detail voor de folder: de grofte van de spiraal bepaalt hoeveel er losgemaakt wordt.":
    "Nosotros trabajamos con el HydraFacial Syndeo, el modelo actual de la propia marca. Las puntas son de un solo uso y van por tratamiento; cuál se usa depende de tu piel y del objetivo. Eso no es un detalle de folleto: lo gruesa que sea la espiral decide cuánto se suelta.",
  "Leg je tarieven van verschillende klinieken naast elkaar, vraag dan welk apparaat er staat en welke tips erbij horen. Dat is een gewone vraag en je hoort er gewoon antwoord op te krijgen. Het antwoord bepaalt of je twee keer hetzelfde vergelijkt.":
    "Si pones precios de distintas clínicas uno al lado del otro, pregunta qué equipo tienen y qué puntas lleva. Es una pregunta normal y te tienen que contestar sin más. La respuesta decide si estás comparando dos veces lo mismo.",
  "Over dit apparaat": "Sobre este equipo",
  "Drie varianten, allemaal 60 minuten. De intakeregeling staat er compleet bij, want dat is het bedrag dat mensen bij een eerste afspraak niet zien aankomen.":
    "Tres versiones, todas de 60 minutos. La regla de la primera consulta está entera, porque ese es el importe que la gente no ve venir en una primera cita.",
  Signature: "Signature",
  Deluxe: "Deluxe",
  Platinum: "Platinum",
  "Welke van de drie bij je past bespreekt de behandelaar tijdens de intake, op basis van wat je huid nodig heeft en wat je met de behandeling wilt.":
    "Cuál de las tres encaja contigo lo habla la terapeuta durante la primera consulta, según lo que tu piel necesite y lo que quieras del tratamiento.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de HydraFacial in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el HydraFacial en esa misma cita.",
  "Dan boek je de HydraFacial rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst. Dat verandert soms de keuze van de tip of het serum.":
    "Entonces reservas el HydraFacial directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar. Eso a veces cambia la elección de la punta o del sérum.",
  "Een HydraFacial werkt op wat er in en op je huid ligt. Voor alles wat dieper zit is er een andere behandeling, en dan zeggen we dat.":
    "Un HydraFacial actúa sobre lo que hay en y sobre tu piel. Para todo lo que esté más profundo hay otro tratamiento, y entonces lo decimos.",
  "Een doffe huid en poriën waar zichtbaar iets in zit, vooral rond je neus en kin":
    "Una piel apagada y poros con algo visiblemente dentro, sobre todo alrededor de la nariz y la barbilla",
  "Een huid die er binnen een dag beter uit moet zien, bijvoorbeeld voor een gelegenheid":
    "Una piel que tiene que verse mejor en un día, por ejemplo para una ocasión",
  "Onderhoud naast een lopend traject voor acne, pigment of huidverbetering":
    "Mantenimiento junto a un programa en marcha para el acné, la pigmentación o la mejora de la piel",
  "Een eerste kennismaking als je nog niet weet wat je huid nodig heeft":
    "Una primera toma de contacto cuando todavía no sabes qué necesita tu piel",
  "Littekens en pigment dat dieper in de huid zit. Daar werkt microneedling of laser op, want die komen in de laag waar het probleem zit.":
    "Cicatrices y pigmento que está más profundo en la piel. Sobre eso actúa el microneedling o el láser, porque llegan a la capa donde está el problema.",
  "Blijvend verschil in de structuur van je huid. Een HydraFacial is onderhoud; het effect houdt dagen tot weken aan en bouwt niet op.":
    "Un cambio duradero en la textura de tu piel. Un HydraFacial es mantenimiento; el efecto dura de días a semanas y no se acumula.",
  "Actieve, ontstoken acne. Dan begint het bij het acnetraject en niet bij een losse behandeling.":
    "Acné activo e inflamado. Entonces se empieza por el programa de acné y no por un tratamiento suelto.",
  "Een huid die net gepeeld, gelaserd of genaald is. Daar houden we tijd tussen; hoeveel hangt af van wat er gedaan is.":
    "Una piel a la que se le acaba de hacer un peeling, un láser o un needling. Dejamos tiempo entre medias; cuánto depende de lo que se haya hecho.",
  "Naast de andere": "Junto a los demás",
  gezichtsbehandelingen: "tratamientos faciales",
  "Wie deze naam kent, kent de andere vaak niet. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Quien conoce este nombre a menudo no conoce los otros. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "De gezichtsbehandelingen van Diba Clinics vergeleken op werking, hersteltijd en tarief":
    "Los tratamientos faciales de Diba Clinics comparados por efecto, tiempo de recuperación y precio",
  "Haalt eruit wat erin zit en brengt in dezelfde beweging stoffen terug. Je ziet het meteen.":
    "Saca lo que hay dentro y en ese mismo movimiento devuelve principios activos. Se ve al momento.",
  "Maakt de bovenste laag los met een gel in plaats van met onderdruk, waarbij er in de huid zuurstof vrijkomt. Rustiger aan je huid, minder gericht op het legen van poriën.":
    "Suelta la capa superior con un gel en vez de con succión, liberando oxígeno en la piel. Más suave con tu piel, menos centrado en vaciar poros.",
  "Schraapt de dode laag en het donshaar er met een mesje af. Vooral voor een gladde huid onder make-up; het doet niets aan wat er in de porie zit.":
    "Raspa la capa muerta y el vello fino con una cuchilla. Sobre todo para una piel lisa bajo el maquillaje; no hace nada con lo que hay dentro del poro.",
  "Werkt met zuren en gaat dieper. Meer effect op pigment en op de structuur, en daardoor ook meer reactie van je huid na afloop.":
    "Trabaja con ácidos y llega más profundo. Más efecto sobre el pigmento y sobre la textura, y por eso también más reacción de tu piel después.",
  "Twee tot vijf dagen droog en schilferig, afhankelijk van de sterkte.":
    "De dos a cinco días seca y descamada, según la concentración.",
  "Maakt met naalden kleine kanaaltjes in de lederhuid, zodat je huid zelf collageen gaat aanmaken. Voor littekens en structuur, met een paar dagen roodheid.":
    "Hace con agujas pequeños canales en la dermis, para que tu piel produzca colágeno por sí misma. Para cicatrices y textura, con unos días de rojez.",
  "Eén tot drie dagen rood, als een stevige zonnegloed.":
    "De uno a tres días roja, como un buen rubor de sol.",
  "Een HydraFacial wordt bij ons gedaan door een huidtherapeut of een orthomoleculair huidspecialist. De huidtherapeuten staan in het Kwaliteitsregister Paramedici en zijn aangesloten bij de Nederlandse Vereniging van Huidtherapeuten.":
    "Un HydraFacial lo hace aquí una terapeuta de piel o una especialista ortomolecular de la piel. Las terapeutas de piel figuran en el registro neerlandés de profesionales paramédicos y son miembros de la asociación neerlandesa de terapeutas de piel.",
  "Reviews van klanten die hier voor een gezichtsbehandeling waren. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.":
    "Reseñas de clientes que estuvieron aquí para un tratamiento facial. Vienen directamente de nuestra agenda y están tal como se escribieron.",
  "Wat kost een HydraFacial in Rotterdam?":
    "¿Cuánto cuesta un HydraFacial en Rotterdam?",
  "Bij Diba Clinics kost een HydraFacial € 170 voor de Signature, € 190 voor de Deluxe en € 220 voor de Platinum. Een behandeling duurt 60 minuten. Kom je voor het eerst, dan boek je een behandeling op advies: die begint met een intake, en de intakekosten van € 50 vervallen zodra we in dezelfde afspraak behandelen.":
    "En Diba Clinics un HydraFacial cuesta € 170 el Signature, € 190 el Deluxe y € 220 el Platinum. El tratamiento dura 60 minutos. Si vienes por primera vez, reservas un tratamiento con asesoramiento: ese empieza con una primera consulta, y la tarifa de € 50 se anula en cuanto tratamos en esa misma cita.",
  "Hoe lang duurt een HydraFacial?": "¿Cuánto dura un HydraFacial?",
  "60 minuten. Voor een eerste afspraak reserveren we maximaal twee uur, omdat daar de intake bij komt en er geen haast mag ontstaan. Die tijd is een maximum en geen verplichting; vaak ben je eerder klaar.":
    "60 minutos. Para una primera cita reservamos como máximo dos horas, porque se suma la primera consulta y nada debe ir con prisas. Ese tiempo es un máximo y no una obligación; muchas veces acabas antes.",
  "Heb je hersteltijd na een HydraFacial?":
    "¿Hay tiempo de recuperación después de un HydraFacial?",
  "Nee. Je huid is na afloop roze en voelt strak aan, en dat trekt meestal binnen een uur weg. Make-up kan dezelfde dag nog. Je kunt er direct na de afspraak weer mee de deur uit.":
    "No. Al terminar tu piel está rosada y tirante, y eso suele irse en una hora. Puedes maquillarte ese mismo día. Puedes salir por la puerta justo después de la cita.",
  "Hoe vaak kun je een HydraFacial doen?":
    "¿Cada cuánto se puede hacer un HydraFacial?",
  "Los te doen, of maandelijks als onderhoud. Een startreeks is meestal drie tot zes behandelingen. Wat er in jouw geval zinvol is, hangt af van je huid en van wat je ermee wilt; dat bespreken we bij de intake.":
    "Suelto, o cada mes como mantenimiento. Una serie inicial suele ser de tres a seis tratamientos. Qué tiene sentido en tu caso depende de tu piel y de lo que quieras conseguir; eso lo hablamos en la primera consulta.",
  "Kan ik een HydraFacial doen vlak voor een bruiloft of feest?":
    "¿Puedo hacerme un HydraFacial justo antes de una boda o una fiesta?",
  "Ja, dat is een van de redenen dat mensen deze behandeling kiezen: het effect is er meteen en er is geen dag waarop je binnen moet blijven. Heb je hem nog nooit gehad, plan hem dan minstens een week van tevoren, zodat je weet hoe je huid erop reageert voordat het erop aankomt.":
    "Sí, y es una de las razones por las que la gente elige este tratamiento: el efecto está ahí al momento y no hay ningún día en que tengas que quedarte en casa. Si nunca te lo has hecho, resérvalo al menos una semana antes, para saber cómo reacciona tu piel antes de que llegue el día.",
  "Wat is het verschil met een gewone gezichtsbehandeling?":
    "¿En qué se diferencia de un tratamiento facial normal?",
  "Bij een klassieke gezichtsbehandeling gebeuren reinigen, uitdrukken en verzorgen na elkaar en met de hand. Bij een HydraFacial gebeurt het in één doorgang met één mondstuk, waarbij onderdruk het werk doet in plaats van vingers. Dat is gelijkmatiger over je gezicht en je huid raakt er minder van geïrriteerd.":
    "En un facial clásico, limpiar, extraer y cuidar ocurren uno detrás de otro y a mano. En un HydraFacial ocurre en una sola pasada con un solo cabezal, y el trabajo lo hace la succión en vez de los dedos. Eso es más uniforme por toda la cara y tu piel se irrita menos.",
  "Helpt een HydraFacial tegen acne?": "¿Un HydraFacial ayuda contra el acné?",
  "Bij verstopte poriën en meeëters kan het helpen, want dat is precies wat er weggehaald wordt. Bij actieve, ontstoken acne is het niet de eerste stap: dan begin je met het acnetraject, waar we de huid eerst tot rust brengen. Wat bij jou past bepaalt de behandelaar na de meting.":
    "Con poros obstruidos y puntos negros puede ayudar, porque eso es justo lo que se retira. Con acné activo e inflamado no es el primer paso: entonces empiezas por el programa de acné, donde primero calmamos la piel. Qué encaja contigo lo decide la terapeuta después de la medición.",
  "Kan een HydraFacial bij een gevoelige huid?":
    "¿Se puede hacer un HydraFacial con una piel sensible?",
  "Vaak wel. Er komen geen zuren aan te pas en de behandeling blijft aan de oppervlakte, waardoor je huid er weinig van te verduren krijgt. Bij actieve rosacea of een ontstoken huid brengen we die eerst tot rust. Of het bij jou kan, bepaalt de meting tijdens de intake.":
    "A menudo sí. No intervienen ácidos y el tratamiento se queda en la superficie, así que tu piel aguanta poco de él. Con rosácea activa o una piel inflamada, eso lo calmamos primero. Si en tu caso se puede lo decide la medición durante la primera consulta.",
  "Wordt een HydraFacial vergoed door de zorgverzekering?":
    "¿El seguro cubre un HydraFacial?",
  "Nee. Een HydraFacial is een onderhoudsbehandeling zonder medische noodzaak en valt daarmee buiten het stelsel. Heeft je klacht wel een medische reden, bijvoorbeeld bij acne of een litteken, dan is er soms een route naar vergoeding; die staat uitgelegd op onze pagina over vergoedingen.":
    "No. Un HydraFacial es un tratamiento de mantenimiento sin necesidad médica y por eso queda fuera del sistema. Si tu problema sí tiene un motivo médico, por ejemplo con acné o una cicatriz, a veces hay una vía al reembolso; está explicada en nuestra página sobre el reembolso.",
  "Weet je niet of dit de": "¿No sabes si este es el",
  "juiste behandeling": "tratamiento adecuado?",
  "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we meten je huid, bespreken wat er speelt en zeggen welke behandeling daarbij past. Blijkt een HydraFacial niet het beste antwoord op jouw vraag, dan hoor je dat en doen we die dag iets anders of niets.":
    "Tampoco hace falta que lo sepas antes de venir. Reserva un tratamiento con asesoramiento: medimos tu piel, hablamos de lo que hay y decimos qué tratamiento encaja. Si un HydraFacial resulta no ser la mejor respuesta a tu pregunta, lo sabes y ese día hacemos otra cosa, o nada.",
  "Een HydraFacial in Rotterdam": "Un HydraFacial en Rotterdam",
  "We beginnen met een meting van je huid en bespreken daarna welke behandeling erbij past. Is dat een HydraFacial, dan kan die vaak in dezelfde afspraak.":
    "Empezamos con una medición de tu piel y después hablamos de qué tratamiento encaja. Si es un HydraFacial, muchas veces se puede hacer en esa misma cita.",
  "Microneedling in": "Microneedling en",
  "Microneedling is een behandeling waarbij fijne naalden heel veel kleine kanaaltjes in de huid maken, zodat je huid zelf nieuw collageen gaat aanmaken. Bij Diba Clinics in Rotterdam werken we met de SkinPen en de Dermapen 4. Een behandeling van het gezicht kost € 180 en duurt 60 minuten, en daarna ben je een tot drie dagen rood.":
    "El microneedling es un tratamiento en el que unas agujas finas hacen muchísimos canales pequeños en la piel, para que tu piel produzca colágeno nuevo por sí misma. En Diba Clinics en Rotterdam trabajamos con el SkinPen y el Dermapen 4. Un tratamiento de la cara cuesta € 180 y dura 60 minutos, y después estás de uno a tres días roja.",
  "Vanaf € 180": "Desde € 180",
  "1 tot 3 dagen rood": "De 1 a 3 días roja",
  Reeks: "Serie",
  "3 tot 6 sessies": "De 3 a 6 sesiones",
  "De pennen": "Los dermapen",
  "Wat microneedling": "Lo que el microneedling",
  "Het resultaat komt niet van de prikjes zelf maar van wat je huid daarna doet, en daarom zie je het pas na weken.":
    "El resultado no viene de los pinchazos en sí sino de lo que tu piel hace después, y por eso solo lo ves al cabo de semanas.",
  "Onder de opperhuid ligt de lederhuid, en daar zit het bindweefsel dat je huid stevig en glad houdt. Bij een litteken, een grove porie of een huid die met de jaren minder veerkracht heeft, is dat bindweefsel ongelijk of dunner geworden. Een crème komt daar niet; die laag ligt te diep.":
    "Debajo de la epidermis está la dermis, y ahí se encuentra el tejido conectivo que mantiene tu piel firme y lisa. Con una cicatriz, un poro dilatado o una piel que ha perdido elasticidad con los años, ese tejido conectivo se ha vuelto irregular o más fino. Una crema no llega ahí; esa capa está demasiado profunda.",
  "Microneedling maakt met fijne naalden heel veel kleine kanaaltjes tot in de bovenste lederhuid. Je huid behandelt die als kleine wondjes en begint te herstellen, en bij dat herstel maakt hij nieuw collageen aan. Dat herstel is het doel; de prikjes zijn alleen de aanleiding.":
    "El microneedling hace con agujas finas muchísimos canales pequeños hasta la dermis superior. Tu piel los trata como pequeñas heridas y empieza a repararse, y en esa reparación produce colágeno nuevo. Esa reparación es el objetivo; los pinchazos son solo la ocasión.",
  "Daarom zie je het resultaat niet na één behandeling maar over een reeks. Wat je de eerste dagen ziet is roodheid en een beetje zwelling. Het echte verschil bouwt zich over weken op en wordt het best zichtbaar als de reeks van drie tot zes behandelingen klaar is, met vier tot zes weken ertussen.":
    "Por eso no ves el resultado después de un tratamiento sino a lo largo de una serie. Lo que ves los primeros días es rojez y algo de hinchazón. La diferencia de verdad se construye a lo largo de semanas y se ve mejor cuando la serie de tres a seis tratamientos está terminada, con cuatro a seis semanas entre medias.",
  "Wat microneedling bij een bepaalde klacht doet, staat apart uitgewerkt: bij":
    "Lo que el microneedling hace en un problema concreto está desarrollado aparte: en",
  ", bij": ", en",
  "grove poriën": "los poros dilatados",
  "littekens na een operatie": "las cicatrices después de una operación",
  "en bij": "y en",
  striae: "las estrías",
  ". Waarom er weken tussen de sessies zitten staat bij":
    ". Por qué hay semanas entre las sesiones está en",
  "het aantal sessies": "el número de sesiones",
  "Twee pennen": "Dos dermapen",
  "SkinPen en": "SkinPen y",
  "We werken met twee microneedlingpennen. Welke je krijgt hangt af van de zone en de diepte die daar past, en niet van welke beter is.":
    "Trabajamos con dos dermapen de microneedling. Cuál te toca depende de la zona y de la profundidad que le corresponde, y no de cuál es mejor.",
  "heeft veertien naalden en werkt iets bedaarder. De":
    "tiene catorce agujas y trabaja algo más pausado. El",
  "haalt tot 1920 prikken per seconde en werkt een vlak daardoor sneller af, met voorgeprogrammeerde standen, waaronder een instelling voor littekens op de maximale diepte. De diepte is bij allebei in te stellen van 0,25 tot 3 millimeter.":
    "llega hasta 1920 pinchazos por segundo y por eso cubre antes una zona, con modos preprogramados, entre ellos un ajuste para cicatrices a la profundidad máxima. En los dos, la profundidad se puede ajustar de 0,25 a 3 milímetros.",
  "Die diepte is de instelling die er echt toe doet. Ondiep raakt alleen de opperhuid en heelt binnen een dag; drie millimeter komt tot in het bindweefsel en vraagt langer. Rond je ogen en op je voorhoofd, waar de huid dun over bot ligt, gaat de pen minder diep dan op je wangen.":
    "Esa profundidad es el ajuste que de verdad importa. Poco profundo solo alcanza la epidermis y cura en un día; tres milímetros llega hasta el tejido conectivo y pide más tiempo. Alrededor de los ojos y en la frente, donde la piel está fina sobre el hueso, el dermapen va menos profundo que en las mejillas.",
  "De naaldcartridges zijn steriel en gaan per behandeling weg. Bij microneedling is dat geen detail, want de naalden gaan door de beschermlaag van je huid heen. Vooraf gaat er een verdovende crème op die een half uur intrekt; wat je daarna voelt is vooral trilling en druk.":
    "Los cartuchos de agujas son estériles y se tiran después de cada tratamiento. En el microneedling eso no es un detalle, porque las agujas atraviesan la capa protectora de tu piel. Antes se pone una crema anestésica que tarda media hora en hacer efecto; lo que notas después es sobre todo vibración y presión.",
  "Over de behandeling": "Sobre el tratamiento",
  "Het tarief is voor de SkinPen en de Dermapen hetzelfde en hangt af van het gebied. De intakeregeling staat er compleet bij.":
    "El precio es el mismo para el SkinPen y el Dermapen y depende de la zona. La regla de la primera consulta está entera.",
  Gezicht: "Cara",
  "Gezicht en hals": "Cara y cuello",
  "Gezicht, hals en décolleté": "Cara, cuello y escote",
  Rug: "Espalda",
  "Microneedling werkt in een reeks. Vergelijk je tarieven, reken dan met het bedrag per sessie maal het aantal sessies. Hoeveel het er bij jou worden hoor je na de meting; een vast aantal vooraf beloven we niet.":
    "El microneedling funciona en serie. Si comparas precios, cuenta con el importe por sesión multiplicado por el número de sesiones. Cuántas salen en tu caso lo sabes después de la medición; no prometemos un número fijo de antemano.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de eerste microneedling in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el primer microneedling en esa misma cita.",
  "Dan boek je de microneedling rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el microneedling directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "Microneedling werkt op de structuur van je huid. Voor pigment door zon, voor vaatjes en voor een ontstoken huid is er een ander antwoord.":
    "El microneedling actúa sobre la textura de tu piel. Para el pigmento del sol, para los vasos y para una piel inflamada hay otra respuesta.",
  "Littekens die door verlies van structuur zijn ontstaan, zoals de ondiepe kuiltjes na acne":
    "Cicatrices formadas por pérdida de estructura, como los hoyitos poco profundos después del acné",
  "Fijne lijntjes en een ongelijke textuur":
    "Líneas finas y una textura desigual",
  "Grove poriën en een huid die dof is geworden":
    "Poros dilatados y una piel que se ha vuelto apagada",
  "Pigment dat na een puistje of wondje is achtergebleven":
    "Pigmento que ha quedado después de un grano o una heridita",
  "Zonschade en losse pigmentvlekken. Daarvoor kies je laser of IPL":
    "Daño solar y manchas de pigmentación sueltas. Para eso eliges láser o IPL",
  "Een huid met actieve, ontstoken acne. Die brengen we eerst tot rust":
    "Una piel con acné activo e inflamado. Eso lo calmamos primero",
  "Een enkele sessie. Wat je na één keer ziet is zwelling; het resultaat komt over de reeks":
    "Una sola sesión. Lo que ves después de una vez es hinchazón; el resultado llega a lo largo de la serie",
  "Diepe of ingetrokken littekens met alleen microneedling. Die vragen vaak een combinatie met laser":
    "Cicatrices profundas o retraídas solo con microneedling. Esas piden a menudo una combinación con láser",
  "Microneedling of": "Microneedling o",
  "laser en peeling": "láser y peeling",
  "Voor littekens en structuur zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para las cicatrices y la textura hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "Microneedling vergeleken met laser en peeling op werking, hersteltijd en tarief":
    "El microneedling comparado con el láser y el peeling por efecto, tiempo de recuperación y precio",
  "Veertien naalden en een bedaarder ritme. Instelbaar van 0,25 tot 3 millimeter.":
    "Catorce agujas y un ritmo más pausado. Ajustable de 0,25 a 3 milímetros.",
  "Meer prikken per seconde en sneller over een groot vlak, met een vaste stand voor littekens.":
    "Más pinchazos por segundo y más rápido sobre una zona grande, con un modo fijo para cicatrices.",
  "Eén tot drie dagen rood.": "De uno a tres días roja.",
  "Laser in plaats van naalden. Voor diepere of ingetrokken littekens, vaak samen met microneedling.":
    "Láser en vez de agujas. Para cicatrices más profundas o retraídas, a menudo junto con microneedling.",
  "Een tot enkele dagen rood, afhankelijk van de diepte en de zone.":
    "De uno a unos pocos días roja, según la profundidad y la zona.",
  "Werkt met zuren op de bovenlaag. Minder diep, en meer effect op oppervlakkige verkleuring en ruwheid.":
    "Trabaja con ácidos sobre la capa superior. Menos profundo, y más efecto sobre la decoloración superficial y la aspereza.",
  "Microneedling wordt bij ons gedaan door een huidtherapeut. Die kiest per zone de diepte en de pen, en stelt die bij als je huid anders reageert dan verwacht.":
    "El microneedling lo hace aquí una terapeuta de piel. Ella elige la profundidad y el dermapen por zona, y los ajusta si tu piel reacciona de otra manera de la esperada.",
  "Reviews van klanten die hier kwamen voor littekens. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.":
    "Reseñas de clientes que vinieron aquí por cicatrices. Vienen directamente de nuestra agenda y están tal como se escribieron.",
  "Wat kost microneedling in Rotterdam?":
    "¿Cuánto cuesta el microneedling en Rotterdam?",
  "Bij Diba Clinics kost microneedling € 180 voor het gezicht en € 255 voor de rug. Met de hals erbij is het € 210, en met hals en decolleté € 240. Dat is per sessie, en microneedling werkt in een reeks van drie tot zes. Kom je voor het eerst, dan begint je afspraak met een intake; die kost € 50 en vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics el microneedling cuesta € 180 para la cara y € 255 para la espalda. Con el cuello incluido son € 210, y con cuello y escote € 240. Eso es por sesión, y el microneedling funciona en una serie de tres a seis. Si vienes por primera vez, tu cita empieza con una primera consulta; esa cuesta € 50 y se anula si tratamos en esa misma cita.",
  "Doet microneedling pijn?": "¿Duele el microneedling?",
  "Het is goed te doen. Vooraf gaat er een verdovende crème op die een half uur intrekt. Wat je daarna voelt is vooral trilling en druk, het sterkst waar de huid dun over bot ligt, zoals op je voorhoofd.":
    "Es llevadero. Antes se pone una crema anestésica que tarda media hora en hacer efecto. Lo que notas después es sobre todo vibración y presión, más fuerte donde la piel está fina sobre el hueso, como en la frente.",
  "Hoe lang ben ik rood na microneedling?":
    "¿Cuánto tiempo estoy roja después del microneedling?",
  "Een tot drie dagen, ongeveer als een stevige zonnegloed. De eerste vierentwintig uur laat je je huid met rust: geen make-up en niet sporten tot je flink zweet.":
    "De uno a tres días, más o menos como un buen rubor de sol. Las primeras veinticuatro horas dejas tu piel en paz: sin maquillaje y sin hacer deporte hasta sudar mucho.",
  "Hoeveel behandelingen heb ik nodig?": "¿Cuántos tratamientos necesito?",
  "Meestal drie tot zes, met vier tot zes weken ertussen. Hoeveel het er bij jou worden hangt af van je klacht en van hoe je huid reageert. Dat meten we tussendoor, en een vast aantal vooraf beloven we niet.":
    "Normalmente de tres a seis, con cuatro a seis semanas entre medias. Cuántos salen en tu caso depende de tu problema y de cómo reacciona tu piel. Eso lo medimos por el camino, y no prometemos un número fijo de antemano.",
  "Wanneer zie ik resultaat van microneedling?":
    "¿Cuándo veo el resultado del microneedling?",
  "Niet na de eerste keer; wat je dan ziet is zwelling. Het collageen dat je huid aanmaakt bouwt zich over weken op, dus het verschil zie je in de loop van de reeks en het duidelijkst een paar maanden na de laatste behandeling.":
    "No después de la primera vez; lo que ves entonces es hinchazón. El colágeno que produce tu piel se construye a lo largo de semanas, así que la diferencia la ves durante la serie y con más claridad unos meses después del último tratamiento.",
  "Wat is het verschil tussen de SkinPen en de Dermapen?":
    "¿Qué diferencia hay entre el SkinPen y el Dermapen?",
  "Het motorontwerp en het aantal naalden. De SkinPen heeft er veertien en werkt iets bedaarder; de Dermapen haalt meer prikken per seconde en werkt een vlak sneller af. De diepte is bij allebei in te stellen tot 3 millimeter, en het tarief is hetzelfde.":
    "El diseño del motor y el número de agujas. El SkinPen tiene catorce y trabaja algo más pausado; el Dermapen llega a más pinchazos por segundo y cubre antes una zona. En los dos la profundidad se puede ajustar hasta 3 milímetros, y el precio es el mismo.",
  "Helpt microneedling tegen acnelittekens?":
    "¿El microneedling ayuda con las cicatrices de acné?",
  "Bij littekens die door verlies van structuur zijn ontstaan, zoals de ondiepe kuiltjes na acne, kan het goed helpen. Diepe of ingetrokken littekens vragen vaak een combinatie met laser. Zolang de acne nog actief is, beginnen we er niet aan: de huid moet eerst rustig zijn.":
    "Con cicatrices formadas por pérdida de estructura, como los hoyitos poco profundos después del acné, puede ayudar bastante. Las cicatrices profundas o retraídas piden a menudo una combinación con láser. Mientras el acné siga activo no empezamos: la piel tiene que estar tranquila primero.",
  "Kan microneedling bij een donkere huid?":
    "¿Se puede hacer microneedling en una piel oscura?",
  "Vaak wel, en het is dan een van de betere opties, omdat er geen warmte aan te pas komt. Bij huidtype IV tot VI letten we extra op pigmentvorming na de behandeling en passen we de diepte daarop aan. Dat bespreken we vooraf.":
    "A menudo sí, y entonces es una de las mejores opciones, porque no interviene calor. Con los fototipos IV a VI prestamos especial atención a la formación de pigmento después del tratamiento y ajustamos la profundidad a eso. Lo hablamos antes.",
  "Weet je niet of": "¿No sabes si",
  "bij je past": "encaja contigo?",
  "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we meten je huid, kijken wat voor litteken of structuur het is en zeggen welke behandeling daarbij past. Is dat laser of een peeling, dan hoor je dat.":
    "Tampoco hace falta que lo sepas antes de venir. Reserva un tratamiento con asesoramiento: medimos tu piel, miramos qué tipo de cicatriz o de textura es y decimos qué tratamiento encaja. Si es láser o un peeling, te lo decimos.",
  "We meten je huid en bespreken welke diepte en welke pen erbij passen. Is behandelen verstandig, dan kan de eerste sessie vaak in dezelfde afspraak.":
    "Medimos tu piel y hablamos de qué profundidad y qué dermapen encajan. Si tratar es sensato, la primera sesión se puede hacer muchas veces en esa misma cita.",
  "Chemische peeling": "Peeling químico",
  "Chemische peeling in": "Peeling químico en",
  "Een chemische peeling is een behandeling waarbij een zuur de verbinding tussen de buitenste huidcellen losmaakt, zodat die laag sneller wordt vervangen. Bij Diba Clinics in Rotterdam werken we met vier merken in drie sterktes. Een peeling kost vanaf € 140 en duurt 60 minuten; afhankelijk van de sterkte ben je daarna twee tot vijf dagen droog en schilferig.":
    "Un peeling químico es un tratamiento en el que un ácido suelta la unión entre las células exteriores de la piel, para que esa capa se reemplace más rápido. En Diba Clinics en Rotterdam trabajamos con cuatro marcas en tres concentraciones. Un peeling cuesta desde € 140 y dura 60 minutos; según la concentración, después estás de dos a cinco días seca y descamada.",
  "Vanaf € 140": "Desde € 140",
  "2 tot 5 dagen": "De 2 a 5 días",
  Sterktes: "Concentraciones",
  "Drie niveaus": "Tres niveles",
  "De merken": "Las marcas",
  "Wat een peeling": "Lo que un peeling",
  "Een peeling versnelt iets wat je huid uit zichzelf al doet: de bovenste laag vervangen. Hoe ver dat gaat, hangt af van het middel.":
    "Un peeling acelera algo que tu piel ya hace por sí sola: reemplazar la capa superior. Hasta dónde llega eso depende del producto.",
  "Je huid vervangt zijn bovenste laag voortdurend, maar niet altijd even snel. Blijven de oude cellen te lang zitten, dan voelt je huid ruw, ziet hij er dof uit, raken poriën verstopt en blijft oppervlakkige verkleuring langer staan dan nodig.":
    "Tu piel reemplaza su capa superior sin parar, pero no siempre a la misma velocidad. Si las células viejas se quedan demasiado tiempo, tu piel se nota áspera, se ve apagada, los poros se obstruyen y la decoloración superficial se queda más de lo necesario.",
  "Een peeling maakt de verbinding tussen die buitenste cellen los, zodat de laag sneller wordt vervangen. Wat het middel doet, hangt af van drie dingen samen: welk zuur erin zit, hoe geconcentreerd het is en hoe zuur het mengsel als geheel is. Fruitzuren blijven in de hoornlaag, salicylzuur lost op in talg en komt daardoor in de porie, en sterkere mengsels gaan tot in de opperhuid.":
    "Un peeling suelta la unión entre esas células exteriores, para que la capa se reemplace más rápido. Lo que hace el producto depende de tres cosas juntas: qué ácido lleva, cómo de concentrado está y cómo de ácida es la mezcla en conjunto. Los ácidos de frutas se quedan en la capa córnea, el ácido salicílico se disuelve en el sebo y por eso llega al poro, y las mezclas más fuertes entran en la epidermis.",
  "Op de site en in de agenda heet dit een medische peeling. Chemische peeling is dezelfde behandeling, onder de naam waarmee de meeste mensen ernaar zoeken.":
    "En la web y en la agenda esto se llama peeling médico. Peeling químico es el mismo tratamiento, con el nombre con el que la mayoría de la gente lo busca.",
  "Per klacht staat het apart uitgewerkt: een peeling bij":
    "Está desarrollado aparte por problema: un peeling en el",
  "en voor": "y para el",
  huidverjonging: "rejuvenecimiento facial",
  ". Wat de zon rond een peeling doet staat bij":
    ". Lo que hace el sol alrededor de un peeling está en",
  "zon en je huid": "el sol y tu piel",
  ", en wat er tijdens een zwangerschap kan bij":
    ", y lo que se puede hacer durante un embarazo en",
  "De middelen": "Los productos",
  "Vier merken": "Cuatro marcas",
  "in drie sterktes": "en tres concentraciones",
  "Een peeling is geen apparaat maar een vloeistof. Welke er bij je past, hangt af van je huid op dat moment en van het seizoen.":
    "Un peeling no es un aparato sino un líquido. Cuál encaja contigo depende de tu piel en ese momento y de la estación.",
  "We werken met peelings van": "Trabajamos con peelings de",
  "Skin Tech Pharma, Dermaceutic, ADO en Mesoestetic":
    "Skin Tech Pharma, Dermaceutic, ADO y Mesoestetic",
  ", in drie niveaus. De lichtste werken op de bovenlaag en laten je meestal niet zichtbaar vervellen. De sterkste, zoals de TCA-peeling van Dermaceutic in 12 tot 20 procent, gaan dieper en vragen voorbereiding en hersteltijd.":
    ", en tres niveles. Los más suaves actúan sobre la capa superior y normalmente no te hacen descamar de forma visible. Los más fuertes, como el peeling de TCA de Dermaceutic al 12 a 20 por ciento, llegan más profundo y piden preparación y tiempo de recuperación.",
  "De inwerktijd wordt op je huid afgemeten. Langer laten zitten geeft geen beter resultaat maar meer schade, en daarom blijft de behandelaar erbij zolang de peeling op je huid zit.":
    "El tiempo de actuación se mide según tu piel. Dejarlo más rato no da mejor resultado sino más daño, y por eso la terapeuta se queda contigo mientras el peeling esté sobre tu piel.",
  "Voor een huid met ontstoken acne is een zuur soms te veel. Daarvoor is er de":
    "Para una piel con acné inflamado, un ácido a veces es demasiado. Para eso está el",
  "kruidenpeel van ADO": "peeling de hierbas de ADO",
  ": fijngemalen kruiden zonder zuur, die ontstekingsremmend en antibacterieel werken. De huid is daarna drie tot vijf dagen rood en vervelt.":
    ": hierbas molidas muy finas sin ácido, que son antiinflamatorias y antibacterianas. Después la piel está roja de tres a cinco días y se descama.",
  "Het bedrag hangt af van de peeling, het gebied en of je een kuur boekt. Bij sommige kuren zitten de producten voor thuis inbegrepen.":
    "El importe depende del peeling, de la zona y de si reservas una cura. En algunas curas están incluidos los productos para casa.",
  "Mesoestetic peeling": "Peeling Mesoestetic",
  "TCA Dermaceutic 12 tot 20%": "TCA Dermaceutic del 12 al 20%",
  "Mesoestetic peeling rug": "Peeling Mesoestetic, espalda",
  "Mesoestetic rugkuur van drie": "Cura Mesoestetic de tres, espalda",
  "TCA-kuur van drie met drie producten":
    "Cura de TCA de tres con tres productos",
  "TCA-kuur van drie met K-ceutic": "Cura de TCA de tres con K-ceutic",
  "Kruidenpeel, gezicht": "Peeling de hierbas, cara",
  "Kruidenpeel, rug": "Peeling de hierbas, espalda",
  "Kruidenpeel, rugkuur van drie":
    "Peeling de hierbas, cura de tres para la espalda",
  "Peelings werken meestal in een reeks van vier tot zes, met twee tot vier weken ertussen. Hoeveel het er bij jou worden, hoor je na de meting.":
    "Los peelings suelen funcionar en una serie de cuatro a seis, con dos a cuatro semanas entre medias. Cuántos salen en tu caso lo sabes después de la medición.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de eerste peeling in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el primer peeling en esa misma cita.",
  "Dan boek je de peeling rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el peeling directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "Een peeling werkt op de bovenste lagen. Voor littekens die dieper zitten en voor hardnekkig pigment is er een zwaardere weg.":
    "Un peeling actúa sobre las capas superiores. Para cicatrices que están más profundas y para el pigmento persistente hay una vía más potente.",
  "Oppervlakkige verkleuring, en pigment dat na een puistje is achtergebleven":
    "Decoloración superficial, y pigmento que ha quedado después de un grano",
  "Een ruwe huid en een doffe textuur": "Una piel áspera y una textura apagada",
  "Verstopte poriën, doordat de bovenlaag sneller vernieuwt":
    "Poros obstruidos, porque la capa superior se renueva más rápido",
  "Ontstoken acne, met de kruidenpeel of een peeling die daarop is afgestemd":
    "Acné inflamado, con el peeling de hierbas o un peeling ajustado a ello",
  "Littekens die dieper zitten dan de opperhuid. Daarvoor kies je microneedling":
    "Cicatrices que están más profundas que la epidermis. Para esas eliges microneedling",
  "Hardnekkig pigment of melasma. Daar zijn Cosmelan en Dermamelan de zwaardere trajecten":
    "Pigmento persistente o melasma. Ahí Cosmelan y Dermamelan son los programas más potentes",
  "Peelen vlak voor veel zon, of bij pigment in de zomermaanden":
    "Hacer un peeling justo antes de mucho sol, o con pigmento en los meses de verano",
  "Tijdens een zwangerschap of in de periode dat je borstvoeding geeft":
    "Durante un embarazo o en el periodo de lactancia",
  "Peeling naast": "El peeling junto a",
  "Voor een betere huidtextuur zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para mejorar la textura de la piel hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "De chemische peeling vergeleken met andere behandelingen op werking, hersteltijd en tarief":
    "El peeling químico comparado con otros tratamientos por efecto, tiempo de recuperación y precio",
  "Een zuur maakt de bovenlaag los. Drie sterktes, van nauwelijks vervellen tot een paar dagen schilferen.":
    "Un ácido suelta la capa superior. Tres concentraciones, desde apenas descamar hasta unos días de descamación.",
  "Kruiden in plaats van zuur. Remt de ontsteking en werkt antibacterieel, en daarom vooral bij ontstoken acne.":
    "Hierbas en vez de ácido. Calma la inflamación y actúa contra las bacterias, y por eso sobre todo en el acné inflamado.",
  "Drie tot vijf dagen.": "De tres a cinco días.",
  "Reinigt en zuigt poriën leeg, zonder zuur en zonder vervellen. Minder effect op verkleuring, en het resultaat zie je meteen.":
    "Limpia y vacía los poros, sin ácido y sin descamación. Menos efecto sobre la decoloración, y el resultado se ve al momento.",
  "Werkt met naalden in de lederhuid, dieper dan een peeling. Voor littekens en structuur.":
    "Trabaja con agujas en la dermis, más profundo que un peeling. Para cicatrices y textura.",
  "Een traject van zes maanden tegen hardnekkig pigment, met een masker in de kliniek en producten thuis.":
    "Un programa de seis meses contra el pigmento persistente, con una mascarilla en la clínica y productos en casa.",
  "Vervellen en roodheid in de eerste dagen, en maandenlang strikte zonbescherming.":
    "Descamación y rojez los primeros días, y meses de protección solar estricta.",
  "Een peeling wordt bij ons gedaan door een huidtherapeut. Die kiest de sterkte, meet de inwerktijd af op je huid en bouwt bij een reeks pas op als je huid dat aankan.":
    "Un peeling lo hace aquí una terapeuta de piel. Ella elige la concentración, mide el tiempo de actuación según tu piel y, en una serie, solo sube cuando tu piel lo aguanta.",
  "Reviews van klanten die hier voor acne kwamen, waarbij peelings vaak een deel van de behandeling zijn. Ze komen rechtstreeks uit onze agenda en staan er zoals ze geschreven zijn.":
    "Reseñas de clientes que vinieron aquí por acné, donde los peelings suelen formar parte del tratamiento. Vienen directamente de nuestra agenda y están tal como se escribieron.",
  "Wat kost een chemische peeling in Rotterdam?":
    "¿Cuánto cuesta un peeling químico en Rotterdam?",
  "Bij Diba Clinics kost een Mesoestetic-peeling € 140 en een TCA-peeling van Dermaceutic € 180. Een kruidenpeel kost € 150 voor het gezicht. Er zijn ook kuren van drie, waarvan sommige met producten voor thuis. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics un peeling Mesoestetic cuesta € 140 y un peeling de TCA de Dermaceutic € 180. Un peeling de hierbas cuesta € 150 para la cara. También hay curas de tres, algunas con productos para casa. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Wat is het verschil tussen een chemische en een medische peeling?":
    "¿Qué diferencia hay entre un peeling químico y uno médico?",
  "Er is geen verschil; het zijn twee namen voor dezelfde behandeling. Wij noemen het een medische peeling, omdat het gaat om middelen die per huid gekozen en op je huid afgemeten worden. Chemische peeling is de naam waarmee de meeste mensen zoeken.":
    "No hay ninguna diferencia; son dos nombres para el mismo tratamiento. Nosotros lo llamamos peeling médico, porque son productos elegidos por piel y medidos según tu piel. Peeling químico es el nombre con el que busca la mayoría de la gente.",
  "Ga ik vervellen na een peeling?":
    "¿Me voy a descamar después de un peeling?",
  "Bij een lichte peeling meestal niet, bij een sterkere wel. Reken bij de sterkere varianten op twee tot vijf dagen droog en schilferig. Dat hoor je vooraf, want het bepaalt wanneer je de behandeling het beste inplant.":
    "Con un peeling suave normalmente no, con uno más fuerte sí. Con las versiones más fuertes cuenta con dos a cinco días seca y descamada. Eso lo sabes antes, porque decide cuándo conviene programar el tratamiento.",
  "Kan ik een peeling in de zomer doen?":
    "¿Puedo hacerme un peeling en verano?",
  "Bij pigment liever niet, en bij de sterkere peelings ook niet. Zon op een huid die net gepeeld is, is precies de combinatie die het resultaat kost. Een lichte peeling voor de textuur kan soms wel, met strikte zonbescherming.":
    "Con pigmento mejor no, y con los peelings más fuertes tampoco. El sol sobre una piel recién tratada es justo la combinación que te cuesta el resultado. Un peeling suave para la textura a veces sí, con protección solar estricta.",
  "Hoeveel peelings heb ik nodig?": "¿Cuántos peelings necesito?",
  "Meestal een reeks van vier tot zes, met twee tot vier weken ertussen. Hoeveel het er bij jou worden, hangt af van je huid en van hoe die reageert; dat meten we tussendoor.":
    "Normalmente una serie de cuatro a seis, con dos a cuatro semanas entre medias. Cuántos salen en tu caso depende de tu piel y de cómo reacciona; eso lo medimos por el camino.",
  "Helpt een chemische peeling tegen acne?":
    "¿Un peeling químico ayuda contra el acné?",
  "Ja, peelings zijn bij acne een van de belangrijkste middelen. Bij ontstoken acne werken we met chemische peelings en met de kruidenpeel, die ook antibacterieel werkt. Littekens pakken we pas aan als de huid rustig is.":
    "Sí, los peelings son en el acné una de las herramientas más importantes. Con acné inflamado trabajamos con peelings químicos y con el peeling de hierbas, que además es antibacteriano. Las cicatrices solo las abordamos cuando la piel está tranquila.",
  "Helpt een peeling tegen pigmentvlekken?":
    "¿Un peeling ayuda con las manchas de pigmentación?",
  "Bij oppervlakkige verkleuring wel, zoals de vlekken die na een puistje achterblijven. Zit het pigment dieper of is het melasma, dan is een traject als Cosmelan of Dermamelan het passender antwoord. Welke van de twee het is, stellen we vast met een meting.":
    "Con la decoloración superficial sí, como las marcas que quedan después de un grano. Si el pigmento está más profundo o es melasma, un programa como Cosmelan o Dermamelan es la respuesta más adecuada. Cuál de los dos es lo determinamos con una medición.",
  "Kan een peeling bij een donkere huid?":
    "¿Se puede hacer un peeling en una piel oscura?",
  "Ja, en het vraagt een andere aanpak. Bij huidtype IV tot VI is de kans op nieuwe pigmentvlekken door de behandeling groter, dus kiezen we de sterkte voorzichtiger en bouwen we trager op. Dat bespreken we vooraf.":
    "Sí, y pide otro enfoque. Con los fototipos IV a VI hay más riesgo de que el tratamiento deje manchas de pigmentación nuevas, así que elegimos la concentración con más cuidado y subimos más despacio. Lo hablamos antes.",
  "Weet je niet welke": "¿No sabes qué",
  peeling: "peeling",
  "je nodig hebt": "necesitas?",
  "Dat hoef je ook niet te weten voordat je komt. We meten je huid, kijken wat er speelt en kiezen de sterkte die daarbij past. Is een peeling niet het goede antwoord, dan hoor je dat.":
    "Tampoco hace falta que lo sepas antes de venir. Medimos tu piel, miramos qué hay y elegimos la concentración que encaja. Si un peeling no es la respuesta correcta, te lo decimos.",
  "Een peeling in Rotterdam": "Un peeling en Rotterdam",
  "We meten je huid en kiezen daarna de peeling en de sterkte die erbij passen. Is behandelen verstandig, dan kan dat vaak in dezelfde afspraak.":
    "Medimos tu piel y después elegimos el peeling y la concentración que encajan. Si tratar es sensato, muchas veces se puede hacer en esa misma cita.",
  "OxyGeneo in": "OxyGeneo en",
  "OxyGeneo is een gezichtsbehandeling waarbij een capsule op de huid met een gel reageert: de bovenste laag wordt losgemaakt, werkzame stoffen gaan erin, en de huid krijgt een prikkel om meer zuurstofrijk bloed naar het oppervlak te sturen. Bij Diba Clinics in Rotterdam duurt de behandeling 60 minuten, kost hij € 150 en is er geen hersteltijd.":
    "OxyGeneo es un tratamiento facial en el que una cápsula reacciona con un gel sobre la piel: la capa superior se suelta, entran principios activos, y la piel recibe un estímulo para mandar más sangre rica en oxígeno a la superficie. En Diba Clinics en Rotterdam el tratamiento dura 60 minutos, cuesta € 150 y no tiene tiempo de recuperación.",
  "OxyGeneo, Pollogen": "OxyGeneo, Pollogen",
  "In de stoel": "En la camilla",
  "Wat OxyGeneo": "Lo que el OxyGeneo",
  "Drie dingen in één beweging: losmaken, inbrengen en de doorbloeding een zet geven. Het blijft aan de oppervlakte, en daarom zie je het meteen.":
    "Tres cosas en un solo movimiento: soltar, aportar y dar un empujón al riego. Se queda en la superficie, y por eso se ve al momento.",
  "Een huid die dof staat, heeft vaak een laag dode cellen die te lang blijft zitten, en een oppervlak dat weinig licht terugkaatst. Crèmes komen door die laag slecht heen. Wat helpt is de laag losmaken en tegelijk iets teruggeven, en dat is precies wat deze behandeling in één doorgang doet.":
    "Una piel apagada tiene a menudo una capa de células muertas que se queda demasiado tiempo, y una superficie que devuelve poca luz. Las cremas atraviesan mal esa capa. Lo que ayuda es soltar la capa y a la vez devolver algo, y eso es exactamente lo que hace este tratamiento en una sola pasada.",
  "Het handstuk beweegt een capsule over je huid terwijl er een gel op ligt. Die twee reageren met elkaar en er ontstaan kleine CO2-belletjes. Je huid reageert daarop door meer zuurstofrijk bloed naar de plek te sturen. Intussen maakt de capsule de buitenste laag los en gaan de stoffen uit de gel erin.":
    "El cabezal mueve una cápsula por tu piel mientras encima hay un gel. Los dos reaccionan y se forman pequeñas burbujas de CO2. Tu piel responde mandando más sangre rica en oxígeno a ese punto. Mientras tanto la cápsula suelta la capa exterior y entran los principios activos del gel.",
  "Het blijft aan de oppervlakte, en dat is de reden dat je er meteen iets van ziet en er verder niets van merkt. Het is ook de reden dat het effect dagen aanhoudt en geen weken. Veel mensen plannen deze behandeling daarom vlak voor een gelegenheid, of elke vier tot zes weken als onderhoud.":
    "Se queda en la superficie, y por eso ves algo al momento y no notas nada más. También es la razón de que el efecto dure días y no semanas. Por eso mucha gente programa este tratamiento justo antes de una ocasión, o cada cuatro a seis semanas como mantenimiento.",
  "Hoe het apparaat werkt staat bij de": "Cómo funciona el equipo está en el",
  "OxyGeneo van Pollogen": "OxyGeneo de Pollogen",
  "Een van de rustigste": "Uno de los más suaves",
  "Er komen geen naalden, geen zuren en geen warmte aan te pas. Wat je voelt is vooral een licht bruisen.":
    "No intervienen agujas, ni ácidos, ni calor. Lo que notas es sobre todo un ligero burbujeo.",
  "Eerst gaan make-up en talg eraf, anders werkt de rest op een laagje in plaats van op je huid. Daarna gaat de gel op en beweegt de behandelaar het handstuk in banen over je gezicht. De gel en de capsule reageren met elkaar en dat bruist licht; je hoort het meer dan dat je het voelt.":
    "Primero salen el maquillaje y el sebo, si no el resto trabaja sobre una capita en vez de sobre tu piel. Después va el gel y la terapeuta mueve el cabezal por franjas sobre tu cara. El gel y la cápsula reaccionan y eso burbujea ligeramente; lo oyes más de lo que lo notas.",
  "Erna is je huid roze en voelt hij zacht aan. Dat trekt meestal binnen een uur weg, en make-up mag dezelfde dag nog. Er is niets waar je rekening mee hoeft te houden behalve zonbescherming, en die geldt sowieso.":
    "Después tu piel está rosada y se nota suave. Eso suele irse en una hora, y puedes maquillarte ese mismo día. No hay nada que tener en cuenta salvo la protección solar, y esa vale de todos modos.",
  "Bij een huid die op dat moment ontstoken of geïrriteerd is, doen we het niet; dan brengen we je huid eerst tot rust. Bij een gevoelige huid kan het meestal wel, en dat beoordeelt de behandelaar bij de intake.":
    "En una piel que en ese momento está inflamada o irritada no lo hacemos; entonces calmamos tu piel primero. Con una piel sensible normalmente sí se puede, y eso lo valora la terapeuta en la primera consulta.",
  "Over de OxyGeneo": "Sobre el OxyGeneo",
  "Eén tarief, en geen varianten om uit te kiezen. De intakeregeling voor een eerste afspraak staat er compleet bij, want daar zit het bedrag dat mensen niet zien aankomen.":
    "Un solo precio, y ninguna versión que elegir. La regla de la primera consulta está entera, porque ahí está el importe que la gente no ve venir.",
  "Wil je het effect vasthouden, dan plan je het elke vier tot zes weken als onderhoud. Hoe vaak dat bij jou zin heeft, bespreken we bij de intake.":
    "Si quieres mantener el efecto, lo programas cada cuatro a seis semanas como mantenimiento. Con qué frecuencia tiene sentido en tu caso lo hablamos en la primera consulta.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de OxyGeneo in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el OxyGeneo en esa misma cita.",
  "Dan boek je de OxyGeneo rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el OxyGeneo directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "OxyGeneo werkt op de bovenste lagen. Voor wat dieper zit, en voor verschil dat blijft, is er een andere behandeling.":
    "El OxyGeneo actúa sobre las capas superiores. Para lo que está más profundo, y para una diferencia que se quede, hay otro tratamiento.",
  "Een doffe huid die er meteen frisser uit mag zien":
    "Una piel apagada que pueda verse más fresca al momento",
  "Een droge of vochtarme huid": "Una piel seca o deshidratada",
  "Een behandeling vlak voor een gelegenheid, zonder dag waarop je binnen moet blijven":
    "Un tratamiento justo antes de una ocasión, sin ningún día en que tengas que quedarte en casa",
  "Onderhoud naast een traject, zonder hersteltijd":
    "Mantenimiento junto a un programa, sin tiempo de recuperación",
  "Littekens of pigment dat dieper zit. Daar is microneedling of laser voor":
    "Cicatrices o pigmento que están más profundos. Para eso está el microneedling o el láser",
  "Een huid die op dat moment ontstoken of geïrriteerd is. Die brengen we eerst tot rust":
    "Una piel que en ese momento está inflamada o irritada. Eso lo calmamos primero",
  "Blijvend verschil. Het effect houdt dagen aan, dus het is onderhoud":
    "Una diferencia duradera. El efecto dura días, así que es mantenimiento",
  "Verstopte poriën legen. Daarvoor is een HydraFacial gerichter":
    "Vaciar poros obstruidos. Para eso un HydraFacial es más específico",
  "OxyGeneo naast": "El OxyGeneo junto a",
  "Voor een frissere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para una piel más fresca hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "OxyGeneo vergeleken met andere gezichtsbehandelingen op werking, hersteltijd en tarief":
    "El OxyGeneo comparado con otros tratamientos faciales por efecto, tiempo de recuperación y precio",
  "Een capsule en een gel maken de bovenlaag los en brengen stoffen in, met een prikkel voor de doorbloeding. Rustig en zonder hersteltijd.":
    "Una cápsula y un gel sueltan la capa superior y aportan principios activos, con un estímulo para el riego. Suave y sin tiempo de recuperación.",
  "Zuigt poriën leeg met onderdruk en brengt in dezelfde beweging serum terug. Gerichter op wat er in de porie zit.":
    "Vacía los poros con succión y en ese mismo movimiento devuelve sérum. Más dirigido a lo que hay dentro del poro.",
  "Een mesje haalt dode cellen en donshaar weg. Voor een gladde huid onder make-up.":
    "Una cuchilla retira células muertas y vello fino. Para una piel lisa bajo el maquillaje.",
  "Licht dat de huid rustiger maakt, zonder warmte. Vaak als toevoeging aan een andere behandeling.":
    "Luz que calma la piel, sin calor. A menudo como añadido a otro tratamiento.",
  "Een zuur maakt de bovenlaag los en gaat dieper. Meer effect op verkleuring, en meer reactie van je huid.":
    "Un ácido suelta la capa superior y llega más profundo. Más efecto sobre la decoloración, y más reacción de tu piel.",
  "De behandelaar beoordeelt vooraf of je huid er rustig genoeg voor is, en kiest de gel op wat je huid op dat moment nodig heeft.":
    "La terapeuta valora antes si tu piel está lo bastante tranquila para ello, y elige el gel según lo que tu piel necesite en ese momento.",
  "Wat kost OxyGeneo in Rotterdam?": "¿Cuánto cuesta el OxyGeneo en Rotterdam?",
  "Bij Diba Clinics kost een OxyGeneo-behandeling € 150 en duurt hij 60 minuten. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics un tratamiento de OxyGeneo cuesta € 150 y dura 60 minutos. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Wat zijn die belletjes op mijn huid?":
    "¿Qué son esas burbujas sobre mi piel?",
  "CO2 dat vrijkomt als de capsule met de gel reageert. Je huid reageert daarop met een betere doorbloeding, en dat is precies de bedoeling.":
    "CO2 que se libera cuando la cápsula reacciona con el gel. Tu piel responde con un mejor riego, y eso es exactamente lo que se busca.",
  "Voel ik iets van OxyGeneo?": "¿Se nota algo del OxyGeneo?",
  "Een licht bruisen en wat warmte. Geen prikken en geen hersteltijd; je kunt er direct mee de deur uit.":
    "Un ligero burbujeo y algo de calor. Sin pinchazos y sin tiempo de recuperación; puedes salir por la puerta al momento.",
  "Hoe lang zie ik er iets van?": "¿Cuánto tiempo se nota?",
  "Het effect houdt dagen aan, geen weken. Veel mensen plannen deze behandeling daarom vlak voor een gelegenheid, of elke vier tot zes weken als onderhoud.":
    "El efecto dura días, no semanas. Por eso mucha gente programa este tratamiento justo antes de una ocasión, o cada cuatro a seis semanas como mantenimiento.",
  "Wat is het verschil tussen OxyGeneo en een HydraFacial?":
    "¿Qué diferencia hay entre el OxyGeneo y un HydraFacial?",
  "Allebei werken ze op de bovenste laag en zonder hersteltijd. Een HydraFacial zuigt met onderdruk poriën leeg en brengt serum terug; OxyGeneo maakt de laag los met een capsule en een gel, waarbij je huid een prikkel krijgt om meer zuurstofrijk bloed naar het oppervlak te sturen. Voor verstopte poriën is de HydraFacial gerichter.":
    "Los dos actúan sobre la capa superior y sin tiempo de recuperación. Un HydraFacial vacía los poros con succión y devuelve sérum; el OxyGeneo suelta la capa con una cápsula y un gel, con lo que tu piel recibe un estímulo para mandar más sangre rica en oxígeno a la superficie. Para los poros obstruidos el HydraFacial es más específico.",
  "Kan OxyGeneo bij een gevoelige huid?":
    "¿Se puede hacer OxyGeneo con una piel sensible?",
  "Meestal wel. De behandelaar beoordeelt dat tijdens de intake; bij actieve rosacea of ontstoken acne brengen we eerst je huid tot rust.":
    "Normalmente sí. La terapeuta lo valora durante la primera consulta; con rosácea activa o acné inflamado calmamos tu piel primero.",
  "Kan ik OxyGeneo doen vlak voor een feest?":
    "¿Puedo hacerme un OxyGeneo justo antes de una fiesta?",
  "Ja, daar is hij juist geschikt voor: het effect is er meteen en er is geen dag waarop je binnen moet blijven. Je huid is na afloop kort roze, en dat trekt meestal binnen een uur weg.":
    "Sí, para eso encaja especialmente bien: el efecto está ahí al momento y no hay ningún día en que tengas que quedarte en casa. Después tu piel está un rato rosada, y eso suele irse en una hora.",
  "Hoe vaak kun je OxyGeneo doen?": "¿Cada cuánto se puede hacer un OxyGeneo?",
  "Los, of als onderhoud elke vier tot zes weken. Wat bij jou zin heeft, bespreken we bij de intake.":
    "Suelto, o como mantenimiento cada cuatro a seis semanas. Qué tiene sentido en tu caso lo hablamos en la primera consulta.",
  "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid en zeggen welke behandeling erbij past. Zitten je poriën vol, dan is een HydraFacial misschien het betere antwoord, en dat hoor je dan.":
    "Tampoco hace falta que lo sepas antes de venir. Miramos tu piel y decimos qué tratamiento encaja. Si tienes los poros llenos, quizá un HydraFacial sea la mejor respuesta, y entonces te lo decimos.",
  "We bekijken eerst je huid en zeggen daarna of OxyGeneo erbij past. Is dat zo, dan kan de behandeling vaak in dezelfde afspraak.":
    "Primero miramos tu piel y después decimos si el OxyGeneo encaja. Si es así, el tratamiento se puede hacer muchas veces en esa misma cita.",
  "Dermaplaning in": "Dermaplaning en",
  "Dermaplaning is een behandeling waarbij een chirurgisch mesje onder een vaste hoek dode huidcellen en donshaartjes van je gezicht haalt. Er komen geen zuren aan te pas. Bij Diba Clinics in Rotterdam duurt een behandeling 60 minuten en kost hij € 150; je huid is meteen glad en je hebt geen hersteltijd.":
    "El dermaplaning es un tratamiento en el que una cuchilla quirúrgica, sujeta a un ángulo fijo, retira células muertas y vello fino de tu cara. No intervienen ácidos. En Diba Clinics en Rotterdam el tratamiento dura 60 minutos y cuesta € 150; tu piel queda lisa al momento y no tienes tiempo de recuperación.",
  Werkwijze: "Cómo se hace",
  "Mesje, geen zuur": "Cuchilla, sin ácido",
  "Het haar": "El vello",
  "Wat dermaplaning": "Lo que el dermaplaning",
  "Het is de eenvoudigste behandeling in de kliniek: een steriel mesje, een strak getrokken huid en een vaste hoek. Er komt geen stroom, licht of warmte aan te pas.":
    "Es el tratamiento más sencillo de la clínica: una cuchilla estéril, la piel bien tensada y un ángulo fijo. No interviene corriente, ni luz, ni calor.",
  "De buitenste laag van je huid bestaat uit dode cellen die vanzelf loslaten, maar niet altijd even vlot. Daartussen zitten de fijne, lichte donshaartjes die bijna iedereen op het gezicht heeft. Samen maken ze het oppervlak ruwer dan het hoeft te zijn, en make-up blijft er eerder in hangen dan dat hij glad over je huid gaat.":
    "La capa exterior de tu piel está hecha de células muertas que se sueltan solas, pero no siempre con la misma fluidez. Entre ellas están los vellos finos y claros que casi todo el mundo tiene en la cara. Juntos hacen la superficie más áspera de lo que hace falta, y el maquillaje se queda enganchado en vez de deslizarse sobre tu piel.",
  "Bij dermaplaning trekt de behandelaar je huid strak en gaat het mesje er in korte halen overheen, onder een hoek van 45 graden. Het snijdt niet in de huid maar schraapt over het oppervlak. Wat eraf gaat zijn dode cellen uit de hoornlaag en de donshaartjes die daarin vastzitten; wat blijft is levende huid.":
    "En el dermaplaning la terapeuta tensa tu piel y la cuchilla pasa por encima en trazos cortos, a un ángulo de 45 grados. No corta la piel sino que raspa la superficie. Lo que sale son células muertas de la capa córnea y los vellos finos que están atrapados ahí; lo que se queda es piel viva.",
  "Omdat er geen zuur aan te pas komt, kan het ook bij een gevoelige, droge of allergische huid, en tijdens de zwangerschap. Pijn doet het niet. Het gekste eraan is het geluid: een zacht schrapen dat je eerder in je kaak voelt dan op je huid.":
    "Como no interviene ningún ácido, también sirve para una piel sensible, seca o alérgica, y durante el embarazo. No duele. Lo más raro es el sonido: un raspado suave que notas más en la mandíbula que en la piel.",
  "Hoe het mesje en de hoek precies werken staat bij de":
    "Cómo funcionan exactamente la cuchilla y el ángulo está en el",
  "Groeit het haar": "¿El vello vuelve a crecer",
  "dikker terug": "más grueso?",
  "Het is de vraag die bijna iedereen stelt, en het antwoord is nee. Hieronder waarom.":
    "Es la pregunta que hace casi todo el mundo, y la respuesta es no. Abajo está el porqué.",
  "Scheren en dermaplaning veranderen de haarschacht niet, alleen het uiteinde. Een haar dat nog nooit is afgesneden heeft een dunne, zachte punt. Na het afsnijden is die punt recht, en een recht uiteinde voelt de eerste dagen stugger aan. Dat is wat mensen voor dikker haar aanzien.":
    "Afeitar y hacer dermaplaning no cambian el tallo del pelo, solo la punta. Un pelo que nunca se ha cortado tiene una punta fina y suave. Después de cortarlo esa punta queda recta, y un extremo recto se nota más áspero los primeros días. Eso es lo que la gente confunde con un pelo más grueso.",
  "Het haar groeit terug zoals het was: even fijn en even licht. Het wordt er niet donkerder van en het komt niet sneller terug. Wie het bevalt, komt ongeveer maandelijks terug, want in die tijd is de laag dode cellen weer opgebouwd en staan de haartjes er weer.":
    "El vello vuelve a crecer como era: igual de fino e igual de claro. No se vuelve más oscuro y no sale antes. A quien le gusta vuelve más o menos cada mes, porque en ese tiempo la capa de células muertas se ha vuelto a formar y los vellos están otra vez ahí.",
  "Wil je van de haartjes af in plaats van ze bij te houden, dan is dit de verkeerde behandeling. Voor donker haar is dat":
    "Si lo que quieres es quitarte los vellos en vez de mantenerlos a raya, este es el tratamiento equivocado. Para el pelo oscuro es la",
  laserontharing: "depilación láser",
  "; voor licht, grijs of wit haar dat de laser niet ziet, is dat":
    "; para el pelo claro, gris o blanco que el láser no ve, es la",
  "elektrische epilatie": "electrólisis",
  "Eén tarief voor de hele behandeling, zonder varianten. De intakeregeling voor een eerste afspraak staat er compleet bij, want dat is het bedrag dat mensen niet zien aankomen.":
    "Un solo precio para todo el tratamiento, sin versiones. La regla de la primera consulta está entera, porque ese es el importe que la gente no ve venir.",
  "Dermaplaning gaat goed samen met een behandeling die daarna op een gladde huid werkt, zoals een peeling of een HydraFacial. Wat er in jouw geval bij past, bespreken we bij de intake.":
    "El dermaplaning combina bien con un tratamiento que después actúe sobre una piel lisa, como un peeling o un HydraFacial. Qué encaja en tu caso lo hablamos en la primera consulta.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de dermaplaning in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el dermaplaning en esa misma cita.",
  "Dan boek je de dermaplaning rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el dermaplaning directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "Dermaplaning werkt op de buitenste laag. Voor wat dieper zit, en voor haar dat weg moet blijven, is er een andere behandeling.":
    "El dermaplaning actúa sobre la capa exterior. Para lo que está más profundo, y para el vello que debe desaparecer para siempre, hay otro tratamiento.",
  "Een ruwe of doffe huid die direct glad en egaal moet zijn":
    "Una piel áspera o apagada que tenga que quedar lisa y uniforme al momento",
  "Een huid die geen zuren verdraagt, zoals een gevoelige, droge of allergische huid":
    "Una piel que no tolera los ácidos, como una piel sensible, seca o alérgica",
  "Een gladde basis voor make-up, of een behandeling vlak voor een gelegenheid":
    "Una base lisa para el maquillaje, o un tratamiento justo antes de una ocasión",
  "Een combinatie met bijna elke andere behandeling":
    "Una combinación con casi cualquier otro tratamiento",
  "Pigment of littekens die dieper zitten. Daarvoor kies je laser of microneedling":
    "Pigmento o cicatrices que están más profundos. Para eso eliges láser o microneedling",
  "Blijvend minder haar. De donshaartjes groeien terug zoals ze waren":
    "Menos vello de forma permanente. Los vellos finos vuelven a crecer como eran",
  "Een huid met actieve ontstekingen of een beschadigde barrière. Dan doen we het niet":
    "Una piel con inflamaciones activas o con la barrera dañada. Entonces no lo hacemos",
  "Verschil dat blijft. Het effect duurt tot de laag dode cellen weer is opgebouwd, meestal een paar weken":
    "Una diferencia que se quede. El efecto dura hasta que la capa de células muertas se ha vuelto a formar, normalmente unas semanas",
  "Dermaplaning naast": "El dermaplaning junto a",
  "Voor een gladdere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para una piel más lisa hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "Dermaplaning vergeleken met andere behandelingen voor een gladdere huid op werking, hersteltijd en tarief":
    "El dermaplaning comparado con otros tratamientos para una piel más lisa por efecto, tiempo de recuperación y precio",
  "Een mesje haalt dode cellen en donshaar weg. Geen zuur, en het resultaat is er meteen.":
    "Una cuchilla retira células muertas y vello fino. Sin ácido, y el resultado está ahí al momento.",
  "Reinigt en zuigt poriën leeg met onderdruk en brengt stoffen terug. Werkt ook op wat er in de porie zit.":
    "Limpia y vacía los poros con succión y devuelve principios activos. Actúa también sobre lo que hay dentro del poro.",
  "Maakt de bovenlaag los met een gel en een capsule, waarbij je huid een prikkel krijgt voor de doorbloeding.":
    "Suelta la capa superior con un gel y una cápsula, con lo que tu piel recibe un estímulo para el riego.",
  "De behandelaar beoordeelt eerst of je huid rustig genoeg is, want bij een actieve ontsteking gaat het mesje er niet overheen.":
    "La terapeuta valora primero si tu piel está lo bastante tranquila, porque la cuchilla no pasa por encima de una inflamación activa.",
  "Wat kost dermaplaning in Rotterdam?":
    "¿Cuánto cuesta el dermaplaning en Rotterdam?",
  "Bij Diba Clinics kost dermaplaning € 150 en duurt een behandeling 60 minuten. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics el dermaplaning cuesta € 150 y un tratamiento dura 60 minutos. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Groeit mijn haar dikker terug na dermaplaning?":
    "¿Mi vello vuelve a crecer más grueso después del dermaplaning?",
  "Nee. Dermaplaning verandert de haarschacht niet, alleen het uiteinde. Een recht afgesneden punt voelt de eerste dagen stugger dan een punt die nog nooit geknipt is, en dat voelt als dikker haar. Het haar groeit terug zoals het was: even fijn en even licht.":
    "No. El dermaplaning no cambia el tallo del pelo, solo la punta. Una punta cortada recta se nota más áspera los primeros días que una punta que nunca se ha cortado, y eso se siente como pelo más grueso. El vello vuelve a crecer como era: igual de fino e igual de claro.",
  "Doet dermaplaning pijn?": "¿Duele el dermaplaning?",
  "Nee. Je voelt het mesje in korte halen over je huid gaan, en je hoort vooral een zacht schrapen. Het is een van de rustigste behandelingen die we doen.":
    "No. Notas la cuchilla pasando por tu piel en trazos cortos, y sobre todo oyes un raspado suave. Es uno de los tratamientos más tranquilos que hacemos.",
  "Snijdt het mesje in mijn huid?": "¿La cuchilla corta mi piel?",
  "Nee, het schraapt over het oppervlak onder een vaste hoek. Wat eraf gaat zijn dode cellen uit de hoornlaag en de donshaartjes die daarin vastzitten.":
    "No, raspa la superficie a un ángulo fijo. Lo que sale son células muertas de la capa córnea y los vellos finos que están atrapados ahí.",
  "Hoe vaak kun je dermaplaning doen?":
    "¿Cada cuánto se puede hacer dermaplaning?",
  "Los, of elke vier tot zes weken als onderhoud. In die tijd is de laag dode cellen weer opgebouwd en staan de donshaartjes er weer.":
    "Suelto, o cada cuatro a seis semanas como mantenimiento. En ese tiempo la capa de células muertas se ha vuelto a formar y los vellos finos están otra vez ahí.",
  "Kan dermaplaning tijdens de zwangerschap?":
    "¿Se puede hacer dermaplaning durante el embarazo?",
  "Meestal wel, want er komen geen zuren of andere middelen aan te pas. Vertel het ons wel bij de intake, dan houden we er rekening mee bij wat er verder op je huid komt.":
    "Normalmente sí, porque no intervienen ácidos ni otros productos. Eso sí, dilo en la primera consulta, para que lo tengamos en cuenta con lo demás que se ponga en tu piel.",
  "Kan dermaplaning bij een gevoelige huid?":
    "¿Se puede hacer dermaplaning con una piel sensible?",
  "Vaak wel, want er komen geen zuren aan te pas. Bij actieve ontstekingen of een beschadigde barrière doen we het niet. Of het bij jou kan, bepaalt de behandelaar bij de intake.":
    "A menudo sí, porque no intervienen ácidos. Con inflamaciones activas o con la barrera dañada no lo hacemos. Si en tu caso se puede lo decide la terapeuta en la primera consulta.",
  "Waarom neemt mijn crème daarna beter op?":
    "¿Por qué mi crema absorbe mejor después?",
  "Omdat de laag dode cellen eraf is die er anders tussen zit. Dat effect is tijdelijk en duurt zolang die laag zich niet heeft hersteld.":
    "Porque ya no está la capa de células muertas que si no se interpone. Ese efecto es temporal y dura mientras esa capa no se haya recuperado.",
  dermaplaning: "dermaplaning",
  "Dat hoef je ook niet te weten voordat je komt. Boek een behandeling op advies: we bekijken je huid en zeggen welke behandeling erbij past. Is dat een peeling of een HydraFacial, dan hoor je dat.":
    "Tampoco hace falta que lo sepas antes de venir. Reserva un tratamiento con asesoramiento: miramos tu piel y decimos qué tratamiento encaja. Si es un peeling o un HydraFacial, te lo decimos.",
  "We bekijken eerst je huid en zeggen daarna of dermaplaning erbij past. Is dat zo, dan kan de behandeling vaak in dezelfde afspraak.":
    "Primero miramos tu piel y después decimos si el dermaplaning encaja. Si es así, el tratamiento se puede hacer muchas veces en esa misma cita.",
  "IPL-behandeling in": "Tratamiento IPL en",
  "IPL is een behandeling met intens gepulst licht dat pigment en kleine vaatjes in de huid opzoekt, zodat vlekken vervagen en roodheid wegtrekt. Bij Diba Clinics in Rotterdam werken we met de Nordlys van Candela. Een behandeling duurt 30 minuten en kost € 75 voor de neus tot € 250 voor het hele gelaat, en je bent meestal een paar uur rood.":
    "El IPL es un tratamiento con luz pulsada intensa que busca el pigmento y los vasos pequeños de la piel, para que las manchas se difuminen y la rojez desaparezca. En Diba Clinics en Rotterdam trabajamos con el Nordlys de Candela. Un tratamiento dura 30 minutos y cuesta de € 75 para la nariz hasta € 250 para toda la cara, y normalmente estás unas horas roja.",
  "30 minuten": "30 minutos",
  "€ 75 tot € 250": "€ 75 a € 250",
  "Een paar uur rood": "Unas horas roja",
  "Nordlys, Candela": "Nordlys, Candela",
  "Geen laser": "No es un láser",
  "Wat IPL": "Lo que el IPL",
  "Het licht zoekt kleur op. In een pigmentvlek is dat melanine, in een vaatje is het bloed, en daar gaat de energie naartoe.":
    "La luz busca el color. En una mancha de pigmentación eso es la melanina, en un vaso es la sangre, y ahí es donde va la energía.",
  "IPL stuurt geen enkele golflengte de huid in maar een band, met een filter dat het grofste eruit haalt. Die band raakt daardoor meerdere dingen tegelijk: oppervlakkig pigment, zichtbare vaatjes en een huid die structureel rood staat. Het licht komt gemiddeld minder diep dan een laser, en dat is precies wat oppervlakkige klachten nodig hebben.":
    "El IPL no manda a la piel una sola longitud de onda sino una banda, con un filtro que retira lo más basto. Por eso esa banda alcanza varias cosas a la vez: pigmento superficial, vasos visibles y una piel que está roja de forma estructural. De media la luz llega menos profundo que un láser, y eso es justo lo que necesitan los problemas superficiales.",
  "Bij pigment neemt de vlek de energie op, wordt hij korrelig en werkt hij naar de oppervlakte. In de dagen erna wordt de vlek eerst donkerder en vervaagt hij daarna. Dat donkerder worden hoort erbij en betekent niet dat het erger wordt.":
    "Con el pigmento, la mancha absorbe la energía, se vuelve granulosa y va subiendo a la superficie. En los días siguientes la mancha primero se oscurece y después se difumina. Ese oscurecimiento forma parte del proceso y no significa que vaya a peor.",
  "Bij roodheid mikt het licht op het bloed in de vaatjes. Dat warmt op, het vaatje klapt dicht en wordt door je lichaam opgeruimd. Bij rosacea gaat het minder om een los vaatje en meer om een gebied dat structureel rood staat; dan werkt het licht over het hele vlak.":
    "Con la rojez, la luz apunta a la sangre de los vasos. Esta se calienta, el vaso se cierra y tu cuerpo lo retira. En la rosácea no se trata tanto de un vaso suelto sino de una zona que está roja de forma estructural; entonces la luz trabaja sobre toda la superficie.",
  "Per klacht staat het apart uitgewerkt: IPL bij":
    "Está desarrollado aparte por problema: IPL en las",
  zonnevlekken: "manchas solares",
  rosacea: "rosácea",
  ". Begin je liever bij de klacht, kijk dan bij":
    ". Si prefieres empezar por el problema, mira en",
  pigmentvlekken: "manchas de pigmentación",
  ". Welke rol je huidtype hierbij speelt staat bij":
    ". El papel que juega aquí tu fototipo está en",
  "het Fitzpatrick-huidtype": "el fototipo de Fitzpatrick",
  "IPL is": "El IPL",
  "geen laser": "no es un láser",
  "De twee worden vaak door elkaar gehaald. Het verschil bepaalt waarvoor je welk apparaat kiest.":
    "Los dos se confunden a menudo. La diferencia decide qué equipo eliges para qué.",
  "Een laser zendt één golflengte uit en is daarmee heel precies. IPL zendt een band uit, raakt daardoor meerdere doelen tegelijk en werkt over een groter vlak. Voor één specifiek plekje is een laser preciezer; voor zonschade verspreid over je wangen is IPL sneller en gelijkmatiger.":
    "Un láser emite una sola longitud de onda y por eso es muy preciso. El IPL emite una banda, con lo que alcanza varios objetivos a la vez y cubre una zona más grande. Para una sola lesión concreta un láser es más preciso; para el daño solar repartido por las mejillas, el IPL es más rápido y más uniforme.",
  "Wij werken met de": "Trabajamos con el",
  "Nordlys van Candela": "Nordlys de Candela",
  ". Candela noemt zijn variant Selective Waveband Technology: twee filters knippen de boven- en onderkant van het spectrum weg, zodat er een smallere band overblijft dan bij gewone IPL, met pulsen korter dan een milliseconde.":
    ". Candela llama a su versión Selective Waveband Technology: dos filtros recortan la parte alta y la baja del espectro, con lo que queda una banda más estrecha que en un IPL corriente, con pulsos de menos de un milisegundo.",
  "Welke band er uitkomt, hangt af van het handstuk dat de behandelaar kiest. Voor pigment is dat een ander dan voor vaatjes, want elke band is gekozen rond wat hij moet raken.":
    "Qué banda sale depende del cabezal que elija la terapeuta. Para el pigmento es otro que para los vasos, porque cada banda está elegida en torno a lo que tiene que alcanzar.",
  "Over de Nordlys": "Sobre el Nordlys",
  "Het tarief hangt af van de zone en is voor pigment en roodheid hetzelfde. De intakeregeling staat er compleet bij.":
    "El precio depende de la zona y es el mismo para el pigmento y para la rojez. La regla de la primera consulta está entera.",
  "Wangen, neus en kin": "Mejillas, nariz y barbilla",
  "Hele gelaat": "Toda la cara",
  "IPL werkt in een reeks van drie tot zes behandelingen, met vier weken ertussen. Bij rosacea hoort daarna onderhoud, omdat de roodheid kan terugkomen.":
    "El IPL funciona en una serie de tres a seis tratamientos, con cuatro semanas entre medias. En la rosácea después va mantenimiento, porque la rojez puede volver.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de eerste IPL-behandeling in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el primer tratamiento IPL en esa misma cita.",
  "Dan boek je de IPL-behandeling rechtstreeks in de agenda. Reken op 30 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el tratamiento IPL directamente en la agenda. Cuenta con 30 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "IPL werkt op wat oppervlakkig zit en kleur heeft. Voor melasma, voor wat diep zit en in de zomer kiezen we iets anders of wachten we.":
    "El IPL actúa sobre lo que está cerca de la superficie y tiene color. Para el melasma, para lo que está profundo y en verano elegimos otra cosa o esperamos.",
  "Zonschade en scherp afgebakende pigmentvlekken, ook over een groot vlak":
    "Daño solar y manchas de pigmentación de borde nítido, también en una zona grande",
  "Losse zichtbare vaatjes, bijvoorbeeld rond de neusvleugels":
    "Vasos visibles sueltos, por ejemplo alrededor de las aletas de la nariz",
  "Een gebied dat structureel rood staat, zoals bij rosacea":
    "Una zona que está roja de forma estructural, como en la rosácea",
  "Weinig hersteltijd: meestal ben je dezelfde dag weer presentabel":
    "Poco tiempo de recuperación: normalmente vuelves a estar presentable el mismo día",
  "Melasma. Dat pigment reageert vaak juist op warmte, en daar is IPL niet de eerste keuze":
    "El melasma. Ese pigmento reacciona a menudo justo al calor, y ahí el IPL no es la primera opción",
  "Pigment in de zomermaanden. Tussen mei en augustus behandelen we pigment niet":
    "Pigmento en los meses de verano. Entre mayo y agosto no tratamos el pigmento",
  "Rosacea genezen. IPL haalt de zichtbare roodheid weg, en die kan terugkomen":
    "Curar la rosácea. El IPL retira la rojez visible, y esa puede volver",
  "Elk huidtype. Bij een donkere huid is de kans op nieuwe pigmentvlekken groter, en dan kiezen we een andere behandeling":
    "Cualquier fototipo. En una piel oscura hay más riesgo de manchas de pigmentación nuevas, y entonces elegimos otro tratamiento",
  "IPL naast": "El IPL junto a",
  "Voor pigment en roodheid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para el pigmento y la rojez hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "IPL vergeleken met andere behandelingen voor pigment en roodheid op werking, hersteltijd en tarief":
    "El IPL comparado con otros tratamientos para el pigmento y la rojez por efecto, tiempo de recuperación y precio",
  "Licht op scherp afgebakende vlekken en zonschade. De vlek wordt eerst donkerder en vervaagt daarna.":
    "Luz sobre manchas de borde nítido y daño solar. La mancha primero se oscurece y después se difumina.",
  "Meestal een paar uur rood.": "Normalmente unas horas roja.",
  "Licht op het bloed in de vaatjes. Voor couperose, losse vaatjes en rosacea.":
    "Luz sobre la sangre de los vasos. Para la cuperosis, los vasos sueltos y la rosácea.",
  "Een paar uur rood, en de behandelde vaatjes zijn eerst donkerder voor ze wegtrekken.":
    "Unas horas roja, y los vasos tratados están primero más oscuros antes de desaparecer.",
  "Een traject van zes maanden dat de aanmaak van pigment remt, voor hardnekkig pigment waar losse behandelingen op stuklopen.":
    "Un programa de seis meses que frena la producción de pigmento, para el pigmento persistente con el que fracasan los tratamientos sueltos.",
  "Een zuur op de bovenlaag. Werkt op oppervlakkige verkleuring, zonder warmte.":
    "Un ácido sobre la capa superior. Actúa sobre la decoloración superficial, sin calor.",
  "Licht dat de huid rustiger maakt, zonder warmte en zonder hersteltijd. Vaak naast een andere behandeling bij roodheid.":
    "Luz que calma la piel, sin calor y sin tiempo de recuperación. A menudo junto a otro tratamiento para la rojez.",
  "IPL wordt bij ons gedaan door een huidtherapeut of een laserspecialist. Die kiest per zone het handstuk en de instelling, en past die aan op je huidtype.":
    "El IPL lo hace aquí una terapeuta de piel o una especialista en láser. Ella elige el cabezal y el ajuste por zona, y los adapta a tu fototipo.",
  "Wat kost een IPL-behandeling in Rotterdam?":
    "¿Cuánto cuesta un tratamiento IPL en Rotterdam?",
  "Bij Diba Clinics kost IPL € 75 voor de neus, € 150 voor de wangen en € 250 voor het hele gelaat; wangen, neus en kin samen kosten € 200. Dat geldt voor pigment en voor roodheid. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics el IPL cuesta € 75 para la nariz, € 150 para las mejillas y € 250 para toda la cara; mejillas, nariz y barbilla juntas cuestan € 200. Eso vale para el pigmento y para la rojez. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Is IPL hetzelfde als laser?": "¿El IPL es lo mismo que el láser?",
  "Nee. Een laser zendt één golflengte uit, IPL een band. Die band raakt daardoor meerdere dingen tegelijk, zoals roodheid, vaatjes en oppervlakkig pigment, en komt gemiddeld minder diep.":
    "No. Un láser emite una sola longitud de onda, el IPL una banda. Por eso esa banda alcanza varias cosas a la vez, como la rojez, los vasos y el pigmento superficial, y de media llega menos profundo.",
  "Waarom wordt mijn pigmentvlek eerst donkerder?":
    "¿Por qué mi mancha de pigmentación se oscurece primero?",
  "Dat hoort erbij. Het pigment komt naar de oppervlakte voordat het vervaagt, en dat duurt een aantal dagen. Het betekent niet dat het erger wordt.":
    "Forma parte del proceso. El pigmento sube a la superficie antes de difuminarse, y eso lleva unos cuantos días. No significa que vaya a peor.",
  "Doet IPL pijn?": "¿Duele el IPL?",
  "Je voelt bij elke lichtflits een korte, warme tik, vaak vergeleken met een elastiekje tegen je huid. Het is kort en goed te doen.":
    "Con cada destello de luz notas un golpecito corto y caliente, que a menudo se compara con una goma elástica contra la piel. Es breve y llevadero.",
  "Hoeveel IPL-behandelingen heb ik nodig?":
    "¿Cuántos tratamientos IPL necesito?",
  "Meestal drie tot zes, met vier weken ertussen. Bij rosacea hoort daarna onderhoud, omdat de roodheid kan terugkomen.":
    "Normalmente de tres a seis, con cuatro semanas entre medias. En la rosácea después va mantenimiento, porque la rojez puede volver.",
  "Kan ik IPL in de zomer doen?": "¿Puedo hacerme un IPL en verano?",
  "Voor pigment niet. Tussen mei en augustus behandelen we pigment niet, omdat een huid die net behandeld is extra fel op zon reageert. Voor roodheid en vaatjes ligt dat anders; dat bespreken we per geval.":
    "Para el pigmento no. Entre mayo y agosto no tratamos el pigmento, porque una piel recién tratada reacciona con especial fuerza al sol. Para la rojez y los vasos es distinto; eso lo hablamos caso por caso.",
  "Helpt IPL tegen couperose en rosacea?":
    "¿El IPL ayuda con la cuperosis y la rosácea?",
  "Het haalt losse vaatjes weg en maakt een gebied dat structureel rood staat rustiger. Rosacea geneest het niet: de zichtbare roodheid gaat weg, en die kan terugkomen. Daarom hoort er bij rosacea onderhoud bij.":
    "Retira los vasos sueltos y calma una zona que está roja de forma estructural. No cura la rosácea: la rojez visible se va, y puede volver. Por eso en la rosácea va mantenimiento.",
  "Kan IPL bij een donkere huid?": "¿Se puede hacer IPL en una piel oscura?",
  "Niet bij elk huidtype. Bij een donkere huid neemt de huid zelf meer licht op, en is de kans op nieuwe pigmentvlekken groter. We bepalen je huidtype vooraf en kiezen de behandeling die bij je huid past.":
    "No con cualquier fototipo. En una piel oscura la propia piel absorbe más luz, y hay más riesgo de manchas de pigmentación nuevas. Determinamos tu fototipo de antemano y elegimos el tratamiento que encaja con tu piel.",
  "Weet je niet of het": "¿No sabes si es",
  "pigment of roodheid": "pigmento o rojez?",
  "Dat hoef je ook niet te weten voordat je komt. De meting laat zien wat het is en hoe diep het zit, en daarna hoor je of IPL het goede antwoord is. Is het melasma, dan kiezen we iets anders.":
    "Tampoco hace falta que lo sepas antes de venir. La medición enseña qué es y a qué profundidad está, y después sabes si el IPL es la respuesta correcta. Si es melasma, elegimos otra cosa.",
  "IPL in Rotterdam": "IPL en Rotterdam",
  "We meten je huid en bepalen of het pigment of roodheid is, en hoe diep het zit. Past IPL, dan kan de eerste behandeling vaak in dezelfde afspraak.":
    "Medimos tu piel y determinamos si es pigmento o rojez, y a qué profundidad está. Si el IPL encaja, el primer tratamiento se puede hacer muchas veces en esa misma cita.",
  Elektrische: "Electrólisis",
  epilatie: "depilatoria",
  "Elektrische epilatie": "Electrólisis",
  "Elektrische epilatie is een ontharingsmethode waarbij een dun naaldje langs de haar de wortel bereikt en die met een korte stroomstoot uitschakelt, haar voor haar. Omdat kleur er niet toe doet, werkt het ook op grijs, wit en licht blond haar waar de laser niet op reageert. Bij Diba Clinics in Rotterdam kost het € 60 per half uur behandeltijd.":
    "La electrólisis es un método de depilación en el que una aguja fina sigue el pelo hasta la raíz y la desactiva con un impulso corto de corriente, pelo a pelo. Como el color no importa, funciona también en el pelo gris, blanco y rubio muy claro al que el láser no responde. En Diba Clinics en Rotterdam cuesta € 60 por media hora de tratamiento.",
  "€ 60 per half uur": "€ 60 por media hora",
  Haarkleur: "Color del pelo",
  "Elke kleur": "Cualquier color",
  Gebied: "Zona",
  "Klein, per haar": "Pequeña, pelo a pelo",
  "Laser of epilatie": "Láser o electrólisis",
  "Wat elektrische": "Lo que la electrólisis",
  "epilatie doet": "hace",
  "Waar de laser een kleur nodig heeft om op te mikken, gaat dit rechtstreeks naar de wortel. Daarom maakt de kleur van het haar hier niet uit.":
    "Donde el láser necesita un color al que apuntar, esto va directo a la raíz. Por eso aquí el color del pelo no importa.",
  "De laser mikt op het pigment in de haarwortel. Zit daar geen pigment meer, zoals bij grijs, wit en heel licht blond haar, dan is er niets om op te mikken. Dat ligt niet aan het apparaat of aan de instelling; zo werkt laserontharing.":
    "El láser apunta al pigmento de la raíz del pelo. Si ahí ya no hay pigmento, como en el pelo gris, blanco y rubio muy claro, no hay nada a lo que apuntar. Eso no es cuestión del equipo ni del ajuste; así funciona la depilación láser.",
  "Bij elektrische epilatie gaat er een dun naaldje langs de haar het haarkanaal in, tot bij de wortel. Die krijgt een korte stroomstoot, en daarmee is het de wortel zelf die wordt aangepakt en niet de kleur. Je voelt per haar een korte prik.":
    "En la electrólisis una aguja fina entra por el canal del pelo, al lado de este, hasta la raíz. Esa recibe un impulso corto de corriente, con lo que es la raíz misma la que se trata y no el color. Por cada pelo notas un pinchazo corto.",
  "Het gaat haar voor haar, en dat maakt het trager dan laser. Daarom is het bedoeld voor kleine gebieden, zoals de kin, de bovenlip en rond de wenkbrauw, en voor de losse haren die na een laserkuur zijn blijven staan. Een haar reageert alleen in de groeifase, dus je komt in een reeks, met een paar weken ertussen.":
    "Va pelo a pelo, y eso la hace más lenta que el láser. Por eso está pensada para zonas pequeñas, como la barbilla, el labio superior y alrededor de la ceja, y para los pelos sueltos que quedan después de una cura de láser. Un pelo solo responde en fase de crecimiento, así que vienes en una serie, con unas semanas entre medias.",
  "Heeft je haar wel kleur, dan is": "Si tu pelo sí tiene color, la",
  "sneller en voordeliger. Bij haargroei door PCOS staat meer op":
    "es más rápida y más barata. Sobre el crecimiento de pelo por SOP hay más en",
  "de pagina over PCOS": "la página sobre el SOP",
  "Laser en": "Láser y",
  "epilatie samen": "electrólisis juntas",
  "De twee sluiten elkaar niet uit. In de meeste gevallen is het een volgorde, en die scheelt je tijd en geld.":
    "Las dos no se excluyen. En la mayoría de los casos es un orden de pasos, y eso te ahorra tiempo y dinero.",
  "Heeft een deel van je haar nog kleur, dan begin je met een laserkuur. De laser pakt in één flits een heel vlak aan en werkt daardoor veel sneller dan haar voor haar. Wat daarna blijft staan, meestal de lichte of grijze haren, gaat met elektrische epilatie. Zo betaal je niet per haar voor wat sneller kan.":
    "Si una parte de tu pelo todavía tiene color, empiezas por una cura de láser. El láser cubre toda una zona en un solo destello y por eso trabaja mucho más rápido que pelo a pelo. Lo que quede después, normalmente los pelos claros o grises, va con electrólisis. Así no pagas por pelo lo que se puede hacer más rápido.",
  "Is al je haar grijs, wit of heel licht, dan is elektrische epilatie de methode die voor die haren bedoeld is. Dat is geen tweede keus maar de juiste behandeling voor dat haar.":
    "Si todo tu pelo es gris, blanco o muy claro, la electrólisis es el método pensado para esos pelos. No es una segunda opción sino el tratamiento correcto para ese pelo.",
  "Voor grote vlakken, zoals benen of rug, is het niet geschikt: haar voor haar kost daar te veel tijd en te veel sessies. Ook dat hoor je bij de intake, samen met wat er in jouw geval wel kan.":
    "Para zonas grandes, como las piernas o la espalda, no sirve: pelo a pelo cuesta ahí demasiado tiempo y demasiadas sesiones. Eso también lo sabes en la primera consulta, junto con lo que sí se puede hacer en tu caso.",
  "Over laserontharing": "Sobre la depilación láser",
  "Wat epilatie": "Lo que la electrólisis",
  "Het tarief gaat per half uur behandeltijd, want het hangt af van hoeveel haren er staan. De intakeregeling staat er compleet bij.":
    "El precio va por media hora de tratamiento, porque depende de cuántos pelos haya. La regla de la primera consulta está entera.",
  "Elektrische epilatie, per 30 minuten": "Electrólisis, por 30 minutos",
  "Hoeveel tijd je nodig hebt, hangt af van het gebied en van het aantal haren. Dat schatten we bij de intake in, en na de eerste afspraak weet je het beter.":
    "Cuánto tiempo necesitas depende de la zona y del número de pelos. Eso lo estimamos en la primera consulta, y después de la primera cita lo sabes mejor.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de eerste epilatie in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos la primera electrólisis en esa misma cita.",
  "Dan boek je de epilatie rechtstreeks in de agenda. Reken op 30 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas la electrólisis directamente en la agenda. Cuenta con 30 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "Elektrische epilatie is precisiewerk voor kleine gebieden. Voor grote vlakken met donker haar is de laser het betere antwoord.":
    "La electrólisis es trabajo de precisión para zonas pequeñas. Para zonas grandes con pelo oscuro, el láser es la mejor respuesta.",
  "Grijs, wit en heel licht blond haar, waar de laser niet op werkt":
    "Pelo gris, blanco y rubio muy claro, en el que el láser no funciona",
  "De losse haren die na een laserkuur zijn blijven staan":
    "Los pelos sueltos que han quedado después de una cura de láser",
  "Kleine gebieden waar precisie telt, zoals kin, bovenlip en wenkbrauw":
    "Zonas pequeñas donde cuenta la precisión, como la barbilla, el labio superior y la ceja",
  "Wie geen laser kan of wil, bijvoorbeeld door het huidtype":
    "Quien no puede o no quiere láser, por ejemplo por su fototipo",
  "Grote vlakken zoals benen of rug. Daar is laserontharing sneller en voordeliger":
    "Zonas grandes como las piernas o la espalda. Ahí la depilación láser es más rápida y más barata",
  "Een vol gebied in weinig sessies. Het gaat per haar, dus het vraagt meer tijd":
    "Una zona entera en pocas sesiones. Va pelo a pelo, así que pide más tiempo",
  "Resultaat na één afspraak. Het bouwt op over de reeks":
    "Resultado después de una cita. Se construye a lo largo de la serie",
  "Een huid die op dat moment geïrriteerd of ontstoken is":
    "Una piel que en ese momento está irritada o inflamada",
  "Epilatie naast": "La electrólisis junto a",
  "Er zijn meer manieren om van haar af te komen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Hay varias maneras de quitarse el pelo. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "Elektrische epilatie vergeleken met andere manieren van ontharen op werking, hersteltijd en tarief":
    "La electrólisis comparada con otras formas de depilación por efecto, tiempo de recuperación y precio",
  "Haar voor haar, via de wortel. Werkt op elke haarkleur, en daardoor ook op grijs en wit.":
    "Pelo a pelo, por la raíz. Funciona con cualquier color de pelo, y por eso también con el gris y el blanco.",
  "De behandelde plekjes zijn een paar uur rood en kunnen wat opstaan, vergelijkbaar met na het harsen.":
    "Las zonas tratadas están rojas unas horas y pueden hincharse un poco, parecido a después de la cera.",
  "Licht op het pigment in de wortel. Snel over een groot vlak, maar alleen op haar met kleur.":
    "Luz sobre el pigmento de la raíz. Rápido en una zona grande, pero solo en pelo con color.",
  "Een paar uur rood, soms bultjes rond de haarzakjes.":
    "Unas horas roja, a veces con bultitos alrededor de los folículos.",
  "Een mesje haalt donshaar tijdelijk weg, samen met dode huidcellen. Het haar groeit terug zoals het was.":
    "Una cuchilla retira el vello fino de forma temporal, junto con células muertas. El vello vuelve a crecer como era.",
  "De behandelaar kijkt eerst of een deel van je haar nog op laser reageert, want dan is dat de snellere weg. Wat overblijft, doet de behandelaar haar voor haar.":
    "La terapeuta mira primero si una parte de tu pelo todavía responde al láser, porque esa es la vía más rápida. Lo que quede, la terapeuta lo hace pelo a pelo.",
  "Wat kost elektrische epilatie in Rotterdam?":
    "¿Cuánto cuesta la electrólisis en Rotterdam?",
  "Bij Diba Clinics kost elektrische epilatie € 60 per half uur behandeltijd, zoals het ook in de agenda staat. Hoeveel tijd je nodig hebt, hangt af van het gebied en het aantal haren. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics la electrólisis cuesta € 60 por media hora de tratamiento, tal como figura en la agenda. Cuánto tiempo necesitas depende de la zona y del número de pelos. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Waarom werkt de laser niet op grijs haar?":
    "¿Por qué el láser no funciona en el pelo gris?",
  "Omdat de laser het pigment in de haarwortel opzoekt en de warmte daar zijn werk doet. Grijs en wit haar heeft dat pigment niet meer, dus er is niets om op te mikken. Dat ligt niet aan het apparaat of aan de instelling.":
    "Porque el láser busca el pigmento de la raíz del pelo y el calor hace ahí su trabajo. El pelo gris y blanco ya no tiene ese pigmento, así que no hay nada a lo que apuntar. Eso no es cuestión del equipo ni del ajuste.",
  "Doet elektrische epilatie pijn?": "¿Duele la electrólisis?",
  "Je voelt per haar een korte prik, en daarna een warm gevoel op die plek. Het is goed te doen, maar omdat het haar voor haar gaat, is een langere sessie wel merkbaar.":
    "Por cada pelo notas un pinchazo corto, y después una sensación de calor en ese punto. Es llevadero, pero como va pelo a pelo, una sesión larga sí se nota.",
  "Is elektrische epilatie blijvend?": "¿La electrólisis es permanente?",
  "Een haar waarvan de wortel goed is uitgeschakeld, komt niet terug. Omdat haren niet allemaal tegelijk in de groeifase zitten, heb je wel een reeks afspraken nodig om een gebied rustig te krijgen. Hoeveel verschilt per persoon.":
    "Un pelo cuya raíz se ha desactivado bien no vuelve. Como los pelos no están todos a la vez en fase de crecimiento, sí necesitas una serie de citas para dejar una zona tranquila. Cuántas cambia de una persona a otra.",
  "Kan ik het combineren met laserontharing?":
    "¿Puedo combinarla con la depilación láser?",
  "Dat is de gebruikelijke volgorde. Eerst de laserkuur voor alles wat pigment heeft, en daarna elektrische epilatie voor de haren die zijn blijven staan. Zo betaal je niet per haar voor wat sneller kan.":
    "Ese es el orden habitual. Primero la cura de láser para todo lo que tenga pigmento, y después electrólisis para los pelos que hayan quedado. Así no pagas por pelo lo que se puede hacer más rápido.",
  "Welke gebieden kun je met elektrische epilatie behandelen?":
    "¿Qué zonas se pueden tratar con electrólisis?",
  "Kleine gebieden waar precisie belangrijker is dan snelheid: de kin, de bovenlip en rond de wenkbrauw. Voor grote vlakken zoals benen of rug is het niet bedoeld; daar is laser sneller en voordeliger.":
    "Zonas pequeñas donde la precisión importa más que la velocidad: la barbilla, el labio superior y alrededor de la ceja. No está pensada para zonas grandes como las piernas o la espalda; ahí el láser es más rápido y más barato.",
  "Hoe zie ik eruit na elektrische epilatie?":
    "¿Cómo quedo después de la electrólisis?",
  "De behandelde plekjes zijn een paar uur rood en kunnen wat opstaan, vergelijkbaar met na het harsen. Bij de meeste mensen is dat dezelfde dag weg.":
    "Las zonas tratadas están rojas unas horas y pueden hincharse un poco, parecido a después de la cera. En la mayoría de la gente eso desaparece el mismo día.",
  "Helpt elektrische epilatie bij haargroei door PCOS?":
    "¿La electrólisis ayuda con el crecimiento de pelo por SOP?",
  "Voor de lichte haren die de laser niet ziet, ja. Bij PCOS blijft je lichaam nieuwe haren aanmaken, dus bij laser en bij epilatie hoort dan onderhoud. Meer daarover staat op onze pagina over PCOS.":
    "Para los pelos claros que el láser no ve, sí. Con el SOP tu cuerpo sigue produciendo pelos nuevos, así que tanto con láser como con electrólisis va mantenimiento. Hay más sobre eso en nuestra página sobre el SOP.",
  "Weet je niet of je": "¿No sabes si tu",
  haar: "pelo",
  "op laser reageert": "responde al láser?",
  "Dat hoef je ook niet te weten voordat je komt. Bij de intake kijken we naar de kleur en de dikte van je haar, en dan hoor je of laser, epilatie of een combinatie het beste werkt.":
    "Tampoco hace falta que lo sepas antes de venir. En la primera consulta miramos el color y el grosor de tu pelo, y entonces sabes si funciona mejor el láser, la electrólisis o una combinación.",
  "We kijken eerst naar je haar en je huid, en zeggen dan of laser, epilatie of allebei past. Past epilatie, dan kan de eerste sessie vaak in dezelfde afspraak.":
    "Primero miramos tu pelo y tu piel, y después decimos si encaja el láser, la electrólisis o las dos. Si encaja la electrólisis, la primera sesión se puede hacer muchas veces en esa misma cita.",
  "Fotona 4D in": "Fotona 4D en",
  "Fotona 4D is een laserbehandeling in vier stappen in één sessie: eerst van binnenuit door de wang, daarna op diepte in de huid, en tot slot een lichte laserpeeling. Samen werken ze op verslapping, textuur en kleur, zonder naalden. Bij Diba Clinics in Rotterdam duurt een behandeling 90 minuten en kost hij € 370.":
    "Fotona 4D es un tratamiento láser en cuatro pasos en una sola sesión: primero desde dentro a través de la mejilla, después en profundidad en la piel, y por último un peeling láser suave. Juntos actúan sobre la flacidez, la textura y el color, sin agujas. En Diba Clinics en Rotterdam un tratamiento dura 90 minutos y cuesta € 370.",
  "90 minuten": "90 minutos",
  "€ 370 per sessie": "€ 370 por sesión",
  "Uren tot een dag": "De horas a un día",
  "De vier stappen": "Los cuatro pasos",
  "Twee lasers": "Dos láseres",
  "Wat Fotona 4D": "Lo que el Fotona 4D",
  "Vier behandelingen die in dezelfde sessie op elkaar volgen, elk op een andere diepte. Samen raken ze wat één stap alleen niet haalt.":
    "Cuatro tratamientos que se suceden en la misma sesión, cada uno a otra profundidad. Juntos alcanzan lo que un solo paso no consigue.",
  "Met de jaren maakt je huid minder collageen aan, het bindweefsel dat hem stevig houdt. Dat zie je als verslapping langs de kaaklijn, fijne lijntjes en een huid die minder egaal is. Die veranderingen zitten op verschillende diepten, en daarom werkt Fotona 4D ook op verschillende diepten.":
    "Con los años tu piel produce menos colágeno, el tejido conectivo que la mantiene firme. Eso se ve como flacidez a lo largo de la mandíbula, líneas finas y una piel menos uniforme. Esos cambios están a distintas profundidades, y por eso el Fotona 4D también trabaja a distintas profundidades.",
  "Het begint van binnenuit met": "Empieza desde dentro con",
  ": een handstuk tegen de binnenkant van je wang, dat het weefsel verwarmt waar je van buitenaf niet bij komt. Daarna werkt":
    ": un cabezal contra la cara interna de la mejilla, que calienta el tejido al que no se llega desde fuera. Después",
  "op diepte op onregelmatigheden, en verwarmt":
    "actúa en profundidad sobre las irregularidades, y",
  "het weefsel vlak en gelijkmatig.":
    "calienta el tejido de forma plana y uniforme.",
  SupErficial: "SupErficial",
  "sluit af met een lichte laserpeeling van de bovenste laag.":
    "cierra con un peeling láser suave de la capa superior.",
  "Direct na de sessie ziet de huid er voller uit door de warmte, maar dat is nog geen resultaat. De aanmaak van collageen kost weken, en het verschil bouwt zich op over de reeks: los te doen of als kuur van drie, met vier tot zes weken ertussen.":
    "Justo después de la sesión la piel se ve más llena por el calor, pero eso todavía no es el resultado. Producir colágeno lleva semanas, y la diferencia se construye a lo largo de la serie: suelto o como cura de tres, con cuatro a seis semanas entre medias.",
  ", en welke behandelingen er nog meer op dit apparaat draaien bij":
    ", y qué otros tratamientos funcionan con este equipo está en",
  "de Fotona TimeWalker": "el Fotona TimeWalker",
  ". Wat een kuur aan tijd vraagt staat bij":
    ". Lo que una cura pide en tiempo está en",
  "in één apparaat": "en un solo equipo",
  "De Fotona TimeWalker is geen behandeling maar een platform. Dat hij twee lasers heeft, is waarom 4D kan wat één laser niet kan.":
    "El Fotona TimeWalker no es un tratamiento sino una plataforma. Que tenga dos láseres es la razón de que el 4D pueda lo que un solo láser no puede.",
  "In de kast zitten twee lasers. Een Er:YAG op 2940 nanometer, die bijna volledig door water wordt opgenomen en daardoor aan de oppervlakte blijft. En een Nd:YAG op 1064 nanometer, die veel minder door water wordt tegengehouden en dus dieper komt. Samen dekken ze een bereik dat één laser niet haalt.":
    "Dentro del armario hay dos láseres. Un Er:YAG a 2940 nanómetros, absorbido casi por completo por el agua y que por eso se queda en la superficie. Y un Nd:YAG a 1064 nanómetros, mucho menos frenado por el agua y que por eso llega más profundo. Juntos cubren un alcance que un solo láser no logra.",
  "De verwarmende stappen gebruiken de SMOOTH-modus: de energie komt in een reeks trage pulsen in plaats van één harde. Het weefsel wordt daardoor verwarmd zonder dat de bovenlaag wordt weggenomen. Wat je voelt is een oplopende warmte die net voor het ongemakkelijke stopt, en de behandelaar vraagt tijdens de sessie hoe warm het aanvoelt.":
    "Los pasos que calientan usan el modo SMOOTH: la energía llega en una serie de pulsos lentos en vez de en uno fuerte. Así el tejido se calienta sin que se retire la capa superior. Lo que notas es un calor que sube y se para justo antes de resultar incómodo, y durante la sesión la terapeuta te pregunta cómo de caliente lo notas.",
  "Er is ook een volledig pakket,": "También hay un paquete completo,",
  ", waarin de hals en de kaaklijn meegaan. Daar valt verslapping vaak het eerst op, terwijl het gezicht er nog strak uitziet. En er is":
    ", en el que entran el cuello y la mandíbula. Ahí es donde la flacidez se nota primero a menudo, mientras la cara todavía se ve tensa. Y está el",
  ", met instellingen voor de doorgaans dikkere mannenhuid.":
    ", con ajustes para la piel masculina, que suele ser más gruesa.",
  "Over de Fotona": "Sobre el Fotona",
  "Een losse behandeling of een kuur van drie, voor het gezicht of met de hals en de kaaklijn erbij. De intakeregeling staat er compleet bij.":
    "Un tratamiento suelto o una cura de tres, para la cara o con el cuello y la mandíbula incluidos. La regla de la primera consulta está entera.",
  "Fotona 4D, losse behandeling": "Fotona 4D, tratamiento suelto",
  "Fotona 4D, kuur van drie": "Fotona 4D, cura de tres",
  "Full Package, losse behandeling": "Full Package, tratamiento suelto",
  "Full Package, kuur van drie": "Full Package, cura de tres",
  "Een kuur van drie kost € 995, tegen € 1.110 voor drie losse behandelingen. Het tarief voor Fotona 4D Men hoor je bij de intake.":
    "Una cura de tres cuesta € 995, frente a € 1.110 por tres tratamientos sueltos. El precio del Fotona 4D Men lo sabes en la primera consulta.",
  "Dan boek je een behandeling op advies, waar we maximaal twee uur voor reserveren. Fotona 4D duurt zelf 90 minuten, dus of hij in die eerste afspraak past, hangt af van hoe lang de intake duurt. Past het niet, dan plannen we hem direct daarna in.":
    "Entonces reservas un tratamiento con asesoramiento, para el que reservamos como máximo dos horas. El Fotona 4D dura de por sí 90 minutos, así que si cabe en esa primera cita depende de cuánto dure la consulta. Si no cabe, lo programamos justo después.",
  "Dan boek je de Fotona 4D rechtstreeks in de agenda. Reken op 90 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst.":
    "Entonces reservas el Fotona 4D directamente en la agenda. Cuenta con 90 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar.",
  "Fotona 4D werkt op verslapping, textuur en kleur. Voor huid die echt is gaan hangen, en voor wie in één keer resultaat wil, is het niet de goede keuze.":
    "El Fotona 4D actúa sobre la flacidez, la textura y el color. Para una piel que de verdad se ha descolgado, y para quien quiere resultado de una vez, no es la elección correcta.",
  "Beginnende verslapping, vooral langs de kaaklijn en rond de mond":
    "Flacidez incipiente, sobre todo a lo largo de la mandíbula y alrededor de la boca",
  "Fijne lijntjes en een huid die minder egaal is geworden":
    "Líneas finas y una piel que se ha vuelto menos uniforme",
  "Werken in vier diepten tegelijk, van het slijmvlies tot de bovenste huidlaag":
    "Trabajar a cuatro profundidades a la vez, desde la mucosa hasta la capa superior de la piel",
  "Een behandeling zonder naalden en zonder snijden":
    "Un tratamiento sin agujas y sin cortes",
  "Huid die echt is gaan hangen. Daarvoor is chirurgie het antwoord":
    "Una piel que de verdad se ha descolgado. Para eso la respuesta es la cirugía",
  "Resultaat in één keer. Het effect bouwt zich op over de reeks":
    "Resultado de una vez. El efecto se construye a lo largo de la serie",
  "Een dag waarop je er meteen weer onberispelijk uit moet zien. Reken op een paar uur tot een dag rood en warm":
    "Un día en el que tengas que estar impecable al momento. Cuenta con unas horas o un día roja y caliente",
  "Een vast aantal sessies vooraf. Hoeveel je huid opbouwt verschilt per persoon, dus we leggen het verloop vast":
    "Un número fijo de sesiones por adelantado. Cuánto construye tu piel cambia de una persona a otra, así que registramos la evolución",
  "Fotona 4D naast": "El Fotona 4D junto a",
  "Voor een stevigere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para una piel más firme hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "Fotona 4D vergeleken met andere behandelingen voor een stevigere huid op werking, hersteltijd en tarief":
    "El Fotona 4D comparado con otros tratamientos para una piel más firme por efecto, tiempo de recuperación y precio",
  "Vier laserstappen in één sessie, van binnenuit tot een afsluitende peeling.":
    "Cuatro pasos de láser en una sesión, desde dentro hasta un peeling final.",
  "Een paar uur tot een dag rood en warm, alsof je te lang in de zon hebt gezeten.":
    "De unas horas a un día roja y caliente, como si hubieras estado demasiado tiempo al sol.",
  "Hetzelfde protocol met de hals en de kaaklijn erbij, in een afspraak van twee uur.":
    "El mismo protocolo con el cuello y la mandíbula incluidos, en una cita de dos horas.",
  "Rood en warm voor een paar uur tot een dag; bij de afsluitende peelingstap kan de huid een paar dagen ruw aanvoelen.":
    "Roja y caliente de unas horas a un día; con el paso final de peeling la piel puede notarse áspera unos días.",
  "Laser op het voorhoofd en rond de wenkbrauw, voor wie vooral daar verslapping ziet.":
    "Láser en la frente y alrededor de la ceja, para quien ve la flacidez sobre todo ahí.",
  "Een paar uur licht rood op het voorhoofd.":
    "Unas horas ligeramente roja en la frente.",
  "Een paar uur licht rood rond de ogen.":
    "Unas horas ligeramente roja alrededor de los ojos.",
  "Werkzame stoffen in de huid met naalden. Werkt op vocht en stevigheid, zonder warmte.":
    "Principios activos dentro de la piel con agujas. Actúa sobre la hidratación y la firmeza, sin calor.",
  "Kort rood en soms kleine bultjes, meestal binnen een dag weg.":
    "Roja un rato y a veces con bultitos, normalmente desaparecidos en un día.",
  "Fotona 4D wordt bij ons gedaan door een huidtherapeut of een laserspecialist. Die stelt het apparaat per stap en per zone in, en past de warmte aan op wat jij tijdens de sessie aangeeft.":
    "El Fotona 4D lo hace aquí una terapeuta de piel o una especialista en láser. Ella ajusta el equipo por paso y por zona, y adapta el calor a lo que tú digas durante la sesión.",
  "Wat kost Fotona 4D in Rotterdam?":
    "¿Cuánto cuesta el Fotona 4D en Rotterdam?",
  "Bij Diba Clinics kost Fotona 4D € 370 per behandeling en € 995 voor een kuur van drie. Het volledige pakket met hals en kaaklijn kost € 575, of € 1.495 als kuur van drie. Kom je voor het eerst, dan begint je afspraak met een intake van € 50.":
    "En Diba Clinics el Fotona 4D cuesta € 370 por tratamiento y € 995 una cura de tres. El paquete completo con cuello y mandíbula cuesta € 575, o € 1.495 como cura de tres. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50.",
  "Waarom heet het 4D?": "¿Por qué se llama 4D?",
  "Omdat er vier behandelingen in een sessie op elkaar volgen, elk op een andere diepte: van het slijmvlies aan de binnenkant van je wang tot de bovenste huidlaag.":
    "Porque en una sesión se suceden cuatro tratamientos, cada uno a otra profundidad: desde la mucosa de la cara interna de la mejilla hasta la capa superior de la piel.",
  "Doet Fotona 4D pijn?": "¿Duele el Fotona 4D?",
  "Het is warm. De eerste stap gebeurt in je mond en voelt warm tegen je wang; daarna loopt de warmte aan de buitenkant op tot net voor het ongemakkelijke. De behandelaar vraagt tijdens de sessie hoe het voelt en stelt het apparaat daarop bij. De laatste stap voelt als korte tikjes.":
    "Es caliente. El primer paso ocurre dentro de la boca y se nota caliente contra la mejilla; después el calor por fuera sube hasta justo antes de resultar incómodo. Durante la sesión la terapeuta te pregunta cómo lo notas y ajusta el equipo a eso. El último paso se siente como golpecitos cortos.",
  "Heb je hersteltijd na Fotona 4D?":
    "¿Hay tiempo de recuperación después del Fotona 4D?",
  "Weinig. Je bent een paar uur tot een dag rood en warm, alsof je te lang in de zon hebt gezeten. Bij het volledige pakket kan de huid door de afsluitende peeling een paar dagen ruw aanvoelen.":
    "Poco. Estás de unas horas a un día roja y caliente, como si hubieras estado demasiado tiempo al sol. Con el paquete completo, el peeling final puede dejar la piel áspera unos días.",
  "Wanneer zie ik resultaat van Fotona 4D?":
    "¿Cuándo veo el resultado del Fotona 4D?",
  "Direct na de sessie ziet de huid er voller uit door de warmte, maar dat is nog geen resultaat. De opbouw van collageen kost weken; het verschil bouwt zich over de reeks op.":
    "Justo después de la sesión la piel se ve más llena por el calor, pero eso todavía no es el resultado. Construir colágeno lleva semanas; la diferencia se construye a lo largo de la serie.",
  "Hoeveel behandelingen Fotona 4D heb ik nodig?":
    "¿Cuántos tratamientos de Fotona 4D necesito?",
  "Los te doen of als kuur van drie, met vier tot zes weken ertussen. Bij het volledige pakket volgt na de kuur meestal een keer per jaar onderhoud. Wat bij jou past, hoor je bij de intake.":
    "Suelto o como cura de tres, con cuatro a seis semanas entre medias. Con el paquete completo, después de la cura suele ir mantenimiento una vez al año. Qué encaja contigo lo sabes en la primera consulta.",
  "Is Fotona 4D een alternatief voor een facelift?":
    "¿El Fotona 4D es una alternativa a un lifting?",
  "Nee. Fotona 4D werkt op beginnende verslapping, textuur en kleur, zonder naalden en zonder snijden. Voor huid die echt is gaan hangen is chirurgie het antwoord, en dat zeggen we je dan ook.":
    "No. El Fotona 4D actúa sobre la flacidez incipiente, la textura y el color, sin agujas y sin cortes. Para una piel que de verdad se ha descolgado, la respuesta es la cirugía, y te lo decimos.",
  "Kan ik ook een van de vier stappen los doen?":
    "¿Puedo hacerme también uno de los cuatro pasos por separado?",
  "Ja. SmoothLiftin, FRAC3, PIANO en SupErficial zijn elk los te boeken. Welke bij jou past, hoor je bij de intake.":
    "Sí. SmoothLiftin, FRAC3, PIANO y SupErficial se pueden reservar por separado. Cuál encaja contigo lo sabes en la primera consulta.",
  "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid, bespreken wat je wilt bereiken en zeggen welke behandeling daarbij past. Is dat iets anders dan Fotona, of iets waar laser niet bij helpt, dan hoor je dat.":
    "Tampoco hace falta que lo sepas antes de venir. Miramos tu piel, hablamos de lo que quieres conseguir y decimos qué tratamiento encaja. Si es otra cosa que el Fotona, o algo en lo que el láser no ayuda, te lo decimos.",
  "We bekijken eerst je huid en bespreken wat Fotona 4D daar kan doen en wat niet. Daarna plannen we de eerste sessie.":
    "Primero miramos tu piel y hablamos de lo que el Fotona 4D puede hacer ahí y de lo que no. Después programamos la primera sesión.",
  Skinboosters: "Skin boosters",
  "Skinboosters in": "Skin boosters en",
  "Een skinbooster is een behandeling waarbij werkzame stoffen, zoals hyaluronzuur en vitamines, met heel fijne prikjes ín de huid worden gebracht in plaats van erop. Bij Diba Clinics in Rotterdam gebeurt dat met de U225, die elke prik op dezelfde diepte zet. Een losse behandeling kost € 180 en een kuur van drie € 500.":
    "Un skin booster es un tratamiento en el que principios activos, como el ácido hialurónico y las vitaminas, se llevan dentro de la piel con pinchazos muy finos en vez de ponerse encima. En Diba Clinics en Rotterdam eso se hace con el U225, que coloca cada pinchazo a la misma profundidad. Un tratamiento suelto cuesta € 180 y una cura de tres € 500.",
  "Vanaf € 130": "Desde € 130",
  "Bultjes, een dag": "Bultitos, un día",
  Kuur: "Cura",
  "Drie sessies": "Tres sesiones",
  "Geen filler": "No es relleno",
  "Wat een skinbooster": "Lo que un skin booster",
  "Een crème blijft grotendeels aan de oppervlakte. Een skinbooster brengt de stoffen in de laag waar ze hun werk moeten doen.":
    "Una crema se queda en gran parte en la superficie. Un skin booster lleva los principios activos a la capa donde tienen que hacer su trabajo.",
  "Wat je op je huid smeert, komt voor het grootste deel niet verder dan de buitenste laag. Die laag is er juist om dingen tegen te houden. Voor vocht en stevigheid moeten stoffen als hyaluronzuur dieper zitten, in de huid zelf, en daar kom je met een crème niet.":
    "Lo que te pones en la piel, en su mayor parte no pasa de la capa exterior. Esa capa está justamente para frenar cosas. Para la hidratación y la firmeza, principios como el ácido hialurónico tienen que estar más profundos, dentro de la piel, y ahí no llegas con una crema.",
  "Bij een skinbooster gaat een mengsel van werkzame stoffen met heel fijne prikjes vlak onder de huid, verdeeld over het hele vlak in plaats van op één plek. Het doel is niet opvullen maar de kwaliteit van de huid: dat hij vochtiger en steviger aanvoelt. Welk mengsel en hoeveel, hangt af van wat je huid nodig heeft.":
    "En un skin booster una mezcla de principios activos entra justo debajo de la piel con pinchazos muy finos, repartidos por toda la zona en vez de en un solo punto. El objetivo no es rellenar sino la calidad de la piel: que se note más hidratada y más firme. Qué mezcla y cuánta depende de lo que tu piel necesite.",
  "Er zijn verschillende boosters: een voor fijne lijnen en vocht, zoals RRS Hyalift, een aparte voor de dunne huid rond de ogen, en een depigmentatiebooster voor gezicht, hals en decolleté bij pigment, zonneschade en melasma. Omdat de huid tussen de sessies het werk doet, is het meestal een kuur van drie.":
    "Hay distintos boosters: uno para las líneas finas y la hidratación, como el RRS Hyalift, otro aparte para la piel fina del contorno de ojos, y un booster despigmentante para cara, cuello y escote en pigmento, daño solar y melasma. Como la piel hace el trabajo entre las sesiones, normalmente es una cura de tres.",
  "Hoe de injector werkt staat bij de": "Cómo funciona el inyector está en el",
  ", en de booster voor de ogen bij": ", y el booster para los ojos en",
  "Een skinbooster": "Un skin booster",
  "is geen filler": "no es un relleno",
  "Ze worden vaak door elkaar gehaald, en het verschil bepaalt wat je van de behandeling kunt verwachten.":
    "Se confunden a menudo, y la diferencia decide qué puedes esperar del tratamiento.",
  "Een filler brengt volume op één plek: een plooi opvullen, een lip voller maken, een contour veranderen. Een skinbooster doet dat niet. Hij wordt dun over het hele vlak verdeeld en werkt op de kwaliteit van je huid, niet op de vorm van je gezicht. Fillers zetten we hier niet.":
    "Un relleno aporta volumen en un punto: rellenar un pliegue, dar volumen a un labio, cambiar un contorno. Un skin booster no hace eso. Se reparte fino por toda la zona y actúa sobre la calidad de tu piel, no sobre la forma de tu cara. Aquí no ponemos rellenos.",
  "Wat hier het verschil maakt is de U225. Bij met de hand injecteren beweegt de hele spuit mee; bij de U225 staat de spuit stil en beweegt alleen de naald, tot acht keer per seconde. Daardoor trilt er minder en is elke prik even diep, ook als er een paar honderd achter elkaar gaan.":
    "Lo que marca la diferencia aquí es el U225. Al inyectar a mano se mueve toda la jeringa; con el U225 la jeringa se queda quieta y solo se mueve la aguja, hasta ocho veces por segundo. Así vibra menos y cada pinchazo va a la misma profundidad, aunque se den unos cuantos cientos seguidos.",
  "Vooraf gaat er een verdovende crème op. Wat je daarna voelt is een reeks korte prikjes, rond de ogen gevoeliger dan op de wang. Vlak erna zie je kleine bultjes op de plek van elke prik; die zakken meestal binnen een dag.":
    "Antes se pone una crema anestésica. Lo que notas después es una serie de pinchazos cortos, más sensibles alrededor de los ojos que en la mejilla. Justo después ves bultitos donde ha entrado cada pinchazo; esos suelen bajar en un día.",
  "Over de U225": "Sobre el U225",
  "Wat skinboosters": "Lo que los skin boosters",
  "Een losse behandeling of een kuur van drie, en voor de ogen een eigen booster. De intakeregeling staat er compleet bij.":
    "Un tratamiento suelto o una cura de tres, y para los ojos un booster propio. La regla de la primera consulta está entera.",
  "Skinbooster los": "Skin booster suelto",
  "RRS hyalift mini filler booster": "RRS Hyalift mini filler booster",
  "Kuur van drie": "Cura de tres",
  "RRS Eyes kuur van drie": "RRS Eyes, cura de tres",
  "Een kuur van drie kost € 500, tegen € 540 voor drie losse behandelingen. Omdat de huid tussen de sessies het werk doet, is de kuur meestal ook de zinvolle keuze.":
    "Una cura de tres cuesta € 500, frente a € 540 por tres tratamientos sueltos. Como la piel hace el trabajo entre las sesiones, la cura suele ser además la opción con sentido.",
  "Dan boek je een behandeling op advies. We reserveren daar maximaal twee uur voor: de intake, en daarna minstens een uur om te behandelen. Is behandelen op dat moment verantwoord en wil je dat, dan doen we de eerste skinbooster in dezelfde afspraak.":
    "Entonces reservas un tratamiento con asesoramiento. Para eso reservamos como máximo dos horas: la consulta, y después al menos una hora para tratar. Si tratar es responsable en ese momento y tú quieres, hacemos el primer skin booster en esa misma cita.",
  "Dan boek je de skinbooster rechtstreeks in de agenda. Reken op 60 minuten. Is er sinds je laatste bezoek iets veranderd aan je huid, je medicatie of je verwachting, zeg dat dan bij binnenkomst. Plan een skinbooster niet vlak voor iets waar je op de foto moet: rond de ogen kan een blauw plekje langer blijven.":
    "Entonces reservas el skin booster directamente en la agenda. Cuenta con 60 minutos. Si desde tu última visita ha cambiado algo en tu piel, tu medicación o tu expectativa, dilo al llegar. No programes un skin booster justo antes de algo en lo que tengas que salir en fotos: alrededor de los ojos un moratón puede durar más.",
  "Een skinbooster werkt op de kwaliteit van je huid. Voor volume, voor diepe lijnen en voor wie geen naalden verdraagt, is het niet de goede keuze.":
    "Un skin booster actúa sobre la calidad de tu piel. Para volumen, para líneas profundas y para quien no tolera las agujas, no es la elección correcta.",
  "Een huid die vocht en stevigheid mist, over het hele vlak":
    "Una piel a la que le falta hidratación y firmeza, en toda la zona",
  "Fijne lijntjes, ook rond de ogen met een booster die daarvoor bedoeld is":
    "Líneas finas, también alrededor de los ojos con un booster pensado para ello",
  "Pigment, zonneschade en melasma, met de depigmentatiebooster":
    "Pigmento, daño solar y melasma, con el booster despigmentante",
  "Een combinatie met behandelingen die op de bovenlaag werken":
    "Una combinación con tratamientos que actúan sobre la capa superior",
  "Volume of een andere vorm. Dat is filler, en dat doen we niet":
    "Volumen u otra forma. Eso es relleno, y eso no lo hacemos",
  "Diepe lijnen of plooien. Die haalt een skinbooster niet weg":
    "Líneas o pliegues profundos. Un skin booster no los quita",
  "Wie geen naalden verdraagt. Het zijn er veel, al zijn ze klein":
    "Quien no tolera las agujas. Son muchas, por pequeñas que sean",
  "Pigment zonder zonbescherming. Zonder dat loopt het door, ook tijdens de kuur":
    "Pigmento sin protección solar. Sin ella sigue avanzando, también durante la cura",
  "Skinboosters naast": "Los skin boosters junto a",
  "Voor een stevigere, vochtigere huid zijn er meer wegen. Dit is wat ze doen, wat je erna merkt en wat ze kosten.":
    "Para una piel más firme e hidratada hay varias vías. Esto es lo que hacen, lo que notas después y lo que cuestan.",
  "Skinboosters vergeleken met andere behandelingen voor een stevigere huid op werking, hersteltijd en tarief":
    "Los skin boosters comparados con otros tratamientos para una piel más firme por efecto, tiempo de recuperación y precio",
  "Werkzame stoffen in de huid, verdeeld over het vlak met de U225. Werkt op vocht en stevigheid.":
    "Principios activos dentro de la piel, repartidos por la zona con el U225. Actúa sobre la hidratación y la firmeza.",
  "Een van de mengsels die we als skinbooster gebruiken: hyaluronzuur, vitamines en aminozuren.":
    "Una de las mezclas que usamos como skin booster: ácido hialurónico, vitaminas y aminoácidos.",
  "Kleine bultjes die binnen een dag wegtrekken, en soms een blauwe plek.":
    "Bultitos que desaparecen en un día, y a veces un moratón.",
  "Naalden zonder middel, zodat je huid zelf collageen aanmaakt. Meer voor structuur en littekens.":
    "Agujas sin producto, para que tu piel produzca colágeno por sí misma. Más para la textura y las cicatrices.",
  "Laser in vier stappen, van binnenuit door de wang tot een afsluitende peeling. Werkt op verslapping, zonder naalden.":
    "Láser en cuatro pasos, desde dentro a través de la mejilla hasta un peeling final. Actúa sobre la flacidez, sin agujas.",
  "Brengt serum in de bovenste laag, zonder naalden. Meteen zichtbaar, en korter van duur.":
    "Lleva sérum a la capa superior, sin agujas. Visible al momento, y de menos duración.",
  "De behandelaar kiest het mengsel en de diepte, en stelt de U225 per zone in: rond de ogen anders dan op de wang.":
    "La terapeuta elige la mezcla y la profundidad, y ajusta el U225 por zona: de otra manera alrededor de los ojos que en la mejilla.",
  "Wat kosten skinboosters in Rotterdam?":
    "¿Cuánto cuestan los skin boosters en Rotterdam?",
  "Bij Diba Clinics kost een losse skinbooster € 180 en een kuur van drie € 500. De RRS Hyalift-booster kost € 175, en de booster voor de ogen, RRS Eyes, € 130 per keer of € 350 voor een kuur van drie. Kom je voor het eerst, dan begint je afspraak met een intake van € 50, die vervalt als we in dezelfde afspraak behandelen.":
    "En Diba Clinics un skin booster suelto cuesta € 180 y una cura de tres € 500. El booster RRS Hyalift cuesta € 175, y el booster para los ojos, RRS Eyes, € 130 cada vez o € 350 una cura de tres. Si vienes por primera vez, tu cita empieza con una primera consulta de € 50, que se anula si tratamos en esa misma cita.",
  "Wat is het verschil tussen een skinbooster en een filler?":
    "¿Qué diferencia hay entre un skin booster y un relleno?",
  "Een filler brengt volume op één plek en verandert een vorm. Een skinbooster wordt dun over het hele vlak verdeeld en werkt op het vocht en de stevigheid van de huid zelf. Fillers zetten we hier niet.":
    "Un relleno aporta volumen en un punto y cambia una forma. Un skin booster se reparte fino por toda la zona y actúa sobre la hidratación y la firmeza de la piel misma. Aquí no ponemos rellenos.",
  "Doet een skinbooster pijn?": "¿Duele un skin booster?",
  "Het voelt als een reeks korte prikjes en het gaat snel. Vooraf gaat er een verdovende crème op. Rond de ogen is het gevoeliger dan op de wang.":
    "Se siente como una serie de pinchazos cortos y va rápido. Antes se pone una crema anestésica. Alrededor de los ojos es más sensible que en la mejilla.",
  "Zie ik er daarna uit alsof ik geprikt ben?":
    "¿Se me nota después que me han pinchado?",
  "Vlak erna zie je kleine bultjes op de plek van elke prik; die zakken meestal binnen een dag. Blauwe plekjes kunnen, vooral rond de ogen, en die blijven langer. Plan het dus niet vlak voor een gelegenheid.":
    "Justo después ves bultitos donde ha entrado cada pinchazo; esos suelen bajar en un día. Pueden salir moratones, sobre todo alrededor de los ojos, y esos duran más. Así que no lo programes justo antes de una ocasión.",
  "Waarom een kuur van drie?": "¿Por qué una cura de tres?",
  "Omdat de huid tussen de sessies door het werk doet. Er zijn meerdere prikkels nodig voordat er iets wordt opgebouwd, met twee tot vier weken ertussen.":
    "Porque la piel hace el trabajo entre las sesiones. Hacen falta varios estímulos antes de que se construya algo, con dos a cuatro semanas entre medias.",
  "Wanneer zie ik resultaat van een skinbooster?":
    "¿Cuándo veo el resultado de un skin booster?",
  "Je huid voelt vaak al snel vochtiger aan, maar het echte verschil bouwt zich over de kuur op. Hoe snel dat gaat, verschilt per huid.":
    "Tu piel suele notarse más hidratada bastante pronto, pero la diferencia de verdad se construye a lo largo de la cura. Con qué rapidez cambia de una piel a otra.",
  "Helpt een skinbooster tegen pigment?":
    "¿Un skin booster ayuda con el pigmento?",
  "Daar is een aparte booster voor, de depigmentatiebooster, voor gezicht, hals en decolleté bij pigment, zonneschade en melasma. Zonder dagelijkse zonbescherming loopt het pigment door, ook tijdens de kuur.":
    "Para eso hay un booster aparte, el despigmentante, para cara, cuello y escote en pigmento, daño solar y melasma. Sin protección solar diaria el pigmento sigue avanzando, también durante la cura.",
  "Wat doet de U225 anders dan een spuit?":
    "¿Qué hace el U225 distinto de una jeringa?",
  "Bij de U225 staat de spuit stil en beweegt alleen de naald, tot acht keer per seconde. Daardoor trilt er minder en is de diepte van prik tot prik gelijk, ook als er een paar honderd achter elkaar gaan.":
    "Con el U225 la jeringa se queda quieta y solo se mueve la aguja, hasta ocho veces por segundo. Así vibra menos y la profundidad es la misma de un pinchazo a otro, aunque se den unos cuantos cientos seguidos.",
  "een skinbooster": "un skin booster",
  "Dat hoef je ook niet te weten voordat je komt. We bekijken je huid, bespreken wat je wilt bereiken en zeggen welke behandeling daarbij past. Zoek je volume, dan hoor je dat een skinbooster daar niet voor is.":
    "Tampoco hace falta que lo sepas antes de venir. Miramos tu piel, hablamos de lo que quieres conseguir y decimos qué tratamiento encaja. Si buscas volumen, te decimos que un skin booster no es para eso.",
  "We bekijken je huid en kiezen daarna het mengsel dat erbij past. Is behandelen verstandig, dan kan de eerste sessie vaak in dezelfde afspraak.":
    "Miramos tu piel y después elegimos la mezcla que encaja. Si tratar es sensato, la primera sesión se puede hacer muchas veces en esa misma cita.",
  "Cosmelan en": "Cosmelan y",
  "Cosmelan en Dermamelan zijn trajecten van ongeveer zes maanden tegen hardnekkig pigment: een masker in de kliniek, en daarna een vaste routine met producten thuis. Dermamelan is de sterkste van de twee en wordt vaker bij melasma ingezet. Bij Diba Clinics in Rotterdam kost Cosmelan € 720 en Dermamelan € 920, inclusief de producten.":
    "Cosmelan y Dermamelan son programas de unos seis meses contra el pigmento persistente: una mascarilla en la clínica, y después una rutina fija con productos en casa. El Dermamelan es el más fuerte de los dos y se usa más a menudo en el melasma. En Diba Clinics en Rotterdam el Cosmelan cuesta € 720 y el Dermamelan € 920, productos incluidos.",
  "Zes maanden": "Seis meses",
  "€ 720 tot € 920": "€ 720 a € 920",
};
