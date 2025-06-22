import { useRouter } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Bug,
  Home,
  RefreshCw,
  Server,
  Shield,
  WifiOff,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ErrorPageProps = {
  error?: Error | null;
  reset?: () => void;
  type?: "404" | "500" | "network" | "unauthorized" | "generic";
  title?: string;
  message?: string;
};

export function ErrorPage({
  error,
  reset,
  type = "generic",
  title,
  message,
}: ErrorPageProps) {
  const router = useRouter();
  const getErrorConfig = () => {
    switch (type) {
      case "404":
        return {
          icon: AlertTriangle,
          iconColor: "text-orange-500",
          title: title || "Page Not Found",
          message: message || "The page you're looking for doesn't exist or has been moved.",
        };
      case "500":
        return {
          icon: Server,
          iconColor: "text-red-500",
          title: title || "Server Error",
          message: message || "Something went wrong on our end. Please try again later.",
        };
      case "network":
        return {
          icon: WifiOff,
          iconColor: "text-blue-500",
          title: title || "Network Error",
          message: message || "Unable to connect to the server. Please check your internet connection.",
        };
      case "unauthorized":
        return {
          icon: Shield,
          iconColor: "text-purple-500",
          title: title || "Access Denied",
          message: message || "You don't have permission to access this resource.",
        };
      default:
        return {
          icon: Bug,
          iconColor: "text-muted-foreground",
          title: title || "Something went wrong",
          message: message || error?.message || "An unexpected error occurred. Please try again.",
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  const handleGoHome = () => {
    router.navigate({ to: "/app" });
  };

  const handleGoBack = () => {
    router.history.back();
  };

  const handleRetry = () => {
    if (reset) {
      reset();
    }
    else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Main Error Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 rounded-full bg-muted">
              <Icon className={`h-8 w-8 ${config.iconColor}`} />
            </div>
            <CardTitle className="text-2xl font-bold">
              {config.title}
            </CardTitle>
            <CardDescription className="text-base">
              {config.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Details (only show if error exists) */}
            {error && (
              <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">
                      Technical Details
                    </summary>
                    <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                      {error.stack || error.message}
                    </pre>
                  </details>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Primary Action */}
              {type === "404"
                ? (
                    <Button onClick={handleGoHome} className="w-full" size="lg">
                      <Home className="mr-2 h-4 w-4" />
                      Go to Dashboard
                    </Button>
                  )
                : (
                    <Button onClick={handleRetry} className="w-full" size="lg">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  )}

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleGoBack}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoHome}
                  className="flex-1"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <Card>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>Need help? Contact our support team</p>
              <div className="flex justify-center gap-4">
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Help Center
                </Button>
                <Button variant="link" size="sm" className="p-0 h-auto">
                  Contact Support
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Specialized error page components for common use cases
export function NotFoundPage() {
  return <ErrorPage type="404" />;
}

export function ServerErrorPage() {
  return <ErrorPage type="500" />;
}

export function NetworkErrorPage() {
  return <ErrorPage type="network" />;
}

export function UnauthorizedPage() {
  return <ErrorPage type="unauthorized" />;
}
