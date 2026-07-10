import apiClient, { USE_MOCKS } from "./client";
import { delay } from "../utils/delay";
import { mockUser } from "../mocks/auth.mock";

/**
 * Contrat attendu du backend réel (Stagiaire 2) :
 * - POST /auth/register  -> { user, token }
 * - POST /auth/login     -> { user, token }
 * - GET  /auth/me        -> user
 * - PUT  /auth/profile   -> user
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
