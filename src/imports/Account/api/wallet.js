const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1").replace("/api/auth", "/api/v1");

export async function fetchWalletBalance() {
  const res = await fetch(`${API_BASE}/wallet/balance`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch balance.");
  }
  return data.data.balance;
}

export async function depositMoney(amount) {
  const res = await fetch(`${API_BASE}/wallet/add-money`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: parseFloat(amount) }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Deposit failed.");
  }
  return data.data.balance;
}

export async function withdrawMoney(amount) {
  const res = await fetch(`${API_BASE}/wallet/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: parseFloat(amount) }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Withdrawal failed.");
  }
  return data.data.balance;
}

export async function fetchDemoBalance() {
  const res = await fetch(`${API_BASE}/wallet/demo/balance`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch demo balance.");
  }
  return data.data.balance;
}

export async function depositDemoMoney(amount) {
  const res = await fetch(`${API_BASE}/wallet/demo/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: parseFloat(amount) }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Demo deposit failed.");
  }
  return data.data.balance;
}

export async function withdrawDemoMoney(amount) {
  const res = await fetch(`${API_BASE}/wallet/demo/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: parseFloat(amount) }),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Demo withdrawal failed.");
  }
  return data.data.balance;
}
