import { Database, Shield } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { DiagnosticDTCWithInfo } from "../types";

type DTCsHeaderProps = {
  dtcs: DiagnosticDTCWithInfo[];
};

export function DTCsHeader({ dtcs }: DTCsHeaderProps) {
  return (
    <CardHeader className="pb-2 pt-3 px-4 flex-shrink-0">
      <div className="flex flex-wrap items-center justify-between gap-y-2">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Diagnostic Trouble Codes</CardTitle>
          </div>
          <CardDescription>
            {dtcs.length}
            {" "}
            {dtcs.length === 1 ? "DTC" : "DTCs"}
            {" "}
            found in this diagnostic session
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date(dtcs[0]?.createdAt || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </CardHeader>
  );
}
