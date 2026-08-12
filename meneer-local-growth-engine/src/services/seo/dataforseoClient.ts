function getCredentials() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD ontbreken");
  }
  return { login, password };
}

export async function dataForSeoPost<T>(
  path: string,
  body: unknown
): Promise<{ data: T; cost: number; raw: unknown }> {
  const { login, password } = getCredentials();
  const auth = Buffer.from(`${login}:${password}`).toString("base64");
  const response = await fetch(`https://api.dataforseo.com/v3${path}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json()) as {
    status_code?: number;
    status_message?: string;
    cost?: number;
    tasks?: Array<{
      status_code?: number;
      status_message?: string;
      cost?: number;
    }>;
  };

  if (!response.ok || (json.status_code && json.status_code !== 20000)) {
    throw new Error(
      `DataForSEO ${path}: ${json.status_message ?? response.statusText} (${json.status_code ?? response.status})`
    );
  }

  const task = json.tasks?.[0];
  if (task?.status_code && task.status_code !== 20000) {
    throw new Error(
      `DataForSEO task ${path}: ${task.status_message ?? "error"} (${task.status_code})`
    );
  }

  return {
    data: json as T,
    cost: Number(task?.cost ?? json.cost ?? 0),
    raw: json,
  };
}
