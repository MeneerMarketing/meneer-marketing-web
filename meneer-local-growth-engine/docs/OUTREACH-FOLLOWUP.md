# Outreach follow-up (handmatig via LGE)

Follow-ups draaien in het dashboard onder **Follow-ups** (`/dashboard/followups`).

## Workflow

1. **Kandidaten** — leads met een verzonden eerste mail (geen reply)
2. **Follow-up lijst** — vink zelf aan wie follow-up krijgt (checkbox)
3. **Sjabloon kiezen** — Korte check-in · Laatste ping · Leeg sjabloon
4. **Draft genereren** — per lead of batch voor hele lijst
5. **Editor** — zelfde flow als outreach: bewerken, HTML preview, approve, test send, plan send

Geen automatische dag-2/dag-5 sequences. Jij beslist wie, wanneer en welke tekst.

## Sjablonen

### Korte check-in (`check_in`)

Kort herinneren aan het concept + preview- en aanbod-CTA.

### Laatste ping (`last_ping`)

Laatste reminder met optionele social proof (Pilates: Hills Pilates preview).

### Leeg sjabloon (`custom`)

Minimale start; zelf invullen in de editor.

## Eerste mail (dag 0)
Wordt gegenereerd via LGE outreach draft. Bevat:

- Concept-preview URL
- Gepersonaliseerde `/pilates-studios?ref=mmlg_…` link
- Meneer Meter (`/meter?url=…`) als de studio een website heeft
- WhatsApp `wa.me`-link

## Dag 2 · Korte follow-up (geen reactie)

**Onderwerp:** Even checken · {studio}

```
Hoi {naam},

Kort nog even: heb je het concept voor {studio} al kunnen bekijken?

{preview}

Als je wilt zien hoe ik met studio's samenwerk:
{link}

Groet,
Meneer Marketing
```

## Dag 5 · Laatste ping + social proof

**Onderwerp:** Hills Pilates preview · {studio}

```
Hoi {naam},

Laatste ping van mijn kant. Ik werk nu met een paar studio's in {stad} en omgeving.

Ter inspiratie: zo ziet een live preview eruit (Hills Pilates):
https://meneermarketing.nl/preview/hills-pilates-rotterdam-minimal

Jouw concept staat nog klaar:
{preview}

Vragen? Antwoord op deze mail of app me even.
{wa_me_link}

Groet,
Meneer Marketing
```

## WhatsApp (vóór Business API)

Vaste tekst op telefoon:

```
Hoi! Ik las je mail over {studio}. Ik heb een vraag over het concept.
```

Zet `NEXT_PUBLIC_BUSINESS_WHATSAPP=31612935389` (of jouw nummer) in `.env` op meneermarketing.nl.

## Tracking

- Opens/clicks/formulier: LGE dashboard → Klanten + campagne-events op `mmlg_` ref
- GA4: `generate_lead`, `begin_checkout`, `purchase` op vertical pages
