import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { convertSensorDataToCsv, downloadCsv } from "@/features/tables/utils/export-utils";

import type { SensorData } from "../types";

type ExportButtonProps = {
  data: SensorData[];
  isDisabled?: boolean;
};

export function ExportButton({ data, isDisabled = false }: ExportButtonProps) {
  const handleExportCsv = () => {
    const csvData = convertSensorDataToCsv(data);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
    downloadCsv(csvData, `sensor-data-${timestamp}.csv`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled || data.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCsv}>
          Export to CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
