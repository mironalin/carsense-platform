import { createFileRoute } from "@tanstack/react-router";

import DownloadHeroSection from "@/features/download/components/download-hero-section";
import { useLenis } from "@/features/landing-page/hooks/use-lenis";

export const Route = createFileRoute("/_landing-page/download/")({
  component: RouteComponent,
});

function RouteComponent() {
  useLenis();

  return (
    <div>
      <DownloadHeroSection />
    </div>
  );
}
