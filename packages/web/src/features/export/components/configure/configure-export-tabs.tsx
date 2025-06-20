import { CardHeader } from "@/components/ui/card";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TabSlider } from "../tab-slider";

type ConfigureExportTabsProps = {
  selectedTab: string;
  tabs: string[];
};

export function ConfigureExportTabs({ selectedTab, tabs }: ConfigureExportTabsProps) {
  return (
    <CardHeader>
      <TabsList className="grid w-full grid-cols-3 relative">
        <TabSlider selectedTab={selectedTab} tabs={tabs} />
        <TabsTrigger
          value="format"
          className="relative z-10"
        >
          Export Format
        </TabsTrigger>
        <TabsTrigger
          value="columns"
          className="relative z-10"
        >
          Column Selection
        </TabsTrigger>
        <TabsTrigger
          value="daterange"
          className="relative z-10"
        >
          Date Range
        </TabsTrigger>
      </TabsList>
    </CardHeader>
  );
}
