import { demoApi } from "./demoBackend";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function api(path, options = {}) {
  const token = localStorage.getItem("goal_portal_token");
  if (token?.startsWith("demo-token:")) return demoApi(path, options);

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    return demoApi(path, options);
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    if (response.status >= 500 || response.status === 404) return demoApi(path, options);
    throw new Error(error.message || "Request failed");
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/csv") || contentType.includes("spreadsheet")) return response.blob();
  return response.json();
}
