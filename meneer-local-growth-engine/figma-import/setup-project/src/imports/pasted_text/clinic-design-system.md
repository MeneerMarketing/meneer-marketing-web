# Create a complete premium clinic website design system and reusable master template

Design a **complete, reusable high-end website design system and master website template** for premium clinics, aesthetic brands, cosmetic clinics, wellness concepts and other luxury service businesses.

The visual direction should be inspired by the supplied reference screenshots in terms of:

* editorial layouts
* sophisticated whitespace
* premium photography
* oversized image compositions
* rounded corners
* elegant typography
* horizontal carousels
* restrained UI
* soft warm neutral backgrounds
* subtle cool accent colors
* asymmetric compositions
* premium medical / lifestyle positioning

However:

**DO NOT copy the reference website 1:1.**

Do not reproduce its exact sections, spacing, visual assets, logo, text, colors or composition.

Instead, extract the underlying design principles and create an **original, more refined and reusable design language**.

The final result should feel like a custom €10.000–€25.000 agency-designed website, not a generic Framer, Webflow, SaaS or AI template.

---

# 1. DESIGN DIRECTION

The overall aesthetic should combine:

**Premium healthcare**
+
**quiet luxury**
+
**editorial fashion design**
+
**modern European minimalism**
+
**warm hospitality**

The website should feel:

* calm
* trustworthy
* sophisticated
* clean
* medically credible
* warm rather than sterile
* contemporary
* human
* spacious
* editorial
* conversion-oriented

Avoid:

* generic SaaS layouts
* dozens of floating cards
* excessive shadows
* glassmorphism
* neon gradients
* large blobs
* generic startup UI
* excessive icon usage
* unnecessarily boxed sections
* every section being a 3-column card grid
* overly clinical blue-and-white hospital styling
* cliché beauty salon pink
* excessive beige everywhere
* template-looking layouts

The design should rely primarily on:

**typography + photography + whitespace + composition**

rather than UI decoration.

---

# 2. BRAND PERSONALITY

Imagine a premium clinic that wants to communicate:

“World-class expertise, without feeling like a hospital.”

Visitors should immediately feel:

* I can trust these specialists
* this organization is established
* this is premium
* the clinic is approachable
* treatments are professionally performed
* the website feels modern but timeless

The emotional balance should be approximately:

35% medical authority
30% luxury / premium
20% human warmth
15% editorial lifestyle

---

# 3. COLOR SYSTEM

Create a professional Figma Variables color system.

Use a sophisticated neutral foundation.

Suggested direction:

### Core neutrals

Warm White
`#FAF9F7`

Soft Off White
`#F5F3F0`

Warm Light Grey
`#ECEBE8`

Cool Mist
`#E9EEF0`

Charcoal
`#292825`

Soft Black
`#181817`

Muted Text
`#716F6A`

Borders
`#DEDCD8`

### Primary accent

Use a restrained premium blue / petrol / teal.

Example direction:

Primary
`#247C91`

Primary Dark
`#175E70`

Primary Light
`#DCECEF`

The accent color should NOT dominate the page.

Use it mainly for:

* CTA buttons
* small navigational accents
* arrows
* active states
* subtle links
* progress indicators

### Optional warm accent

Introduce an extremely restrained muted clay / taupe accent for selected editorial moments.

Something around:

`#A88670`

Do not turn the site into a brown/beige website.

---

# 4. TYPOGRAPHY SYSTEM

Typography is one of the most important elements of the entire design.

Use a modern premium sans serif with distinctive geometric/editorial characteristics.

Preferred direction:

* Satoshi
* General Sans
* Neue Montreal
* Manrope
* Plus Jakarta Sans
* DM Sans

Or choose the best high-quality alternative available inside Figma.

Do NOT use:

* Inter as the primary visual identity
* Roboto
* Poppins
* generic system typography

Create a clear typography system using Figma Text Styles.

---

## DISPLAY TYPOGRAPHY

Large editorial headings should combine different weights inside the same sentence.

Example:

