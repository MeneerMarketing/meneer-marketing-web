import Image from "next/image";
import type { ReactNode } from "react";
import { AutomationFlowMark } from "@/components/icons/AutomationFlowMark";
import { GoogleLogoMark } from "@/components/icons/GoogleLogoMark";
import { MetaIcon } from "@/components/icons/MetaIcon";
import { ShopifyMark } from "@/components/icons/ShopifyMark";
import type { OverStackItem } from "@/data/over-index";

export type StackBrandId = OverStackItem["id"];

interface StackBrandIconProps {
  id: StackBrandId;
  className?: string;
  size?: number;
}

function IconWrap({
  size,
  className,
  children,
}: {
  size: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

export function StackBrandIcon({ id, className = "", size = 20 }: StackBrandIconProps) {
  switch (id) {
    case "shopify":
      return (
        <IconWrap size={size} className={className}>
          <ShopifyMark className="size-full" />
        </IconWrap>
      );
    case "nextjs":
      return (
        <Image
          src="/icons/nextjs-mark.png"
          alt=""
          width={size}
          height={size}
          className={`shrink-0 rounded-md ${className}`}
          unoptimized
        />
      );
    case "seo":
      return (
        <span
          className={`relative inline-flex shrink-0 items-center ${className}`}
          style={{ width: size * 1.55, height: size }}
        >
          <span className="inline-flex" style={{ width: size, height: size }}>
            <GoogleLogoMark className="size-full" title="Google" />
          </span>
          <Image
            src="/icons/chatgpt-mark.png"
            alt=""
            width={Math.round(size * 0.72)}
            height={Math.round(size * 0.72)}
            className="absolute -right-0.5 -top-0.5 rounded-full ring-2 ring-slate-950"
            unoptimized
          />
        </span>
      );
    case "google-ads":
      return (
        <IconWrap size={size} className={className}>
          <GoogleLogoMark className="size-full" title="Google Ads" />
        </IconWrap>
      );
    case "meta-ads":
      return <MetaIcon className={`shrink-0 ${className}`} size={size} />;
    case "automation":
      return (
        <IconWrap size={size} className={className}>
          <AutomationFlowMark className="size-full" />
        </IconWrap>
      );
    default:
      return null;
  }
}
