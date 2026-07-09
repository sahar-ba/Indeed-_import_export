import apiClient, { USE_MOCKS } from "./client";
import { delay } from "../utils/delay";
import { mockUser } from "../mocks/auth.mock";

export async function registerUser(payload) {
  if (USE_MOCKS) {
    await delay(400);
    return { ...mockUser, email: payload.email, role: payload.role, profileStatus: "pending" };
  }
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
}

export async function loginUser(payload) {
  if (USE_MOCKS) {
    await delay(400);
    return { user: mockUser, token: "mock-token-123" };
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
