import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { AlertTriangle, CalendarDays, Car, Clock, Search } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { DiagnosticsListProps } from "../types";

import { useGetVehicleDiagnostics } from "../api/use-get-vehicle-diagnostics";
import { cardVariants, listItemVariants, listVariants } from "../utils/animation-variants";
import { DiagnosticsListSkeleton } from "./skeleton/diagnostics-list-skeleton";

export function DiagnosticsList({
  vehicleId,
  onSelectDiagnostic,
  selectedDiagnosticId,
  isLoading: isLoadingProp,
  error: errorProp,
}: DiagnosticsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch diagnostics if not provided externally
  const {
    data: diagnostics,
    isLoading: isLoadingData,
    error: fetchError,
  } = useGetVehicleDiagnostics(vehicleId);

  const isLoading = isLoadingProp || isLoadingData;
  const error = errorProp || fetchError;

  // Filter diagnostics based on search term
  const filteredDiagnostics = diagnostics?.filter((diagnostic) => {
    const searchLower = searchTerm.toLowerCase();
    const dateStr = new Date(diagnostic.createdAt).toLocaleDateString();

    return (
      dateStr.toLowerCase().includes(searchLower)
      || diagnostic.odometer.toString().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  if (isLoading) {
    return <DiagnosticsListSkeleton />;
  }

  if (error) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Card className="w-full h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle>Diagnostics</CardTitle>
            <CardDescription>Error loading diagnostics</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-destructive" />
              <p>Failed to load diagnostics.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full h-[500px] flex flex-col overflow-hidden">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Diagnostic Sessions</CardTitle>
              <CardDescription>
                {diagnostics?.length || 0}
                {" "}
                sessions found
              </CardDescription>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by date or odometer..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[350px]">
            <motion.div
              className="space-y-2 px-6"
              variants={listVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {filteredDiagnostics?.length === 0
                ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No diagnostic sessions found
                    </p>
                  )
                : (
                    filteredDiagnostics?.map((diagnostic, index) => (
                      <motion.div
                        key={diagnostic.uuid}
                        variants={listItemVariants}
                        custom={index}
                        className="relative"
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={
                                  selectedDiagnosticId === diagnostic.uuid
                                    ? "default"
                                    : "outline"
                                }
                                className={`
                                  w-full justify-start text-left h-auto py-4 px-4
                                  ${selectedDiagnosticId === diagnostic.uuid ? "border-primary shadow-sm" : ""}
                                  transition-all duration-200 hover:shadow-md
                                `}
                                onClick={() => onSelectDiagnostic(diagnostic.uuid)}
                              >
                                <div className="grid grid-cols-[auto_1fr] gap-4 w-full">
                                  <div className={`
                                    rounded-full w-10 h-10 flex items-center justify-center
                                    ${selectedDiagnosticId === diagnostic.uuid ? "bg-primary/10" : "bg-muted"}
                                  `}
                                  >
                                    <CalendarDays className={`h-5 w-5 
                                      ${selectedDiagnosticId === diagnostic.uuid ? "text-primary" : "text-muted-foreground"}
                                    `}
                                    />
                                  </div>
                                  <div className="flex flex-col w-full">
                                    <div className="flex justify-between items-center">
                                      <span className="font-medium text-base">
                                        {new Date(diagnostic.createdAt).toLocaleDateString()}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(diagnostic.createdAt), {
                                          addSuffix: true,
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mt-1 items-center">
                                      <div className="flex items-center gap-2">
                                        <Car className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                          {diagnostic.odometer.toLocaleString()}
                                          {" "}
                                          mi
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(diagnostic.createdAt).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                              <div className="space-y-1">
                                <p>
                                  Diagnostic session recorded on
                                  {new Date(diagnostic.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Odometer:
                                  {" "}
                                  {diagnostic.odometer.toLocaleString()}
                                  {" "}
                                  mi
                                </p>
                                {diagnostic.notes && (
                                  <p className="text-xs border-t pt-1 mt-1">
                                    Note:
                                    {" "}
                                    {diagnostic.notes}
                                  </p>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    ))
                  )}
            </motion.div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="py-3">
          <div className="text-xs text-muted-foreground w-full text-center">
            Select a diagnostic session to view its DTCs
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
