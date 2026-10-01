const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");


export async function fetchStockQuote(symbol) {
  const res = await fetch(`${API_BASE}/stocks/${symbol}/quote`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch stock quote.");
  }
  return data.data;
}

export async function fetchStockCandles(symbol, resolution, from, to) {
  const res = await fetch(`${API_BASE}/charts/candlestick?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch stock candles.");
  }
  return data.data;
}

export async function fetchStockLineChart(symbol) {
  const res = await fetch(`${API_BASE}/charts/line?symbol=${symbol}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch stock line chart.");
  }
  return data.data;
}

export async function fetchCompanyNews(symbol) {
  const res = await fetch(`${API_BASE}/news/${symbol}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch company news.");
  }
  return data.data;
}

export async function fetchCompanyProfile(symbol) {
  const res = await fetch(`${API_BASE}/stocks/${symbol}/profile`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch company profile.");
  }
  return data.data;
}

