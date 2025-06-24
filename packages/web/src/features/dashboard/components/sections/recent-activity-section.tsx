import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { RecentActivity } from "../../types";

import { itemVariants } from "../../utils/animation-variants";
import { ActivityList } from "../activity/activity-list";
import { EmptyActivityState } from "../activity/empty-activity-state";

type RecentActivitySectionProps = {
  recentActivity: RecentActivity[];
};

export function RecentActivitySection({ recentActivity }: RecentActivitySectionProps) {
  return (
    <motion.div variants={itemVariants} className="w-full">
      <Card className="h-full">
        <CardHeader>
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-sm">
              Latest diagnostics, maintenance, and system events
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          {recentActivity.length === 0
            ? (
                <EmptyActivityState />
              )
            : (
                <ActivityList activities={recentActivity} />
              )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
