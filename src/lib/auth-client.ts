// src/lib/auth-client.ts
// Central JWT authentication utilities — uses cookies for SSR compatibility.

const API_BASE = "https://localhost:44363";

// ─── Cookie Keys ───
const ACCESS_TOKEN_KEY = "smart_school_access_token";
const REFRESH_TOKEN_KEY = "smart_school_refresh_token";
const USER_INFO_KEY = "smart_school_user_info";

// ─── Types ───
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userName: string;
  email: string;
  role: string;
}

export interface UserInfo {
  userName: string;
  email: string;
  role: string;
}

// ─── Cookie Helpers (client-side) ───
function setCookie(name: string, value: string, days = 7): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// ─── Token Helpers ───
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return getCookie(REFRESH_TOKEN_KEY);
}

export function getUserInfo(): UserInfo | null {
  if (typeof window === "undefined") return null;
  const raw = getCookie(USER_INFO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserInfo;
  } catch {
    return null;
  }
}

export function saveAuthData(data: AuthResponse): void {
  setCookie(ACCESS_TOKEN_KEY, data.accessToken, 7);
  setCookie(REFRESH_TOKEN_KEY, data.refreshToken, 30);
  setCookie(
    USER_INFO_KEY,
    JSON.stringify({
      userName: data.userName,
      email: data.email,
      role: data.role,
    }),
    7
  );
}

export function clearAuthData(): void {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(USER_INFO_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ─── Login ───
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg =
      body?.message || body?.Message || "البريد أو كلمة المرور غير صحيحة";
    throw new Error(msg);
  }

  const data: AuthResponse = await res.json();
  saveAuthData(data);
  return data;
}

// ─── Refresh Token ───
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}/api/Auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(refreshToken),
    });

    if (!res.ok) {
      clearAuthData();
      return false;
    }

    const data: AuthResponse = await res.json();
    saveAuthData(data);
    return true;
  } catch {
    clearAuthData();
    return false;
  }
}

// ─── Logout ───
export async function logout(): Promise<void> {
  const token = getAccessToken();
  if (token) {
    try {
      await fetch(`${API_BASE}/api/Auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    } catch {
      // Silently ignore logout API errors
    }
  }
  clearAuthData();
  if (typeof window !== "undefined") {
    window.location.href = "/auth/login";
  }
}

// ─── Authenticated Fetch Wrapper ───
// Use this instead of raw `fetch` for any API call that requires JWT.
export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAccessToken();

  if (!token) {
    // No token available — redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
    throw new Error("غير مسجل الدخول");
  }

  // Merge the Authorization header
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  let res = await fetch(url, { ...options, headers });

  // If 401, attempt to refresh token and retry once
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = getAccessToken();
      headers.set("Authorization", `Bearer ${newToken}`);
      res = await fetch(url, { ...options, headers });
    } else {
      // Refresh failed — redirect to login
      clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      throw new Error("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً");
    }
  }

  return res;
}
