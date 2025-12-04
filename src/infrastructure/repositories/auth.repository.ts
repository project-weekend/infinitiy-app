/**
 * Infrastructure Layer - Authentication Repository
 * Implements the IAuthRepository interface with real API calls
 */

import { IAuthRepository } from "@/domain/interfaces/auth.interface";
import {
  LoginCredentials,
  AuthResponse,
  UserEntity,
} from "@/domain/entities/user.entity";
import { apiClient, ApiError } from "../api/api-client";
import { API_CONFIG } from "../config/api.config";

export class AuthRepository implements IAuthRepository {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const endpoint = `${API_CONFIG.API_VERSION}${API_CONFIG.ENDPOINTS.LOGIN}`;

      const response = await apiClient.post<any>(endpoint, {
        email: credentials.email,
        password: credentials.password,
      });

      // Handle the API response which wraps data in a "data" object
      const responseData = response.data || response;

      // Validate that we have required data
      if (!responseData.token) {
        console.error("No token found in response:", response);
        throw new Error(
          "Login succeeded but no authentication token was received. Please contact support."
        );
      }

      // Map the API response to our domain model
      const authResponse: AuthResponse = {
        user: {
          id:
            responseData.user_id ||
            responseData.userId ||
            responseData.id ||
            "",
          email: responseData.email || credentials.email,
          name: responseData.name || responseData.fullName || "User",
          role: responseData.role || responseData.userRole || "user",
        },
        token: responseData.token || responseData.accessToken || "",
      };

      // Store token in localStorage
      localStorage.setItem("infinity_token", authResponse.token);

      // Store user data
      localStorage.setItem("infinity_user", JSON.stringify(authResponse.user));

      console.log("Login successful, token stored");
      return authResponse;
    } catch (error) {
      // Clear any partial data
      localStorage.removeItem("infinity_token");
      localStorage.removeItem("infinity_user");

      if (error instanceof ApiError) {
        // Re-throw API errors with more context
        console.error("API Error:", error);
        throw new Error(error.message || "Login failed");
      }

      if (error instanceof Error) {
        console.error("Login Error:", error);
        throw error;
      }

      console.error("Unknown Error:", error);
      throw new Error("Network error. Please check your connection.");
    }
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    // Clear local storage
    localStorage.removeItem("infinity_token");
    localStorage.removeItem("infinity_user");
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<UserEntity | null> {
    try {
      const token = localStorage.getItem("infinity_token");
      if (!token) {
        return null;
      }

      // Get user from localStorage
      const storedUser = localStorage.getItem("infinity_user");
      if (storedUser) {
        return JSON.parse(storedUser);
      }

      return null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }
}

// Singleton instance
export const authRepository = new AuthRepository();
