export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileRequest = {
  name?: string;
  image?: string | null;
};

export type UpdateProfileResponse = {
  status: boolean;
};

export type ProfileFormData = {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
};

export type ProfileStats = {
  memberSince: string;
  emailVerified: boolean;
  accountType: string;
  lastLogin: string;
};
