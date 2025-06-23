import { motion } from "framer-motion";
import { Rocket, Smartphone, Car, Activity, BarChart3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemVariants } from "../../utils/animation-variants";
import type { GettingStartedStep } from "../../types";

export function GettingStartedSection() {
  const steps: GettingStartedStep[] = [
    {
      number: 1,
      title: "Install Android App",
      description: "Download and install the CarSense Android app from the Google Play Store. The Android app is mandatory for connecting to your vehicle.",
      icon: Smartphone,
    },
    {
      number: 2,
      title: "Connect to Vehicle",
      description: "Use the Android app to connect to your vehicle's OBD-II port using a compatible OBD-II adapter. Follow the in-app pairing instructions.",
      icon: Car,
    },
    {
      number: 3,
      title: "Use Android App Features",
      description: "Access real-time diagnostics, view live sensor data, monitor engine parameters, and collect diagnostic trouble codes (DTCs) directly from your Android device.",
      icon: Activity,
    },
    {
      number: 4,
      title: "View Historical Data",
      description: "Access this web dashboard to analyze historical data, view detailed reports, export diagnostic sessions, and track your vehicle's performance over time.",
      icon: BarChart3,
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <div key={step.number} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{step.number}</Badge>
                  <span className="font-medium">{step.title}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 