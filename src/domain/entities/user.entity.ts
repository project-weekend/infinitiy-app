/**
 * Domain Layer - User Entity
 * Represents the core business model for a user
 */

export interface UserEntity {
  id?: string;
  email: string;
  name?: string;
  role?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserEntity;
  token: string;
}
