import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/ui/icons/github-icon";
import { GoogleIcon } from "@/components/ui/icons/google-icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TooltipProvider,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import env from "../../../../env";
import { FieldErrorIconTooltip } from "./field-error-icon-tooltip";

const signUpFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();
  const [socialSignUpProviderPending, setSocialSignUpProviderPending]
    = useState<"github" | "google" | null>(null);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: `${value.firstName} ${value.lastName}`,
          callbackURL: `${env.API_PROD_URL}/app`,
        },
        {
          onSuccess: () => {
            toast.success("Account created! Please check your email to verify.");
            navigate({ to: "/app" });
          },
          onError: (ctx: any) => {
            toast.error(ctx.error.message || "Sign up failed. Please try again.");
          },
        },
      );
    },
  });

  const handleSocialSignUp = async (provider: "github" | "google") => {
    setSocialSignUpProviderPending(provider);
    await authClient.signIn.social(
      { provider, callbackURL: `${env.API_PROD_URL}/app` },
      {
        onSuccess: () => {
          navigate({ to: "/app" });
        },
        onError: (ctx: any) => {
          toast.error(
            ctx.error.message || "Social sign up failed. Please try again.",
          );
        },
        onResponse: () => setSocialSignUpProviderPending(null),
      },
    );
  };

  return (
    <TooltipProvider>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your details below to create your account
          </p>
        </div>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <form.Field
              name="firstName"
              validators={{ onChange: signUpFormSchema._def.schema.shape.firstName }}
              children={(field) => {
                const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>First Name</Label>
                    <div className="relative flex items-center">
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="John"
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
              name="lastName"
              validators={{ onChange: signUpFormSchema._def.schema.shape.lastName }}
              children={(field) => {
                const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
                return (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Last Name</Label>
                    <div className="relative flex items-center">
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Doe"
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
          </div>

          <form.Field
            name="email"
            validators={{ onChange: signUpFormSchema._def.schema.shape.email }}
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
          <form.Field
            name="password"
            validators={{ onChange: signUpFormSchema._def.schema.shape.password }}
            children={(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-2">
                  <Label htmlFor={field.name}>Password</Label>
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
            name="confirmPassword"
            validators={{
              onChange: signUpFormSchema._def.schema.shape.confirmPassword,
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value, fieldApi }) => {
                const formValues = { ...fieldApi.form.state.values, confirmPassword: value };
                const parsed = signUpFormSchema.safeParse(formValues as z.infer<typeof signUpFormSchema>);
                if (!parsed.success) {
                  const confirmPasswordError = parsed.error.errors.find(
                    err => err.path.includes("confirmPassword"),
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
                  <Label htmlFor={field.name}>Confirm Password</Label>
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
          <Button
            type="submit"
            className="w-full"
            disabled={form.state.isSubmitting || socialSignUpProviderPending !== null}
          >
            {form.state.isSubmitting
              ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )
              : null}
            Create account
          </Button>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full"
              disabled={socialSignUpProviderPending !== null || form.state.isSubmitting}
              onClick={() => handleSocialSignUp("github")}
            >
              {socialSignUpProviderPending === "github"
                ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )
                : (
                    <GitHubIcon className="mr-2 h-4 w-4" />
                  )}
              Sign up with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={socialSignUpProviderPending !== null || form.state.isSubmitting}
              onClick={() => handleSocialSignUp("google")}
            >
              {socialSignUpProviderPending === "google"
                ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )
                : (
                    <GoogleIcon className="mr-2 h-4 w-4" />
                  )}
              Sign up with Google
            </Button>
          </div>
        </div>
        <div className="text-center text-sm">
          Already have an account?
          {" "}
          <Link to="/sign-in" search={{ mode: undefined, redirect: undefined, state: undefined }} className="underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </form>
    </TooltipProvider>
  );
}
