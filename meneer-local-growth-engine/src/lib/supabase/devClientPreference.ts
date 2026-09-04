import { cookies } from "next/headers";
import {
  DEV_ADMIN_CLIENT_COOKIE,
  type DevAdminClientMode,
  isDevAdminClientEnvEnabled,
} from "@/lib/supabase/devClientPreference.shared";

export {
  DEV_ADMIN_CLIENT_COOKIE,
  devAdminClientModeLabel,
  isDevAdminClientEnvEnabled,
  type DevAdminClientMode,
  type DevAdminClientSource,
} from "@/lib/supabase/devClientPreference.shared";

function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export async function getDevAdminClientMode(
  adminConfigured: boolean,
): Promise<DevAdminClientMode> {
  const dev = isDevelopment();
  if (!dev) {
    return {
      enabled: false,
      source: "off",
      canToggle: false,
      adminConfigured,
      isDevelopment: false,
    };
  }

  if (process.env.LGE_DEV_AUTH_BYPASS === "true") {
    return {
      enabled: true,
      source: "auth_bypass",
      canToggle: false,
      adminConfigured,
      isDevelopment: true,
    };
  }

  if (isDevAdminClientEnvEnabled()) {
    return {
      enabled: true,
      source: "env",
      canToggle: false,
      adminConfigured,
      isDevelopment: true,
    };
  }

  const cookieEnabled =
    (await cookies()).get(DEV_ADMIN_CLIENT_COOKIE)?.value === "1";

  return {
    enabled: cookieEnabled && adminConfigured,
    source: cookieEnabled ? "cookie" : "off",
    canToggle: adminConfigured,
    adminConfigured,
    isDevelopment: true,
  };
}

export async function shouldPreferAdminDataClient(
  adminConfigured: boolean,
): Promise<boolean> {
  const mode = await getDevAdminClientMode(adminConfigured);
  return mode.enabled && adminConfigured;
}
