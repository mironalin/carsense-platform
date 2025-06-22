import type { LucideIcon } from "lucide-react";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { listItemAnimation } from "@/features/notifications/utils/animation-variants";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <motion.div variants={listItemAnimation}>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Icon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-muted-foreground max-w-md">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
