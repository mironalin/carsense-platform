import { FileDown, ListFilter, Settings } from "lucide-react";
import { useEffect } from "react";

import { Card } from "@/components/ui/card";

import { ExportStepId } from "../types";
import { AnimateHeight } from "./animate-height";
import { ExportProvider, useExport } from "./export-context";
import { ExportSteps } from "./export-steps";
import { ExportWizard } from "./export-wizard";

// Step guard component to ensure valid steps
function ExportStepGuard({ children }: { children: React.ReactNode }) {
  const { currentStep, setCurrentStep } = useExport();

  // Validate current step on mount
  useEffect(() => {
    const validSteps = [
      ExportStepId.SelectDiagnostics,
      ExportStepId.ConfigureExport,
      ExportStepId.ReviewAndExport,
    ];

    // If current step is not valid, reset to first step
    if (!validSteps.includes(currentStep as ExportStepId)) {
      setCurrentStep(ExportStepId.SelectDiagnostics);
    }
  }, [currentStep, setCurrentStep]);

  return <>{children}</>;
}

export function ExportLayout() {
  const exportSteps = [
    {
      id: ExportStepId.SelectDiagnostics,
      title: "Select Diagnostics",
      description: "Choose which diagnostics to export",
      icon: <ListFilter className="h-5 w-5" />,
    },
    {
      id: ExportStepId.ConfigureExport,
      title: "Configure Export",
      description: "Select format, columns, and date range",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      id: ExportStepId.ReviewAndExport,
      title: "Review & Export",
      description: "Review your selection and export data",
      icon: <FileDown className="h-5 w-5" />,
    },
  ];

  return (
    <ExportProvider>
      <Card className="overflow-hidden">
        <div className="flex">
          <div className="hidden md:block border-r w-1/4 p-6">
            <h2 className="text-xl font-semibold mb-6">Export Wizard</h2>
            <ExportSteps steps={exportSteps} />
          </div>
          <AnimateHeight className="flex-1">
            <div className="p-6">
              <ExportStepGuard>
                <ExportWizard steps={exportSteps} />
              </ExportStepGuard>
            </div>
          </AnimateHeight>
        </div>
      </Card>
    </ExportProvider>
  );
}
