import { Bluetooth, Car, Download, Smartphone } from "lucide-react";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { Button } from "@/components/ui/button";
import { TextEffect } from "@/components/ui/text-effect";

import { DownloadHeroHeader } from "./download-header";

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: "blur(12px)",
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function DownloadHeroSection() {
  return (
    <>
      <DownloadHeroHeader />

      <main className="pt-24 md:pt-16 lg:pt-0 min-h-screen overflow-hidden [--color-primary-foreground:var(--color-white)] [--color-primary:var(--color-blue-600)]">
        <section className="min-h-screen flex items-center">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center min-h-[calc(100vh-8rem)]">
              {/* Left Column - Content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <TextEffect
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    as="h1"
                    className="text-balance text-4xl lg:text-5xl font-medium"
                  >
                    CarSense Android App
                  </TextEffect>

                  <TextEffect
                    per="line"
                    preset="fade-in-blur"
                    speedSegment={0.3}
                    delay={0.3}
                    as="p"
                    className="text-pretty text-lg lg:text-xl text-muted-foreground mx-auto lg:mx-0"
                  >
                    Turn your smartphone into a powerful automotive diagnostic tool. Connect directly to your car's OBD-II port and access real-time vehicle data.
                  </TextEffect>
                </div>

                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 0.6,
                        },
                      },
                    },
                    ...transitionVariants,
                  } as any}
                  className="space-y-10"
                >

                  {/* Features List */}
                  <div className="space-y-5 text-left mx-auto lg:mx-0">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <Car className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Real-time Diagnostics</h3>
                        <p className="text-sm text-muted-foreground">Monitor engine performance and live sensor data streams.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <Bluetooth className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">OBD-II Connection</h3>
                        <p className="text-sm text-muted-foreground">A direct wireless connection to your vehicle's computer.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <Smartphone className="size-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">Mobile Dashboard</h3>
                        <p className="text-sm text-muted-foreground">View all critical data right on your smartphone screen.</p>
                      </div>
                    </div>
                  </div>
                  {/* Download Button */}
                  <div className="space-y-3 mx-auto lg:mx-0">
                    <Button size="lg" className="w-full  h-14 text-base cursor-pointer">
                      <Download className="mr-3 size-5" />
                      Download for Android
                    </Button>

                    <p className="text-sm text-center text-muted-foreground">Requires Android 6.0+ and OBD-II Bluetooth adapter</p>
                  </div>
                </AnimatedGroup>
              </div>

              {/* Right Column - App Preview */}
              <div className="relative flex justify-center items-center">
                <AnimatedGroup
                  variants={{
                    container: {
                      visible: {
                        transition: {
                          staggerChildren: 0.2,
                          delayChildren: 0.8,
                        },
                      },
                    },
                    ...transitionVariants,
                  } as any}
                  className="relative"
                >
                  {/* Background Gradient */}
                  <div
                    aria-hidden
                    className="bg-radial from-primary/30 dark:from-primary/20 relative mx-auto max-w-2xl to-transparent to-55% text-left"
                  >
                    <div className="bg-background border-border/50 absolute inset-0 mx-auto w-65 -translate-x-3 rounded-[2rem] border p-2 [mask-image:linear-gradient(to_bottom,#000_50%,transparent_90%)] sm:-translate-x-6">
                      <img
                        src="./assets/sensorReadingsDarkMobile.png"
                        alt="CarSense app screenshot showing diagnostic data"
                        className="w-full h-auto object-cover rounded-[1.5rem] shadow-xl hidden dark:block"
                      />
                      <img
                        src="./assets/sensorReadingsLightMobile.png"
                        alt="CarSense app screenshot showing diagnostic data"
                        className="w-full h-auto object-cover rounded-[1.5rem] shadow-xl block dark:hidden"
                      />
                    </div>
                    <div className="bg-muted dark:bg-background/80 border-border/50 mx-auto w-65 translate-x-4 translate-y-12 rounded-[2rem] border p-2 backdrop-blur-3xl [mask-image:linear-gradient(to_bottom,black_70%,transparent_95%)] sm:translate-x-8">
                      <div className="bg-background space-y-2 overflow-hidden rounded-[1.5rem] shadow-xl dark:bg-white/5 dark:shadow-black dark:backdrop-blur-3xl">
                        <img
                          src="./assets/welcomeScreenConnectedDarkMobile.png"
                          alt="CarSense app screenshot showing diagnostic data"
                          className="w-full h-auto object-cover shadow-xl hidden dark:block"
                        />
                        <img
                          src="./assets/welcomeScreenConnectedLightMobile.png"
                          alt="CarSense app screenshot showing diagnostic data"
                          className="w-full h-auto object-cover shadow-xl block dark:hidden"
                        />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] mix-blend-overlay [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:opacity-5"></div>
                  </div>
                </AnimatedGroup>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
