import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
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

import env from "../../../../env";
import { FieldErrorIconTooltip } from "./field-error-icon-tooltip";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormProps = React.ComponentPropsWithoutRef<"form"> & {
  isMobileMode?: boolean;
};

export function ForgotPasswordForm({
  className,
  isMobileMode = false,
  ...props
}: ForgotPasswordFormProps) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.forgetPassword({
        email: value.email,
        redirectTo: `${env.API_PROD_URL}/reset-password`,
      }, {
        onSuccess: () => {
          toast.success("Reset password email sent");
          navigate({
            to: "/sign-in",
            search: { mode: undefined, redirect: undefined, state: undefined },
            replace: true,
          });
        },
        onError: (ctx: any) => {
          let errorMessage = "Failed to send reset password email. Please try again.";
          if (ctx.error?.message) {
            errorMessage = ctx.error.message;
          }
          else if (ctx.error?.statusText && ctx.error.statusText !== "") {
            errorMessage = `${ctx.error.statusText} (Status: ${ctx.error.status})`;
          }
          else if (ctx.response?.status && ctx.response.status !== 200) {
            errorMessage = `Failed to send reset password email. Server responded with status: ${ctx.response.status}`;
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
            Forgot your password?
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to reset your password
          </p>
        </div>
        <div className="grid gap-6">
          <form.Field
            name="email"
            validators={{ onChange: formSchema.shape.email }}
            children={(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Email</Label>
                  <div className="relative flex items-center">
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="name@example.com"
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
            Send reset password email
          </Button>
          <div className="text-center text-sm">
            <Link to="/sign-in" search={{ mode: undefined, redirect: undefined, state: undefined }} className="flex items-center justify-center gap-2 hover:underline underline-offset-4">
              Back to login
            </Link>
          </div>
        </div>
      </form>
    </TooltipProvider>
  );
}
