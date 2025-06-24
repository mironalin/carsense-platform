import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";

import type { StatCardColor } from "../../utils/stat-card-utils";

import { statsCardVariants } from "../../utils/animation-variants";
import { getStatCardIconColor, getStatCardShadowColor, getStatCardVariant } from "../../utils/stat-card-utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  color?: StatCardColor;
};

export function StatCard({ title, value, icon, description, color = "blue" }: StatCardProps) {
  return (
    <motion.div variants={statsCardVariants} whileHover="hover" className="h-full">
      <Card className={`${getStatCardVariant(color)} hover:shadow-lg hover:shadow-${getStatCardShadowColor(color)}-500/20 transition-all duration-300 h-full flex flex-col backdrop-blur-sm`}>
        <CardContent className="p-4 flex-1 flex items-center">
          <div className="flex items-center gap-3 w-full">
            <div className={`p-2.5 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm ${getStatCardIconColor(color)}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-2xl font-bold tabular-nums text-foreground">{value}</div>
              <div className="text-sm font-medium text-foreground/90">{title}</div>
              <div className="text-xs text-muted-foreground/80">{description}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
