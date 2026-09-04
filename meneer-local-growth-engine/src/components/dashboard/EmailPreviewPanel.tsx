"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { OutreachLinkAuditItem } from "@/services/outreach/outreachLinkAudit";

type Viewport = "desktop" | "mobile";
type Format = "html" | "text";

export function EmailPreviewPanel({
  subject,
  bodyHtml,
  bodyText,
  linkAudit = [],
  allLinksOk,
  loading = false,
}: {
  subject?: string;
  bodyHtml: string | null | undefined;
  bodyText: string;
  linkAudit?: OutreachLinkAuditItem[];
  allLinksOk?: boolean;
  loading?: boolean;
}) {
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [format, setFormat] = useState<Format>("html");

  const html = useMemo(() => {
    if (bodyHtml?.trim()) return bodyHtml;
    return `<pre style="font-family:Georgia,serif;white-space:pre-wrap;margin:0;padding:16px;">${escapeHtml(bodyText)}</pre>`;
  }, [bodyHtml, bodyText]);

  return (
    <div className="overflow-hidden rounded border border-mm-border bg-white">
      <div className="border-b border-mm-border bg-mm-surface/40 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
              Preview vóór verzenden
            </p>
            {subject ? (
              <p className="mt-1 text-sm font-semibold text-slate-900">{subject}</p>
            ) : null}
          </div>
          {loading ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
              Vernieuwen…
            </span>
          ) : null}
        </div>

        {linkAudit.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {linkAudit.map((item) => (
              <li
                key={item.id}
                className={`rounded border px-3 py-2 text-xs ${
                  item.status === "ok"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : item.status === "warn"
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : "border-rose-200 bg-rose-50 text-rose-900"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold">{item.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">
                    {item.status === "ok" ? "OK" : item.status === "warn" ? "Let op" : "Fout"}
                  </span>
                </div>
                <p className="mt-1 leading-relaxed">{item.detail}</p>
                {item.href ? (
                  <p className="mt-1 break-all font-mono text-[11px] opacity-80">{item.href}</p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        {allLinksOk === false ? (
          <p className="mt-3 text-xs font-semibold text-rose-700">
            Los linkfouten op vóór approve of send.
          </p>
        ) : allLinksOk === true ? (
          <p className="mt-3 text-xs font-semibold text-emerald-700">
            CTA&apos;s en links zien er goed uit.
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap border-b border-mm-border">
        <TabButton active={viewport === "desktop"} onClick={() => setViewport("desktop")}>
          Desktop
        </TabButton>
        <TabButton active={viewport === "mobile"} onClick={() => setViewport("mobile")}>
          Mobiel
        </TabButton>
        <span className="mx-2 self-center text-slate-300">|</span>
        <TabButton active={format === "html"} onClick={() => setFormat("html")}>
          HTML
        </TabButton>
        <TabButton active={format === "text"} onClick={() => setFormat("text")}>
          Plain text
        </TabButton>
      </div>

      {format === "html" ? (
        <div
          className={`bg-slate-100 p-4 ${
            viewport === "mobile" ? "flex justify-center" : ""
          }`}
        >
          <div
            className={`overflow-hidden border border-slate-200 bg-white shadow-sm ${
              viewport === "mobile" ? "w-[390px] max-w-full rounded-[24px]" : "w-full"
            }`}
          >
            {viewport === "mobile" ? (
              <div className="flex items-center justify-center border-b border-slate-100 py-2">
                <span className="h-1.5 w-16 rounded-full bg-slate-200" />
              </div>
            ) : null}
            <iframe
              title="E-mail HTML preview"
              srcDoc={html}
              className={`w-full border-0 bg-white ${
                viewport === "mobile" ? "h-[520px]" : "h-[460px]"
              }`}
              sandbox=""
            />
          </div>
        </div>
      ) : (
        <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap p-4 font-serif text-sm leading-relaxed text-slate-700">
          {bodyText}
        </pre>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] ${
        active ? "bg-[#FF5722]/10 text-[#C2410C]" : "text-slate-500 hover:text-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
