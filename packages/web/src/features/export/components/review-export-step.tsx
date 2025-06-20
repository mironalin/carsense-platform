import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetDiagnosticData } from "../api/use-get-diagnostic-data";
import { ExportStepId } from "../types";
import { convertDiagnosticsDataToCsv, downloadCsv, downloadJson, downloadXlsx } from "../utils/export-utils";
import { useExport } from "./export-context";
import { ColumnsSummary } from "./review/columns-summary";
import { DateRangeSummary } from "./review/date-range-summary";
import { DiagnosticsSummary } from "./review/diagnostics-summary";
import { ExportActionFooter } from "./review/export-action-footer";
import { ExportStatus } from "./review/export-status";
import { FileNameInput } from "./review/file-name-input";
import { FormatSummary } from "./review/format-summary";

export function ReviewExportStep() {
  const { vehicleId } = useParams({ from: "/_authenticated/app/$vehicleId/export/" });
  const { selection, setCurrentStep } = useExport();
  const [fileName, setFileName] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { data: diagnosticResponse, isLoading, error } = useGetDiagnosticData({
    vehicleId,
    diagnosticIds: selection.diagnostics.map(diag => diag.id),
    startDate: selection.dateRange?.startDate || undefined,
    endDate: selection.dateRange?.endDate || undefined,
    includeAllData: selection.includeAllData || false,
  });

  // Extract the data array from the response
  const diagnosticData = diagnosticResponse?.data || [];

  const handleBack = () => {
    setCurrentStep(ExportStepId.ConfigureExport);
  };

  const handleExport = () => {
    if (!diagnosticData || diagnosticData.length === 0)
      return;

    setIsExporting(true);

    try {
      // Use custom filename if provided, otherwise use default
      const currentTimestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
      const fileBaseName = fileName.trim() ? fileName.trim() : `vehicle-diagnostics-${currentTimestamp}`;

      let exportSuccess = true;
      let csvData: string;

      switch (selection.format) {
        case "csv":
          csvData = convertDiagnosticsDataToCsv(diagnosticData, selection.columns.filter(col => col.selected));
          downloadCsv(csvData, `${fileBaseName}.csv`);
          break;
        case "xlsx":
          exportSuccess = downloadXlsx(
            diagnosticData,
            selection.columns.filter(col => col.selected),
            `${fileBaseName}.xlsx`,
          );
          if (!exportSuccess) {
            toast.error("There was a problem creating the Excel file. Try a different format or check your data.");
          }
          break;
        case "json":
          downloadJson(
            diagnosticData,
            selection.columns.filter(col => col.selected),
            `${fileBaseName}.json`,
          );
          break;
      }

      if (exportSuccess) {
        toast.success(`Your file has been exported as ${fileBaseName}.${selection.format}`);
      }
    }
    catch (err) {
      console.error("Export error:", err);
      toast.error("An unexpected error occurred during export. Please try again.");
    }
    finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 animate-transition">
      <div className="animate-transition">
        <Card>
          <CardHeader>
            <CardTitle>Export Summary</CardTitle>
          </CardHeader>
          <div className="animate-transition">
            <CardContent className="space-y-6">
              <DiagnosticsSummary diagnostics={selection.diagnostics} />

              <Separator />

              <FormatSummary format={selection.format} />

              <Separator />

              <ColumnsSummary columns={selection.columns} />

              <Separator />

              <DateRangeSummary
                includeAllData={selection.includeAllData || false}
                dateRange={selection.dateRange}
              />

              <Separator />

              <FileNameInput
                fileName={fileName}
                onChange={setFileName}
                format={selection.format}
              />

              <ExportStatus
                isLoading={isLoading}
                error={error}
                dataCount={diagnosticData.length}
              />
            </CardContent>
          </div>
          <CardFooter className="border-t pt-4">
            <ExportActionFooter
              onBack={handleBack}
              onExport={handleExport}
              isLoading={isLoading}
              hasError={!!error}
              dataCount={diagnosticData.length}
              isExporting={isExporting}
              format={selection.format}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
