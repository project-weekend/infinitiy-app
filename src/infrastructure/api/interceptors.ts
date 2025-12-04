/**
 * Infrastructure Layer - API Interceptors
 * Handles token refresh and error interception
 */

import { ApiClient, ApiError } from "./api-client";
import { authRepository } from "../repositories/auth.repository";

/**
 * Intercepts 401 errors and attempts to refresh the token
 */
export async function handleUnauthorizedError(
  error: ApiError,
  retryRequest: () => Promise<any>
): Promise<any> {
  // Only attempt refresh for 401 errors
  if (error.status !== 401) {
    throw error;
  }

  // Check if we have a refresh token
  const refreshToken = localStorage.getItem("infinity_refresh_token");
  if (!refreshToken) {
    // No refresh token, redirect to login
    localStorage.removeItem("infinity_token");
    localStorage.removeItem("infinity_user");
    window.location.href = "/login";
    throw error;
  }

  try {
    // Attempt to refresh the token
    await authRepository.refreshToken(refreshToken);

    // Retry the original request with the new token
    return await retryRequest();
  } catch (refreshError) {
    // Refresh failed, clear session and redirect to login
    localStorage.removeItem("infinity_token");
    localStorage.removeItem("infinity_refresh_token");
    localStorage.removeItem("infinity_user");
    window.location.href = "/login";
    throw error;
  }
}

/**
 * Enhanced API client with automatic token refresh
 */
export class ApiClientWithRefresh extends ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  async request<T>(endpoint: string, options: any = {}): Promise<T> {
    try {
      return await super.request<T>(endpoint, options);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem("infinity_refresh_token");
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const authResponse = await authRepository.refreshToken(refreshToken);
            this.isRefreshing = false;
            this.onTokenRefreshed(authResponse.token);

            // Retry original request with new token
            return await super.request<T>(endpoint, {
              ...options,
              token: authResponse.token,
            });
          } catch (refreshError) {
            this.isRefreshing = false;
            // Clear session and redirect
            localStorage.removeItem("infinity_token");
            localStorage.removeItem("infinity_refresh_token");
            localStorage.removeItem("infinity_user");
            if (typeof window !== "undefined") {
              window.location.href = "/login";
            }
            throw error;
          }
        } else {
          // Wait for the refresh to complete
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh((token: string) => {
              super
                .request<T>(endpoint, { ...options, token })
                .then(resolve)
                .catch(reject);
            });
          });
        }
      }

      throw error;
    }
  }
}

// Export enhanced client instance
export const apiClientWithRefresh = new ApiClientWithRefresh();


