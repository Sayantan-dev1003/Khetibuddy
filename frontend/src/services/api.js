export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function post(url, body) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });
    
    // Check if the response is unauthorized (401)
    if (res.status === 401) {
      return { success: false, message: "Unauthorized", status: 401 };
    }
    
    return await res.json();
  } catch (error) {
    console.error("API POST error:", error);
    return { success: false, message: "Network error" };
  }
}

export async function get(url) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    
    if (res.status === 401) {
      return { success: false, message: "Unauthorized", status: 401 };
    }
    
    return await res.json();
  } catch (error) {
    console.error("API GET error:", error);
    return { success: false, message: "Network error" };
  }
}
