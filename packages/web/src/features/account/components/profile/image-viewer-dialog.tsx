import { Camera } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  name: string;
}

export function ImageViewerDialog({
  isOpen,
  onClose,
  imageUrl,
  name,
}: ImageViewerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2 flex-shrink-0">
          <DialogTitle>Profile Picture</DialogTitle>
        </DialogHeader>
        <div className="flex-1 flex items-center justify-center p-6 pt-2 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${name}'s profile picture`}
              className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Camera className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No profile picture</p>
              <p className="text-sm">Upload an image using the card below</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 