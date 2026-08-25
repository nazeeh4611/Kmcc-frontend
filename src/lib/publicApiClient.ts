import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://kmcc-backend.onrender.com/api";

// Unauthenticated client for public endpoints (registration, verification,
// public content listing). Never attaches admin or member tokens.
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

publicApiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export { type ApiEnvelope, extractErrorMessage } from "@/lib/apiEnvelope";
