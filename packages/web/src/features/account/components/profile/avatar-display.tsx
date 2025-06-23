import { motion } from "framer-motion";
import { Eye } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { avatarVariants } from "../../utils/animation-variants";

interface AvatarDisplayProps {
  image: string | null;
  name: string;
  avatarFallback: string;
  showViewButton?: boolean;
  onViewClick?: () => void;
  className?: string;
}

export function AvatarDisplay({
  image,
  name,
  avatarFallback,
  showViewButton = false,
  onViewClick,
  className = "",
}: AvatarDisplayProps) {
  return (
    <motion.div
      variants={avatarVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      className={`relative ${className}`}
    >
      <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
        <AvatarImage src={image || ""} alt={name} className="object-cover" />
        <AvatarFallback className="text-2xl font-semibold">
          {avatarFallback}
        </AvatarFallback>
      </Avatar>
      
      {showViewButton && image && onViewClick && (
        <motion.div
          className="absolute -bottom-2 -right-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 w-8 rounded-full bg-background p-0 shadow-md"
            onClick={onViewClick}
            title="View full size image"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
} 