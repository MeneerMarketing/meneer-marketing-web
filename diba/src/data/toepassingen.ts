/**
 * Toepassingen: één behandeling bij één klacht.
 *
 * OKAN, 5 september 2026, onder "belangrijke behandeltoepassingen die ontbreken": SkinPen
 * bij acnelittekens, bij grove poriën, bij fijne lijntjes, bij chirurgische littekens,
 * microneedling bij striae, Nordlys bij couperose, bij rosacea, bij pigmentvlekken, peeling
 * bij acne, bij pigment, voor huidverjonging, LED bij acne. "Deze hoeven niet allemaal als
 * hoofdkaart in het menu, maar verdienen wel een eigen landingspagina."
 *
 * WAAROM DIT GEEN DUBBELE PAGINA'S ZIJN.
 *
 * Iemand zoekt niet op "microneedling". Die zoekt op "microneedling acnelittekens" of op
 * "helpt needling tegen striae", en komt dan op een behandelpagina die over alles gaat of
 * op een klachtpagina die alle behandelingen noemt. Beide kloppen en geen van beide geeft
 * antwoord op de vraag die gesteld is.
 *
 * De valkuil is dat je dan dertien pagina's maakt die hetzelfde zeggen met een ander woord
 * erin. Dat is dunne inhoud, en Google straft het af terecht. Elke toepassing hier draagt
 * daarom drie dingen die op geen van beide ouderpagina's staan:
 *
 *   `waarom`     — waarom déze behandeling bij déze klacht werkt, in het mechaniek.
 *   `instelling` — wat er anders is aan de aanpak: diepte, sterkte, aantal, volgorde.
 *   `grens`      — wanneer het niet de juiste keuze is. Dat is per combinatie anders en
 *                  het is het deel dat een verkooppagina overslaat.
 *
 * Als een van die drie niet met iets specifieks te vullen is, hoort de toepassing hier niet
 * te staan; dan is het geen eigen onderwerp maar een synoniem.
 *
 * [MEDISCHE-CHECK-ROJDA: alle drie de velden per toepassing, en de sessieaantallen.]
 */
export type Toepassing = {
  /** Tweede segment van de URL: /behandelingen/<behandeling>/<slug>. */
  readonly slug: string;
  readonly behandeling: string;
  /** De huidprobleempagina waar dit bij hoort. */
  readonly probleem: string;
  /** Wat er in de titel en de kop staat. */
  readonly naam: string;
  readonly kop: string;
  readonly accent: string;
  /** Eén zin voor de zoekmachine. */
  readonly omschrijving: string;
  readonly intro: string;
  readonly waarom: readonly string[];
  readonly instelling: readonly {
    readonly kop: string;
    readonly zin: string;
  }[];
  readonly verwachting: string;
  readonly grens: readonly string[];
  readonly faq: readonly {
    readonly vraag: string;
    readonly antwoord: string;
  }[];
};

