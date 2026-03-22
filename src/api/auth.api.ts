/**
 * Auth API — registration, login, OTP verification, password reset
 */
import { apiFetch } from "./client";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  weight: number;
  height: number;
  dateOfBirth: string;
  gender: string;
  address: string;
  phoneNumber: string;
  hasDisease: boolean;
  diseaseName?: string;
  profileImage?: File;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface VerifyOtpPayload {
  token: string;
  otp: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyResetOtpPayload {
  token: string;
  otp: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface GenericResponse {
  success: boolean;
  message: string;
  token?: string;
}

// ─── API calls ──────────────────────────────────────────────────────────────

/** POST /auth/register — multipart (supports profile image upload) */
export const registerUser = async (payload: SignupPayload): Promise<RegisterResponse> => {
  const formData = new FormData();
  formData.append("firstName", payload.firstName);
  if (payload.lastName) formData.append("lastName", payload.lastName);
  formData.append("email", payload.email);
  formData.append("password", payload.password);
  formData.append("weight", String(payload.weight));
  formData.append("height", String(payload.height));
  formData.append("dateOfBirth", payload.dateOfBirth);
  formData.append("gender", payload.gender);
  formData.append("address", payload.address);
  formData.append("phoneNumber", payload.phoneNumber);
  formData.append("hasDisease", String(payload.hasDisease));
  if (payload.diseaseName) formData.append("diseaseName", payload.diseaseName);
  if (payload.profileImage) formData.append("profileImage", payload.profileImage);

  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: formData,
  });
};

/** POST /auth/login */
export const loginUser = (payload: LoginPayload): Promise<AuthResponse> =>
  apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** POST /auth/verify — email OTP verification */
export const verifyOtp = (payload: VerifyOtpPayload): Promise<GenericResponse> =>
  apiFetch<GenericResponse>("/auth/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** POST /auth/forgetPass — request password reset OTP */
export const forgotPassword = (payload: ForgotPasswordPayload): Promise<GenericResponse> =>
  apiFetch<GenericResponse>("/auth/forgetPass", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** POST /auth/verify-reset-otp — verify reset OTP */
export const verifyResetOtp = (payload: VerifyResetOtpPayload): Promise<GenericResponse> =>
  apiFetch<GenericResponse>("/auth/verify-reset-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** POST /auth/resetPass — set new password */
export const resetPassword = (payload: ResetPasswordPayload): Promise<GenericResponse> =>
  apiFetch<GenericResponse>("/auth/resetPass", {
    method: "POST",
    body: JSON.stringify(payload),
  });

/** POST /auth/resendOtp — resend OTP */
export const resendOtp = (email: string): Promise<GenericResponse> =>
  apiFetch<GenericResponse>("/auth/resendOtp", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
