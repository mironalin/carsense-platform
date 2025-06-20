import type { ColumnDef } from "@tanstack/react-table";

import {
  ArrowUpDown,
  ClipboardList,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategoryIcon } from "@/features/sensors/utils/sensor-categories";

import type { SensorData } from "../types";

import { convertSensorDataToCsv, downloadCsv } from "../utils/export-utils";

// Handle row actions
function handleExportSensor(sensor: SensorData) {
  const singleSensorData = [sensor];
  const csvData = convertSensorDataToCsv(singleSensorData);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
  const filename = `sensor-${sensor.pid || sensor.name || "unknown"}-${timestamp}.csv`;
  downloadCsv(csvData, filename);
  toast.success(`Exported data for ${sensor.name || "sensor"}`);
}

// Handle copying sensor details to clipboard
function handleCopyDetails(sensor: SensorData) {
  // Create a formatted text with the sensor details
  const formattedDetails = [
    `Sensor: ${sensor.name || "N/A"}`,
    `PID: ${sensor.pid || "N/A"}`,
    `Value: ${sensor.value !== undefined && sensor.value !== null ? `${sensor.value} ${sensor.unit || ""}` : "N/A"}`,
    `Category: ${sensor.category || "N/A"}`,
    `Timestamp: ${sensor.timestamp ? new Date(sensor.timestamp).toLocaleString() : "N/A"}`,
    sensor.diagnosticUUID ? `Diagnostic UUID: ${sensor.diagnosticUUID}` : "",
    sensor.snapshotUUID ? `Snapshot UUID: ${sensor.snapshotUUID}` : "",
  ].filter(Boolean).join("\n");

  // Copy to clipboard
  navigator.clipboard.writeText(formattedDetails)
    .then(() => {
      toast.success(`Copied details for ${sensor.name || "sensor"}`);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy to clipboard");
    });
}

// Define columns with enhanced features
export function getSensorTableColumns(): ColumnDef<SensorData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          className="mx-auto"
          checked={
            table.getIsAllPageRowsSelected()
            || (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mx-auto"
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "timestamp",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            <span>Timestamp</span>
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <span className="ml-1 text-muted-foreground/50 text-xs hidden group-hover:inline">↔</span>
        </div>
      ),
      cell: ({ row }) => {
        const timestamp = row.getValue("timestamp") as string;
        return timestamp ? new Date(timestamp).toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            <span>Sensor Name</span>
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <span className="ml-1 text-muted-foreground/50 text-xs hidden group-hover:inline">↔</span>
        </div>
      ),
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        return (
          <div className="font-medium">{name || "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "value",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            <span>Value</span>
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <span className="ml-1 text-muted-foreground/50 text-xs hidden group-hover:inline">↔</span>
        </div>
      ),
      cell: ({ row }) => {
        const value = row.getValue("value");
        const unit = row.original.unit;
        return (
          <div className="font-medium">
            {value !== undefined && value !== null ? `${value} ${unit || ""}` : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            <span>Category</span>
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
          </Button>
          <span className="ml-1 text-muted-foreground/50 text-xs hidden group-hover:inline">↔</span>
        </div>
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        if (!category)
          return "N/A";

        return (
          <div className="flex items-center gap-1.5">
            <div className="text-muted-foreground">
              {getCategoryIcon(category, "h-3.5 w-3.5")}
            </div>
            <Badge variant="outline" className="px-2 py-0.5 text-xs">
              {category}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const sensor = row.original;

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem onClick={() => handleExportSensor(sensor)}>
                  <Download className="mr-2 h-3.5 w-3.5" />
                  Export Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCopyDetails(sensor)}>
                  <ClipboardList className="mr-2 h-3.5 w-3.5" />
                  Copy Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableHiding: false,
    },
  ];
}
