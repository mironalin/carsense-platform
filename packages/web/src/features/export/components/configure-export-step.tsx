import { Card } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";

import { useConfigureExport } from "../hooks/use-configure-export";
import { ConfigureExportContent } from "./configure/configure-export-content";
import { ConfigureExportFooter } from "./configure/configure-export-footer";
import { ConfigureExportTabs } from "./configure/configure-export-tabs";

export function ConfigureExportStep() {
  const {
    tabs,
    selectedTab,
    setSelectedTab,
    exportFormat,
    columns,
    dateRange,
    includeAllData,
    isLoading,
    availableDateRange,
    handleBack,
    handleNext,
    handleColumnToggle,
    handleSelectAllColumns,
    handleClearAllColumns,
    setLocalExportFormat,
    setLocalDateRange,
    setLocalIncludeAllData,
  } = useConfigureExport();

  return (
    <div className="space-y-6">
      <Card>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <ConfigureExportTabs
            selectedTab={selectedTab}
            tabs={tabs}
          />

          <ConfigureExportContent
            selectedTab={selectedTab}
            exportFormat={exportFormat}
            columns={columns}
            dateRange={dateRange}
            includeAllData={includeAllData}
            isLoading={isLoading}
            availableDateRange={availableDateRange}
            onFormatChange={setLocalExportFormat}
            onColumnToggle={handleColumnToggle}
            onSelectAllColumns={handleSelectAllColumns}
            onClearAllColumns={handleClearAllColumns}
            onDateRangeChange={setLocalDateRange}
            onIncludeAllDataChange={setLocalIncludeAllData}
          />

          <ConfigureExportFooter
            onBack={handleBack}
            onNext={handleNext}
          />
        </Tabs>
      </Card>
    </div>
  );
}
