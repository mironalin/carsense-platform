import { AnimatePresence } from "framer-motion";

import type { ConfigureExportContentProps } from "../../types";

import { AnimateHeight } from "../animate-height";
import { ColumnOptions } from "../column-options";
import { DateRangeOptions } from "../date-range-options";
import { FormatOptions } from "../format-options";

export function ConfigureExportContent({
  selectedTab,
  exportFormat,
  columns,
  dateRange,
  includeAllData,
  isLoading,
  availableDateRange,
  onFormatChange,
  onColumnToggle,
  onSelectAllColumns,
  onClearAllColumns,
  onDateRangeChange,
  onIncludeAllDataChange,
}: ConfigureExportContentProps) {
  return (
    <div className="p-6">
      <AnimateHeight>
        <AnimatePresence mode="wait">
          {selectedTab === "format" && (
            <FormatOptions
              exportFormat={exportFormat}
              onFormatChange={onFormatChange}
            />
          )}

          {selectedTab === "columns" && (
            <ColumnOptions
              columns={columns}
              onColumnToggle={onColumnToggle}
              onSelectAll={onSelectAllColumns}
              onClearAll={onClearAllColumns}
            />
          )}

          {selectedTab === "daterange" && (
            <DateRangeOptions
              isLoading={isLoading}
              availableDateRange={availableDateRange}
              dateRange={dateRange}
              includeAllData={includeAllData}
              onDateRangeChange={onDateRangeChange}
              onIncludeAllDataChange={onIncludeAllDataChange}
            />
          )}
        </AnimatePresence>
      </AnimateHeight>
    </div>
  );
}
