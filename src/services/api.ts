/**
 * API Service Layer
 * Base URL: http://localhost:8888/api/
 * 
 * All backend API calls are centralized here.
 * Each function corresponds to a specific endpoint.
 * Replace placeholder endpoints with actual backend routes.
 */

const BASE_URL = "http://localhost:8888/api";

// ─── Generic fetch helper ───────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      // TODO: connect to backend here — add Authorization header if needed
      // "Authorization": `Bearer ${token}`,
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || `API error: ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// TODO: connect to backend here
export const loginUser = (payload: LoginPayload): Promise<AuthResponse> =>
  apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// TODO: connect to backend here
export const signupUser = (payload: SignupPayload): Promise<AuthResponse> =>
  apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ─── Profile ────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  height: string;
  weight: string;
  gender: string;
  goal: string;
  avatarUrl: string | null;
}

// TODO: connect to backend here
export const getProfile = (): Promise<UserProfile> =>
  apiFetch<UserProfile>("/profile");

// TODO: connect to backend here
export const updateProfile = (data: Partial<UserProfile>): Promise<UserProfile> =>
  apiFetch<UserProfile>("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

// ─── Dashboard ──────────────────────────────────────────────────────────────

export interface DashboardData {
  streak: number;
  quote: string;
}

// TODO: connect to backend here
export const getDashboardData = (): Promise<DashboardData> =>
  apiFetch<DashboardData>("/dashboard");

// ─── Activities ─────────────────────────────────────────────────────────────

export interface Activity {
  icon: string;
  label: string;
  value: string;
  target: string;
  percent: number;
  color: string;
  bg: string;
}

export interface ActivitiesData {
  activities: Activity[];
  waterMl: number;
  waterTarget: number;
}

// TODO: connect to backend here
export const getActivities = (): Promise<ActivitiesData> =>
  apiFetch<ActivitiesData>("/activities");

// TODO: connect to backend here
export const updateWaterIntake = (ml: number): Promise<{ waterMl: number }> =>
  apiFetch<{ waterMl: number }>("/activities/water", {
    method: "POST",
    body: JSON.stringify({ ml }),
  });

// ─── Diet Plan ──────────────────────────────────────────────────────────────

export interface DietAnalysisPayload {
  text?: string;
  imageBase64?: string;
}

export interface DietAnalysisResult {
  analysis: string;
}

// TODO: connect to backend here
export const analyzeDiet = (payload: DietAnalysisPayload): Promise<DietAnalysisResult> =>
  apiFetch<DietAnalysisResult>("/diet/analyze", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ─── Reports ────────────────────────────────────────────────────────────────

export interface MacroData {
  name: string;
  value: number;
  color: string;
}

export interface WeeklyData {
  week: string;
  weight: number;
  calories: number;
  workouts: number;
}

export interface ReportsData {
  macros: MacroData[];
  weekly: WeeklyData[];
}

// TODO: connect to backend here
export const getReports = (): Promise<ReportsData> =>
  apiFetch<ReportsData>("/reports");

// ─── Mood Detection ─────────────────────────────────────────────────────────

export interface MoodPayload {
  text?: string;
  imageBase64?: string;
}

export interface MoodResult {
  mood: string;
  recommendation: string;
}

// TODO: connect to backend here
export const detectMood = (payload: MoodPayload): Promise<MoodResult> =>
  apiFetch<MoodResult>("/mood/detect", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// ─── Settings ───────────────────────────────────────────────────────────────

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeEmailPayload {
  newEmail: string;
}

// TODO: connect to backend here
export const changePassword = (payload: ChangePasswordPayload): Promise<{ success: boolean }> =>
  apiFetch<{ success: boolean }>("/settings/password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// TODO: connect to backend here
export const changeEmail = (payload: ChangeEmailPayload): Promise<{ success: boolean }> =>
  apiFetch<{ success: boolean }>("/settings/email", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

// TODO: connect to backend here
export const toggle2FA = (enabled: boolean): Promise<{ enabled: boolean }> =>
  apiFetch<{ enabled: boolean }>("/settings/2fa", {
    method: "PUT",
    body: JSON.stringify({ enabled }),
  });
