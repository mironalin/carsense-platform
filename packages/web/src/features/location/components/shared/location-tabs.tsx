import { ChartBar, PlayIcon } from "lucide-react";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function LocationTabs() {
  return (
    <TabsList className="h-9">
      <TabsTrigger value="overview">
        <ChartBar className="mr-1 h-3 w-3" />
        Overview
      </TabsTrigger>
      <TabsTrigger value="playback">
        <PlayIcon className="mr-1 h-3 w-3" />
        Playback
      </TabsTrigger>
    </TabsList>
  );
} 