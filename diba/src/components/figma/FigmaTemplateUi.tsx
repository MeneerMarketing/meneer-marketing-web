import Link from "next/link";

export type FigmaBreadcrumbItem = {
  label: string;
  href?: string;
};

export function FigmaBreadcrumbs({ items }: { items: FigmaBreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Broodkruimels"
      className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium uppercase tracking-[.12em] text-[#5d8166]"
    >
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden className="opacity-40">
              /
            </span>
          ) : null}
          {item.href ? (
            <Link href={item.href} className="transition hover:text-[#286943]">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#286943]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function FigmaCheckIcon() {
  return (
    <svg aria-hidden width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0">
      <circle cx="9" cy="9" r="8.5" stroke="#5eae67" />
      <path
        d="M5.5 9l2.5 2.5 4.5-5"
        stroke="#286943"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FigmaCrossIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-1 shrink-0">
      <path d="M4 4l8 8M12 4l-8 8" stroke="#b85c5c" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type FigmaWelNietGridProps = {
  wel: string[];
  niet: string[];
  welLabel?: string;
  nietLabel?: string;
};

export function FigmaWelNietGrid({
  wel,
  niet,
  welLabel = "Dit werkt",
  nietLabel = "Dit raden wij af",
}: FigmaWelNietGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[1.5rem] border border-[#dce8d9] bg-white p-7 shadow-[0_8px_32px_rgba(15,45,28,.04)] sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#5d9564]">
          {welLabel}
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {wel.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-7 text-[#17372a]">
              <FigmaCheckIcon />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[1.5rem] bg-[#f2f7ef] p-7 sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#9a6b6b]">
          {nietLabel}
        </p>
        <ul className="mt-5 flex flex-col gap-3">
          {niet.map((item) => (
            <li key={item} className="flex gap-3 text-[15px] leading-7 text-[#5f5765]">
              <FigmaCrossIcon />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export type FigmaFilterItem<T extends string = string> = {
  id: T;
  label: string;
};

type FigmaFilterPillsProps<T extends string> = {
  items: readonly FigmaFilterItem<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
};

export function FigmaFilterPills<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
  className = "",
}: FigmaFilterPillsProps<T>) {
  return (
    <div
      className={`flex flex-wrap gap-2 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item) => {
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`min-h-10 rounded-full border px-5 text-[11px] font-semibold uppercase tracking-[.1em] transition
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                        focus-visible:outline-[#286943]
                        ${
                          active
                            ? "border-[#286943] bg-[#286943] text-white"
                            : "border-[#dce8d9] bg-white text-[#17372a] hover:border-[#95c592]"
                        }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
