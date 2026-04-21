const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data as T;
}

export async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
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
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers: {
      ...DEFAULT_HEADERS,
      ...headers
    },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(response);
}