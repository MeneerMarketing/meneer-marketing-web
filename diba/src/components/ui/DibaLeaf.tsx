/** Officieel Diba-blad — transparante PNG, groen met nerven. */
import { DIBA_LEAF_OFFICIAL } from "@/lib/diba-brand";

export { DIBA_LEAF_OFFICIAL };

/** Beeldverhouding width / height (512×512). */
export const DIBA_LEAF_ASPECT = 1;

type DibaLeafProps = {
  className?: string;
  /** Behouden voor bestaande calls. */
  decorative?: boolean;
};

/** Officieel groen blad — transparante PNG via img. */
export default function DibaLeaf({ className = "" }: DibaLeafProps) {
  return (
    <img
      src={DIBA_LEAF_OFFICIAL}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`inline-block shrink-0 object-contain ${className}`}
    />
  );
}

/** Decoratieve accenten */
export const dibaLeafDecorativeSm = "h-[180px] w-[180px]";
export const dibaLeafDecorativeLg = "sm:h-[240px] sm:w-[240px]";

/** Trust strip / kleine iconen in cirkel */
export const dibaLeafIconSm = "h-[72px] w-[72px]";
