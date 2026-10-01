const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");


export async function fetchTopGainers() {
  const res = await fetch(`${API_BASE}/analytics/top-gainers`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch top gainers.");
  }
  return data.data;
}

export async function fetchTopLosers() {
  const res = await fetch(`${API_BASE}/analytics/top-losers`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch top losers.");
  }
  return data.data;
}

export async function fetchMarketCap() {
  const res = await fetch(`${API_BASE}/analytics/market-cap`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch market cap.");
  }
  return data.data;
}

export async function fetchVolume() {
  const res = await fetch(`${API_BASE}/analytics/volume`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch volume data.");
  }
  return data.data;
}

export async function fetch52WeekHigh() {
  const res = await fetch(`${API_BASE}/analytics/52-week-high`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch 52-week high metrics.");
  }
  return data.data;
}

export async function fetch52WeekLow() {
  const res = await fetch(`${API_BASE}/analytics/52-week-low`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch 52-week low metrics.");
  }
  return data.data;
}
