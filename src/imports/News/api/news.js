const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");

export async function fetchGeneralNews() {
  const res = await fetch(`${API_BASE}/news`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch general news.");
  }
  return data.data;
}

export async function fetchLatestNews() {
  const res = await fetch(`${API_BASE}/news/latest`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch latest news.");
  }
  return data.data;
}

export async function fetchTrendingNews() {
  const res = await fetch(`${API_BASE}/news/trending`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch trending news.");
  }
  return data.data;
}
