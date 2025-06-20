import { format } from "date-fns";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { listAnimation, listItemAnimation } from "../utils/animation-variants";
import { AnimateHeight } from "./animate-height";

type DateRangeOptionsProps = {
  isLoading: boolean;
  availableDateRange: {
    min: Date | null;
    max: Date | null;
  };
  dateRange: {
    from: Date;
    to: Date;
  };
  includeAllData: boolean;
  onDateRangeChange: (range: { from: Date; to: Date }) => void;
  onIncludeAllDataChange: (include: boolean) => void;
};

export function DateRangeOptions({
  isLoading,
  availableDateRange,
  dateRange,
  includeAllData,
  onDateRangeChange,
  onIncludeAllDataChange,
}: DateRangeOptionsProps) {
  return (
    <motion.div
      key="daterange-tab"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <CardTitle className="text-lg">Set Data Range</CardTitle>

      {isLoading
        ? (
            <div className="py-4 text-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-4 w-32 bg-muted rounded mb-2"></div>
                <div className="h-3 w-24 bg-muted rounded"></div>
              </div>
            </div>
          )
        : (
            <>
              {availableDateRange.min && availableDateRange.max && (
                <div className="mb-4 p-3 bg-muted/30 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Available data range:
                    {" "}
                    {format(availableDateRange.min, "MMM d, yyyy")}
                    {" "}
                    to
                    {" "}
                    {format(availableDateRange.max, "MMM d, yyyy")}
                  </p>
                </div>
              )}

              <div className="grid gap-4">
                <motion.div
                  className="grid grid-cols-1 gap-1.5"
                  variants={listAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div
                    variants={listItemAnimation}
                    className={`
                  flex items-center justify-between px-4 py-3 rounded overflow-hidden 
                  ${includeAllData
              ? "bg-primary/10 border border-primary/30"
              : "bg-muted/40 border border-muted hover:bg-muted/60"}
                  transition-colors cursor-pointer relative
                `}
                    onClick={() => onIncludeAllDataChange(true)}
                    whileHover={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderColor: includeAllData ? "var(--primary)" : "var(--border)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">Include all available data</span>
                    <motion.div
                      className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                      animate={{
                        backgroundColor: includeAllData ? "var(--primary)" : "rgba(125,125,125,0.3)",
                        scale: includeAllData ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <motion.div
                    variants={listItemAnimation}
                    className={`
                  flex items-center justify-between px-4 py-3 rounded overflow-hidden 
                  ${!includeAllData
              ? "bg-primary/10 border border-primary/30"
              : "bg-muted/40 border border-muted hover:bg-muted/60"}
                  transition-colors cursor-pointer relative
                `}
                    onClick={() => onIncludeAllDataChange(false)}
                    whileHover={{
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      borderColor: !includeAllData ? "var(--primary)" : "var(--border)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">Specify date range</span>
                    <motion.div
                      className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                      animate={{
                        backgroundColor: !includeAllData ? "var(--primary)" : "rgba(125,125,125,0.3)",
                        scale: !includeAllData ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </motion.div>

                <AnimateHeight>
                  {!includeAllData && (
                    <motion.div
                      className="grid grid-cols-2 gap-4 pt-2"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.15,
                          },
                        },
                      }}
                    >
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: -20 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.4 },
                          },
                        }}
                      >
                        <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn("w-full justify-start text-left font-normal")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from
                                ? (
                                    format(dateRange.from, "PPP")
                                  )
                                : (
                                    <span>Pick a date</span>
                                  )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.from}
                              onSelect={date =>
                                onDateRangeChange({ ...dateRange, from: date || dateRange.from })}
                              initialFocus
                              disabled={date =>
                                availableDateRange.min && availableDateRange.max
                                  ? date < availableDateRange.min || date > availableDateRange.max
                                  : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>

                      <motion.div
                        variants={{
                          hidden: { opacity: 0, x: 20 },
                          visible: {
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.4 },
                          },
                        }}
                      >
                        <p className="text-sm text-muted-foreground mb-2">End Date</p>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn("w-full justify-start text-left font-normal")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.to
                                ? (
                                    format(dateRange.to, "PPP")
                                  )
                                : (
                                    <span>Pick a date</span>
                                  )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dateRange.to}
                              onSelect={date =>
                                onDateRangeChange({ ...dateRange, to: date || dateRange.to })}
                              initialFocus
                              disabled={date =>
                                availableDateRange.min && availableDateRange.max
                                  ? date < availableDateRange.min
                                  || date > availableDateRange.max
                                  || date < dateRange.from
                                  : false}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimateHeight>
              </div>
            </>
          )}
    </motion.div>
  );
}