export const TOEPASSINGEN: readonly Toepassing[] = [
  /* ── SkinPen ──────────────────────────────────────────────────────────── */
  {
    slug: "acnelittekens",
    behandeling: "skinpen",
    probleem: "acne-littekens",
    naam: "SkinPen bij acnelittekens",
    kop: "Microneedling bij",
    accent: "acnelittekens",
    omschrijving:
      "Microneedling met de SkinPen bij acnelittekens in Rotterdam. Wat het doet bij putjes, wat het niet doet bij vlekken, en hoeveel sessies het vraagt.",
    intro:
      "Acnelittekens zijn geen vlekken maar vormen: de huid mist er bindweefsel, en daardoor vangt hij het licht anders. Daar helpt geen crème tegen en geen peeling; die werken op kleur en op de bovenlaag. Microneedling werkt op de vorm.",
    waarom: [
      "Een acnelitteken ontstaat doordat een ontsteking bindweefsel heeft opgeruimd en er te weinig voor is teruggekomen. Wat overblijft is een putje waarin het licht een schaduw maakt, en juist die schaduw zie je in de spiegel.",
      "De SkinPen zet honderden kanaaltjes tot in de bovenste lederhuid, precies de laag waar dat bindweefsel zit. Het lichaam herstelt die kanaaltjes met nieuw collageen, en dat vult de bodem van het putje op. Niet ineens: de opbouw loopt over weken tot maanden door, en daarom zie je na de eerste sessie nog niets.",
      "Bij acnelittekens is dat het hele verhaal. Het gaat niet om de kleur maar om de diepte: hoe minder verschil in hoogte, hoe minder schaduw, hoe minder je het litteken ziet.",
    ],
    instelling: [
      {
        kop: "Dieper dan bij een gewone sessie",
        zin: "Voor structuur wordt er dieper gewerkt dan bij een huidverbetering. De behandelaar zet de diepte per zone; op de wang kan meer dan op de kaaklijn.",
      },
      {
        kop: "Eerst de acne, dan het litteken",
        zin: "Zolang er actieve ontstekingen zijn wordt er niet op littekens gewerkt. Prikkelen van een ontstoken huid maakt de kans op nieuwe littekens groter, niet kleiner.",
      },
      {
        kop: "Een reeks, geen sessie",
        zin: "Vier tot zes keer met vier tot zes weken ertussen. Die tussentijd is geen wachten maar de behandeling: daarin wordt het collageen aangemaakt.",
      },
    ],
    verwachting:
      "Reken op maanden en op verbetering, niet op verdwijnen. Putjes worden ondieper en de huid oogt gelijkmatiger; een litteken dat er niet meer is, is een belofte die niemand kan waarmaken. Wat er ná de reeks nog staat, bekijken we samen voor we besluiten of er meer zin heeft.",
    grens: [
      "Bij donkere of rode vlekken zonder putje is dit niet de eerste keuze: dat is kleur, en daar werkt licht of een peeling beter op.",
      "Bij diepe, scherp begrensde putjes (ijspriemlittekens) komt needling vaak niet ver genoeg; dan is een fractionele laser een reëlere route.",
      "Bij aanleg voor keloïd wordt er niet geprikkeld voordat een arts heeft meegekeken.",
    ],
    faq: [
      {
        vraag: "Kan het ook als ik nog acne heb?",
        antwoord:
          "Niet op de plekken waar het actief is. We beginnen dan met de acne zelf; zodra de huid rustig is, is er iets om aan te werken dat ook rustig blijft.",
      },
      {
        vraag: "Hoeveel sessies heb ik nodig?",
        antwoord:
          "Meestal vier tot zes, met vier tot zes weken ertussen. Hoeveel het er bij jou worden hangt af van hoe diep de littekens zitten en hoe je huid op de eerste reageert.",
      },
    ],
  },
  {
    slug: "grove-porien",
    behandeling: "skinpen",
    probleem: "porien",
    naam: "SkinPen bij grove poriën",
    kop: "Microneedling bij",
    accent: "grove poriën",
    omschrijving:
      "Microneedling bij grove poriën en een ongelijkmatige huidstructuur. Wat er wel verandert, wat niet, en waarom poriën niet kleiner worden.",
    intro:
      "Een porie kan niet dichtgaan; er moet talg uit. Wat wel kan is dat de rand eromheen steviger wordt, en dat is precies het verschil tussen een porie die opvalt en een porie die je niet ziet.",
    waarom: [
      "Poriën vallen op als de huid eromheen slap is. Het gaatje zelf is bij iedereen ongeveer even groot; wat verschilt is of de rand strak staat of iets is ingezakt. Bij een ingezakte rand valt er schaduw in en dan lijkt de opening groter dan hij is.",
      "Microneedling brengt in de bovenste lederhuid nieuw collageen op gang. Dat is het weefsel dat die rand overeind houdt, en als het aantrekt wordt de opening minder diep en vangt hij minder schaduw.",
      "Daarom is dit een structuurbehandeling en geen reiniging. Een porie leeghalen helpt voor een paar dagen; de rand verstevigen houdt langer aan.",
    ],
    instelling: [
      {
        kop: "Ondieper en over een groter vlak",
        zin: "Bij structuur telt de dekking meer dan de diepte. Er wordt over de hele zone gewerkt in plaats van op losse plekken, met een instelling die lichter is dan bij littekens.",
      },
      {
        kop: "Vaak in combinatie met reinigen",
        zin: "Een HydraFacial ervoor haalt weg wat er in de poriën zit. Needling op een volle porie is de verkeerde volgorde.",
      },
      {
        kop: "Onderhoud hoort erbij",
        zin: "Na de startreeks houdt een sessie per kwartaal het resultaat vast. Collageen breekt weer af; dat is niet mislukken maar hoe huid werkt.",
      },
    ],
    verwachting:
      "Een huid die egaler oogt en licht gelijkmatiger weerkaatst, meestal vanaf de derde sessie zichtbaar. Wat niet gebeurt is dat poriën verdwijnen: als iemand dat belooft, belooft hij iets over anatomie dat niet klopt.",
    grens: [
      "Bij een vette huid met veel mee-eters is reinigen en talgregulatie de eerste stap; needling doet daar weinig aan.",
      "Bij actieve ontstekingen wordt er niet geprikkeld.",
      "Wie een direct zichtbaar verschil zoekt komt hier bedrogen uit: dit werkt over maanden.",
    ],
    faq: [
      {
        vraag: "Worden mijn poriën kleiner?",
        antwoord:
          "Nee. De opening blijft; wat verandert is de stevigheid van de huid eromheen, waardoor er minder schaduw in valt en hij minder opvalt.",
      },
      {
        vraag: "Wat is het verschil met een HydraFacial hiervoor?",
        antwoord:
          "Een HydraFacial haalt eruit wat erin zit en dat zie je meteen; het houdt dagen tot weken aan. Needling verandert de huid eromheen en dat duurt maanden. De twee bijten elkaar niet, ze werken op verschillende dingen.",
      },
    ],
  },
  {
    slug: "fijne-lijntjes",
    behandeling: "skinpen",
    probleem: "rimpels",
    naam: "SkinPen bij fijne lijntjes",
    kop: "Microneedling bij",
    accent: "fijne lijntjes",
    omschrijving:
      "Microneedling bij fijne lijntjes. Waarom het op oppervlakkige lijnen werkt en op een diepe vouw niet, en hoe lang het duurt.",
    intro:
      "Er zijn twee soorten lijnen en ze vragen om iets anders. Een fijn lijntje staat er ook als je je gezicht ontspant en komt van een huid die dunner en droger is geworden. Een vouw ontstaat doordat een spier de huid samentrekt. Op de eerste soort werkt dit; op de tweede niet.",
    waarom: [
      "Vanaf een jaar of vijfentwintig maakt de huid ieder jaar iets minder collageen aan. De bovenste lederhuid wordt daardoor dunner en de bovenlaag komt losser te liggen, en dat is wat je als een fijn netwerk van lijntjes ziet.",
      "Needling brengt precies in die laag herstel op gang. Het nieuwe collageen maakt de huid iets dikker en steviger, en een dikkere huid vouwt minder makkelijk in kleine lijntjes.",
      "Dat is geen opvullen. Er wordt niets ingebracht; de huid maakt het zelf, en daarom bouwt het effect op over weken en verdwijnt het ook weer geleidelijk.",
    ],
    instelling: [
      {
        kop: "Voorzichtig rond de ogen",
        zin: "De huid bij de oogkas is dunner dan de rest van het gezicht. Daar wordt met een lagere instelling gewerkt, en soms helemaal niet.",
      },
      {
        kop: "Vaak met een booster erbij",
        zin: "In dezelfde afspraak kan er hyaluronzuur mee de kanaaltjes in. Dat maakt de huid direct voller aanvoelend terwijl de opbouw op gang komt.",
      },
      {
        kop: "Drie tot zes, en dan onderhoud",
        zin: "Met vier weken ertussen. Daarna een of twee keer per jaar om vast te houden wat er is opgebouwd.",
      },
    ],
    verwachting:
      "Na de reeks een huid die gladder aanvoelt en waarin de fijnste lijntjes minder opvallen. Het beste moment om te vergelijken is drie maanden na de laatste sessie, want dan is de opbouw af.",
    grens: [
      "Een vouw tussen de wenkbrauwen of een lachrimpel die door spierbeweging ontstaat, gaat hier niet weg. Daarvoor werken wij niet met injectables.",
      "Bij een hangend ooglid of echt verslapte huid is dit te licht; dan is verstrakking met laser eerder aan de orde.",
      "Bij een pas gebruinde huid wachten we, ook bij een lichte instelling.",
    ],
    faq: [
      {
        vraag: "Is dit een alternatief voor botox?",
        antwoord:
          "Nee, het werkt op iets anders. Botox ontspant een spier en haalt daarmee een vouw weg; needling verandert de kwaliteit van de huid zelf. Bij een spiervouw doet needling weinig, bij een dunne huid met fijne lijntjes doet botox weinig.",
      },
      {
        vraag: "Hoe snel zie ik iets?",
        antwoord:
          "De eerste dagen ziet je huid er frisser uit door de zwelling; dat is nog geen resultaat. Wat blijft begint na een week of vier op te bouwen en loopt tot ongeveer drie maanden door.",
      },
    ],
  },
  {
    slug: "chirurgische-littekens",
    behandeling: "skinpen",
    probleem: "littekens",
    naam: "SkinPen bij operatielittekens",
    kop: "Microneedling bij",
    accent: "operatielittekens",
    omschrijving:
      "Microneedling bij littekens na een operatie of keizersnede. Wanneer je kunt beginnen, wat er verandert en wanneer een arts eerst meekijkt.",
    intro:
      "Een litteken van een operatie is ander weefsel dan de huid eromheen: het bindweefsel ligt er in één richting in plaats van kriskras. Daardoor is het strakker, glanzender en vaak wat verheven of juist ingetrokken. Needling herordent dat weefsel.",
    waarom: [
      "Bij normale huid liggen de collageenvezels door elkaar heen, en dat maakt de huid soepel in elke richting. In een litteken liggen ze evenwijdig, want zo is de wond dichtgetrokken. Dat weefsel is sterk maar stug, en het reflecteert licht anders.",
      "Microneedling maakt in dat stugge weefsel duizenden kleine wondjes die opnieuw genezen. Bij die tweede genezing ligt het nieuwe collageen minder strak in één richting, en wordt het litteken soepeler en minder scherp begrensd.",
      "Dat werkt het best als het litteken volgroeid is en niet meer verandert: meestal vanaf een half jaar na de operatie, soms later.",
    ],
    instelling: [
      {
        kop: "Niet voordat het rijp is",
        zin: "Een litteken dat nog rood is verandert nog uit zichzelf, en prikkelen kan dat verstoren. We wachten tot minstens zes maanden na de ingreep.",
      },
      {
        kop: "Alleen op en net naast het litteken",
        zin: "Er wordt op het weefsel zelf gewerkt en een klein stuk eromheen, zodat de overgang naar de gewone huid vloeiender wordt.",
      },
      {
        kop: "Meer sessies dan bij gewone huid",
        zin: "Littekenweefsel reageert trager. Reken op zes tot acht sessies, met vier tot zes weken ertussen.",
      },
    ],
    verwachting:
      "Een litteken dat soepeler aanvoelt, minder glanst en minder scherp afsteekt tegen de huid eromheen. De lijn blijft zichtbaar; wat verandert is hoeveel hij opvalt.",
    grens: [
      "Bij een keloïd of bij aanleg daarvoor wordt er niet geprikkeld voordat een arts of dermatoloog heeft meegekeken: een te stevige prikkel maakt een keloïd groter.",
      "Bij een litteken dat nog geen half jaar oud is wachten we.",
      "Bij een litteken dat open gaat, jeukt of van kleur verandert hoort eerst een arts te kijken.",
    ],
    faq: [
      {
        vraag: "Kan het op een keizersnedelitteken?",
        antwoord:
          "Vaak wel, als het litteken volgroeid is en rustig. De behandelaar beoordeelt het eerst; bij twijfel over het type litteken overleggen we met je arts.",
      },
      {
        vraag: "Wanneer kan ik beginnen na mijn operatie?",
        antwoord:
          "Meestal niet eerder dan zes maanden. Daarvoor verandert het litteken nog uit zichzelf en is er niets te winnen met prikkelen.",
      },
    ],
  },
  {
    slug: "striae",
    behandeling: "skinpen",
    probleem: "striae",
    naam: "Microneedling bij striae",
    kop: "Microneedling bij",
    accent: "striae",
    omschrijving:
      "Microneedling bij striae. Waarom rode striae beter reageren dan witte, en wat er wel en niet verandert.",
    intro:
      "Striae zijn scheuren in de lederhuid die van binnenuit zijn ontstaan doordat de huid sneller werd opgerekt dan hij mee kon groeien. De kleur vertelt hoe oud ze zijn, en die leeftijd bepaalt wat er nog te winnen valt.",
    waarom: [
      "Verse striae zijn rood of paars: er lopen nog vaatjes doorheen en het weefsel is nog bezig. In die fase reageert de huid het best op een prikkel, want het herstel is nog aan de gang en je duwt het een kant op.",
      "Witte striae zijn uitgewerkt. Het weefsel is dan dunner en er zit weinig pigment in, en dat komt niet meer terug. Wat wel kan is dat de structuur verbetert: de striae worden minder diep en de rand minder scherp, waardoor ze minder opvallen.",
      "Needling brengt in beide gevallen nieuw collageen op gang in de laag waar de scheur zit. Bij rode striae levert dat meer op dan bij witte, en dat verschil hoor je te weten voordat je aan een reeks begint.",
    ],
    instelling: [
      {
        kop: "Dieper dan in het gezicht",
        zin: "De huid op buik, heupen en dijen is dikker. De diepte wordt daarop afgestemd en verschilt per zone.",
      },
      {
        kop: "Grote vlakken, langere afspraak",
        zin: "Striae zitten zelden op één plek. Reken op een langere sessie dan een gezichtsbehandeling.",
      },
      {
        kop: "Zes tot acht sessies",
        zin: "Met vier tot zes weken ertussen. Op het lichaam gaat herstel trager dan in het gezicht.",
      },
    ],
    verwachting:
      "Minder diepe striae met een gelijkmatiger oppervlak. Bij rode striae vaak ook minder kleurverschil. Wat er niet gebeurt is dat ze verdwijnen; wie dat belooft, belooft iets over weefsel dat niet klopt.",
    grens: [
      "Witte striae reageren minder dan rode. Dat is geen instelling die anders kan; het is wat er nog te herstellen valt.",
      "Tijdens de zwangerschap en de borstvoeding behandelen we niet.",
      "Op een pas gebruinde huid wachten we, ook op het lichaam.",
    ],
    faq: [
      {
        vraag: "Werkt het ook op oude, witte striae?",
        antwoord:
          "Minder goed dan op rode. De structuur kan verbeteren waardoor ze minder opvallen, maar de kleur komt niet terug. Tijdens de intake kijken we welke van de twee je hebt, want dat bepaalt of het de moeite waard is.",
      },
      {
        vraag: "Kan het tijdens de zwangerschap?",
        antwoord:
          "Nee. We behandelen niet tijdens de zwangerschap of de borstvoeding, ook niet op het lichaam.",
      },
    ],
  },

  /* ── Peelings ─────────────────────────────────────────────────────────── */
  {
    slug: "acne",
    behandeling: "peelings",
    probleem: "acne",
    naam: "Medische peeling bij acne",
    kop: "Medische peelings bij",
    accent: "acne",
    omschrijving:
      "Medische peelings bij acne in Rotterdam. Welk zuur waarvoor werkt, waarom je huid eerst onrustiger kan worden, en hoe vaak.",
    intro:
      "Een peeling bij acne is geen schoonmaakbeurt. Het zuur doet twee dingen tegelijk: het maakt de opening van de porie vrij en het remt wat er zich daarbinnen opstapelt. Welk zuur er op je huid gaat, hangt af van welke van die twee bij jou het probleem is.",
    waarom: [
      "Acne begint met een verstopping: de wand van de porie vernieuwt te snel, de losse cellen plakken samen en de talg kan er niet meer uit. Wat daarna volgt aan bacterie en ontsteking zit áchter die verstopping.",
      "Salicylzuur lost op in vet en komt daardoor de porie zelf in; het maakt de prop losser waar hij zit. Glycolzuur werkt op de bovenlaag en zorgt dat losse cellen sneller loslaten. Bij een vette huid met veel mee-eters ligt het eerste voor de hand, bij een doffe huid met verstoppingen het tweede.",
      "Daarom is het bij acne minder een kwestie van sterker of zwakker en meer van welk zuur waar aangrijpt. Dat is wat er tijdens de intake vastgesteld wordt.",
    ],
    instelling: [
      {
        kop: "Opbouwen, niet meteen vol",
        zin: "De eerste keer op een lagere sterkte en een kortere inwerktijd. Hoe je huid daarop reageert bepaalt de volgende.",
      },
      {
        kop: "Reken op een dip",
        zin: "In de eerste weken kan de huid onrustiger worden doordat verstoppingen naar de oppervlakte komen. Dat is geen verslechtering; het is wat er al onder zat.",
      },
      {
        kop: "Een reeks van vier tot zes",
        zin: "Met twee tot vier weken ertussen, en daarna onderhoud zolang de huid daarom vraagt.",
      },
    ],
    verwachting:
      "Minder verstoppingen en minder nieuwe puistjes, meestal merkbaar vanaf de derde sessie. Wat een peeling niet doet is bestaande littekens weghalen; die vragen om iets anders en dat komt pas als de acne rustig is.",
    grens: [
      "Bij zware, ontstoken acne met knobbels hoort een arts mee te kijken; een peeling is dan niet de eerste stap.",
      "Bij gebruik van isotretinoïne wordt er niet gepeeld, en na het stoppen geldt een wachttijd.",
      "Op een pas gebruinde huid gaat een peeling niet door.",
    ],
    faq: [
      {
        vraag: "Wordt mijn huid eerst slechter?",
        antwoord:
          "Dat kan, in de eerste weken. Wat er dan naar boven komt zat er al; het wordt alleen sneller zichtbaar. Het hoort bij het verloop en het gaat over.",
      },
      {
        vraag: "Hoe vaak moet ik komen?",
        antwoord:
          "Meestal vier tot zes keer met twee tot vier weken ertussen. Daarna kijken we of onderhoud nodig is en hoe vaak.",
      },
    ],
  },
  {
    slug: "pigment",
    behandeling: "peelings",
    probleem: "pigmentvlekken",
    naam: "Medische peeling bij pigmentvlekken",
    kop: "Medische peelings bij",
    accent: "pigmentvlekken",
    omschrijving:
      "Medische peelings bij pigmentvlekken. Waarom zon het resultaat bepaalt, wanneer een peeling wel werkt en wanneer een traject beter past.",
    intro:
      "Pigment ligt op verschillende diepten, en een peeling komt maar tot één daarvan. Dat is de hele afweging: zit de vlek in de bovenlaag, dan kun je hem afvoeren. Zit hij dieper, dan haal je er de bovenkant vanaf en komt hij terug.",
    waarom: [
      "Een pigmentvlek is een plek waar de pigmentcellen te veel hebben aangemaakt. Bij zonschade zit dat pigment meestal hoog, in de opperhuid, en die laag vernieuwt zichzelf voortdurend.",
      "Een peeling versnelt die vernieuwing. De cellen met te veel pigment worden sneller afgevoerd en de nieuwe die eronder liggen hebben er minder in. Daarom werkt het op oppervlakkig pigment en niet op pigment dat in de lederhuid zit.",
      "Zon is hier geen bijzaak maar de helft van het resultaat. Elke blootstelling zet de pigmentcellen weer aan het werk, en dan haal je weg wat er meteen weer bij komt.",
    ],
    instelling: [
      {
        kop: "Voorbereiden met producten thuis",
        zin: "Twee tot vier weken vooraf remmen wat de pigmentcellen doen. Zonder die voorbereiding is de kans op een vlekkerig resultaat groter.",
      },
      {
        kop: "Liever in het najaar of de winter",
        zin: "Niet omdat het anders niet kan, maar omdat de maanden erna bepalen of het blijft. Minder zon betekent meer resultaat.",
      },
      {
        kop: "Dagelijkse bescherming, geen advies maar onderdeel",
        zin: "Zonder bescherming komt pigment terug, en dan was de reeks weggegooid geld.",
      },
    ],
    verwachting:
      "Een gelijkmatiger huid met lichtere vlekken, opgebouwd over een reeks. Bij hardnekkig of dieper pigment is een traject van maanden een reëlere route dan losse peelings; dat hoor je tijdens de intake, niet halverwege.",
    grens: [
      "Bij melasma is een gewone peeling vaak niet de juiste keuze: dat pigment reageert op warmte en hormonen en kan er juist van opspelen.",
      "Bij een pigmentrijke huid is er kans op verkleuring ná de peeling; de sterkte wordt daarop afgestemd en soms raden we het af.",
      "Op een gebruinde huid gaat het niet door.",
    ],
    faq: [
      {
        vraag: "Komen de vlekken terug?",
        antwoord:
          "Als je onbeschermd in de zon komt, ja. De pigmentcellen zijn er nog en die doen weer wat ze deden. Dagelijkse bescherming is hier geen tip maar het verschil tussen resultaat en geen resultaat.",
      },
      {
        vraag: "Wat is beter, een peeling of Cosmelan?",
        antwoord:
          "Dat hangt af van hoe diep het pigment zit en hoe hardnekkig het is. Een peeling is lichter en losser te doen; Cosmelan is een traject van maanden en pakt aan waar losse peelings op stuklopen. De behandelaar stelt tijdens de intake vast welke van de twee past.",
      },
    ],
  },
  {
    slug: "huidverjonging",
    behandeling: "peelings",
    probleem: "huidveroudering",
    naam: "Medische peeling voor huidverjonging",
    kop: "Medische peelings voor",
    accent: "huidverjonging",
    omschrijving:
      "Medische peelings voor huidverjonging. Wat een peeling doet aan een doffe, ongelijkmatige huid en waar de grens ligt.",
    intro:
      "Een huid die er vermoeid uitziet is vaak niet slap maar dof: de bovenlaag vernieuwt trager, ligt onregelmatiger en weerkaatst het licht daardoor ongelijk. Dat is precies de laag waar een peeling op werkt.",
    waarom: [
      "Vanaf een jaar of dertig duurt het langer voordat een huidcel van onderaf de oppervlakte bereikt. Er blijven meer dode cellen liggen, en die liggen niet netjes. Licht dat daarop valt weerkaatst alle kanten op, en dat zien wij als dof.",
      "Een peeling maakt die bovenlaag in één keer los, waardoor de nieuwe laag eronder gelijkmatiger komt te liggen. Dat is direct zichtbaar en het is ook de reden dat het effect tijdelijk is: de huid gaat gewoon door met vertragen.",
      "Bij herhaling gebeurt er meer. Een reeks peelings zet ook de aanmaak in de laag eronder aan, en dan gaat het niet alleen over glans maar ook over stevigheid.",
    ],
    instelling: [
      {
        kop: "Sterkte naar wat je huid aankan",
        zin: "Van een oppervlakkige peeling zonder hersteltijd tot een stevigere die een paar dagen vervelt. Wat het wordt hangt af van je huid en van hoeveel dagen je hebt.",
      },
      {
        kop: "Goed te combineren",
        zin: "Met needling in dezelfde reeks: de peeling op de bovenlaag, de needling op het bindweefsel eronder. Twee lagen, twee soorten resultaat.",
      },
      {
        kop: "Onderhoud in plaats van een kuur",
        zin: "Vier tot zes om te beginnen, daarna om de paar maanden. Het is een onderhoudsbehandeling en dat is geen tekortkoming.",
      },
    ],
    verwachting:
      "Een frissere, gelijkmatiger huid die het licht rustiger weerkaatst, direct na de eerste sessie merkbaar en na een reeks steviger. Diepe lijnen en verslapping vallen hier buiten.",
    grens: [
      "Een vouw die door spierbeweging ontstaat gaat hier niet weg.",
      "Bij echte verslapping is verstrakking met laser aan de orde; een peeling raakt die laag niet.",
      "Bij een gevoelige of beschadigde barrière beginnen we met herstellen en niet met afhalen.",
    ],
    faq: [
      {
        vraag: "Hoe lang houdt het aan?",
        antwoord:
          "De glans van één peeling houdt weken aan. Wat een reeks opbouwt aan stevigheid houdt maanden, en daarna vraagt het onderhoud. Dat is geen verkooptruc maar hoe huidvernieuwing werkt.",
      },
      {
        vraag: "Moet ik er vrij voor nemen?",
        antwoord:
          "Bij een oppervlakkige peeling niet; je bent een paar uur rood. Bij een stevigere vervel je een paar dagen, en dan plannen we het liever niet vlak voor iets belangrijks.",
      },
    ],
  },

  /* ── LED ──────────────────────────────────────────────────────────────── */
  {
    slug: "acne",
    behandeling: "led-therapie",
    probleem: "acne",
    naam: "LED-therapie bij acne",
    kop: "LED-lichttherapie bij",
    accent: "acne",
    omschrijving:
      "LED-lichttherapie bij acne. Wat blauw licht doet met de bacterie, waarom het geen losse behandeling is en hoe vaak het moet.",
    intro:
      "LED doet niets aan de verstopping en niets aan de talg. Het werkt op wat daarna komt: de bacterie die in een verstopte porie gedijt en de ontsteking die daaruit volgt. Daarom staat het bijna nooit alleen.",
    waarom: [
      "In een verstopte porie groeit een bacterie die van nature in de huid voorkomt. Die bacterie maakt stoffen aan die op blauw licht van een bepaalde golflengte reageren; daarbij komt zuurstof vrij die de bacterie zelf beschadigt.",
      "Rood licht doet iets anders: het dringt dieper door en remt de ontstekingsreactie eromheen. Bij acne worden ze daarom vaak na elkaar gegeven, blauw op de bacterie en rood op de roodheid.",
      "Wat LED niet doet is de porie vrijmaken. Zonder reiniging of een peeling blijft de verstopping zitten en komt de bacterie terug, en dan behandel je elke keer opnieuw hetzelfde.",
    ],
    instelling: [
      {
        kop: "Meestal aansluitend, niet los",
        zin: "Na een reiniging of een peeling, als de porie vrij is. Dan pakt het licht aan wat er nog zit in plaats van wat er bovenop ligt.",
      },
      {
        kop: "Blauw en rood, in die volgorde",
        zin: "Blauw op de bacterie, rood op de ontsteking. Welke van de twee zwaarder telt hangt af van hoe rood en hoe ontstoken je huid is.",
      },
      {
        kop: "Kort maar vaak",
        zin: "Een sessie duurt twintig minuten en er is geen hersteltijd. Het werkt door herhaling, dus een reeks met een paar dagen tot een week ertussen.",
      },
    ],
    verwachting:
      "Een rustigere huid met minder ontstoken plekjes, en minder roodheid rond de puistjes die er zijn. Het is de rustige stap in een acnetraject: geen hersteltijd, geen prikkeling, wel herhaling.",
    grens: [
      "Als losse behandeling doet het weinig; zonder aanpak van de verstopping komt het terug.",
      "Bij zware ontstoken acne hoort een arts mee te kijken.",
      "Bepaalde medicatie maakt de huid lichtgevoelig; dat hoor je te melden voordat er licht op gaat.",
    ],
    faq: [
      {
        vraag: "Kan ik alleen LED doen?",
        antwoord:
          "Dat kan, maar dan haal je er weinig uit. Het licht werkt op de bacterie en op de ontsteking; als de porie verstopt blijft komt het steeds terug. Het is bedoeld als stap in een traject.",
      },
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Nee. Je ligt twintig minuten met een bril op onder het licht en je voelt hooguit wat warmte. Erna kun je meteen door met je dag.",
      },
    ],
  },

  /* ── Nordlys ──────────────────────────────────────────────────────────── */
  {
    slug: "couperose",
    behandeling: "nordlys-roodheid",
    probleem: "couperose",
    naam: "Nordlys IPL bij couperose",
    kop: "Nordlys IPL bij",
    accent: "couperose",
    omschrijving:
      "Nordlys IPL bij couperose en zichtbare vaatjes. Wat er met een vaatje gebeurt, hoeveel sessies het vraagt en waarom er nieuwe bij kunnen komen.",
    intro:
      "Een zichtbaar vaatje is een bloedvat dat wijder is geworden dan het hoort en niet meer vanzelf dichtgaat. Licht kan het dichtmaken, en dan ruimt je lichaam het op. Dat is het hele mechaniek.",
    waarom: [
      "Het licht van de Nordlys wordt opgenomen door het rood in het bloed, en niet door de huid eromheen. Daardoor warmt precies het vaatje op en blijft de rest koel.",
      "Door die warmte klapt de wand van het vaatje dicht. Het bloed kan er niet meer doorheen en het lichaam breekt het in de weken erna af. Wat je daarna ziet is gewone huid, want dat vaatje is er niet meer.",
      "Meteen na de behandeling kan een vaatje juist donkerder zijn. Dat hoort erbij: het is het teken dat het geraakt is, en het trekt in de dagen erna weg.",
    ],
    instelling: [
      {
        kop: "Filter op de dikte van het vaatje",
        zin: "Een fijn adertje op de wang vraagt een andere instelling dan een dikker vaatje bij de neusvleugel. De behandelaar kiest het filter daarop.",
      },
      {
        kop: "Losse vaatjes gericht, roodheid over het vlak",
        zin: "Bij een paar zichtbare adertjes wordt er per vaatje gewerkt. Bij een gebied dat structureel rood staat gaat het licht over de hele zone.",
      },
      {
        kop: "Drie tot zes, met vier weken ertussen",
        zin: "Niet alles reageert in één keer, en de tussentijd is nodig om te zien wat er is weggegaan.",
      },
    ],
    verwachting:
      "Zichtbaar minder vaatjes en een rustiger kleur. Wat weg is komt niet terug: dat vaatje bestaat niet meer. Wel kunnen er elders nieuwe ontstaan, want de aanleg die ze maakte verandert niet.",
    grens: [
      "Dit geneest de aanleg niet. Wie makkelijk vaatjes maakt, blijft dat doen; onderhoud hoort er dan bij.",
      "Op een gebruinde huid kan het niet: het licht zoekt kleur, en dan raakt het ook de bruine huid.",
      "Bij een rode neus die dikker en bobbelig wordt hoort een arts mee te kijken.",
    ],
    faq: [
      {
        vraag: "Komen de vaatjes terug?",
        antwoord:
          "De behandelde vaatjes niet; die zijn opgeruimd. Wel kunnen er nieuwe ontstaan, want wat ze veroorzaakte verandert niet. Bij de meeste mensen betekent dat een sessie per jaar of twee om het bij te houden.",
      },
      {
        vraag: "Doet het pijn?",
        antwoord:
          "Elke flits voelt als een kort tikje met een elastiekje. Er gaat een koele gel op en je krijgt een bril op, want je ziet het licht ook door je oogleden heen.",
      },
    ],
  },
  {
    slug: "rosacea",
    behandeling: "nordlys-roodheid",
    probleem: "rosacea",
    naam: "Nordlys IPL bij rosacea",
    kop: "Nordlys IPL bij",
    accent: "rosacea",
    omschrijving:
      "Nordlys IPL bij rosacea. Wat licht doet aan de blijvende roodheid, wat het niet doet aan de opvliegers, en wanneer een arts erbij hoort.",
    intro:
      "Rosacea is meer dan roodheid: het is een huid die overreageert, met opvliegers, gevoeligheid en soms bultjes. Licht pakt daar één deel van aan, en dat is het deel dat je in de spiegel ziet.",
    waarom: [
      "Bij rosacea staan de kleine bloedvaten in het gezicht vaker en langer open. Op den duur gaan ze niet meer helemaal dicht, en dan blijft er een rode ondergrond staan ook als je geen opvlieger hebt.",
      "Het licht van de Nordlys wordt door dat bloed opgenomen en maakt de vaatjes dicht, waarna het lichaam ze opruimt. Daardoor zakt de vaste roodheid: de laag die er altijd was, verdwijnt.",
      "Wat blijft is de neiging tot opvliegen. Die zit in hoe de vaten reageren op warmte, alcohol, inspanning of spanning, en daar doet licht niets aan. Wie dat vooraf weet, is achteraf niet teleurgesteld.",
    ],
    instelling: [
      {
        kop: "Voorzichtig beginnen",
        zin: "Een rosacea-huid is prikkelbaar. De eerste sessie op een lagere energie, en pas op wat je huid ermee doet voordat er wordt opgeschaald.",
      },
      {
        kop: "Over het hele vlak, niet per vaatje",
        zin: "Bij rosacea gaat het zelden om één adertje maar om een gebied dat structureel rood staat. Het licht gaat daarom over de hele zone.",
      },
      {
        kop: "Onderhoud hoort erbij",
        zin: "Na de startreeks een of twee keer per jaar. Rosacea gaat niet weg; de zichtbare roodheid houd je ermee onder controle.",
      },
    ],
    verwachting:
      "Minder blijvende roodheid en een gelijkmatiger kleur, opgebouwd over drie tot zes sessies. De gevoeligheid en de opvliegers blijven; die vragen om weten wat je huid triggert, en dat is geen behandeling maar kennis.",
    grens: [
      "Het geneest rosacea niet. Het haalt de zichtbare roodheid weg en die kan terugkomen.",
      "Bij bultjes en puistjes die bij rosacea horen is er vaak medicatie van een arts nodig; licht doet daar weinig aan.",
      "Bij een neus die dikker en bobbelig wordt hoort dat bij een arts en niet bij ons.",
    ],
    faq: [
      {
        vraag: "Gaan mijn opvliegers hiermee weg?",
        antwoord:
          "Nee. Het licht sluit vaatjes die permanent open staan; de neiging om op te vliegen zit in hoe je vaten reageren en die blijft. Wat wel verandert is de rode ondergrond die er altijd was.",
      },
      {
        vraag: "Werkt dit samen met de behandeling van mijn arts?",
        antwoord:
          "Ja, en vaak is dat de beste route: de arts pakt de bultjes en de ontsteking aan, wij de zichtbare roodheid. We stemmen af wat er wanneer gebeurt.",
      },
    ],
  },
  {
    slug: "zonnevlekken",
    behandeling: "nordlys-pigment",
    probleem: "ouderdomsvlekken",
    naam: "Nordlys IPL bij zonnevlekken",
    kop: "Nordlys IPL bij",
    accent: "zonne- en ouderdomsvlekken",
    omschrijving:
      "Nordlys IPL bij zonnevlekken en ouderdomsvlekken. Waarom de vlek eerst donkerder wordt, hoeveel sessies het vraagt en wanneer het niet kan.",
    intro:
      "Een zonnevlek is een plek waar pigmentcellen jarenlang te veel hebben aangemaakt. Licht kan die opeenhoping gericht aanpakken, juist omdat het donker opzoekt en de huid eromheen overslaat.",
    waarom: [
      "Het licht van de Nordlys wordt opgenomen door het pigment in de vlek en niet door de lichtere huid ernaast. Daardoor warmt precies de vlek op en blijft de rest koel; dat is wat een IPL onderscheidt van een peeling, die de hele bovenlaag afhaalt.",
      "Door die warmte valt de pigmentkorrel uiteen en werkt hij naar de oppervlakte. In de dagen erna wordt de vlek eerst donkerder en korreliger, daarna schilfert hij weg. Dat donkerder worden is het teken dat het gewerkt heeft.",
      "Daarom werkt dit goed op scherp afgebakende vlekken door zon, en minder op pigment dat diffuus of dieper zit.",
    ],
    instelling: [
      {
        kop: "Alleen op een onbruinde huid",
        zin: "Het licht zoekt kleur. Op een gebruinde huid raakt het niet alleen de vlek, en dat geeft kans op verkleuring. Na de zon wachten we.",
      },
      {
        kop: "Vlekken los of een hele zone",
        zin: "Een paar losse vlekken worden gericht behandeld; bij verspreide zonschade gaat het licht over de hele wang of over de handrug.",
      },
      {
        kop: "Drie tot zes sessies",
        zin: "Met vier weken ertussen, zodat er tijd is om te zien wat er is weggegaan voordat er opnieuw gewerkt wordt.",
      },
    ],
    verwachting:
      "Vlekken die lichter worden of verdwijnen, met een gelijkmatiger huid als geheel. De eerste week na een sessie ziet het er slechter uit dan ervoor; dat hoort erbij en is geen tegenvaller.",
    grens: [
      "Bij melasma is dit vaak niet de juiste keuze: dat pigment reageert op warmte en kan er juist van opspelen.",
      "Een vlek die van vorm of kleur verandert hoort eerst door een arts beoordeeld te worden, niet door ons behandeld.",
      "Op een gebruinde huid gaat het niet door.",
    ],
    faq: [
      {
        vraag: "Waarom wordt de vlek eerst donkerder?",
        antwoord:
          "Omdat het pigment uiteen is gevallen en naar de oppervlakte werkt. Na een dag of vijf tot tien schilfert het weg. Krabben of scrubben in die periode is de enige manier om er een vlek van te maken die blijft.",
      },
      {
        vraag: "Komen ze terug?",
        antwoord:
          "De behandelde vlek niet, maar de pigmentcellen die hem maakten zitten er nog. Zonder dagelijkse bescherming komen er nieuwe, en dan heb je hetzelfde geld twee keer uitgegeven.",
      },
    ],
  },
];

/** Alle toepassingen bij één behandeling. */
export function toepassingenBijBehandeling(
  slug: string,
): readonly Toepassing[] {
  return TOEPASSINGEN.filter((t) => t.behandeling === slug);
}

/** Alle toepassingen die naar één huidprobleem wijzen. */
export function toepassingenBijProbleem(slug: string): readonly Toepassing[] {
  return TOEPASSINGEN.filter((t) => t.probleem === slug);
}

export function toepassingVoor(
  behandeling: string,
  slug: string,
): Toepassing | undefined {
  return TOEPASSINGEN.find(
    (t) => t.behandeling === behandeling && t.slug === slug,
  );
}
