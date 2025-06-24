import { motion } from "framer-motion";

import { ScrollArea } from "@/components/ui/scroll-area";

import type { RecentActivity } from "../../types";

import { ActivityItem } from "./activity-item";

type ActivityListProps = {
  activities: RecentActivity[];
};

export function ActivityList({ activities }: ActivityListProps) {
  return (
    <div className="h-[400px] rounded-xl overflow-hidden bg-background/80 shadow-sm border border-border/40 dark:border-border/20 mx-6">
      <div className="h-full relative">
        {/* Top indicator - visual candy */}
        <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
        </div>

        <ScrollArea className="h-full">
          <div className="py-3 px-2">
            <motion.div
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
            >
              {activities.map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </motion.div>
          </div>
        </ScrollArea>

        {/* Bottom indicator - visual candy */}
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent dark:via-primary/30"></div>
        </div>
      </div>
    </div>
  );
}
