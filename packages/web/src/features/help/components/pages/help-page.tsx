import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

import { GettingStartedSection } from "../sections/getting-started-section";
import { FeaturesOverviewSection } from "../sections/features-overview-section";
import { FaqSection } from "../sections/faq-section";
import { ContactSupportSection } from "../sections/contact-support-section";
import { containerVariants, itemVariants } from "../../utils/animation-variants";

export function HelpPage() {
  return (
    <div className="container mx-auto p-2 lg:p-6 max-w-6xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Help Center</h1>
          </div>
          <p className="text-base lg:text-xl text-muted-foreground max-w-4xl mx-auto">
            Everything you need to know about using CarSense to monitor and maintain your vehicle.
          </p>
        </motion.div>

        <GettingStartedSection />
        <FeaturesOverviewSection />
        <FaqSection />
        <ContactSupportSection />
      </motion.div>
    </div>
  );
} 