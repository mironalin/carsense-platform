import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";

import type { UpdateProfileRequest } from "../types";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await authClient.updateUser(data);
      
      if (!response.data?.status) {
        throw new Error("Failed to update profile");
      }
      
      return response.data;
    },
    onSuccess: async () => {
      // Force refetch session data after profile update
      // This ensures the updated user data is reflected immediately
      try {
        await authClient.getSession({ 
          query: { disableCookieCache: true } 
        });
        
        // Only invalidate specific queries to prevent race conditions
        queryClient.invalidateQueries({ queryKey: ["auth", "session"] });
        queryClient.invalidateQueries({ queryKey: ["user"] });
      } catch (error) {
        console.error("Failed to refetch session:", error);
      }
      
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
    },
  });
} 