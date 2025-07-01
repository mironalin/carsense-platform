import type { LucideIcon } from "lucide-react";

import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";

import { staggerItem, statsVariants } from "../../utils/animation-variants";

type StatItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
  bgColor: string;
  showVerifiedBadge?: boolean;
  showAdminBadge?: boolean;
};

export function StatItem({
  icon: Icon,
  label,
  value,
  color,
  bgColor,
  showAdminBadge = false,
}: StatItemProps) {
  return (
    <motion.div
      variants={staggerItem}
      whileHover="hover"
      className="group"
    >
      <motion.div
        variants={statsVariants}
        className={`rounded-lg p-4 transition-colors ${bgColor} border border-border/50`}
      >
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold truncate">
                {value}
              </p>
              {showAdminBadge && (
                <Badge variant="default" className="text-xs">
                  Admin
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
