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

import { FieldErrorIconTooltip } from "./field-error-icon-tooltip";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormProps = React.ComponentPropsWithoutRef<"form"> & {
  redirectUri?: string;
  state?: string;
  isMobileMode?: boolean;
};

export function SignInForm({
  className,
  redirectUri,
  state,
  isMobileMode = false,
  ...props
}: SignInFormProps) {
  const navigate = useNavigate();
  const [socialLoginProviderPending, setSocialLoginProviderPending] = useState<
    "github" | "google" | null
  >(null);

  const handleMobileSuccess = async () => {
    // For mobile auth, we don't navigate in the app - wait for backend to handle the redirect
    if (isMobileMode) {
      toast.success("Authentication successful, redirecting...");
      // The authClient has already set the session cookie,
      // and the /api/auth route will detect this and redirect to the mobile app
      return;
    }

    // For web auth, navigate to the app as normal
    navigate({ to: "/app" });
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: handleMobileSuccess,
          onError: (ctx: any) => {
            toast.error(`${ctx.error.message}!`);
          },
        },
      );
    },
  });

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setSocialLoginProviderPending(provider);
    await authClient.signIn.social(
      { provider },
      {
        onSuccess: handleMobileSuccess,
        onError: (ctx: any) => {
          toast.error(ctx.error.message);
        },
        onResponse: () => setSocialLoginProviderPending(null),
      },
    );
  };

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
            {isMobileMode ? "CarSense Mobile Login" : "Login to your account"}
          </h1>
          <p className="text-balance text-sm text-muted-foreground">
            Enter your email below to login to your account
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
          <form.Field
            name="password"
            validators={{ onChange: formSchema.shape.password }}
            children={(field) => {
              const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
              return (
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor={field.name}>Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
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
            Login
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
              disabled={socialLoginProviderPending !== null}
              onClick={() => handleSocialSignIn("github")}
            >
              {socialLoginProviderPending === "github"
                ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )
                : (
                    <GitHubIcon className="mr-2 h-4 w-4" />
                  )}
              Login with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={socialLoginProviderPending !== null}
              onClick={() => handleSocialSignIn("google")}
            >
              {socialLoginProviderPending === "google"
                ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )
                : (
                    <GoogleIcon className="mr-2 h-4 w-4" />
                  )}
              Login with Google
            </Button>
          </div>
        </div>
        {!isMobileMode && (
          <div className="text-center text-sm">
            Don&apos;t have an account?
            {" "}
            <Link to="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        )}
      </form>
    </TooltipProvider>
  );
}
