import axios, { type AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";

const DATAFORSEO_BASE_URL = "https://api.dataforseo.com/v3";

export interface DataForSeoConnectionResult {
  ok: boolean;
  message: string;
}

export function createDataForSeoClient(env: Env): AxiosInstance {
  return axios.create({
    baseURL: DATAFORSEO_BASE_URL,
    auth: {
      username: env.DATAFORSEO_LOGIN,
      password: env.DATAFORSEO_PASSWORD,
    },
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Uses the free appendix/user_data endpoint to verify credentials and reachability.
 * @see https://docs.dataforseo.com/v3/appendix/user_data/
 */
export async function testDataForSeoConnection(
  client: AxiosInstance
): Promise<DataForSeoConnectionResult> {
  try {
    const response = await client.get("/appendix/user_data");

    if (response.status !== 200) {
      return {
        ok: false,
        message: `Unexpected status ${response.status} from DataForSEO`,
      };
    }

    const statusCode = response.data?.status_code;
    if (statusCode !== undefined && statusCode !== 20000) {
      const apiMessage =
        response.data?.status_message ?? "DataForSEO returned an error status";
      return { ok: false, message: apiMessage };
    }

    return { ok: true, message: "CONNECTED" };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const apiMessage = error.response?.data?.status_message;

      if (status === 401) {
        return {
          ok: false,
          message: "Authentication failed. Check DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.",
        };
      }

      if (apiMessage) {
        return { ok: false, message: String(apiMessage) };
      }

      if (error.code === "ECONNABORTED") {
        return { ok: false, message: "Request timed out while reaching DataForSEO." };
      }

      if (error.message) {
        return { ok: false, message: error.message };
      }
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unknown DataForSEO error",
    };
  }
}
