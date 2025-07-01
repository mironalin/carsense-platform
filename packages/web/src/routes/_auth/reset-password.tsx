import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const Route = createFileRoute("/_auth/reset-password")({
  validateSearch: z.object({
    token: z.string(),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardContent>
          <ResetPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