**Medische expertise.**
Persoonlijke aandacht.

or:

**Voel je goed.**
Zie er natuurlijk uit.

Use selective bold emphasis rather than making the entire heading bold.

Desktop display:

64–82 px
line-height around 92–100%

Large sections:

48–64 px

Normal section heading:

38–48 px

Mobile hero:

42–52 px

---

## BODY TYPOGRAPHY

Body Large:

18–20 px
150% line height

Body:

16–18 px

Small:

13–15 px

Micro labels:

11–13 px

Navigation:

14–15 px medium

Buttons:

14–15 px semibold

Keep text columns relatively narrow.

Avoid long paragraph widths.

Maximum comfortable body width approximately:

520–650 px.

---

# 5. SPACING SYSTEM

Use generous whitespace.

Build an 8px-based spacing system.

Variables:

4
8
12
16
24
32
40
48
64
80
96
120
160
200

Desktop section spacing should often be around:

120–180 px vertically.

Do NOT compress everything.

The page should breathe.

Large blank areas are intentional.

---

# 6. GRID

Desktop master frame:

1440 px

Content width:

1280–1320 px

Create:

12-column responsive grid

Outer margin:

48–72 px desktop

Tablet:

32 px

Mobile:

20 px

Use grids consistently, but intentionally break them with large photography where appropriate.

Some sections should feel more editorial than mathematically symmetrical.

---

# 7. BORDER RADIUS

Create radius variables.

Small:
8 px

Medium:
14 px

Large:
20–24 px

Extra Large:
28–32 px

Pill:
999 px

Large photography containers should generally use:

20–28 px radius.

Do not make every element rounded.

---

# 8. SHADOWS

Very little shadow.

Use subtle shadows only when hierarchy genuinely requires it.

Preferred:

soft 6–10% opacity shadow

Avoid visible floating dashboard-style card shadows.

Borders and tonal differences should create most separation.

---

# 9. PHOTOGRAPHY DIRECTION

Photography must be central to the design.

The visual style should feel like premium editorial lifestyle photography rather than stock photography.

Use image placeholders representing:

* real clinic environments
* consultation moments
* professionals
* subtle patient interactions
* close-up skincare details
* treatment equipment
* architectural clinic photography
* candid team imagery
* natural portraits
* premium lifestyle scenes

Photography treatment:

* warm
* natural
* softly cinematic
* sophisticated
* believable
* not over-retouched
* no exaggerated beauty advertising
* soft natural light
* realistic skin texture

Use different image ratios throughout the design:

1:1
4:5
3:4
16:9
wide cinematic formats

Do NOT force every image into identical cards.

---

# 10. IMAGE OVERLAYS

For sections containing text over photography:

Use sophisticated soft gradients.

For example:

transparent
→
rgba(0,0,0,0.55)

Never place white text directly on a complicated image without readability protection.

Gradients should be almost invisible as UI elements.

---

# 11. GLOBAL HEADER

Create a reusable responsive header component.

Desktop structure:

LEFT:
logo

CENTER / RIGHT:
main navigation

Example navigation:

Behandelingen
Huidproblemen
Resultaten
Over ons
Experts
Locaties

RIGHT:

primary CTA:
“Afspraak maken”

Optional secondary controls:

language selector
phone number
small location selector

Header style:

minimal
transparent over hero OR white on normal pages

Create variants:

* Transparent
* Light
* Scrolled
* Mobile
* Mega menu open

The header should feel integrated into the website, not like a separate navigation bar.

---

# 12. OPTIONAL UTILITY BAR

Create a very thin top utility bar above the main navigation.

Potential content:

★★★★★ 9,0 uit 3.500+ reviews

Promoties
Veelgestelde vragen
Contact
Telephone

Keep typography small and understated.

---

# 13. HERO — MASTER VERSION

Create a distinctive premium homepage hero.

Large cinematic image occupying most of the viewport.

Approximate desktop height:

760–860 px

Rounded outer container:

20–24 px

The photography should extend almost edge-to-edge while keeping a subtle page margin.

