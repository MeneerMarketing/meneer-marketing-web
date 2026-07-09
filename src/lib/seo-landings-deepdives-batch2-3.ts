import type { SeoLandingProseOverride } from "@/data/seo-landings/types";

/**
 * Handgeschreven deep-dive secties voor batch 2 en 3.
 * Vervangt hash-pool copy voor sterkere SEO-uniekheid per slug.
 */
export const DEEPDIVE_BATCH2_BATCH3: Partial<
  Record<string, SeoLandingProseOverride>
> = {
  "conversie-optimalisatie": {
    title: "Conversie-optimalisatie op je echte shop, niet op een heatmap-slideshow",
    paragraphs: [
      "Conversie-optimalisatie begint bij meten: waar haken mensen af, welke stap kost je een aanvraag, welke productpagina trekt kliks maar geen checkout. Ik start met data uit GA4, Clarity of je shop-statistieken. Daarna pas design.",
      "CRO is meer dan een knop groen maken. Het is vertrouwen op mobiel, checkout zonder frictie, prijs en verzending die vooraf duidelijk zijn, en landings die matchen met je ads. Bij BestRest keek ik per productlijn naar andere blokkades.",
      "A/B-testen kan, maar alleen als je genoeg verkeer hebt. Bij MKB wint vaak één grote fix: snelheid, formulier korter, trust-elementen, of een landingspagina die eindelijk de vraag beantwoordt waar je ad op target.",
      "Conversie-optimalisatie bij mij hangt samen met bouwen en campagnes. Ik pas de pagina aan die je verkeer al heeft. Dat levert sneller winst dan maanden testen op details die niemand ziet.",
    ],
  },
  "lokale-seo": {
    title: "Lokale SEO: Maps, GBP en landings die samen scoren",
    paragraphs: [
      "Lokale SEO is meer dan je adres in de footer. Google Business Profile, reviews, NAP-consistentie en pagina's op lokale zoekintentie bepalen of je in de map pack verschijnt wanneer iemand in jouw regio zoekt.",
      "Ik begin met je profiel: categorie, diensten, foto's, posts en Q&A. Daarna kijk ik naar je site: snelheid op mobiel, schema voor local business, en landings per stad of wijk als dat past bij je model.",
      "Reviews zijn social proof die Google én mensen lezen. Ik help met structuur: wanneer vragen, hoe reageren, en hoe je reviews terug laat komen op je site zonder spammy widgets.",
      "Lokale SEO werkt het best als organisch en betaald dezelfde boodschap hebben. Ads naar een trage landings met een vaag GBP-profiel is budget weggeven. Eerst het fundament, dan opschalen.",
    ],
  },
  "zoekmachine-optimalisatie": {
    title: "Zoekmachine-optimalisatie als langdurig verkeurskanaal",
    paragraphs: [
      "Zoekmachine-optimalisatie is het structureel verbeteren van je site en content zodat Google je pagina's begrijpt, vertrouwt en bovenaan zet bij vragen met koopintentie. Het vraagt maanden discipline, geen snelle truc.",
      "Ik werk in drie lagen: techniek (crawl, snelheid, schema), structuur (interne links, silo's, landings per intentie) en content (antwoorden die ranken én converteren). SkinComplete domineerde salonvragen organisch voordat ads live gingen.",
      "Keyword-onderzoek bij mij is marge-gedreven. Welke termen leveren klanten op, niet alleen volume. Een positie op pagina één voor een term die niemand koopt is een trofee zonder omzet.",
      "Zoekmachine-optimalisatie combineer ik met AI-antwoorden: sterke FAQ's, duidelijke merkinfo en pagina's die ChatGPT en Gemini kunnen citeren. Dat is vindbaarheid in 2026, niet alleen tien blauwe links.",
    ],
  },
  "technische-seo": {
    title: "Technische SEO: het fundament onder elke ranking",
    paragraphs: [
      "Technische SEO is alles wat crawlers en gebruikers nodig hebben voordat content kan winnen: indexatie, canonicals, sitemap, Core Web Vitals, mobiele bruikbaarheid en structured data die klopt.",
      "Ik audit niet om een PDF van tachtig pagina's te leveren. Ik prioriteer op impact: wat blokkeert indexatie, wat maakt je site traag op 4G, waar lekt autoriteit weg door duplicate content.",
      "Shopify en Next.js vragen elk een andere aanpak. Bij Shopify kijk ik naar theme-performance, filter-URL's en product-schema. Bij Next.js naar rendering, caching en hoe je dynamische routes indexeerbaar houdt.",
      "Technische SEO is saai tot het fout gaat. Dan kost het je elke dag organisch verkeer. Ik fix het zelf in code. Jij hoeft niet tussen developer en SEO-bureau te pingpongen.",
    ],
  },
  "ppc-bureau": {
    title: "PPC bureau: betaald verkeer met marge in het vizier",
    paragraphs: [
      "PPC (pay-per-click) is betaald adverteren op Google, Meta en soms Bing. Een PPC bureau beheert budget, campagnes, zoektermen en landings zodat elke euro meetbaar bijdraagt aan leads of omzet.",
      "Ik begin bij intentie: Search voor koopmomenten, Shopping voor producten met feed-kwaliteit, Meta voor vraag creëren. Performance Max alleen als je input schoon is. Anders optimaliseer je op een zwarte doos met vieze data.",
      "PPC zonder tracking is gokken. Ik zet GA4, GTM en conversies goed neer vóór ik budget opschaal. ROAS en CPA moeten je bankrekening snappen, niet alleen je dashboard.",
      "Als PPC bureau ben ik ook bouwer. Landings die lekken na de klik fix ik zelf. Dat scheelt weken tussen ads-team en web-team. SkinComplete en BestRest draaiden zo.",
    ],
  },
  "e-commerce-marketing": {
    title: "E-commerce marketing: shop, verkeer en retentie in één lijn",
    paragraphs: [
      "E-commerce marketing is het geheel van tactieken die je webshop laat groeien: vindbaarheid, ads, e-mail, marketplace en site-ervaring. Alles moet dezelfde klantreis ondersteunen.",
      "Ik start bij je shop-data: welke producten dragen marge, waar valt de winkelwagen weg, welk kanaal levert herhaalaankopen. Daarna kies ik volgorde: vaak techniek en feed, dan SEO of Shopping, dan mail en retentie.",
      "E-commerce marketing faalt als kanalen tegen elkaar werken. Ads naar uitverkochte SKU's, mail met verkeerde prijzen, SEO naar pagina's zonder voorraad. Ik koppel shop, feed en campagnes.",
      "Bij SkinComplete hing B2B-portaal, SEO, mail en ads aan dezelfde Shopify. E-commerce marketing is bij mij één brein dat je winkel leest, niet vijf freelancers met losse logins.",
    ],
  },
  "e-mailmarketing": {
    title: "E-mailmarketing die omzet per mailreeks meet",
    paragraphs: [
      "E-mailmarketing is meer dan een nieuwsbrief op dinsdag. Het is welkom na aanmelding, cart recovery na verlaten checkout, post-purchase flows en win-back voor slapende klanten. Elk met een doel en een metric.",
      "Ik koppel mail aan je shop: productdata, segmenten op gedrag, dynamische blokken die kloppen. Klaviyo of Shopify Email, afhankelijk van wat je stack nodig heeft.",
      "Open rate is een vanity metric als niemand koopt. Ik meet omzet per flow, click-to-purchase en LTV per segment. Mail moet je shop voeden, niet alleen je merk 'warm houden'.",
      "E-mailmarketing werkte bij SkinComplete vóór het adsbudget omhoog ging. Elke euro op ads trof een lijst die al geconditioneerd was. Dat is hoe mail je paid versterkt.",
    ],
  },
  "tiktok-ads-bureau": {
    title: "TikTok Ads: short-form creatives die landen op een site die converteert",
    paragraphs: [
      "TikTok Ads draait om scroll-stoppende video, snelle hooks en doelgroepen die passen bij je marge. Het platform is discovery: mensen zien je product voordat ze zoeken.",
      "Ik test creatives in 9:16, korte loops en duidelijke CTA's. Maar een virale view zonder checkout is hobby. Landings moeten mobiel-first zijn, snel laden en dezelfde belofte doen als je ad.",
      "TikTok past niet bij elk product. Lage marge, lange overwegingstijd of een site die alleen op desktop werkt? Dan zeg ik het eerlijk. Als het past, koppel ik TikTok aan Meta en Google in één strategie.",
      "UGC en creators helpen op TikTok. Ik denk mee over hooks en gebruik beelden ook in andere kanalen. Eén shoot, meerdere placements.",
    ],
  },
  "leadgeneratie-website": {
    title: "Leadgeneratie website: van bezoeker naar gekwalificeerde aanvraag",
    paragraphs: [
      "Een leadgeneratie website is gebouwd om contactgegevens te verdienen: formulieren, calls, downloads of intake die sales voeden. Elke pagina heeft één job: vertrouwen wekken en actie uitlokken.",
      "Ik ontwerp landings per dienst of campagne, niet één homepage die alles moet doen. Message match met je ads is cruciaal. Anders betaal je voor kliks naar een pagina die een andere vraag beantwoordt.",
      "Formulieren kort houden, privacy duidelijk, social proof dichtbij de CTA. Ik meet welke bron kwaliteit levert, niet alleen volume. Honderd leads waarvan tien bellen is erger dan twintig waarvan acht.",
      "Leadgeneratie website bouw ik in Next.js of op maat in Shopify als B2B meespeelt. Snelheid, schema en tracking zitten erin. Klaar voor Google Ads en organisch verkeer tegelijk.",
    ],
  },
  "woocommerce-naar-shopify": {
    title: "WooCommerce naar Shopify migreren zonder SEO en omzet te verliezen",
    paragraphs: [
      "Migratie van WooCommerce naar Shopify is meer dan producten importeren. Het is URL-structuur, redirects, feed-kwaliteit, checkout en alle koppelingen die je stack draaiende houden.",
      "Ik map elke URL: wat blijft, wat redirect, wat verdwijnt. Rankings en backlinks zijn geld. Een slordige migratie kost maanden organisch verkeer. Dat plan ik vooraf, niet na livegang.",
      "Shopify wint op onderhoud, apps en schaal voor veel webshops. WooCommerce wint als je extreem custom WordPress nodig hebt. Ik adviseer eerlijk of migratie nu zinvol is.",
      "Na migratie: theme from scratch of custom waar nodig, Shopping-feed, mailflows en tracking opnieuw valideren. WooCommerce naar Shopify bij mij is een project met een checklist, geen weekend-klus.",
    ],
  },
  "google-ads-specialist": {
    title: "Google Ads specialist die ook je landings bijstuurt",
    paragraphs: [
      "Een Google Ads specialist beheert Search, Shopping, Display en remarketing in Google Ads. Bij mij zit die specialist aan dezelfde tafel als degene die je landingspagina's bouwt en je tracking controleert.",
      "Ik lees zoektermenrapporten wekelijks. Broad match zonder negatieven is een pinautomaat voor Google. Ik structureer campagnes op intentie en marge per productgroep of dienst.",
      "Shopping vraagt een schone feed: titels, GTIN, prijs, voorraad. Search vraagt message match. Performance Max vraagt dat je weet wat je instopt voordat je het algoritme de leiding geeft.",
      "Google Ads specialist inhuren bij Meneer Marketing betekent: één aanspreekpunt, eerlijk advies als SEO slimmer is, en pagina's die ik zelf aanpas als de data dat vraagt.",
    ],
  },
  "google-ads-uitbesteden": {
    title: "Google Ads uitbesteden met iemand die je account als eigen geld behandelt",
    paragraphs: [
      "Google Ads uitbesteden loont als je specialist mist, tijd tekort komt of je account te groot wordt voor weekend-tweaks. Het faalt als je alleen een dashboard krijgt zonder actie.",
      "Bij uitbesteding krijg je bij mij: accountstructuur, wekelijkse bijsturing, zoektermenhygiëne, landings die matchen en rapportage in omzet-taal. ROAS, CPA, conversiewaarde.",
      "Ik heb toegang nodig tot je site, analytics en idealiter je shop. Ads in isolatie optimaliseren is optimaliseren op halve waarheid. Uitbesteden is samenwerken, niet wegstoppen.",
      "SkinComplete schaalde ads pas na organisch bewijs. BestRest per matras bekeken. Google Ads uitbesteden bij mij volgt jouw volgorde, niet een standaard pakket van twaalf maanden.",
    ],
  },
  "remarketing-google-ads": {
    title: "Remarketing in Google Ads: warm verkeer terugbrengen zonder stalker-vibe",
    paragraphs: [
      "Remarketing toont ads aan mensen die je site al bezochten. Cart abandoners, dienst-pagina bezoekers, of wie een video bekeek. Het is vaak goedkoper per conversie dan koud verkeer.",
      "Segmentatie is alles. Iedereen die je favicon zag targeten is irritant en duur. Ik segmenteer op diepte: product bekeken, checkout gestart, pricing page, B2B vs B2C.",
      "Frequency caps, creatives die variëren en landings die de vervolgstap uitleggen. Remarketing moet helpen beslissen, niet schreeuwen tot ze blocken.",
      "Remarketing koppel ik aan je e-mailflows waar dat kan. Dubbele touchpoints die elkaar versterken. Google Ads remarketing is één laag in een retentieplan, niet de hele strategie.",
    ],
  },
  "facebook-ads-bureau": {
    title: "Facebook Ads bureau: Meta campagnes met landings die converteren",
    paragraphs: [
      "Facebook Ads (Meta) bereikt mensen in feed, Stories en Reels. Een bureau dat alleen mooie creatives levert maar je checkout niet aanraakt, levert views, geen omzet.",
      "Ik zet campagnes op met duidelijke doelen: conversies, leads of catalog sales. Pixel en CAPI moeten kloppen. Anders optimaliseert Meta op verkeerde signalen.",
      "Creatives roteren. Fatigue is echt. UGC en korte hooks werken vaak beter dan studio-perfecte beelden waar niemand in gelooft.",
      "Facebook Ads bureau bij mij werkt samen met Google Ads onder één strategie. Zelfde aanbod, zelfde landings, andere hooks per kanaal. SkinComplete gebruikte UGC ook in Meta.",
    ],
  },
  "instagram-ads-bureau": {
    title: "Instagram Ads: 9:16 creatives op een mobiele site die meedoet",
    paragraphs: [
      "Instagram Ads leven in visueel en scroll-snel. Reels en Stories domineren. Je creative heeft fracties van een seconde om te landen voordat de duim doorgaat.",
      "Ik bouw landings mobile-first: snel, duidelijke CTA boven de fold, vertrouwen zichtbaar zonder eindeloos scrollen. Een prachtige Reel naar een trage pagina is weggegooid budget.",
      "Instagram past bij merken met sterk beeld en een product dat je in beeld kunt uitleggen. Ik test doelgroepen en creatives, maar meet op checkout en lead, niet op likes.",
      "Instagram Ads bureau bij Meneer Marketing betekent creatives én pagina's in één handenpaar. Certified Meta partner, dagelijks in accounts.",
    ],
  },
  "shopify-webshop-laten-maken": {
    title: "Shopify webshop laten maken: custom theme en klaar voor groei",
    paragraphs: [
      "Shopify webshop laten maken is meer dan een theme uit de store kiezen. Het is architectuur voor jouw assortiment, B2B als dat moet, feed voor Shopping en checkout die converteert.",
      "Ik bouw custom waar de theme store stopt: portalen, prijslijsten, unieke productconfiguraties, koppelingen met ERP of mail. SkinComplete draait zo.",
      "Snelheid en SEO horen bij launch. Product-schema, collectiestructuur, filters die indexeerbaar blijven waar het kan. Een shop die alleen mooi is maar niet rankt, wacht op ads voor elke bezoeker.",
      "Shopify webshop laten maken bij mij includes groeipad: mailflows, tracking, en campagnes als het fundament staat. Eén lijn van bouw tot marketing.",
    ],
  },
  "shopify-seo": {
    title: "Shopify SEO: productpagina's die ranken én verkopen",
    paragraphs: [
      "Shopify SEO vraagt om unieke titels, collectielogica, technische beperkingen van themes en content die koopintentie vangt. Duplicate thin pages zijn de vijand.",
      "Ik optimaliseer product- en collectiepagina's, blog en landings, interne links en schema. Filter-URL's en tag-rommel pak ik aan voordat Google ze indexeert.",
      "Shopify SEO werkt samen met Shopping: dezelfde productdata moet kloppen in feed en op pagina. Inconsistentie kost zowel organisch als betaald.",
      "Shopify SEO is langdurig. Quick wins zijn vaak techniek en dunne pagina's opvullen. Daarna content op vragen die je klanten echt stellen.",
    ],
  },
  "nextjs-website-laten-maken": {
    title: "Next.js website laten maken: snel, schaalbaar en SEO-klaar",
    paragraphs: [
      "Next.js is mijn stack voor marketing sites, landings en webapps die snel moeten zijn. Server components, goede caching en controle over elke URL en meta-tag.",
      "Een Next.js website laten maken betekent: custom build from scratch. Core Web Vitals ingebouwd, schema per pagina, en structuur die groeit met je diensten.",
      "Ik koppel CMS waar nodig, forms, analytics en soms headless Shopify. Alles wat je nodig hebt voor campagnes en SEO zonder plugin-chaos.",
      "Next.js websites die ik bouw zijn klaar voor Google Ads en organisch verkeer op dag één. Hills Pilates en Meneer Marketing zelf draaien zo.",
    ],
  },
  "website-laten-bouwen": {
    title: "Website laten bouwen met code die marketing aankan",
    paragraphs: [
      "Website laten bouwen is bij mij from scratch: structuur eerst, dan design en development in Next.js of Shopify. Jij vertelt het doel, ik vertaal het naar pagina's die converteren.",
      "Elke pagina heeft een job: informeren, overtuigen of converteren. Ik schrijf geen vijftig pagina's 'voor SEO'. Ik bouw landings op intentie die je business voeden.",
      "Snelheid, toegankelijkheid en tracking zijn geen add-ons. Ze zitten in het fundament. Ads opschalen op een trage site is duurder dan je denkt.",
      "Website laten bouwen eindigt niet bij oplevering. Ik meet, bijstuur en breid uit als data het vraagt. Eén bouwer die ook je vindbaarheid en campagnes snapt.",
    ],
  },
  "seo-audit": {
    title: "SEO audit met prioriteiten die je morgen kunt uitvoeren",
    paragraphs: [
      "Een SEO audit is een foto van je vindbaarheid: techniek, content, autoriteit en concurrentie. Bij mij wordt het een ranked lijst met impact die je team kan uitvoeren.",
      "Ik check crawlbaarheid, Core Web Vitals, indexatie, duplicate content, keyword gaps en wat je topconcurrenten anders doen. Lokaal, nationaal of shop-specifiek.",
      "Elke bevinding krijgt: ernst, inspanning en verwacht effect. Sommige fixes zijn een uur werk. Andere zijn een nieuwe landingspagina. Ik kan beide zelf doen.",
      "SEO audit is zinvol vóór een redesign, na migratie, of als verkeer stagneert terwijl je markt groeit. Het antwoord is vaak minder bloggen, meer fundament.",
    ],
  },
  "seo-uitbesteden": {
    title: "SEO uitbesteden aan iemand die ook de pagina's bouwt",
    paragraphs: [
      "SEO uitbesteden werkt als je execution mist: techniek, content, linkwaardige pagina's. Het faalt als je maandrapporten krijgt zonder dat er iets live gaat.",
      "Bij uitbesteding krijg je roadmap, uitvoering en meting. Ik schrijf en bouw landings, fix techniek en rapporteer in posities én omzet, niet alleen impressions.",
      "SEO uitbesteden is een partnership. Ik heb toegang nodig tot CMS, Search Console en analytics. Geheimzinnigheid over 'tactieken' is vaak masker voor weinig werk.",
      "SkinComplete rankte eerst organisch. SEO uitbesteden bij mij volgt die logica: eerst wat gratis verkeer oplevert, dan pas paid versterken.",
    ],
  },
  "linkbuilding-bureau": {
    title: "Linkbuilding met content die mensen écht willen delen",
    paragraphs: [
      "Linkbuilding is autoriteit verdienen: andere sites die naar jou linken omdat je nuttig bent. Ik koop geen linkpakketten uit 2012. Ik bouw pagina's en assets die linkwaardig zijn.",
      "Dat kan een gids zijn, een vergelijking, data, tools of cases. Bij B2B werkt diepgang vaak beter dan generieke gastblogs.",
      "Linkbuilding hoort bij je contentstrategie. Een dun blog zonder unieke invalshoek trekt geen links. Een sterke pagina op een echte vraag wel.",
      "Ik meet niet alleen Domain Rating. Ik meet referral traffic en of links op relevante anchor komen. Linkbuilding bureau bij mij is onderdeel van SEO, één lijn met content en techniek.",
    ],
  },
  "online-marketing-manager": {
    title: "Online marketing manager: één brein voor al je kanalen",
    paragraphs: [
      "Een online marketing manager coördineert site, SEO, ads, mail en data. Bij Meneer Marketing ben ik die manager én de uitvoerder. Jij hebt één aanspreekpunt dat zelf in accounts en code zit.",
      "Ik maak het jaarplan niet in een vacuüm. Ik kijk naar marge, seizoen, capaciteit en wat je site aankan. Soms is het kwartaal van SEO, soms van CRO, soms van Shopping opschalen.",
      "Online marketing manager uitbesteden aan een bureau met vijf juniors is anders dan aan één senior die je shop opent, je zoektermen leest en je flows meet.",
      "Rapportage is wekelijks of maandelijks in mensentaal: wat ging live, wat levert het op, wat doen we volgende week. Online marketing manager bij mij is regie met handen.",
    ],
  },
  "performance-marketing-bureau": {
    title: "Performance marketing: elke euro meetbaar aan de omzet gekoppeld",
    paragraphs: [
      "Performance marketing draait om meetbare acties: clicks, leads, verkopen, ROAS, CPA. Alles wat niet bijdraagt aan je P&L gaat eruit of wordt getest tot het wel werkt.",
      "Ik werk cross-channel: Google Ads, Meta, soms TikTok of marketplaces. Eén attributiemodel dat je begrijpt, liever eenvoudig en consistent dan over-engineered.",
      "Performance marketing bureau zonder sterke landings is dashboard-decoratie. Ik bouw en optimaliseer pagina's waar je budget naartoe stroomt.",
      "Opschalen doe ik als de unit economics kloppen. Performance marketing is geduldig bijsturen, niet wekelijks van strategie wisselen omdat LinkedIn iets nieuws zegt.",
    ],
  },
  "cro-bureau": {
    title: "CRO bureau: meer omzet uit het verkeer dat je al hebt",
    paragraphs: [
      "CRO (conversion rate optimization) verhoogt het percentage bezoekers dat koopt, belt of inschrijft. Goedkoper dan meer verkeer kopen als je site al lekt.",
      "Ik combineer kwalitatief inzicht (heatmaps, sessies, gebruikersfeedback) met kwantitatieve data (funnels, drop-off, device splits). Daarna hypotheses en fixes.",
      "CRO bureau bij mij werkt niet los van development. Ik implementeer zelf: checkout, formulieren, trust, mobiele layout. Zelfde week live, zelfde handen.",
      "CRO is continu bij webshops met seizoenspieken. Een winst van een halve procentpunt conversie kan duizenden euro's per maand zijn. Dat rechtvaardigt focus.",
    ],
  },
  "tracking-google-analytics": {
    title: "Google Analytics en GTM: meten voordat je optimaliseert",
    paragraphs: [
      "Tracking met Google Analytics 4 en Google Tag Manager is het fundament onder elke marketingbeslissing. Zonder betrouwbare events gok je met budget.",
      "Ik zet purchases, leads, micro-conversies en enhanced conversions op. E-commerce enhanced ecommerce voor shops, custom events voor B2B-formulieren.",
      "Consent mode en privacy horen erbij. Meten binnen de regels, maar wel volledig genoeg om te sturen. Ik test met Tag Assistant en live data, niet alleen op papier.",
      "Tracking Google Analytics uitbesteden aan mij loont vóór grote campagnes of na migratie. Eerst waarheid, dan opschalen. Anders optimaliseer je op fantasiecijfers.",
    ],
  },
};

export const DEEPDIVE_BATCH2_BATCH3_SLUGS = new Set(
  Object.keys(DEEPDIVE_BATCH2_BATCH3),
);
