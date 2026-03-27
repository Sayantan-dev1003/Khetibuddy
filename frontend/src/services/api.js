export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function post(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
