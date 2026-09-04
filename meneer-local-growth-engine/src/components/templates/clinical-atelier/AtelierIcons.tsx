export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CircleArrow() {
  return (
    <div className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-full border border-white/25 text-white/70 transition-all transition-transform duration-200 hover:border-white/50 hover:text-white">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path
          d="M3 11L11 3M11 3H5M11 3v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
