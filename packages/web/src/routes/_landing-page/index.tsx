import { createFileRoute } from "@tanstack/react-router";

import AutomotiveFeatures from "@/features/landing-page/components/automotive-features";
import DiagnosticShowcase from "@/features/landing-page/components/diagnostic-showcase";
import DiagnosticActivity from "@/features/landing-page/components/diagnostics-activity";
import FAQs from "@/features/landing-page/components/faqs";
import FooterSection from "@/features/landing-page/components/footer";
import HeroSection from "@/features/landing-page/components/hero-section";
import Pricing from "@/features/landing-page/components/pricing";
import SensorShowcase from "@/features/landing-page/components/sensor-showcase";
import Stats from "@/features/landing-page/components/stats";
import Testimonials from "@/features/landing-page/components/testimonials";
import WebDashboard from "@/features/landing-page/components/web-dashboard";
import { useLenis } from "@/features/landing-page/hooks/use-lenis";

export const Route = createFileRoute("/_landing-page/")({
  component: RouteComponent,
});

function RouteComponent() {
  useLenis();

  return (
    <div>
      <HeroSection />
      <Stats />
      <AutomotiveFeatures />
      <DiagnosticShowcase />
      <SensorShowcase />
      <WebDashboard />
      <DiagnosticActivity />
      <Testimonials />
      <Pricing />
      <FAQs />
      <FooterSection />
    </div>
  );
}
