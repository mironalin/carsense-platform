import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface UploadStatusProps {
  isUploading: boolean;
  hasImage: boolean;
  isDragActive: boolean;
  disabled?: boolean;
  onRemoveImage?: () => void;
}

export function UploadStatus({
  isUploading,
  hasImage,
  isDragActive,
  disabled = false,
  onRemoveImage,
}: UploadStatusProps) {
  if (disabled) {
    return null;
  }

  return (
    <div className="text-center space-y-3">
      {/* Upload Instructions */}
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          {isDragActive 
            ? "Drop your image here" 
            : hasImage 
              ? "Click or drag to change photo"
              : "Click or drag to add photo"
          }
        </p>
        <p className="text-xs text-muted-foreground">
          Supports JPEG, PNG, GIF, WebP • Maximum 5MB
        </p>
      </div>

      {/* Remove Photo Button */}
      {hasImage && onRemoveImage && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemoveImage}
          className="gap-2 w-full max-w-xs"
        >
          <X className="h-4 w-4" />
          Remove Photo
        </Button>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Processing image...</span>
        </div>
      )}
    </div>
  );
} 