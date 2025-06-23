import { motion } from "framer-motion";
import { BookOpen, MessageSquare, Settings, Zap } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { itemVariants } from "../../utils/animation-variants";
import type { Feature } from "../../types";

export function FeaturesOverviewSection() {
  const features: Feature[] = [
    {
      icon: Settings,
      title: "Diagnostics",
      description: "Monitor DTCs, view diagnostic trouble codes, and track vehicle health in real-time.",
    },
    {
      icon: Zap,
      title: "Sensors",
      description: "View live sensor data, historical trends, and performance metrics from your vehicle.",
    },
    {
      icon: BookOpen,
      title: "Maintenance",
      description: "Track maintenance history, set reminders, and manage service records.",
    },
    {
      icon: MessageSquare,
      title: "Export Data",
      description: "Export your vehicle data in multiple formats for analysis or record keeping.",
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 