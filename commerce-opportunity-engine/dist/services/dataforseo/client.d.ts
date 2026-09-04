import { type AxiosInstance } from "axios";
import type { Env } from "../../config/env.js";
export interface DataForSeoConnectionResult {
    ok: boolean;
    message: string;
}
export declare function createDataForSeoClient(env: Env): AxiosInstance;
/**
 * Uses the free appendix/user_data endpoint to verify credentials and reachability.
 * @see https://docs.dataforseo.com/v3/appendix/user_data/
 */
export declare function testDataForSeoConnection(client: AxiosInstance): Promise<DataForSeoConnectionResult>;
//# sourceMappingURL=client.d.ts.map