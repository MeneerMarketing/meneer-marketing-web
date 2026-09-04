import { SITE, siteUrl } from "@/lib/site";

export function GET() {
  const body = `# Lá Sweet by Ela

> Handmade crumble cookies and iced matcha in Enschede, Netherlands.

Lá Sweet by Ela is a small-batch bakery and matcha spot run by Ela in Enschede.
Known from TikTok (${SITE.handle}) and featured in Tubantia newspaper.

## Key facts
- Location: ${SITE.streetAddress}, ${SITE.postalCode} ${SITE.addressLocality}, Netherlands
- Products: crumble cookies, iced matcha, strawberry matcha, cookie boxes
- Walk-in: Saturdays ${SITE.walkInOpens}-${SITE.walkInCloses} (check Instagram for drops)
- Orders: Instagram DM ${SITE.handle}, pickup in Enschede (cookie boxes online; matcha on location)
- Box minimum: 4 cookies
- Matcha prices: iced matcha €5.50, flavored iced matcha €6.50
- Matcha flavours: classic, blue, cherry, mango, vanilla, strawberry (viral), white chocolate
- Cookie flavours: Red velvet aardbei, Tiramisu, Brownie Kinder Bueno, Witte Kinder Bueno, Appel crumble, Lotus, Matcha

## Pages
- ${siteUrl}/ : Homepage (menu, cookies, press)
- ${siteUrl}/bestellen : Order cookie box via Instagram DM
- ${siteUrl}/matcha-enschede : Local SEO landing for matcha / iced matcha / strawberry matcha in Enschede
- ${siteUrl}/koekjes-enschede : Local SEO landing for koekjes / cookies / crumble cookies in Enschede
- ${siteUrl}/cookies-enschede : Permanent redirect to /koekjes-enschede
- ${siteUrl}/contact : Contact, address, walk-in info

## Local intent keywords covered
- matcha enschede, strawberry matcha enschede, iced matcha enschede
- koekjes enschede, cookies enschede, crumble cookies enschede

## Social
- Instagram: ${SITE.instagram}
- TikTok: ${SITE.tiktok}
- Tubantia: ${SITE.tubantiaArticle}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
