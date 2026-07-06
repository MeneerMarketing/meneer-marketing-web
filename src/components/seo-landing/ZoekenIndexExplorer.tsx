"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight, MapPin, Search } from "lucide-react";
import { seoLandingPath } from "@/lib/seo-landings";

export interface ZoekenListItem {
  slug: string;
  primaryKeyword: string;
  city?: string;
  region?: string;
}

interface ZoekenIndexExplorerProps {
  national: ZoekenListItem[];
  local: ZoekenListItem[];
}

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

function matchesItem(item: ZoekenListItem, query: string): boolean {
  if (!query) return true;
  const haystack = [
    item.primaryKeyword,
    item.slug.replace(/-/g, " "),
    item.city ?? "",
    item.region ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function groupByRegion(items: ZoekenListItem[]): Map<string, ZoekenListItem[]> {
  const map = new Map<string, ZoekenListItem[]>();
  for (const item of items) {
    const key = item.region ?? "Overig";
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }
  return map;
}

const REGION_ORDER = [
  "Gelderland",
  "Noord-Brabant",
  "Limburg",
  "Noord-Holland",
  "Zuid-Holland",
  "Utrecht",
  "Overijssel",
  "Groningen",
  "Friesland",
  "Flevoland",
  "Overig",
] as const;

function CityGrid({ items, highlightApeldoorn = false }: { items: ZoekenListItem[]; highlightApeldoorn?: boolean }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((page) => {
        const isHome = page.city === "Apeldoorn";
        return (
          <li key={page.slug}>
            <Link
              href={seoLandingPath(page.slug)}
              className={`group flex h-full flex-col rounded-2xl border px-4 py-4 transition hover:border-[#FF5722]/35 hover:shadow-sm ${
                isHome && highlightApeldoorn
                  ? "border-[#FF5722]/40 bg-gradient-to-br from-orange-100/80 to-white shadow-sm"
                  : "border-slate-200 bg-gradient-to-br from-orange-50/50 to-white"
              }`}
            >
              <span className="font-bold capitalize text-slate-900">{page.primaryKeyword}</span>
              {page.city ? (
                <span className="mt-1 text-xs font-semibold text-slate-500">
                  {page.city}
                  {isHome && highlightApeldoorn ? " · thuisbasis" : ""}
                  {page.region ? ` · ${page.region}` : ""}
                </span>
              ) : null}
              <ArrowUpRight className="mt-3 size-4 self-end text-slate-400 transition group-hover:text-[#FF5722]" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ZoekenIndexExplorer({ national, local }: ZoekenIndexExplorerProps) {
  const searchParams = useSearchParams();
  const stadParam = searchParams.get("stad") ?? "";

  const [query, setQuery] = useState("");

  useEffect(() => {
    if (stadParam && !query) {
      setQuery(stadParam);
    }
  }, [stadParam, query]);

  const normalized = normalizeQuery(query);

  const filteredNational = useMemo(
    () => national.filter((item) => matchesItem(item, normalized)),
    [national, normalized],
  );

  const filteredLocal = useMemo(
    () => local.filter((item) => matchesItem(item, normalized)),
    [local, normalized],
  );

  const apeldoornPages = useMemo(
    () => filteredLocal.filter((item) => item.city === "Apeldoorn"),
    [filteredLocal],
  );

  const localWithoutApeldoorn = useMemo(
    () => filteredLocal.filter((item) => item.city !== "Apeldoorn"),
    [filteredLocal],
  );

  const localByRegion = useMemo(() => groupByRegion(localWithoutApeldoorn), [localWithoutApeldoorn]);

  const totalResults = filteredNational.length + filteredLocal.length;

  return (
    <div className="space-y-14">
      <div className="relative">
        <label htmlFor="zoeken-filter" className="sr-only">
          Zoek op dienst, stad of regio
        </label>
        <Search
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
        <input
          id="zoeken-filter"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek op dienst, stad of regio… bijv. Apeldoorn, Amsterdam, Google Ads"
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#FF5722]/50 focus:ring-2 focus:ring-[#FF5722]/20"
          autoComplete="off"
        />
        {normalized ? (
          <p className="mt-3 text-sm text-slate-500">
            {totalResults === 0
              ? "Geen pagina's gevonden. Probeer een andere stad of dienst."
              : `${totalResults} pagina${totalResults === 1 ? "" : "'s"} gevonden`}
          </p>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            {national.length + local.length} pagina&apos;s. Filter op stad (Apeldoorn, Amsterdam,
            Rotterdam), regio of dienst.
          </p>
        )}
      </div>

      {filteredNational.length > 0 ? (
        <section aria-labelledby="zoeken-diensten-heading">
          <h2 id="zoeken-diensten-heading" className="text-xl font-extrabold text-slate-900">
            Diensten (landelijk)
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredNational.map((page) => (
              <li key={page.slug}>
                <Link
                  href={seoLandingPath(page.slug)}
                  className="group flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition hover:border-[#FF5722]/35 hover:shadow-md"
                >
                  <span className="font-bold capitalize text-slate-900">{page.primaryKeyword}</span>
                  <ArrowUpRight className="size-4 text-slate-400 transition group-hover:text-[#FF5722]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {filteredLocal.length > 0 ? (
        <section aria-labelledby="zoeken-regio-heading">
          <h2 id="zoeken-regio-heading" className="text-xl font-extrabold text-slate-900">
            Regio &amp; steden
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Lokale pagina&apos;s per stad en dienst. Apeldoorn is thuisbasis. Ook Randstad, oost,
            noord en zuid.
          </p>

          <div className="mt-8 space-y-10">
            {apeldoornPages.length > 0 ? (
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                  <MapPin className="size-4" aria-hidden />
                  Apeldoorn · thuisbasis Meneer Marketing
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Gevestigd in Apeldoorn. Breedste dekking: Google Ads, SEO, webshops, automatisering
                  en meer.
                </p>
                <CityGrid items={apeldoornPages} highlightApeldoorn />
              </div>
            ) : null}
            {REGION_ORDER.map((region) => {
              const items = localByRegion.get(region);
              if (!items?.length) return null;
              return (
                <div key={region}>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[#FF5722]">
                    <MapPin className="size-4" aria-hidden />
                    {region}
                  </h3>
                  <CityGrid items={items} />
                </div>
              );
            })}
            {Array.from(localByRegion.entries())
              .filter(([region]) => !REGION_ORDER.includes(region as (typeof REGION_ORDER)[number]))
              .map(([region, items]) => (
                <div key={region}>
                  <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-slate-500">
                    <MapPin className="size-4" aria-hidden />
                    {region}
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((page) => (
                      <li key={page.slug}>
                        <Link
                          href={seoLandingPath(page.slug)}
                          className="group flex h-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4"
                        >
                          <span className="font-bold capitalize text-slate-900">
                            {page.primaryKeyword}
                          </span>
                          <ArrowUpRight className="size-4 text-slate-400" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </section>
      ) : null}

      {totalResults === 0 && normalized ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center text-slate-600">
          Geen match. Probeer &quot;Google Ads&quot;, &quot;Arnhem&quot;, &quot;Gelderland&quot; of{" "}
          <button
            type="button"
            onClick={() => setQuery("")}
            className="font-bold text-[#FF5722] underline-offset-2 hover:underline"
          >
            wis je zoekopdracht
          </button>
          .
        </p>
      ) : null}
    </div>
  );
}
