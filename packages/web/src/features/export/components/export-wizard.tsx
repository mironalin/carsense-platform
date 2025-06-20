import { AnimatePresence, motion } from "framer-motion";

import { ExportStepId } from "../types";
import { slideLeftAnimation, slideRightAnimation } from "../utils/animation-variants";
import { ConfigureExportStep } from "./configure-export-step";
import { useExport } from "./export-context";
import { ReviewExportStep } from "./review-export-step";
import { SelectDiagnosticsStep } from "./select-diagnostics-step";

type Step = {
  id: ExportStepId;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

type ExportWizardProps = {
  steps: Step[];
};

export function ExportWizard({ steps }: ExportWizardProps) {
  const { currentStep, previousStep } = useExport();

  // Find current step details
  const currentStepData = steps.find(step => step.id === currentStep);

  // Determine animation direction based on step progression
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const prevStepIndex = previousStep ? steps.findIndex(step => step.id === previousStep) : -1;
  const direction = !previousStep || currentStepIndex > prevStepIndex ? "forward" : "backward";

  // Get animation variant based on direction
  const animationVariant = direction === "forward" ? slideLeftAnimation : slideRightAnimation;

  return (
    <div className="space-y-6">
      {/* Content wrapper */}
      <div className="perspective-1000">
        {/* Header with title and icon */}
        <AnimatePresence mode="wait">
          <motion.div
            className="flex justify-between items-center"
            key={`header-${currentStep}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h1
              className="text-2xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {currentStepData?.title}
            </motion.h1>
            {currentStepData?.icon && (
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                {currentStepData.icon}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Description */}
        <AnimatePresence mode="wait">
          <motion.p
            className="text-muted-foreground"
            key={`description-${currentStep}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {currentStepData?.description}
          </motion.p>
        </AnimatePresence>

        {/* Step content with enhanced animations */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={animationVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {currentStep === ExportStepId.SelectDiagnostics && <SelectDiagnosticsStep />}
              {currentStep === ExportStepId.ConfigureExport && <ConfigureExportStep />}
              {currentStep === ExportStepId.ReviewAndExport && <ReviewExportStep />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
