import { AlertCircle } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type FieldErrorIconTooltipProps = {
  errors: (string | { message: string } | undefined)[] | undefined | null;
};

export function FieldErrorIconTooltip({ errors }: FieldErrorIconTooltipProps) {
  if (!errors || errors.length === 0) {
    return null;
  }

  const errorMessages = errors
    .map((err) => {
      if (err === undefined)
        return null; // Skip undefined errors
      return typeof err === "string" ? err : (err as { message: string }).message || "Invalid input";
    })
    .filter(Boolean) // Remove nulls introduced by skipping undefined errors
    .join(", ");

  if (!errorMessages) {
    return null; // If all errors were undefined or had no message
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AlertCircle className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer text-destructive" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{errorMessages}</p>
      </TooltipContent>
    </Tooltip>
  );
}
