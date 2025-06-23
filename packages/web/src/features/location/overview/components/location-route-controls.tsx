import { Route, Target } from "lucide-react";

import { Button } from "@/components/ui/button";

type LocationRouteControlsProps = {
  onCenterMap: () => void;
  onFitToBounds: () => void;
};

export function LocationRouteControls({ onCenterMap, onFitToBounds }: LocationRouteControlsProps) {
  return (
    <div className="mt-4 pt-4 border-t space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onCenterMap}
        className="w-full"
      >
        <Target className="mr-2 h-4 w-4" />
        Center Map
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onFitToBounds}
        className="w-full"
      >
        <Route className="mr-2 h-4 w-4" />
        Fit to Route
      </Button>
    </div>
  );
} 