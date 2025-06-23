import { formatDistanceToNow, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  ClockIcon,
  GaugeIcon,
  MailIcon,
  MoreVerticalIcon,
  PhoneIcon,
  StickyNoteIcon,
  TrendingUpIcon,
  WrenchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { MaintenanceEntry } from "../../types";

import { cardVariants } from "../../utils/animation-variants";
import {
  formatCost,
  formatOdometer,
  formatServiceDate,
  getServiceTypeLabel,
  getWorkshopDisplayName,
  isRecentMaintenance,
} from "../../utils/maintenance-utils";
import { DeleteMaintenanceDialog } from "../dialogs/delete-maintenance-dialog";
import { ServiceTypeBadge } from "../shared/service-type-badge";

type MaintenanceEntryCardProps = {
  entry: MaintenanceEntry;
  index: number;
};

export function MaintenanceEntryCard({ entry, index }: MaintenanceEntryCardProps) {
  const relativeTime = formatDistanceToNow(parseISO(entry.serviceDate), { addSuffix: true });
  const isRecent = isRecentMaintenance(entry);
  const hasMultipleServices = entry.serviceTypes.length > 1;

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      style={{ zIndex: 100 - index }}
    >
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4",
        isRecent
          ? "border-l-chart-1 bg-gradient-to-r from-chart-1/5 to-transparent"
          : "border-l-primary",
      )}
      >
        <CardHeader className="pb-4">
          <div className="space-y-3">
            {/* Main title and cost */}
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-foreground leading-tight">
                    {hasMultipleServices
                      ? `Complete Service Package`
                      : getServiceTypeLabel(entry.serviceTypes[0])}
                  </h3>
                  {/* Recent badge positioned next to title */}
                  {isRecent && (
                    <div className="flex items-center gap-1 bg-chart-1/10 text-chart-1 px-2 py-1 rounded-full text-xs font-medium border border-chart-1/20">
                      <TrendingUpIcon className="h-3 w-3" />
                      Recent
                    </div>
                  )}
                </div>
                {hasMultipleServices && (
                  <p className="text-sm text-muted-foreground">
                    {entry.serviceTypes.length}
                    {" "}
                    services performed
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Cost badge */}
                {entry.cost && (
                  <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-semibold text-sm shadow-sm">
                    {formatCost(entry.cost)}
                  </div>
                )}

                {/* Actions dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DeleteMaintenanceDialog entry={entry}>
                      <DropdownMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={e => e.preventDefault()}
                      >
                        Delete Entry
                      </DropdownMenuItem>
                    </DeleteMaintenanceDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Service types badges - only show for multiple services */}
            {hasMultipleServices && (
              <div className="flex flex-wrap gap-2">
                {entry.serviceTypes.map(serviceType => (
                  <ServiceTypeBadge key={serviceType} serviceType={serviceType} />
                ))}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Date and time info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {formatServiceDate(entry.serviceDate)}
                </p>
                <p className="text-xs text-muted-foreground">Service Date</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-lg">
                <ClockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{relativeTime}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Workshop and odometer information */}
          <div className="space-y-3">
            <div className={cn(
              "grid gap-4",
              entry.odometer ? "grid-cols-2" : "grid-cols-1",
            )}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-chart-4/10 rounded-lg">
                  <WrenchIcon className="h-4 w-4 text-chart-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">Service Location</h4>
                  <p className="text-sm text-muted-foreground">{getWorkshopDisplayName(entry)}</p>
                </div>
              </div>

              {entry.odometer && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-chart-3/10 rounded-lg">
                    <GaugeIcon className="h-4 w-4 text-chart-3" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">Odometer Reading</h4>
                    <p className="text-sm text-muted-foreground">{formatOdometer(entry.odometer)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Workshop contact details */}
            {entry.workshop && (entry.workshop.phone || entry.workshop.email) && (
              <div className="flex flex-wrap gap-4 ml-10">
                {entry.workshop.phone && (
                  <a
                    href={`tel:${entry.workshop.phone}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    <PhoneIcon className="h-3 w-3" />
                    <span>{entry.workshop.phone}</span>
                  </a>
                )}
                {entry.workshop.email && (
                  <a
                    href={`mailto:${entry.workshop.email}`}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary cursor-pointer transition-colors"
                  >
                    <MailIcon className="h-3 w-3" />
                    <span>{entry.workshop.email}</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Notes section - more prominent presentation */}
          {entry.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-chart-2/10 rounded-lg">
                    <StickyNoteIcon className="h-4 w-4 text-chart-2" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground">Service Notes</h4>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                  <blockquote className="border-l-4 border-chart-2 bg-chart-2/5 pl-4 py-3 italic">
                    <p className="text-sm text-foreground leading-relaxed">
                      "
                      {entry.notes}
                      "
                    </p>
                  </blockquote>
                </div>
              </div>
            </>
          )}

          {/* Metadata footer */}
          <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground border-t border-border bg-muted/30 -mx-6 px-6 py-3 mt-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-chart-1 rounded-full"></span>
              Added
              {" "}
              {new Date(entry.createdAt).toLocaleDateString()}
            </span>
            {entry.createdAt !== entry.updatedAt && (
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Updated
                {" "}
                {new Date(entry.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
