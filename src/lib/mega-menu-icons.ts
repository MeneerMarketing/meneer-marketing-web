import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Code2,
  GitBranch,
  LayoutGrid,
  Mail,
  Megaphone,
  MousePointerClick,
  Palette,
  PenTool,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  Workflow,
  Zap,
} from "lucide-react";

/** Icoon per dienstlink. Consistente visuele scan in het mega-menu */
const byHref: Record<string, LucideIcon> = {
  "/diensten/shopify-enterprise": ShoppingBag,
  "/diensten/webdevelopment": Code2,
  "/diensten/web-apps": LayoutGrid,
  "/diensten/optimalisatie": Zap,
  "/diensten/seo": Search,
  "/diensten/adverteren": Megaphone,
  "/diensten/cro": MousePointerClick,
  "/diensten/leadgeneratie": Users,
  "/diensten/automatisering": Workflow,
  "/diensten/workflows": GitBranch,
  "/diensten/chatbots": Bot,
  "/diensten/tracking": BarChart3,
  "/diensten/branding": Palette,
  "/diensten/webdesign": PenTool,
  "/diensten/animaties": Sparkles,
  "/diensten/media": Video,
  "/diensten/email": Mail,
};

export function megaMenuIconForHref(href: string): LucideIcon {
  return byHref[href] ?? LayoutGrid;
}
