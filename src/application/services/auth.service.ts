/**
 * Application Layer - Authentication Service
 * Business logic layer that coordinates between domain and infrastructure
 */

import { IAuthService } from "@/domain/interfaces/auth.interface";
import { AuthResponse, UserEntity } from "@/domain/entities/user.entity";
import { authRepository } from "@/infrastructure/repositories/auth.repository";

export class AuthService implements IAuthService {
  private currentUser: UserEntity | null = null;

  constructor() {
    // Initialize user from localStorage if available
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("infinity_user");
      if (storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("infinity_user");
        }
      }
    }
  }

  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    // Validate input
    if (!email || !email.includes("@")) {
      throw new Error("Please enter a valid email address");
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    try {
      // Call repository to perform login
      const authResponse = await authRepository.login({ email, password });

      // Store user in memory and localStorage
      this.currentUser = authResponse.user;
      localStorage.setItem("infinity_user", JSON.stringify(authResponse.user));

      return authResponse;
    } catch (error) {
      this.currentUser = null;
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Login failed. Please try again.");
    }
  }

  /**
   * Logout user and clear session
   */
  async logout(): Promise<void> {
    try {
      await authRepository.logout();
    } finally {
      this.currentUser = null;
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): UserEntity | null {
    return this.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = typeof window !== "undefined" 
      ? localStorage.getItem("infinity_token") 
      : null;
    return !!this.currentUser && !!token;
  }

  /**
   * Set current user (used for initialization)
   */
  setCurrentUser(user: UserEntity | null): void {
    this.currentUser = user;
  }
}

// Singleton instance
export const authService = new AuthService();


