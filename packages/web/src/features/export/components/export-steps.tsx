import { motion } from "framer-motion";
import { Check, CircleDot } from "lucide-react";

import { cn } from "@/lib/utils";

import { ExportStepId } from "../types";
import { useExport } from "./export-context";

type Step = {
  id: ExportStepId;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

type ExportStepsProps = {
  steps: Step[];
};

export function ExportSteps({ steps }: ExportStepsProps) {
  const { currentStep, setCurrentStep, selection } = useExport();

  // Determine if a step is completed based on the current selection
  const isStepCompleted = (stepId: ExportStepId) => {
    switch (stepId) {
      case ExportStepId.SelectDiagnostics:
        return selection.diagnostics.length > 0;
      case ExportStepId.ConfigureExport:
        return selection.columns.length > 0;
      default:
        return false;
    }
  };

  // Determine if a step is accessible (completed previous steps)
  const isStepAccessible = (index: number) => {
    if (index === 0)
      return true;
    return isStepCompleted(steps[index - 1].id);
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = isStepCompleted(step.id);
        const isAccessible = isStepAccessible(index);

        return (
          <motion.div
            key={step.id}
            className={cn(
              "flex items-start space-x-3 p-3 rounded-md transition-colors cursor-pointer",
              isActive ? "bg-secondary/50" : "hover:bg-secondary/30",
              !isAccessible && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => {
              if (isAccessible) {
                setCurrentStep(step.id);
              }
            }}
            role="button"
            tabIndex={0}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: {
                delay: index * 0.1,
                duration: 0.3,
                ease: "easeOut",
              },
            }}
            whileHover={isAccessible
              ? {
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }
              : {}}
            whileTap={isAccessible
              ? {
                  scale: 0.98,
                  transition: { duration: 0.1 },
                }
              : {}}
          >
            <motion.div
              className="flex-shrink-0 mt-1"
              animate={{
                scale: isActive ? 1.1 : 1,
                transition: { duration: 0.3 },
              }}
            >
              {isCompleted
                ? (
                    <motion.div
                      className="h-6 w-6 rounded-full bg-primary flex items-center justify-center"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </motion.div>
                  )
                : isActive
                  ? (
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <CircleDot className="h-6 w-6 text-primary" />
                      </motion.div>
                    )
                  : (
                      <motion.div
                        className="h-6 w-6 rounded-full border-2 border-muted-foreground"
                        whileHover={{ borderColor: "var(--primary)" }}
                      />
                    )}
            </motion.div>
            <div className="flex-1 space-y-1">
              <motion.h3
                className="text-sm font-medium"
                animate={{
                  color: isActive ? "var(--primary)" : "var(--foreground)",
                  transition: { duration: 0.3 },
                }}
              >
                {step.title}
              </motion.h3>
              <motion.p
                className="text-xs text-muted-foreground"
                animate={{
                  opacity: isActive ? 1 : 0.8,
                  transition: { duration: 0.3 },
                }}
              >
                {step.description}
              </motion.p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
