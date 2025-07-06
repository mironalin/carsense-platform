export default function DiagnosticShowcase() {
  return (
    <section className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
        <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">Your car's diagnostic center in your pocket.</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:gap-12 lg:gap-24">
          <div className="relative mb-6 sm:mb-0">
            <div className="border-border/50 relative flex items-center justify-center gap-4 rounded-3xl border p-3">
              <div className="bg-linear-to-b relative inline-block rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <img src="./assets/dashboardScreenDarkMobile.png" className="dark:block hidden max-h-[32.5rem] rounded-[15px]" alt="CarSense Android app dashboard" />
                <img src="./assets/dashboardScreenLightMobile.png" className="dark:hidden max-h-[32.5rem] rounded-[15px] shadow" alt="CarSense Android app dashboard" />
              </div>
              <div className="bg-linear-to-b relative inline-block rounded-2xl from-zinc-300 to-transparent p-px dark:from-zinc-700">
                <img src="./assets/errorMemoryDarkMobile.png" className="dark:block hidden max-h-[32.5rem] rounded-[15px]" alt="CarSense Android app diagnostics" />
                <img src="./assets/errorMemoryLightMobile.png" className="dark:hidden max-h-[32.5rem] rounded-[15px] shadow" alt="CarSense Android app diagnostics" />
              </div>
            </div>
          </div>

          <div className="relative space-y-4">
            <p className="text-muted-foreground">
              Connect your Android device directly to your vehicle's OBD-II port and unlock professional diagnostic capabilities.
              {" "}
              <span className="text-accent-foreground font-bold">Real-time data collection and analysis</span>
              {" "}
              — right from your smartphone.
            </p>
            <p className="text-muted-foreground">Instantly scan for error codes, monitor live sensor data, and receive detailed diagnostic reports. Your car's health information is now accessible anytime, anywhere.</p>

            <div className="pt-6">
              <blockquote className="border-l-4 pl-4">
                <p>CarSense transformed how I work with vehicles. The app connects directly to any car's diagnostic port and gives me instant access to error codes and sensor data. It's like having a professional scan tool that fits in my pocket.</p>

                <div className="mt-6 space-y-3">
                  <cite className="block font-medium">Mike Rodriguez, Auto Technician</cite>
                  <div className="text-sm text-gray-600">Rodriguez Auto Repair</div>
                </div>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
