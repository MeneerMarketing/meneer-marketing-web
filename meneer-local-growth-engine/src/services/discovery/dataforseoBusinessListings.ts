/**
 * DataForSEO Business Listings Search Live client
 * @see https://docs.dataforseo.com/v3/business_data-business_listings-search-live/
 */

export interface BusinessListingAddressInfo {
  borough?: string | null;
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  region?: string | null;
  country_code?: string | null;
}

export interface BusinessListingRating {
  rating_type?: string | null;
  value?: number | null;
  votes_count?: number | null;
  rating_max?: number | null;
}

export interface BusinessListingItem {
  type?: string;
  title?: string | null;
  original_title?: string | null;
  description?: string | null;
  category?: string | null;
  category_ids?: string[] | null;
  additional_categories?: string[] | null;
  cid?: string | null;
  place_id?: string | null;
  address?: string | null;
  address_info?: BusinessListingAddressInfo | null;
  phone?: string | null;
  url?: string | null;
  domain?: string | null;
  logo?: string | null;
  main_image?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_claimed?: boolean | null;
  rating?: BusinessListingRating | null;
  current_status?: string | null;
  work_time?: {
    work_hours?: {
      current_status?: string | null;
    } | null;
  } | null;
  [key: string]: unknown;
}

export interface BusinessListingsSearchParams {
  description?: string;
  title?: string;
  categories?: string[];
  location_coordinate: string;
  limit?: number;
  filters?: unknown[];
  order_by?: string[];
  tag?: string;
}

export interface BusinessListingsSearchResult {
  cost: number;
  total_count: number;
  count: number;
  items: BusinessListingItem[];
  raw: unknown;
}

function getCredentials() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD ontbreken");
  }
  return { login, password };
}

export async function searchBusinessListings(
  params: BusinessListingsSearchParams
): Promise<BusinessListingsSearchResult> {
  const { login, password } = getCredentials();
  const auth = Buffer.from(`${login}:${password}`).toString("base64");

  const body = [
    {
      description: params.description,
      title: params.title,
      categories: params.categories,
      location_coordinate: params.location_coordinate,
      limit: params.limit ?? 20,
      filters: params.filters,
      order_by: params.order_by ?? ["rating.votes_count,desc"],
      tag: params.tag,
    },
  ];

  // Strip undefined keys
  body[0] = Object.fromEntries(
    Object.entries(body[0]).filter(([, v]) => v !== undefined)
  ) as (typeof body)[0];

  const response = await fetch(
    "https://api.dataforseo.com/v3/business_data/business_listings/search/live",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const json = (await response.json()) as {
    status_code?: number;
    status_message?: string;
    cost?: number;
    tasks?: Array<{
      status_code?: number;
      status_message?: string;
      cost?: number;
      result?: Array<{
        total_count?: number;
        count?: number;
        items?: BusinessListingItem[];
      }>;
    }>;
  };

  if (!response.ok || (json.status_code && json.status_code !== 20000)) {
    throw new Error(
      `DataForSEO error: ${json.status_message ?? response.statusText} (${json.status_code ?? response.status})`
    );
  }

  const task = json.tasks?.[0];
  if (task?.status_code && task.status_code !== 20000) {
    throw new Error(
      `DataForSEO task error: ${task.status_message ?? "unknown"} (${task.status_code})`
    );
  }

  const result = task?.result?.[0];
  return {
    cost: Number(task?.cost ?? json.cost ?? 0),
    total_count: Number(result?.total_count ?? 0),
    count: Number(result?.count ?? 0),
    items: result?.items ?? [],
    raw: json,
  };
}
