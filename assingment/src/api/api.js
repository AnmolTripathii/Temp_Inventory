const API_BASE = "https://temp-inventory-rb5q.vercel.app/api";

export const api = {
  get: async (url) => {
    const res = await fetch(`${API_BASE}${url}`);
    return res.json();
  },
  post: async (url, body) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  put: async (url, body) => {
    const res = await fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  },
  delete: async (url) => {
    const res = await fetch(`${API_BASE}${url}`, { method: "DELETE" });
    return res.json();
  },
};
