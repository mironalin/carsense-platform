import { motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Clipboard,
  Clock,
  Info,
  Loader2,
  Shield,
  Tag,
  Zap,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import type { DiagnosticDTCWithInfo } from "../types";

import { useGetDTCByCode } from "../api/use-get-dtc-by-code";
import { badgeVariants, dtcCardVariants } from "../utils/animation-variants";
import { DTCSeverityUpdater, useDTCSeverity } from "./dtc-severity-context";

type DTCCardProps = {
  dtc: DiagnosticDTCWithInfo;
  index: number;
};

export function DTCCard({ dtc, index }: DTCCardProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { getDTCSeverity } = useDTCSeverity();

  // Fetch additional DTC information from the library
  const { data: dtcInfo, isLoading: isLoadingDtcInfo } = useGetDTCByCode(dtc.code);

  // Get severity from context or fallback to local data
  const severity = getDTCSeverity(dtc.uuid) || dtcInfo?.severity || dtc.severity;

  // Combine local DTC data with library data
  const combinedDtc = {
    ...dtc,
    description: dtcInfo?.description || dtc.description,
    severity,
    affectedSystem: dtcInfo?.affectedSystem || dtc.affectedSystem,
    category: dtcInfo?.category || dtc.category,
  };

  // Register this DTC with the severity context
  useEffect(() => {
    // This effect is handled by the DTCSeverityUpdater component
  }, [dtc, dtcInfo]);

  // Helper to get severity icon
  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "low":
        return <Info className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  // Helper to get severity badge
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="outline" className="border-warning text-warning">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get date formatted
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  // Get time elapsed since creation
  const getTimeElapsed = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    }

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high": return "from-destructive/20 to-destructive/5";
      case "medium": return "from-warning/20 to-warning/5";
      case "low": return "from-primary/10 to-primary/5";
      default: return "from-muted/20 to-muted/5";
    }
  };

  return (
    <>
      <DTCSeverityUpdater dtc={dtc} />
      <motion.div
        custom={index}
        variants={dtcCardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="h-full"
      >
        <Card
          className={`border h-full flex flex-col ${
            combinedDtc.severity === "high"
              ? "border-destructive shadow-lg shadow-destructive/10"
              : combinedDtc.severity === "medium"
                ? "border-warning shadow-lg shadow-warning/10"
                : "border-primary/20 shadow-lg"
          } overflow-hidden`}
        >
          <div className={`bg-gradient-to-b ${getSeverityColor(combinedDtc.severity)}`}>
            <CardContent className="p-5 flex-grow space-y-5" ref={contentRef}>
              {/* Card Header - Code and Badges */}
              <div className="flex flex-col space-y-3">
                {/* DTC Code */}
                <div className="flex justify-center mb-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.span
                          initial={{ scale: 0.95, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay: index * 0.05 + 0.2,
                          }}
                          className={`font-bold text-2xl tracking-wide cursor-default px-3 py-1 rounded-md shadow-sm border inline-block ${
                            combinedDtc.severity === "high"
                              ? "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                              : combinedDtc.severity === "medium"
                                ? "bg-warning/10 border-warning/30 text-foreground"
                                : "bg-background/80 border-border/50 text-foreground"
                          }`}
                        >
                          {combinedDtc.code}
                        </motion.span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Diagnostic Trouble Code</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Status and Severity */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 + 0.1 }}
                      className={`p-2 rounded-full ${
                        combinedDtc.severity === "high"
                          ? "bg-destructive/20"
                          : combinedDtc.severity === "medium"
                            ? "bg-warning/20"
                            : "bg-muted/50"
                      }`}
                    >
                      {isLoadingDtcInfo
                        ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          )
                        : (
                            getSeverityIcon(combinedDtc.severity)
                          )}
                    </motion.div>
                    {combinedDtc.severity && (
                      <motion.div variants={badgeVariants} initial="initial" animate="animate">
                        {getSeverityBadge(combinedDtc.severity)}
                      </motion.div>
                    )}
                  </div>
                  {combinedDtc.confirmed && (
                    <motion.div variants={badgeVariants} initial="initial" animate="animate">
                      <Badge variant="default">
                        <Clipboard className="mr-1 h-3 w-3" />
                        Confirmed
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Description */}
              {combinedDtc.description && (
                <div className="pt-1">
                  <Separator className="mb-3" />
                  <div className="bg-background/80 p-3 rounded-md">
                    <p className="text-sm font-medium">
                      {combinedDtc.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-y-3 bg-background/60 p-3 rounded-md">
                {combinedDtc.affectedSystem && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Zap className="h-3.5 w-3.5" />
                      <span>Affected System</span>
                    </div>
                    <p className="font-medium text-sm">{combinedDtc.affectedSystem}</p>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Detected</span>
                    </div>
                    <p className="font-medium text-sm">{getFormattedDate(combinedDtc.createdAt)}</p>
                  </div>

                  {combinedDtc.category && (
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
                        <Tag className="h-3.5 w-3.5" />
                        <span>Category</span>
                      </div>
                      <p className="font-medium text-sm">{combinedDtc.category}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              {/* <div className={`rounded-md p-3 ${
                combinedDtc.severity === "high"
                  ? "bg-destructive/10 border border-destructive/20"
                  : combinedDtc.severity === "medium"
                    ? "bg-warning/10 border border-warning/20"
                    : "bg-primary/5 border border-primary/10"
              }`}
              >
                <div className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Recommendation</span>
                </div>
                <div className="text-sm">
                  {combinedDtc.severity === "high"
                    ? "Immediate service is recommended. This issue could affect vehicle performance and safety."
                    : combinedDtc.severity === "medium"
                      ? "Service is recommended in the near future. Monitor vehicle performance for any changes."
                      : "Standard service is recommended at your convenience. This is a minor issue."}
                </div>
              </div> */}

              {/* Creation Time */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(combinedDtc.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{getTimeElapsed(combinedDtc.createdAt)}</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </>
  );
}