Overlay copy bottom-left.

Suggested structure:

small eyebrow

large heading

short supporting sentence

primary CTA

optional opening hours / trust information

Example hierarchy:

**Persoonlijke zorg.**
Voor een natuurlijk resultaat.

Subline:

“Ontdek behandelingen uitgevoerd door ervaren medische professionals.”

CTA:

Afspraak maken →

Secondary information beside CTA:

Ma–Vr 09:00–17:00

Keep copy compact.

Do NOT cover half the hero with text.

Photography remains dominant.

---

# 14. TRUST STRIP BELOW HERO

Directly below the hero create a quiet trust area.

Possible elements:

medical reviewer avatar

“Medisch gecontroleerd door …”

review rating

certification

years of experience

clinic count

Do not turn this into a loud badge bar.

---

# 15. INTRO / BRAND STATEMENT SECTION

Create a large editorial statement with lots of negative space.

Example:

**Expertise waarop je kunt vertrouwen.**
Zorg waarbij jij centraal staat.

Use approximately 50–70% empty space.

Possibly place:

* one portrait
* one short paragraph
* one small link

Do not immediately place everything inside containers.

---

# 16. CUSTOMER JOURNEY SECTION

Create an editorial horizontal / storytelling section titled approximately:

“Wat kun je verwachten?”

Show a 4–5 step journey.

For example:

01
Maak een afspraak

02
Persoonlijk consult

03
Behandelplan

04
Behandeling

05
Nazorg

The visual composition should NOT look like five identical cards.

Instead create a horizontally flowing editorial journey.

Use:

* large imagery
* step numbers
* curved subtle dotted line
* alternating image positioning
* large whitespace

The active stage may dominate while previous/next stages partially appear at the edges.

Create carousel/progress interaction states.

---

# 17. TREATMENT NAVIGATION

Create a clean treatment explorer.

Heading:

“Populaire behandelingen”

Instead of generic cards, use elegant horizontal rows.

Example:

[icon] Botox                         →

[icon] Huidverbetering               →

[icon] Fillers                       →

[icon] Laserbehandelingen            →

Two columns desktop.

One column mobile.

Row design:

white/off-white
1px subtle border
large click area
minimal icon
arrow on right

Hover:

very subtle background change
arrow moves 4–6 px
border darkens slightly

---

# 18. FEATURED TREATMENTS

Create a more photographic treatment section.

Use editorial treatment cards with strong photography.

Possible grid:

1 dominant large card
+
2 smaller cards

or horizontal scroll.

Each card contains:

category / price pill

treatment name

short line

arrow

Photography fills the card.

Dark gradient near bottom for text legibility.

Example:

Vanaf €159

**Huidverbetering →**

“Persoonlijke behandeling voor een frisse en natuurlijke uitstraling.”

Cards should feel editorial, not ecommerce-like.

---

# 19. PROMOTION / CAMPAIGN BANNER

Create an immersive full-width campaign section.

Large cinematic image.

Centered or slightly off-center overlay.

Small label:

ACTIE

Large headline:

**Samen is mooier.**

Supporting sentence.

Ghost / outline button.

This block may temporarily interrupt the light visual system with a darker photographic moment.

Make it visually dramatic.

---

# 20. AUTHORITY / AWARD SECTION

Create an asymmetric authority section.

LEFT:

large editorial photograph of:

award
certificate
clinic interior
medical detail
press article

RIGHT:

large headline with mixed typography.

Example:

**Al 15 jaar specialist.**
Ervaring die je ziet.

Short paragraph.

Text link:

Lees ons verhaal →

Large whitespace around the composition.

Avoid putting it inside a generic card.

---

# 21. EXPERTS SECTION

Create a premium horizontal expert carousel.

Heading:

**Onze experts**

Each expert card should primarily consist of portrait photography.

Portrait ratio:

roughly 3:4.

Bottom image gradient.

Information at bottom:

Name
Specialism

Small location chips at top.

Example:

Amsterdam
Rotterdam
+2

