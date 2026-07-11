import apiClient, { USE_MOCKS } from "./client";
import { delay } from "../utils/delay";
import { mockUser } from "../mocks/auth.mock";

/**
 * Contrat attendu du backend réel (Stagiaire 2) :
 * - POST /auth/register  -> { user, token }
 * - POST /auth/login     -> { user, token }
 * - GET  /auth/me        -> user
 * - PUT  /auth/profile   -> user
 * - POST /auth/forgot-password { email } -> { success: true }
 * Le `token` est un JWT ; il est stocké côté client par AuthContext via
 * utils/tokenStorage.js (localStorage ou sessionStorage selon "rester connecté").
 */

export async function registerUser(payload) {
  if (USE_MOCKS) {
    await delay(400);
    const user = { ...mockUser, email: payload.email, role: payload.role, profileStatus: "pending" };
    return { user, token: `mock-token-${Date.now()}` };
  }
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  if (USE_MOCKS) {
    await delay(400);
    return { user: mockUser, token: `mock-token-${Date.now()}` };
  }
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
}

export async function getCurrentUser() {
  if (USE_MOCKS) {
    await delay(200);
    return mockUser;
  }
  const { data } = await apiClient.get("/auth/me");
  return data;
}

export async function completeProfile(payload) {
  if (USE_MOCKS) {
    await delay(400);
    return { ...mockUser, profile: payload, profileStatus: "pending" };
  }
  const { data } = await apiClient.put("/auth/profile", payload);
  return data;
}

/**
 * Demande de réinitialisation de mot de passe. Ne révèle jamais si
 * l'adresse existe réellement en base (message identique dans les deux
 * cas côté UI) — c'est une pratique de sécurité standard pour éviter
 * qu'un tiers ne puisse énumérer les comptes existants.
 */
export async function requestPasswordReset(email) {
  if (USE_MOCKS) {
    await delay(500);
    return { success: true };
  }

  try {
    const { data } = await apiClient.post("/auth/forgot-password", { email });
    return data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Impossible d'envoyer l'email pour le moment. Réessayez plus tard."
    );
  }
}
