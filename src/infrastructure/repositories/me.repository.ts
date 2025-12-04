// src/infrastructure/repositories/user.repository.ts
import { apiClient } from "../api/api-client";
import { API_CONFIG } from "../config/api.config";
import { UserProfile, UpdateProfileData } from "@/domain/entities/me.entity";

export class UserRepository {
  async getProfile(): Promise<UserProfile> {
    const endpoint = `${API_CONFIG.API_VERSION}${API_CONFIG.ENDPOINTS.USER_ME}`;
    const response = await apiClient.post<{ data: UserProfile }>(endpoint, {});
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const endpoint = `${API_CONFIG.API_VERSION}/user/me`;
    const response = await apiClient.put<{ data: UserProfile }>(endpoint, data);
    return response.data;
  }
}

export const userRepository = new UserRepository();