Cards should feel like editorial magazine portraits.

Create:

* desktop horizontal carousel
* navigation buttons
* progress line
* mobile swipe layout

---

# 22. BEFORE / AFTER RESULTS

Create a sophisticated results section.

Do not make it feel sensational or cheap.

Use professional framing.

Possible structure:

large before/after comparison

treatment label

short verified information

disclaimer / context

CTA:

Bekijk resultaten →

Provide a slider component variant.

---

# 23. TESTIMONIAL SECTION

Avoid standard quote cards.

Create one large featured patient story.

Possible layout:

LEFT:
portrait or lifestyle image

RIGHT:
large quote

★★★★★

patient first name / age range where appropriate

treatment

Navigation underneath.

Example typography:

“Vanaf het eerste gesprek voelde ik dat er echt naar me werd geluisterd.”

Use large typography.

---

# 24. REVIEWS / SOCIAL PROOF

Create a subtle review strip.

Potential sources:

Google
Kliniekervaringen
Trustpilot

Use large rating:

9,0

and:

3.500+ ervaringen

But preserve minimal visual language.

No loud yellow review stars everywhere.

---

# 25. MEDIA / PRESS SECTION

Create a media section inspired by editorial publications.

Heading:

“In de media”

Large featured video / press content area.

Horizontal carousel with previous and next content partially visible.

Elements:

large video thumbnail

small play button

content title

duration

Below or above:

monochrome media logos.

Use fictional placeholders such as:

Magazine
Editorial
News
Lifestyle

Do not use actual protected logos if they are unavailable.

---

# 26. LOCATION SECTION

Create an elegant locations module.

Possible layout:

LEFT:
clinic list

RIGHT:
large image / stylized map

Each location row:

City
Address
Opening hours
Arrow

Active city highlighted subtly.

Include a mobile-friendly location selector.

---

# 27. SOCIAL MEDIA SECTION

Create a visually distinctive social block.

Large soft background panel.

Possible background:

subtle warm-to-cool neutral gradient.

LEFT:

**Blijf op de hoogte**
Volg ons dagelijks

short copy

Instagram CTA

RIGHT:

an editorial composition of:

phone mockup
vertical image
small floating image
social content

Important:

Keep it sophisticated.

Avoid generic floating social-media UI cards.

---

# 28. CONVERSION CTA

Create a reusable conversion block near the bottom of pages.

Large rounded background container.

LEFT:

**Plan een behandeling**
of een vrijblijvend consult

RIGHT:

short explanation

primary CTA:
Afspraak maken →

secondary opening hours pill

Background:

subtle warm-grey → cool-grey gradient.

This should feel calm rather than aggressive.

---

# 29. FOOTER

Create an unusually spacious premium footer.

White background.

Sections:

Brand / logo

Clinic addresses

Behandelingen

Over de kliniek

Service

Contact

Legal

Social media

Certifications

Medical affiliations

Opening hours

Footer typography should remain relatively small.

Large whitespace.

No giant dark footer.

---

# 30. PAGE TEMPLATES

Do NOT only design a homepage.

Create reusable desktop page templates for:

## 1. Homepage

Include:

Hero
Trust
Intro
Journey
Treatments
Campaign
Authority
Experts
Reviews
Media
Social
CTA
Footer

---

## 2. Treatment overview

Hero

Treatment categories

Popular treatments

Treatment finder

FAQ

Consult CTA

---

## 3. Treatment detail

Hero

Treatment introduction

Benefits

Suitable / not suitable

Treatment process

Before / after

Pricing

Expert

FAQ

Medical information

CTA

---

## 4. Concern / problem page

Example:

“Wallen onder de ogen”

Explain concern

Potential causes

Possible treatments

Treatment comparison

Expert advice

FAQ

CTA

---

## 5. Expert profile

Large portrait hero

Credentials

Biography

Specialisms

Locations

Available treatments

Reviews

Booking CTA

---

## 6. Clinic location

Large clinic photography

Address

Opening hours

