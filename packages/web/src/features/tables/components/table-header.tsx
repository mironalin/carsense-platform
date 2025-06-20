import type { Table } from "@tanstack/react-table";

import { ArrowDownUp, ChevronDown, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getCategoryIcon } from "@/features/sensors/utils/sensor-categories";

import type { SensorData } from "../types";

type TableHeaderControlsProps = {
  table: Table<SensorData>;
  title?: string;
  category?: string;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  resetColumnOrder: () => void;
};

export function TableHeaderControls({
  table,
  title = "Sensor Data",
  category,
  globalFilter,
  setGlobalFilter,
  resetColumnOrder,
}: TableHeaderControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          {getCategoryIcon(category || "Unknown", "h-4 w-4")}
          <span className="text-lg font-semibold">
            {title}
          </span>
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium hidden sm:inline">Search:</span>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search all columns..."
                value={globalFilter ?? ""}
                onChange={e => setGlobalFilter(e.target.value)}
                className="pl-8 h-8 w-full sm:w-[180px] md:w-[250px]"
              />
              {globalFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-6 w-6 p-0"
                  onClick={() => setGlobalFilter("")}
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ChevronDown className="mr-2 h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={resetColumnOrder} className="gap-1.5">
                <ArrowDownUp className="h-3.5 w-3.5" />
                Reset Column Order
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
