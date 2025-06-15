import { Check, ChevronDown, Clock, X } from "lucide-react";
import { useState } from "react";

import type { DiagnosticSession, MultiDiagnosticSessionSelectorProps } from "@/features/charts/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function MultiDiagnosticSessionSelector({
  sessions,
  selectedSessions,
  onSessionsChange,
  isLoading,
  maxSelections = 3,
}: MultiDiagnosticSessionSelectorProps) {
  const [open, setOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  // Toggle a session selection
  const toggleSession = (sessionId: string) => {
    // If already selected, remove it
    if (selectedSessions.includes(sessionId)) {
      onSessionsChange(selectedSessions.filter(id => id !== sessionId));
      return;
    }

    // If max selections reached, show a warning or replace the oldest selection
    if (selectedSessions.length >= maxSelections) {
      // Remove the first (oldest) selection and add the new one
      const newSelections = [...selectedSessions.slice(1), sessionId];
      onSessionsChange(newSelections);
      return;
    }

    // Otherwise, add the new selection
    onSessionsChange([...selectedSessions, sessionId]);
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-[180px]" />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="sm"
          className="h-9 gap-1 w-[180px]"
        >
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {selectedSessions.length > 0
              ? `${selectedSessions.length}/${maxSelections} sessions`
              : "Select sessions"}
          </span>
          <span className="sm:hidden">
            {selectedSessions.length > 0
              ? `${selectedSessions.length}/${maxSelections}`
              : "Select"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 ml-auto" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search sessions..." className="h-9" />
          <CommandEmpty>No sessions found.</CommandEmpty>
          <CommandGroup className="max-h-[250px] overflow-auto">
            {sessions.map(session => (
              <CommandItem
                key={session.uuid}
                value={session.uuid}
                onSelect={() => {
                  toggleSession(session.uuid);
                  // Don't close the popover when selecting
                }}
                className="flex items-center justify-between py-1.5"
              >
                <div className="flex flex-col truncate text-sm">
                  <div className="flex items-center justify-between">
                    <span className="truncate font-medium">
                      {formatDate(session.createdAt)}
                    </span>
                    <Check
                      className={cn(
                        "ml-2 h-3.5 w-3.5",
                        selectedSessions.includes(session.uuid)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {session.odometer}
                    {" "}
                    km
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Separate component to display selected sessions
export function SelectedSessionsBadges({
  sessions,
  selectedSessions,
  onRemoveSession,
  sessionColors = ["#3b82f6", "#ef4444", "#8b5cf6", "#10b981", "#f59e0b"],
}: {
  sessions: DiagnosticSession[];
  selectedSessions: string[];
  onRemoveSession: (sessionId: string) => void;
  sessionColors?: string[];
}) {
  // Format date for badge display (more compact)
  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // Find selected session details
  const selectedSessionDetails = sessions.filter(
    session => selectedSessions.includes(session.uuid),
  );

  if (selectedSessionDetails.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border bg-card p-2">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>Selected diagnostic sessions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {selectedSessionDetails.map((session, index) => {
          // Get the color for this session
          const sessionColor = sessionColors[index % sessionColors.length];

          return (
            <Badge
              key={session.uuid}
              variant="outline"
              className="flex h-8 items-center gap-1.5 px-2.5 text-xs border-l-4"
              style={{ borderLeftColor: sessionColor }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: sessionColor }}
                />
                <div className="flex flex-col">
                  <span className="font-medium">{formatShortDate(session.createdAt)}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {session.odometer}
                    {" "}
                    km
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1 hover:bg-muted"
                onClick={() => onRemoveSession(session.uuid)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove</span>
              </Button>
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
