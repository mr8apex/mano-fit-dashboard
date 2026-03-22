/**
 * Google API — Google Fit integration, OAuth
 */
import { apiFetch } from "./client";

// ─── Interfaces ─────────────────────────────────────────────────────────────

export interface GoogleAuthUrlResponse {
  url: string;
}

export interface DayFitness {
  steps: number;
  calories: number;
  distance: number;
}

export interface WeeklyFitnessData {
  Sunday: DayFitness;
  Monday: DayFitness;
  Tuesday: DayFitness;
  Wednesday: DayFitness;
  Thursday: DayFitness;
  Friday: DayFitness;
  Saturday: DayFitness;
}

// ─── API calls ──────────────────────────────────────────────────────────────

/** GET /google-data/authUrl — get Google OAuth URL */
export const getGoogleAuthUrl = (): Promise<GoogleAuthUrlResponse> =>
  apiFetch<GoogleAuthUrlResponse>("/google-data/authUrl");

/** GET /google-data/fitness — get weekly fitness data */
export const getGoogleFitnessData = (): Promise<WeeklyFitnessData> =>
  apiFetch<WeeklyFitnessData>("/google-data/fitness");
