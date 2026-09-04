"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { ReplyInboxItem } from "@/services/inbox/replyInboxService";
import { Badge } from "@/components/dashboard/ui";

interface Props {
  unreadCount: number;
  inboxAddress: string;
  items: ReplyInboxItem[];
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("nl-NL", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ReplyInboxPanel({ unreadCount, inboxAddress, items }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function acknowledge(replyId: string) {
    setBusyId(replyId);
    try {
      await fetch("/api/inbox/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge", replyId }),
      });
      startTransition(() => router.refresh());
    } finally {
      setBusyId(null);
    }
  }

  async function acknowledgeAll() {
    setBusyId("all");
    try {
      await fetch("/api/inbox/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "acknowledge_all" }),
      });
      startTransition(() => router.refresh());
    } finally {
      setBusyId(null);
    }
  }

  const headline =
    unreadCount === 0
      ? "Nog geen nieuwe reacties"
      : unreadCount === 1
        ? "1 studio heeft geantwoord"
        : `${unreadCount} studios hebben geantwoord`;

  return (
    <section className="overflow-hidden border border-mm-border bg-white shadow-mm-card">
      <div className="flex flex-col gap-4 border-b border-mm-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Inbox
          </p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">{headline}</h3>
          <p className="mt-1 text-xs text-slate-500">
            Reacties komen binnen op{" "}
            <span className="font-medium text-slate-700">{inboxAddress}</span> via
            Resend. Geen Gmail nodig.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {unreadCount > 0 ? <Badge tone="success">{unreadCount} nieuw</Badge> : null}
          {unreadCount > 1 ? (
            <button
              type="button"
              disabled={pending || busyId === "all"}
              onClick={() => void acknowledgeAll()}
              className="rounded-md border border-mm-border px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
            >
              Alles gelezen
            </button>
          ) : null}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-8 text-sm text-slate-500">
          Zodra een studio antwoordt op je outreach, verschijnt de reactie hier met
          link naar lead en concept.
        </div>
      ) : (
        <ul className="divide-y divide-mm-border">
          {items.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-slate-900">
                      {item.business?.studio_name ?? "Onbekende studio"}
                    </p>
                    {item.cityName ? (
                      <span className="text-xs text-slate-500">{item.cityName}</span>
                    ) : null}
                    <Badge tone="success">Reactie</Badge>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatWhen(item.receivedAt)}
                    {item.fromEmail ? ` · ${item.fromEmail}` : ""}
                  </p>
                  {item.subject ? (
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {item.subject}
                    </p>
                  ) : null}
                  {item.bodySnippet ? (
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                      {item.bodySnippet}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.business?.id ? (
                      <Link
                        href={`/dashboard/leads/${item.business.id}`}
                        className="inline-flex items-center rounded-md bg-[#FF5722] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#e64a19]"
                      >
                        Naar lead
                      </Link>
                    ) : null}
                    {item.outreachMessage?.id ? (
                      <Link
                        href={`/dashboard/outreach/${item.outreachMessage.id}`}
                        className="inline-flex items-center rounded-md border border-mm-border px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                      >
                        Outreach-thread
                      </Link>
                    ) : null}
                    {item.previewUrl ? (
                      <a
                        href={item.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center rounded-md border border-mm-border px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                      >
                        Conceptwebsite
                      </a>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={pending || busyId === item.id}
                  onClick={() => void acknowledge(item.id)}
                  className="shrink-0 self-start rounded-md border border-mm-border px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
                >
                  Gelezen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
