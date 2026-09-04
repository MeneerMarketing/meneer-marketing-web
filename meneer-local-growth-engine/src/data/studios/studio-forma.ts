import type { StudioData } from "@/types/studio";

export const studioForma: StudioData = {
  id: "studio-forma-arnhem",
  slug: "studio-forma-arnhem",
  studio_name: "Studio Forma",
  city: "Arnhem",
  country: "Nederland",
  logo: null,
  primary_color: "#1A1614",
  secondary_color: "#F4EFE6",
  accent_color: "#C4A484",
  tagline: "Reformer Pilates met precisie en rust",
  description:
    "Studio Forma is een intimate reformer studio in het hart van Arnhem. Kleine groepen, scherpe instructie en een ruimte die uitnodigt tot focus. Hier train je kracht, controle en lengte. Zonder ruis.",
  primary_service: "Reformer Pilates",
  services: [
    {
      id: "reformer",
      name: "Reformer Pilates",
      description:
        "Klassikale reformer lessen in kleine groepen. Elke beweging met weerstand, ritme en adem. Voor beginners én gevorderden.",
      duration_minutes: 55,
      highlight: true,
    },
    {
      id: "mat",
      name: "Mat Pilates",
      description:
        "Zuivere matwork op de vloer. Core, stabiliteit en flow. Ideaal als aanvulling of startpunt.",
      duration_minutes: 50,
    },
    {
      id: "private",
      name: "Private Reformer",
      description:
        "Eén-op-één op de reformer. Jouw tempo, jouw doelen, volledige aandacht van de instructor.",
      duration_minutes: 55,
    },
    {
      id: "duo",
      name: "Duo Reformer",
      description:
        "Train met z'n tweeën. Dezelfde intensiteit als private, met de energie van samen bewegen.",
      duration_minutes: 55,
    },
  ],
  phone: "+31 6 18 44 29 01",
  email: "hallo@studioforma.nl",
  address: "Weverstraat 28",
  postal_code: "6811 GW",
  booking_url: "https://studioforma.nl/boek",
  instagram_url: "https://instagram.com/studioforma.arnhem",
  review_rating: 4.9,
  review_count: 87,
  founded_year: 2021,
  opening_hours: "Ma–vr 07:00–21:00 · Za 08:00–14:00",
  team: [
    {
      id: "lotte",
      name: "Lotte Vermeer",
      role: "Founder & Lead Instructor",
      bio: "Opgeleid in Londen en Amsterdam. Lotte combineert klassieke reformer techniek met een scherpe oog voor alignment. Tien jaar ervaring in private en groepslessen.",
      image_url: "/demo/pilates-clinic-instructor-1.jpg",
    },
    {
      id: "noah",
      name: "Noah Bakker",
      role: "Reformer Instructor",
      bio: "Van atletische training naar Pilates. Noah brengt kracht en precisie samen. Gespecialiseerd in reformer voor sportrevalidatie en performance.",
      image_url: "/demo/pilates-clinic-instructor-2b.jpg",
    },
    {
      id: "saar",
      name: "Saar de Wit",
      role: "Mat & Reformer Instructor",
      bio: "Saar maakt complexe bewegingen begrijpelijk. Haar lessen voelen kalm, maar laten je sterker de studio uitlopen.",
      image_url: "/demo/pilates-clinic-instructor-3b.jpg",
    },
  ],
  images: [
    {
      id: "hero",
      url: "/demo/pilates-warm-hero.webp",
      alt: "Reformer Pilates sessie in Studio Forma",
      role: "hero",
    },
    {
      id: "studio-1",
      url: "/demo/pilates-warm-studio.webp",
      alt: "Lichte studio ruimte met reformers",
      role: "studio",
    },
    {
      id: "reformer-1",
      url: "/demo/pilates-warm-reformer.webp",
      alt: "Detail van reformer apparatuur",
      role: "reformer",
    },
    {
      id: "atmosphere-1",
      url: "/demo/pilates-warm-atmosphere.webp",
      alt: "Rustige sfeer in de Pilates studio",
      role: "atmosphere",
    },
    {
      id: "gallery-1",
      url: "/demo/pilates-warm-studio.webp",
      alt: "Studio sfeer met natuurlijk licht",
      role: "gallery",
    },
    {
      id: "gallery-2",
      url: "/demo/pilates-warm-corner.webp",
      alt: "Studiohoek met reformer",
      role: "gallery",
    },
  ],
  memberships: [
    {
      id: "intro",
      name: "Intro Pack",
      price_label: "€79",
      period: "4 lessen",
      description: "Kennismaken met de studio. Geldig voor reformer en mat.",
      features: ["4 lessen naar keuze", "Geldig 6 weken", "Inclusief mat & handdoek"],
    },
    {
      id: "unlimited",
      name: "Studio Membership",
      price_label: "€149",
      period: "per maand",
      description: "Onbeperkt trainen in groepsreformer en mat. Jouw ritme, onze ruimte.",
      features: [
        "Onbeperkt groepsreformer",
        "Onbeperkt mat",
        "Priority booking",
        "Maandelijks opzegbaar",
      ],
      featured: true,
    },
    {
      id: "private-pack",
      name: "Private Series",
      price_label: "€420",
      period: "6 sessies",
      description: "Persoonlijk traject op de reformer. Voor wie écht dieper wil.",
      features: ["6 private sessies", "Persoonlijk programma", "Flexibel inplannen"],
    },
  ],
  reviews: [
    {
      id: "r1",
      author: "Emma van Dijk",
      rating: 5,
      text: "Eindelijk een studio waar de instructie écht scherp is. Kleine groepen, rustige ruimte, en na drie maanden merk ik verschil in houding én kracht.",
      date_label: "maart 2026",
    },
    {
      id: "r2",
      author: "Thomas Janssen",
      rating: 5,
      text: "Als hardloper dacht ik dat Pilates soft was. Reformer bij Forma heeft mijn core en heupen sterker gemaakt. Blessures zijn verdwenen.",
      date_label: "januari 2026",
    },
    {
      id: "r3",
      author: "Mirthe Vos",
      rating: 5,
      text: "De sfeer is premium zonder pretentie. Boeken is makkelijk, de trainers kennen je naam, en elke les voelt doordacht.",
      date_label: "februari 2026",
    },
  ],
  faqs: [
    {
      id: "f1",
      question: "Is reformer Pilates geschikt voor beginners?",
      answer:
        "Ja. We starten met basisbewegingen en bouwen weerstand geleidelijk op. Elke les heeft aanpassingen, zodat je veilig meedoet vanaf dag één.",
    },
    {
      id: "f2",
      question: "Wat moet ik meenemen?",
      answer:
        "Comfortabele sportkleding en antislip sokken. Matten, reformers en handdoeken zijn aanwezig in de studio.",
    },
    {
      id: "f3",
      question: "Hoe groot zijn de groepen?",
      answer:
        "Maximaal zes personen per reformer les. Zo blijft er ruimte voor persoonlijke correcties en aandacht.",
    },
    {
      id: "f4",
      question: "Kan ik een losse les boeken?",
      answer:
        "Ja. Drop-ins zijn mogelijk zolang er plek is. Voor regelmatig trainen is het Intro Pack of membership vaak voordeliger.",
    },
  ],
  benefits: [
    {
      id: "b1",
      title: "Kracht met lengte",
      description:
        "Reformer training bouwt diepe spierkracht zonder bulk. Je lichaam wordt sterker, langer en stabieler.",
    },
    {
      id: "b2",
      title: "Kleine groepen",
      description:
        "Maximaal zes reformers. Genoeg ruimte voor focus, correctie en een les die écht op jou is afgestemd.",
    },
    {
      id: "b3",
      title: "Instructie die telt",
      description:
        "Elke cue heeft een reden. Alignment eerst, dan intensiteit. Zo train je veilig en met resultaat.",
    },
    {
      id: "b4",
      title: "Ruimte die rust geeft",
      description:
        "Licht, stilte en materialen die kloppen. De studio is ontworpen om je aandacht naar binnen te trekken.",
    },
  ],
  primary_seo_keyword: "Pilates Arnhem",
  secondary_seo_keywords: [
    "Reformer Pilates Arnhem",
    "Pilates studio Arnhem",
    "Pilates lessen Arnhem",
  ],
};
