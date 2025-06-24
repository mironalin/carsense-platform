import { motion } from "framer-motion";

import type { RecentActivity } from "../../types";

import { formatActivityDate, getActivityIcon, getActivityIconColor } from "../../utils/activity-utils";
import { activityItemVariants } from "../../utils/animation-variants";

type ActivityItemProps = {
  activity: RecentActivity;
};

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <motion.div
      variants={activityItemVariants}
      className="flex items-start gap-3 p-2 mx-1 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
    >
      <div className={`p-2 rounded-full bg-background border shadow-sm shrink-0 ${getActivityIconColor(activity.type)}`}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm text-foreground">{activity.title}</h4>
          <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
            {formatActivityDate(activity.date)}
          </span>
        </div>
        {activity.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {activity.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
