export type DevAdminClientSource = "env" | "cookie" | "auth_bypass" | "off";

export interface DevAdminClientMode {
  enabled: boolean;
  source: DevAdminClientSource;
  canToggle: boolean;
  adminConfigured: boolean;
  isDevelopment: boolean;
}

export function devAdminClientModeLabel(source: DevAdminClientSource): string {
  switch (source) {
    case "env":
      return "Via LGE_DEV_USE_ADMIN_CLIENT";
    case "cookie":
      return "Via instellingen (cookie)";
    case "auth_bypass":
      return "Via LGE_DEV_AUTH_BYPASS";
    default:
      return "Uit (Supabase sessie)";
  }
}

export const DEV_ADMIN_CLIENT_COOKIE = "lge_dev_admin_client";

export function isDevAdminClientEnvEnabled(): boolean {
  return process.env.LGE_DEV_USE_ADMIN_CLIENT === "true";
}
