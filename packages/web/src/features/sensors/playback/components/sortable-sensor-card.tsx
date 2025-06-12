import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import type { PlaybackSensor } from "../types";

import { SensorCard } from "./sensor-card";

type SortableSensorCardProps = {
  sensor: PlaybackSensor;
  value: number;
  hasValue: boolean;
  id: string;
};

export function SortableSensorCard({ sensor, value, hasValue, id }: SortableSensorCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: () => false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-manipulation h-full cursor-grab active:cursor-grabbing",
        isDragging && "opacity-70",
      )}
    >
      <SensorCard
        isActive={isDragging}
        sensor={sensor}
        value={value}
        hasValue={hasValue}
        gripIcon={<GripIcon className="h-5 w-5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />}
      />
    </div>
  );
}
