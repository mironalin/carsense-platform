import { Check, ChevronDown, Clock } from "lucide-react";

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

type DiagnosticSession = {
  uuid: string;
  createdAt: string;
  odometer: number;
  notes?: string | null;
};

type DiagnosticSessionSelectorProps = {
  sessions: DiagnosticSession[];
  selectedSession: string | null;
  onSessionChange: (sessionId: string) => void;
  isLoading: boolean;
};

export function DiagnosticSessionSelector({
  sessions,
  selectedSession,
  onSessionChange,
  isLoading,
}: DiagnosticSessionSelectorProps) {
  // Find the selected session details
  const selectedSessionDetails = selectedSession
    ? sessions.find(session => session.uuid === selectedSession)
    : null;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-[250px]" />;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[250px] justify-between"
        >
          {selectedSessionDetails
            ? (
                <div className="flex items-center gap-2 truncate">
                  <Clock className="h-4 w-4 shrink-0 opacity-50" />
                  <span className="truncate">
                    {formatDate(selectedSessionDetails.createdAt)}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    (
                    {selectedSessionDetails.odometer}
                    {" "}
                    km)
                  </span>
                </div>
              )
            : (
                <span>Select diagnostic session</span>
              )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search sessions..." />
          <CommandEmpty>No sessions found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {sessions.map(session => (
              <CommandItem
                key={session.uuid}
                value={session.uuid}
                onSelect={() => onSessionChange(session.uuid)}
              >
                <div className="flex w-full flex-col truncate">
                  <div className="flex items-center justify-between">
                    <span className="truncate">
                      {formatDate(session.createdAt)}
                    </span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedSession === session.uuid
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>
                      Odometer:
                      {" "}
                      {session.odometer}
                      {" "}
                      km
                    </span>
                    {session.notes && (
                      <span className="truncate">
                        Notes:
                        {session.notes}
                      </span>
                    )}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
