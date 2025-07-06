import { BarChart3, Gauge, Monitor, TrendingUp } from "lucide-react";

export default function WebDashboard() {
  return (
    <section className="overflow-hidden py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-semibold lg:text-5xl">Comprehensive Web Dashboard</h2>
          <p className="mt-6 text-lg">Monitor all your vehicle's sensor data in real-time with our advanced web dashboard. Get detailed insights, historical trends, and comprehensive analytics all in one place.</p>
        </div>
        <div className="relative -mx-4 rounded-3xl p-3 md:-mx-12 lg:col-span-3">
          <div className="perspective-midrange">
            <div className="rotate-x-6 -skew-2">
              <div className="aspect-88/36 relative">
                <div className="bg-radial-[at_75%_25%] to-background z-1 -inset-17 absolute from-transparent to-75%"></div>
                <img src="./assets/dashboardSensorsDark.png" className="hidden dark:block" alt="payments illustration dark" width={2797} height={1137} />
                <img src="./assets/dashboardSensorsLight.png" className="dark:hidden" alt="payments illustration light" width={2797} height={1137} />
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-auto grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-8 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="size-4" />
              <h3 className="text-sm font-medium">Live Sensor Data</h3>
            </div>
            <p className="text-muted-foreground text-sm">Real-time monitoring of all vehicle sensors with instant updates and alerts.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              <h3 className="text-sm font-medium">Data Visualization</h3>
            </div>
            <p className="text-muted-foreground text-sm">Interactive charts and graphs showing sensor trends over time.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Monitor className="size-4" />
              <h3 className="text-sm font-medium">Multi-Vehicle View</h3>
            </div>
            <p className="text-muted-foreground text-sm">Manage and monitor multiple vehicles from a single dashboard interface.</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              <h3 className="text-sm font-medium">Historical Analysis</h3>
            </div>
            <p className="text-muted-foreground text-sm">Track performance trends and identify patterns in your vehicle's data.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
