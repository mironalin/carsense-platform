import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { itemVariants } from "../../utils/animation-variants";
import type { FAQ } from "../../types";

export function FaqSection() {
  const faqs: FAQ[] = [
    {
      question: "Do I need the Android app?",
      answer: "Yes! The CarSense Android app is mandatory for connecting to your vehicle. It handles the OBD-II communication and data collection. This web dashboard is used for viewing and analyzing the data collected by the Android app.",
    },
    {
      question: "How do I connect my vehicle?",
      answer: "First, install the CarSense Android app on your phone. Then use an OBD-II adapter in your vehicle's diagnostic port. The Android app will handle the connection and send data to this web dashboard for analysis.",
    },
    {
      question: "What data does CarSense collect?",
      answer: "CarSense collects diagnostic data, sensor readings, maintenance records, and performance metrics to help you monitor your vehicle's health.",
    },
    {
      question: "How often is data updated?",
      answer: "Data is updated in real-time when your vehicle is running and connected via the Android app. Historical data is available for analysis and comparison.",
    },
    {
      question: "Can I export my vehicle data?",
      answer: "Yes! Use the Export feature to download your diagnostic data, maintenance records, and sensor readings in various formats.",
    },
  ];

  return (
    <motion.div variants={itemVariants}>
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
              {index < faqs.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
} 