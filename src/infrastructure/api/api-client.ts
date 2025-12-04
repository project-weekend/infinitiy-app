/**
 * Infrastructure Layer - API Client
 * Generic HTTP client for API requests
 */

import { API_CONFIG } from "../config/api.config";

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl?: string, timeout?: number) {
    this.baseUrl = baseUrl || API_CONFIG.BASE_URL;
    this.timeout = timeout || API_CONFIG.TIMEOUT;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("infinity_token");
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = "GET", headers = {}, body, token } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    const fullUrl = `${this.baseUrl}${endpoint}`;

    try {
      const authToken = token || this.getAuthToken();
      const defaultHeaders: Record<string, string> = {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      };

      console.log(`[API Request] ${method} ${fullUrl}`, {
        body,
        headers: defaultHeaders,
      });

      const response = await fetch(fullUrl, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[API Response] ${method} ${fullUrl}`, {
        status: response.status,
        statusText: response.statusText,
      });

      // Parse response
      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`[API Data] ${method} ${fullUrl}`, data);

      // Handle non-2xx responses
      if (!response.ok) {
        throw new ApiError(
          response.status,
          data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`,
          data
        );
      }

      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        console.error(`[API Error] ${method} ${fullUrl}`, error);
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.error(`[API Timeout] ${method} ${fullUrl}`);
          throw new ApiError(408, "Request timeout - server did not respond in time");
        }
        
        console.error(`[Network Error] ${method} ${fullUrl}`, error);
        
        // More specific error message for fetch failures
        if (error.message === "Failed to fetch") {
          throw new ApiError(
            0,
            `Cannot connect to API server at ${this.baseUrl}. Please check:\n` +
            `1. Is the API server running at ${this.baseUrl}?\n` +
            `2. Check CORS settings on the backend\n` +
            `3. Check browser console for details`
          );
        }
        
        throw new ApiError(0, error.message);
      }

      console.error(`[Unknown Error] ${method} ${fullUrl}`, error);
      throw new ApiError(0, "An unexpected error occurred");
    }
  }

  async get<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", token });
  }

  async post<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, token });
  }

  async put<T>(endpoint: string, body: any, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, token });
  }

  async delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", token });
  }
}

// Singleton instance
export const apiClient = new ApiClient();


