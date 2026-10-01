const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");

export async function fetchPortfolioSummary() {
  const res = await fetch(`${API_BASE}/portfolio/summary`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch portfolio summary.");
  return data.data;
}

export async function fetchPortfolioHoldings() {
  const res = await fetch(`${API_BASE}/portfolio`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch holdings.");
  return data.data;
}

export async function fetchOrderHistory() {
  const res = await fetch(`${API_BASE}/portfolio/history`, { credentials: "include" });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch order history.");
  return data.data;
}

export async function executeBuy({ symbol, quantity, price }) {
  const res = await fetch(`${API_BASE}/portfolio/buy`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, quantity, price }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Buy order failed.");
  return data.data;
}

export async function executeSell({ symbol, quantity, price }) {
  const res = await fetch(`${API_BASE}/portfolio/sell`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ symbol, quantity, price }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.message || "Sell order failed.");
  return data.data;
}
