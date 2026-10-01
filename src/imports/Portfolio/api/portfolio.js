const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");

export async function fetchPortfolioSummary() {
  const res = await fetch(`${API_BASE}/portfolio/summary`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch portfolio summary.");
  }
  return data.data;
}

export async function fetchPortfolioHoldings() {
  const res = await fetch(`${API_BASE}/portfolio`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch portfolio holdings.");
  }
  return data.data;
}