Directions

Team

Treatments

Facilities

Reviews

Booking CTA

---

## 7. About us

Editorial brand story

Timeline

Values

Medical philosophy

Team

Awards

Press

CTA

---

## 8. Results page

Filter

Before/after examples

Treatment context

Medical disclaimer

Consult CTA

---

## 9. Contact / appointment page

Clean booking-first layout.

Location selection.

Contact options.

Opening hours.

FAQ.

---

# 31. COMPONENT LIBRARY

Create a dedicated Figma page:

**02 — Components**

Build reusable Auto Layout components.

Include:

### Navigation

Header
Utility bar
Mega menu
Mobile navigation
Breadcrumbs

### Buttons

Primary
Secondary
Outline
Text link
Icon button
Circular carousel arrow

States:

Default
Hover
Pressed
Disabled
Focus

Sizes:

Small
Medium
Large

### Form controls

Text field
Textarea
Dropdown
Radio
Checkbox
Treatment selector
Location selector
Date picker placeholder

### Content

Treatment row
Treatment card
Expert card
Review component
Testimonial
Media card
Location row
FAQ accordion
Stat
Award
Certification
Before/after
Article card
Price pill
Location pill
Badge

### Layout

CTA panel
Image-text split
Editorial split
Carousel
Logo strip
Trust strip
Section header

Every component must use:

Auto Layout
Variables
Properties
Variants

Do not create manually duplicated elements.

---

# 32. DESIGN TOKENS

Create a dedicated Figma page:

**01 — Foundations**

Include:

Colors

Typography

Spacing

Grid

Radius

Borders

Shadows

Image ratios

Icons

Buttons

Form rules

Animation principles

Create reusable variables for all important values.

---

# 33. COMPONENT NAMING

Use professional component naming.

Examples:

Button / Primary / Large

Button / Secondary / Medium

Card / Treatment / Image

Card / Expert / Portrait

Navigation / Header / Light

Navigation / Header / Transparent

Section / CTA / Consultation

Form / Input / Default

Use clear developer-friendly naming.

---

# 34. AUTO LAYOUT

Use Auto Layout extensively.

Every major component should resize intelligently.

Use:

Hug contents
Fill container
min/max widths
responsive gaps

Do not manually position content unless the editorial composition specifically requires it.

---

# 35. RESPONSIVE DESIGN

Create desktop, tablet and mobile examples.

Breakpoints:

Desktop:
1440 px

Tablet:
768 px

Mobile:
390 px

Mobile is not just desktop stacked vertically.

Reconsider compositions.

For mobile:

* simplify navigation
* maintain strong typography
* reduce hero height
* convert carousels to swipe
* collapse two-column treatment navigation
* retain large photography
* maintain generous whitespace
* keep CTAs accessible

Do NOT make mobile overly compact.

---

# 36. MOTION / INTERACTION GUIDELINES

Add annotations for intended web interactions.

Use subtle motion.

Suggested:

Button hover:
150–200 ms

Image hover:
scale 1 → 1.02

Arrow:
translate X 4px

Accordion:
250 ms ease

Carousel:
smooth 400–500 ms

Page reveal:
small opacity + vertical shift

Avoid:

dramatic parallax
bouncing
large rotation
constant motion
scroll-jacking

The website should feel premium because movement is restrained.

---

# 37. ICONOGRAPHY

Use thin elegant line icons.

Stroke:

1–1.5 px

Consistent visual weight.

Icons should support functionality, not decorate everything.

Use custom/simple icons for treatment categories where useful.

---

# 38. ACCESSIBILITY

Maintain:

WCAG-friendly contrast

minimum readable body size

clear focus states

44px minimum mobile interaction areas

good image text contrast

semantic hierarchy

Never sacrifice usability for aesthetics.

---

# 39. CONVERSION PRINCIPLES

Although visually editorial, this is still a commercial clinic website.

Primary conversion:

**Afspraak maken**

Secondary conversions:

Bekijk behandeling

Plan consult

Bekijk locatie

