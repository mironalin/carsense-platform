import { BarChart2, Gauge, Smartphone, Wifi } from "lucide-react";

export default function SensorShowcase() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative space-y-4">
            <div className="md:pr-6 lg:pr-0">
              <h2 className="text-4xl font-medium lg:text-5xl">Connect Directly to Your Vehicle</h2>
              <p className="mt-6">Our Android app connects directly to your car's OBD-II port, gathering real-time sensor data and presenting it in easy-to-understand displays and gauges.</p>
            </div>
            <ul className="mt-8 divide-y border-y *:flex *:items-center *:gap-3 *:py-3">
              <li>
                <Wifi className="size-5" />
                Direct OBD-II Connection
              </li>
              <li>
                <Gauge className="size-5" />
                Live Sensor Data Display
              </li>
              <li>
                <BarChart2 className="size-5" />
                Real-time Data Visualization
              </li>
              <li>
                <Smartphone className="size-5" />
                Instant Mobile Access
              </li>
            </ul>
          </div>
          <div className="relative mb-6 sm:mb-0">
            <div className="border-border/50 relative flex items-center justify-center gap-4 rounded-3xl border p-3">
              <div className="bg-linear-to-b relative inline-block rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <img src="./assets/sensorReadingsDarkMobile.png" className="dark:block hidden max-h-[32.5rem] rounded-[15px]" alt="CarSense Android app dark mode" />
                <img src="./assets/sensorReadingsLightMobile.png" className="dark:hidden max-h-[32.5rem] rounded-[15px] shadow" alt="CarSense Android app light mode" />
              </div>
              <div className="bg-linear-to-b relative inline-block rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <img src="./assets/analogGaugeDarkMobile.png" className="dark:block hidden max-h-[32.5rem] rounded-[15px]" alt="CarSense Android app dark mode" />
                <img src="./assets/analogGaugeLightMobile.png" className="dark:hidden max-h-[32.5rem] rounded-[15px] shadow" alt="CarSense Android app light mode" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
