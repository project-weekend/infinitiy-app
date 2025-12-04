/**
 * Infrastructure Layer - API Configuration
 * Centralized API configuration
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8089",
  API_VERSION: "/api/v1",
  SECRET_KEY: process.env.NEXT_PUBLIC_API_SECRET_KEY || "is-this-secret-key?",
  ENDPOINTS: {
    LOGIN: "/user/login",
    USER_ME: "/user/me",
  },
  TIMEOUT: 10000, // 10 seconds
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_VERSION}${endpoint}`;
};
