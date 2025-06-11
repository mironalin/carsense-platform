import type { DiagnosticGetResponse } from "@/api/zod/z-diagnostics";
import type { LocationGetResponse } from "@/api/zod/z-locations";
import type { VehicleGetResponse } from "@/api/zod/z-vehicles";

export type VehicleWithParsedDates = Omit<VehicleGetResponse, "createdAt" | "updatedAt" | "deletedAt" | "odometerUpdatedAt"> & {
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  odometerUpdatedAt: string | null;
};

export type LocationWithParsedDates = Omit<LocationGetResponse, "timestamp"> & {
  timestamp: string;
};

export type DiagnosticWithParsedDates = Omit<DiagnosticGetResponse, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};
