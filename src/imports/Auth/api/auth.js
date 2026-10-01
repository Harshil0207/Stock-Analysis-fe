const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/auth";

export async function registerApi(regForm) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(regForm),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Registration failed. Please check inputs.");
  }
  return data;
}

export async function loginApi(email) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Login failed. Ensure email is registered.");
  }
  return data;
}

export async function verifyRegisterOtpApi(email, otp) {
  const res = await fetch(`${API_BASE}/verify-register-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Verification code is incorrect.");
  }
  return data;
}

export async function verifyLoginOtpApi(email, otp) {
  const res = await fetch(`${API_BASE}/verify-login-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Verification code is incorrect.");
  }
  return data;
}

export async function resendOtpApi(email, purpose) {
  const res = await fetch(`${API_BASE}/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to resend code.");
  }
  return data;
}

export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to retrieve user profile.");
  }
  return data.data;
}

export async function updateUserProfile(profileData) {
  const res = await fetch(`${API_BASE}/update-profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to update profile.");
  }
  return data.data;
}

export async function logoutApi() {
  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    credentials: "include"
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || "Logout failed.");
  }
  return data;
}

