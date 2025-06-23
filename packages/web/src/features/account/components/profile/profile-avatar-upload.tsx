import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useDeleteImage, useUploadImage } from "../../api/use-upload-image";
import { generateAvatarFallback, validateImageFile } from "../../utils/profile-utils";
import { AvatarUploadZone } from "./avatar-upload-zone";
import { ImageViewerDialog } from "./image-viewer-dialog";
import { UploadStatus } from "./upload-status";

interface ProfileAvatarUploadProps {
  currentImage: string | null;
  name: string;
  email: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export function ProfileAvatarUpload({
  currentImage,
  name,
  email,
  onImageChange,
  disabled = false,
}: ProfileAvatarUploadProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();

  const handleImageDrop = useCallback(
    async (file: File) => {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast.error(validation.error || "Invalid image file");
        return;
      }

      setIsUploading(true);
      try {
        // Convert file to base64 data URL for upload
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          
          try {
            // Upload to cloud storage
            const uploadResult = await uploadImage.mutateAsync({
              image: dataUrl,
              filename: file.name,
            });
            
            // Set the cloud URL as the image source
            setPreviewImage(uploadResult.imageUrl);
            onImageChange(uploadResult.imageUrl);
            
          } catch (error) {
            console.error("Upload failed:", error);
            // Error is already handled by the mutation
          } finally {
            setIsUploading(false);
          }
        };
        reader.onerror = () => {
          console.error("Failed to read file");
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Upload error:", error);
        setIsUploading(false);
      }
    },
    [uploadImage, onImageChange],
  );

  const handleRemoveImage = async () => {
    if (previewImage && previewImage.startsWith("http")) {
      try {
        await deleteImage.mutateAsync({ imageUrl: previewImage });
      } catch (error) {
        console.error("Failed to delete image:", error);
        // Continue with local removal even if cloud deletion fails
      }
    }
    
    setPreviewImage(null);
    onImageChange(null);
  };

  const avatarFallback = generateAvatarFallback(name, email);

  return (
    <div className="flex flex-col items-center space-y-3">
      <AvatarUploadZone
        image={previewImage}
        name={name}
        avatarFallback={avatarFallback}
        onImageDrop={handleImageDrop}
        onViewClick={() => setIsImageViewerOpen(true)}
        onDragStateChange={setIsDragActive}
        disabled={disabled}
        isUploading={isUploading}
      />

      <UploadStatus
        isUploading={isUploading}
        hasImage={!!previewImage}
        isDragActive={isDragActive}
        disabled={disabled}
        onRemoveImage={handleRemoveImage}
      />

      <ImageViewerDialog
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        imageUrl={previewImage}
        name={name}
      />
    </div>
  );
} 