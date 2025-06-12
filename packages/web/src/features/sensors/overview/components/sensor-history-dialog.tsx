import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { SensorHistoryDialogProps } from "../types";

export function SensorHistoryDialog({ title, readings, unit }: SensorHistoryDialogProps) {
  if (!readings || readings.length === 0) {
    return null;
  }

  // Sort readings by timestamp (newest first)
  const sortedReadings = [...readings]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs h-7 px-2 gap-1"
        >
          <History className="size-3" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {title}
            {" "}
            History
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-3">
          <div className="space-y-2">
            {sortedReadings.map((reading, index) => (
              <div
                key={index}
                className="flex justify-between p-2 border rounded-md text-sm"
                style={{
                  animationDelay: `${index * 30}ms`,
                  animation: "fadeIn 300ms forwards",
                }}
              >
                <div className="font-medium">
                  {reading.value !== null ? `${reading.value} ${unit}` : "N/A"}
                </div>
                <div className="text-muted-foreground">
                  {new Date(reading.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
