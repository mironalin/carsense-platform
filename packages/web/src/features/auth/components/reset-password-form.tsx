import { useForm } from "@tanstack/react-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { FieldErrorIconTooltip } from "./field-error-icon-tooltip";

const formSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
  confirmNewPassword: z.string().min(8, "Password must be at least 8 characters long"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"],
});

type ResetPasswordFormProps = React.ComponentPropsWithoutRef<"form"> & {
  isMobileMode?: boolean;
};

export function ResetPasswordForm({
  className,
  isMobileMode = false,
  ...props
}: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const token = useSearch({
    from: "/_auth/reset-password",
    select: search => search.token,
  });

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.resetPassword({
        newPassword: value.newPassword,
        token,
      }, {
        onSuccess: () => {
          toast.success("Password reset successfully");
          navigate({
            to: "/sign-in",
            search: { mode: undefined, redirect: undefined, state: undefined },
            replace: true,
          });
        },
        onError: (ctx: any) => {
          let errorMessage = "Failed to reset password. Please try again.";
          if (ctx.error?.message) {
            errorMessage = ctx.error.message;
          }
          else if (ctx.error?.statusText && ctx.error.statusText !== "") {
            errorMessage = `${ctx.error.statusText} (Status: ${ctx.error.status})`;
          }
          else if (ctx.response?.status && ctx.response.status !== 200) {
            errorMessage = `Failed to reset password. Server responded with status: ${ctx.response.status}`;
          }
          else if (typeof ctx.error === "string") {
            errorMessage = ctx.error;
          }
          toast.error(errorMessage);
        },
      });
    },
  });

  const formClasses = cn(
    "flex flex-col gap-6",
    isMobileMode ? "w-full" : "",
    className,
  );

  return (
    <TooltipProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className={formClasses}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">
            Reset your password
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your new password below to reset your password
          </p>
        </div>
        <div className="grid gap-6">
          <form.Field
            name="newPassword"
            validators={{
              onChange: formSchema._def.schema.shape.newPassword,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value, fieldApi }) => {
                const formValues = { ...fieldApi.form.state.values, newPassword: value };
                const parsed = formSchema.safeParse(formValues as z.infer<typeof formSchema>);
                if (!parsed.success) {
                  const confirmPasswordError = parsed.error.errors.find(
                    err => err.path.includes("newPassword"),
                  );
                  if (confirmPasswordError) {
                    return confirmPasswordError.message;
                  }
                }
                return undefined;
              },
            }}
            children={(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>New Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      className={cn(
                        hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                      )}
                    />
                    {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                  </div>
                </div>
              );
            }}
          />
          <form.Field
            name="confirmNewPassword"
            validators={{
              onChange: formSchema._def.schema.shape.confirmNewPassword,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value, fieldApi }) => {
                const formValues = { ...fieldApi.form.state.values, confirmNewPassword: value };
                const parsed = formSchema.safeParse(formValues as z.infer<typeof formSchema>);
                if (!parsed.success) {
                  const confirmPasswordError = parsed.error.errors.find(
                    err => err.path.includes("confirmNewPassword"),
                  );
                  if (confirmPasswordError) {
                    return confirmPasswordError.message;
                  }
                }
                return undefined;
              },
            }}
            children={(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Confirm New Password</Label>
                  <div className="relative flex items-center">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      required
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      className={cn(
                        hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                      )}
                    />
                    {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                  </div>
                </div>
              );
            }}
          />
          <Button type="submit" className="w-full" disabled={form.state.isSubmitting}>
            {form.state.isSubmitting
              ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              : null}
            Reset password
          </Button>
        </div>
      </form>
    </TooltipProvider>
  );
}
