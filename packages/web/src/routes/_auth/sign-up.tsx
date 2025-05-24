import { createFileRoute, Link } from "@tanstack/react-router";
import { GalleryVerticalEnd } from "lucide-react";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const Route = createFileRoute("/_auth/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col bg-muted lg:flex">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="relative z-10 flex justify-center gap-2 p-6 md:justify-start md:p-10">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            CarSense
          </Link>
        </div>
        <div className="relative z-10 mt-auto p-6 md:p-10">
          <blockquote className="mt-2 text-sm italic leading-relaxed md:text-base">
            "CarSense has transformed how I manage my car's health. The predictive insights give me real peace of mind on the road!"
          </blockquote>
          <footer className="mt-4 text-xs font-medium md:text-sm">
            Andrei Popescu
          </footer>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
