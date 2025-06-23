import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { api } from "@/lib/rpc";

interface UploadImageRequest {
  image: string; // base64 data URL
  filename?: string;
}

interface UploadImageResponse {
  success: boolean;
  imageUrl: string;
  message: string;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: async (data: UploadImageRequest): Promise<UploadImageResponse> => {
      console.log("Uploading image to API...", { 
        imageSize: data.image.length, 
        filename: data.filename 
      });
      
      const result = await api.upload.image.$post({
        json: data,
      });

      console.log("API response status:", result.status);

      if (!result.ok) {
        const error = await result.json() as { error?: string };
        console.error("Upload API error:", error);
        throw new Error(error.error || "Failed to upload image");
      }

      const response = await result.json() as UploadImageResponse;
      console.log("Upload API success:", response);
      return response;
    },
    onError: (error: Error) => {
      console.error("Upload mutation error:", error);
      toast.error("Upload failed", {
        description: error.message,
      });
    },
  });
}

interface DeleteImageRequest {
  imageUrl: string;
}

interface DeleteImageResponse {
  success: boolean;
  message: string;
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: async (data: DeleteImageRequest): Promise<DeleteImageResponse> => {
      const result = await api.upload.image.$delete({
        json: data,
      });

      if (!result.ok) {
        const error = await result.json() as { error?: string };
        throw new Error(error.error || "Failed to delete image");
      }

      return await result.json() as DeleteImageResponse;
    },
    onError: (error: Error) => {
      toast.error("Delete failed", {
        description: error.message,
      });
    },
  });
} 