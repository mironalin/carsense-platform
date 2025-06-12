import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { SnapshotNavigationProps } from "../types";

export function SnapshotNavigation({
  snapshots,
  currentSnapshotIndex,
  onSnapshotChange,
}: SnapshotNavigationProps) {
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const currentSnapshot = snapshots[currentSnapshotIndex];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentSnapshotIndex <= 0}
          onClick={() => onSnapshotChange(currentSnapshotIndex - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous snapshot</span>
        </Button>

        <Select
          value={currentSnapshot?.uuid || ""}
          onValueChange={(value) => {
            const index = snapshots.findIndex(s => s.uuid === value);
            if (index !== -1) {
              onSnapshotChange(index);
            }
          }}
        >
          <SelectTrigger className="flex-1 h-8 text-xs">
            <SelectValue placeholder="Select snapshot">
              {currentSnapshot
                ? `Snapshot ${currentSnapshotIndex + 1} of ${snapshots.length}`
                : "No snapshots available"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {snapshots.map((snapshot, index) => (
              <SelectItem key={snapshot.uuid} value={snapshot.uuid} className="text-xs">
                Snapshot
                {" "}
                {index + 1}
                {" "}
                -
                {" "}
                {formatTimestamp(snapshot.createdAt)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentSnapshotIndex >= snapshots.length - 1}
          onClick={() => onSnapshotChange(currentSnapshotIndex + 1)}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next snapshot</span>
        </Button>
      </div>

      {currentSnapshot && (
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            Snapshot taken:
            {" "}
            {formatTimestamp(currentSnapshot.createdAt)}
          </span>
        </div>
      )}
    </div>
  );
}
