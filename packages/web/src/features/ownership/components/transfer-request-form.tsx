import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FieldErrorIconTooltip } from "@/features/auth/components/field-error-icon-tooltip";
import { useCreateTransferRequest } from "@/features/ownership/api/use-create-transfer-request";
import { buttonAnimation } from "@/features/ownership/utils/animation-variants";
import { cn } from "@/lib/utils";

// Zod schema for form validation
const transferRequestSchema = z.object({
  toUserEmail: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  message: z
    .string()
    .optional()
    .transform(val => val?.trim() || undefined),
});

type TransferRequestFormData = z.infer<typeof transferRequestSchema>;

type TransferRequestFormProps = {
  vehicleUUID: string;
  onSuccess?: () => void;
};

export function TransferRequestForm({ vehicleUUID, onSuccess }: TransferRequestFormProps) {
  const createTransferMutation = useCreateTransferRequest();

  const form = useForm({
    defaultValues: {
      toUserEmail: "",
      message: "",
    } as TransferRequestFormData,
    onSubmit: async ({ value }: { value: TransferRequestFormData }) => {
      try {
        // Validate the form data using Zod
        const validatedData = transferRequestSchema.parse(value);

        await createTransferMutation.mutateAsync({
          vehicleUUID,
          toUserEmail: validatedData.toUserEmail,
          message: validatedData.message,
        });

        // Reset form on success
        form.reset();
        onSuccess?.();
      }
      catch (error) {
        if (error instanceof z.ZodError) {
          // Handle Zod validation errors
          error.errors.forEach((err) => {
            const fieldName = err.path[0] as keyof TransferRequestFormData;
            form.setFieldMeta(fieldName, prev => ({
              ...prev,
              errors: [err.message],
            }));
          });
        }
        // API errors are handled by the mutation
      }
    },
  });

  return (
    <TooltipProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <form.Field
          name="toUserEmail"
          validators={{ onChange: transferRequestSchema.shape.toUserEmail }}
        >
          {(field) => {
            const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Recipient Email Address</Label>
                <div className="relative flex items-center">
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="Enter recipient's email address"
                    required
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className={cn(
                      hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                    )}
                  />
                  {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                </div>
              </div>
            );
          }}
        </form.Field>

        <form.Field
          name="message"
          validators={{
            onChange: ({ value }) => {
              if (value && value.length > 500) {
                return "Message must be less than 500 characters";
              }
              return undefined;
            },
          }}
        >
          {(field) => {
            const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
            return (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Message (Optional)</Label>
                <div className="relative flex items-center">
                  <Textarea
                    id={field.name}
                    name={field.name}
                    placeholder="Add a personal message about the transfer"
                    value={field.state.value || ""}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    rows={3}
                    className={cn(
                      hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                    )}
                  />
                  {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                </div>
                {field.state.value && (
                  <p className="text-xs text-muted-foreground">
                    {field.state.value.length}
                    /500 characters
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <Alert>
          <AlertTitle>Important</AlertTitle>
          <AlertDescription>
            Once the transfer is accepted, you will lose access to this vehicle's data.
            The recipient will become the new owner and have full control over the vehicle.
          </AlertDescription>
        </Alert>

        <form.Subscribe
          selector={state => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <motion.div variants={buttonAnimation} whileHover="hover" whileTap="tap">
              <Button
                type="submit"
                disabled={!canSubmit || isSubmitting || createTransferMutation.isPending}
                className="w-full"
              >
                {createTransferMutation.isPending || isSubmitting
                  ? (
                      "Sending Transfer Request..."
                    )
                  : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Transfer Request
                      </>
                    )}
              </Button>
            </motion.div>
          )}
        </form.Subscribe>
      </form>
    </TooltipProvider>
  );
}
