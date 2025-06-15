import type { DiagnosticSession } from "@/features/charts/types";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { MultiDiagnosticSessionSelector, SelectedSessionsBadges } from "./multi-diagnostic-session-selector";

type SessionSelectionContainerProps = {
  sessions: DiagnosticSession[];
  selectedSessions: string[];
  onSessionsChange: (sessions: string[]) => void;
  onRemoveSession: (sessionId: string) => void;
  isLoading: boolean;
  sessionColors: string[];
  maxSelections?: number;
};

export function SessionSelectionContainer({
  sessions,
  selectedSessions,
  onSessionsChange,
  onRemoveSession,
  isLoading,
  sessionColors,
  maxSelections = 3,
}: SessionSelectionContainerProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Sensor Comparison</CardTitle>
            <CardDescription>
              Compare sensor data across multiple diagnostic sessions
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <MultiDiagnosticSessionSelector
              sessions={sessions}
              selectedSessions={selectedSessions}
              onSessionsChange={onSessionsChange}
              isLoading={isLoading}
              maxSelections={maxSelections}
            />
          </div>
        </div>

        {/* Display selected sessions as badges */}
        <SelectedSessionsBadges
          sessions={sessions}
          selectedSessions={selectedSessions}
          onRemoveSession={onRemoveSession}
          sessionColors={sessionColors}
        />
      </CardHeader>
    </Card>
  );
}
