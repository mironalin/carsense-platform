import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { AvatarDisplay } from "./avatar-display";

interface AvatarUploadZoneProps {
  image: string | null;
  name: string;
  avatarFallback: string;
  onImageDrop: (file: File) => void;
  onViewClick?: () => void;
  onDragStateChange?: (isDragActive: boolean) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export function AvatarUploadZone({
  image,
  name,
  avatarFallback,
  onImageDrop,
  onViewClick,
  onDragStateChange,
  disabled = false,
  isUploading = false,
}: AvatarUploadZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onImageDrop(file);
      }
    },
    [onImageDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: false,
    disabled: disabled || isUploading,
    onDragEnter: () => onDragStateChange?.(true),
    onDragLeave: () => onDragStateChange?.(false),
    onDropAccepted: () => onDragStateChange?.(false),
    onDropRejected: () => onDragStateChange?.(false),
  });

  if (disabled) {
    return (
      <AvatarDisplay
        image={image}
        name={name}
        avatarFallback={avatarFallback}
        showViewButton={!!image}
        onViewClick={onViewClick}
      />
    );
  }

  return (
    <motion.div
      className={`relative rounded-full p-2 transition-all duration-200 cursor-pointer ${
        isDragActive
          ? "bg-primary/10 ring-2 ring-primary ring-offset-2"
          : "hover:bg-muted/50"
      }`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      <AvatarDisplay
        image={image}
        name={name}
        avatarFallback={avatarFallback}
        showViewButton={!!image}
        onViewClick={() => onViewClick?.()}
      />
      
      {/* Upload overlay when dragging */}
      {isDragActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-full"
        >
          <Upload className="h-8 w-8 text-primary" />
        </motion.div>
      )}
    </motion.div>
  );
} 