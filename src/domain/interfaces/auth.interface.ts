/**
 * Domain Layer - Authentication Interface
 * Defines the contract for authentication operations
 */

import {
  LoginCredentials,
  AuthResponse,
  UserEntity,
} from "../entities/user.entity";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserEntity | null>;
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  getCurrentUser(): UserEntity | null;
  isAuthenticated(): boolean;
}
