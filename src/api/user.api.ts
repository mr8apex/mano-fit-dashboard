/**
 * User API — profile, settings, account management
 */
import { apiFetch } from "./client";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  phoneNumber: string;
  address: string;
  age: number;
  height: number;
  weight: number;
  gender: string;
  mealType: string;
  profileImageUrl: string | null;
  hasDisease: boolean;
  diseaseName?: string;
}

export interface EditProfilePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  height?: number;
  weight?: number;
  mealType?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface ChangeEmailPayload {
  newEmail: string;
}

export interface GenericSuccess {
  success: boolean;
  message: string;
}

// ─── API calls ──────────────────────────────────────────────────────────────

/** GET /user/profileData */
export const getProfileData = (): Promise<UserProfile> =>
  apiFetch<UserProfile>("/user/profileData");

/** PUT /user/editProfile */
export const editProfile = (data: EditProfilePayload): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/editProfile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

/** PUT /user/changePassword */
export const changePassword = (data: ChangePasswordPayload): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/changePassword", {
    method: "PUT",
    body: JSON.stringify(data),
  });

/** PUT /user/changeEmail */
export const changeEmail = (data: ChangeEmailPayload): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/changeEmail", {
    method: "PUT",
    body: JSON.stringify(data),
  });

/** PUT /user/enable2FA */
export const enable2FA = (): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/enable2FA", { method: "PUT" });

/** PUT /user/disable2FA */
export const disable2FA = (): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/disable2FA", { method: "PUT" });

/** DELETE /user/deleteAccount */
export const deleteAccount = (): Promise<GenericSuccess> =>
  apiFetch<GenericSuccess>("/user/deleteAccount", { method: "DELETE" });
