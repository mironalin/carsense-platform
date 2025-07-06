import type { ReactNode } from "react";

import { Activity, TrendingUp, Truck } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AutomotiveFeatures() {
  return (
    <section id="features" className="py-16 md:py-32">
      <div className="@container mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built for automotive excellence</h2>
          <p className="mt-4">Advanced diagnostic tools and insights to keep your vehicles running at their best.</p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Activity
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Real-time Diagnostics</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">Instant access to your vehicle's diagnostic data with live OBD-II monitoring and real-time error code detection.</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <TrendingUp
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Predictive Analytics</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">AI-powered insights predict potential issues before they become costly repairs, helping you maintain your vehicle proactively.</p>
            </CardContent>
          </Card>

          <Card className="group border-0 shadow-none">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Truck
                  className="size-6"
                  aria-hidden
                />
              </CardDecorator>

              <h3 className="mt-6 font-medium">Fleet Management</h3>
            </CardHeader>

            <CardContent>
              <p className="mt-3 text-sm">Comprehensive fleet monitoring with centralized dashboards, maintenance scheduling, and performance analytics for multiple vehicles.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CardDecorator({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:bg-white/5 dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
      />
      <div
        aria-hidden
        className="bg-radial to-background absolute inset-0 from-transparent to-75%"
      />
      <div className="dark:bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t bg-white">{children}</div>
    </div>
  );
}
