import { motion } from "framer-motion";
import { User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProfileStats } from "../../types";
import { staggerContainer } from "../../utils/animation-variants";
import { StatItem } from "./stat-item";
import { EmailVerificationNotice } from "./email-verification-notice";
import { getStatItemsConfig } from "./stat-items-config";

interface ProfileStatsProps {
  stats: ProfileStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = getStatItemsConfig(stats);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {statItems.map((item) => (
            <StatItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              color={item.color}
              bgColor={item.bgColor}
              showVerifiedBadge={item.showVerifiedBadge}
              showAdminBadge={item.showAdminBadge}
            />
          ))}
        </motion.div>

        {!stats.emailVerified && <EmailVerificationNotice />}
      </CardContent>
    </Card>
  );
} 