Bekijk resultaten

Call clinic

Important CTAs should reappear naturally throughout long pages.

Do not place a CTA in every single section.

Use deliberate conversion pacing.

---

# 40. CONTENT PRINCIPLES

Avoid generic AI marketing language.

Do NOT fill the design with text such as:

“Transform your life”

“Unlock your beauty”

“Experience excellence”

“Your journey starts here”

Use realistic, understated Dutch clinic copy.

For example:

“Een behandeling die bij je past.”

“Persoonlijk advies van een ervaren specialist.”

“Bekijk welke behandeling geschikt is voor jouw huid.”

“Plan een vrijblijvend consult.”

Headlines should usually be short.

---

# 41. VISUAL RHYTHM

Very important:

The complete website should alternate between:

WHITE SPACE
↓
PHOTOGRAPHY
↓
EDITORIAL TEXT
↓
FUNCTIONAL UI
↓
LARGE VISUAL MOMENT
↓
WHITE SPACE

Do not use:

card section
↓
card section
↓
card section
↓
card section

We want visual rhythm and surprise.

---

# 42. ASYMMETRY

Use controlled asymmetry.

Examples:

large image on left with smaller text on right

image extending beyond standard content grid

partially visible next carousel slide

large empty area beside content

text positioned lower than accompanying image

different image heights

However:

The design must still feel precise and intentional.

Do not create chaotic layouts.

---

# 43. EDITORIAL DETAIL

Add small sophisticated design details such as:

01 / 05 pagination

thin horizontal progress lines

small category labels

subtle arrows

location pills

oversized step numbers

very subtle dotted connector lines

small medical reviewer information

monochrome logos

thin divider lines

Use these sparingly.

---

# 44. QUALITY BAR

Every section must pass this question:

“Could this section plausibly appear on an award-winning European agency website?”

If it looks like:

* a WordPress template
* a Bootstrap website
* generic Webflow template
* generic AI website
* SaaS dashboard
* cheap beauty salon

redesign it.

---

# 45. IMPORTANT: ORIGINALITY

The reference website is only a visual benchmark.

Do NOT create a direct clone.

Create a stronger reusable visual system using similar principles:

* large-scale photography
* editorial layout
* subtle blue/petrol UI accents
* large whitespace
* restrained rounded corners
* sophisticated neutral palette
* human photography
* asymmetric layouts
* clean treatment navigation
* premium typography

Introduce enough original compositions that this becomes its own recognizable design system.

---

# 46. FIGMA FILE STRUCTURE

Organize the Figma file into these pages:

**00 — Cover**

Beautiful overview of the design system.

---

**01 — Foundations**

Colors
Typography
Spacing
Grid
Radius
Shadows
Icons
Photography
Motion

---

**02 — Components**

All master components and variants.

---

**03 — Patterns**

Hero patterns
Editorial splits
Treatment sections
Expert sections
Trust sections
Testimonials
CTA sections
Carousels
Media layouts

---

**04 — Homepage**

Full desktop homepage.

---

**05 — Treatment**

Overview + detail.

---

**06 — Concern**

Concern/problem page.

---

**07 — Experts**

Expert overview + profile.

---

**08 — Locations**

Location overview + location detail.

---

**09 — About**

About/brand story.

---

**10 — Mobile**

Key screens adapted to mobile.

---

# 47. FINAL DELIVERABLE

The result should NOT merely be a pretty homepage.

I want a **complete visual language and reusable master template** that a designer or frontend developer can use to create many future clinic websites while maintaining a consistent high-end identity.

Prioritize:

1. Art direction
2. Typography
3. Photography
4. Whitespace
5. Layout composition
6. Reusable components
7. Conversion
8. Responsive behavior

The final result should feel:

**premium, European, medical, editorial, human, distinctive and extremely polished.**

Most importantly:

**Do not make it look AI-generated.**

Avoid predictable symmetrical layouts.

Use editorial composition, deliberate asymmetry and exceptional spacing to make the design feel art-directed by an experienced digital design studio.
