// src/application/services/user.service.ts
import { userRepository } from "@/infrastructure/repositories/me.repository";
import { UserProfile, UpdateProfileData } from "@/domain/entities/me.entity";

export class UserService {
  async getProfile(): Promise<UserProfile> {
    try {
      return await userRepository.getProfile();
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    // Add validation here if needed
    if (data.name && data.name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }

    try {
      return await userRepository.updateProfile(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
    }
  }
}

export const userService = new UserService();
