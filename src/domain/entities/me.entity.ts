// src/domain/entities/user-profile.entity.ts
export interface UserProfile {
  role_id: number;
  user_id: string;
  name: string;
  email: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  name?: string;
  name_pronunciation?: string;
}
