"use client";

import { InteractiveLogo } from "@/components/site/InteractiveLogo";
import type { AboutMeneerStrategyMessage } from "@/data/home-about-meneer";

interface StrategyBubbleProps {
  message: AboutMeneerStrategyMessage;
  isLast: boolean;
}

function StrategyBubble({ message, isLast }: StrategyBubbleProps) {
  const isMeneer = message.from === "meneer";

  return (
    <div className={`flex items-end gap-2 ${isMeneer ? "" : "justify-end"}`}>
      {isMeneer ? <InteractiveLogo className="size-8 shrink-0" interactive={false} /> : null}
      <div
        className={`relative max-w-[min(100%,17.5rem)] rounded-2xl px-3.5 py-2.5 ${
          isMeneer
            ? `rounded-bl-sm bg-slate-900 text-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.4)] ${
                isLast ? "ring-1 ring-[#FF5722]/30" : ""
              }`
            : "rounded-br-sm border border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}
      >
        {isMeneer ? (
          <span
            className="pointer-events-none absolute -bottom-[5px] left-4 size-2.5 rotate-45 border-b border-r border-slate-800 bg-slate-900"
            aria-hidden
          />
        ) : (
          <span
            className="pointer-events-none absolute -bottom-[5px] right-4 size-2.5 rotate-45 border-b border-r border-slate-200 bg-white"
            aria-hidden
          />
        )}
        <p className="text-pretty text-[13px] font-semibold leading-snug">{message.text}</p>
      </div>
    </div>
  );
}

interface AboutMeneerStrategyChatProps {
  messages: readonly AboutMeneerStrategyMessage[];
}

/** Strategiegesprek Meneer ↔ klant, direct zichtbaar zonder type-animatie. */
export function AboutMeneerStrategyChat({ messages }: AboutMeneerStrategyChatProps) {
  return (
    <div className="space-y-2.5">
      {messages.map((message, i) => (
        <StrategyBubble
          key={message.id}
          message={message}
          isLast={i === messages.length - 1}
        />
      ))}
    </div>
  );
}
