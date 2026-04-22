const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

async function clientFetch(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 3,
) {
  const url = `${BASE_URL}/api/${endpoint}`;

  try {
    const response = await fetch(url, options);

    // If the server returns a 5xx error, throw to trigger the catch block
    if (response.status >= 500 && retries > 0) {
      console.warn(`Server error ${response.status}. Retrying...`);
      return clientFetch(url, options, retries - 1);
    }

    return response;
  } catch (error) {
    // Retry on network errors (like DNS or connection loss) if attempts remain
    if (retries > 0) {
      return clientFetch(url, options, retries - 1);
    }
    throw error;
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await clientFetch(endpoint, {
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
    },
  });
  return parseResponse<T>(response);
}

export async function post<T>(
  endpoint: string,
  body: Record<string, unknown> = {},
  headers: Record<string, unknown> = {},
): Promise<T> {
  const response = await clientFetch(endpoint, {
    method: "POST",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function postFormData<T>(
  endpoint: string,
  body: FormData,
): Promise<T> {
  const response = await clientFetch(endpoint, {
    method: "POST",
    body,
  });
  return parseResponse<T>(response);
}

export async function patch<T>(
  endpoint: string,
  body: Record<string, unknown> = {},
  headers: Record<string, unknown> = {},
): Promise<T> {
  const response = await clientFetch(endpoint, {
    method: "PATCH",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}

export async function del<T>(
  endpoint: string,
  body: Record<string, unknown> = {},
  headers: Record<string, unknown> = {},
): Promise<T> {
  const response = await clientFetch(endpoint, {
    method: "DELETE",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}