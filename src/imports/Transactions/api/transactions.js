const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");

export async function fetchRealTransactions() {
  const res = await fetch(`${API_BASE}/transactions`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch real transactions.");
  }
  return data.data;
}

export async function fetchDemoTransactions() {
  const res = await fetch(`${API_BASE}/transactions/demo`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch demo transactions.");
  }
  return data.data;
}
