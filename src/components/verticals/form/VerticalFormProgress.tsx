"use client";

interface VerticalFormProgressProps {
  packageChosen: boolean;
  contactReady: boolean;
  routeChosen: boolean;
}

const STEPS = [
  { id: "package", label: "Pakket" },
  { id: "contact", label: "Gegevens" },
  { id: "start", label: "Start" },
] as const;

export function VerticalFormProgress({
  packageChosen,
  contactReady,
  routeChosen,
}: VerticalFormProgressProps) {
  const active = [
    packageChosen,
    contactReady,
    routeChosen,
  ];

  return (
    <div className="mt-4" aria-hidden>
      <div className="flex gap-1">
        {STEPS.map((step, index) => {
          const lit = active[index];
          return (
            <div
              key={step.id}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                lit ? "bg-[#FF5722]" : "bg-slate-200"
              }`}
            />
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
        {STEPS.map((step, index) => (
          <span
            key={step.id}
            className={active[index] ? "text-[#FF5722]" : undefined}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
}
