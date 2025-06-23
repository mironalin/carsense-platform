import { format, parseISO } from "date-fns";

import type { MaintenanceEntry, ServiceType } from "../types";

import { SERVICE_TYPE_CATEGORIES, SERVICE_TYPE_LABELS } from "../types";

/**
 * Format a service date for display
 */
export function formatServiceDate(date: string): string {
  try {
    return format(parseISO(date), "MMM dd, yyyy");
  }
  catch {
    return "Invalid date";
  }
}

/**
 * Format a service date with time for detailed view
 */
export function formatServiceDateTime(date: string): string {
  try {
    return format(parseISO(date), "MMM dd, yyyy 'at' h:mm a");
  }
  catch {
    return "Invalid date";
  }
}

/**
 * Format cost for display
 */
export function formatCost(cost: number | null): string {
  if (cost === null || cost === undefined) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cost);
}

/**
 * Format odometer reading for display
 */
export function formatOdometer(odometer: number | null): string {
  if (odometer === null || odometer === undefined) {
    return "N/A";
  }
  return new Intl.NumberFormat("en-US").format(odometer);
}

/**
 * Get display label for service type
 */
export function getServiceTypeLabel(serviceType: ServiceType): string {
  return SERVICE_TYPE_LABELS[serviceType] || serviceType;
}

/**
 * Get service type category
 */
export function getServiceTypeCategory(serviceType: ServiceType): string {
  for (const [category, types] of Object.entries(SERVICE_TYPE_CATEGORIES)) {
    if ((types as readonly ServiceType[]).includes(serviceType)) {
      return category;
    }
  }
  return "Other";
}

/**
 * Sort maintenance entries by date (newest first)
 */
export function sortMaintenanceByDate(entries: MaintenanceEntry[]): MaintenanceEntry[] {
  return [...entries].sort((a, b) =>
    new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime(),
  );
}

/**
 * Filter maintenance entries by service type
 */
export function filterMaintenanceByType(
  entries: MaintenanceEntry[],
  serviceType: ServiceType | null,
): MaintenanceEntry[] {
  if (!serviceType)
    return entries;
  return entries.filter(entry => entry.serviceTypes.includes(serviceType));
}

/**
 * Filter maintenance entries by date range
 */
export function filterMaintenanceByDateRange(
  entries: MaintenanceEntry[],
  startDate: Date | null,
  endDate: Date | null,
): MaintenanceEntry[] {
  return entries.filter((entry) => {
    const entryDate = parseISO(entry.serviceDate);

    if (startDate && entryDate < startDate)
      return false;
    if (endDate && entryDate > endDate)
      return false;

    return true;
  });
}

/**
 * Get maintenance summary statistics
 */
export function getMaintenanceSummary(entries: MaintenanceEntry[]) {
  const totalEntries = entries.length;
  const totalCost = entries.reduce((sum, entry) => sum + (entry.cost || 0), 0);

  const serviceTypeCounts = entries.reduce((acc, entry) => {
    entry.serviceTypes.forEach((serviceType) => {
      acc[serviceType] = (acc[serviceType] || 0) + 1;
    });
    return acc;
  }, {} as Record<ServiceType, number>);

  const mostCommonService = Object.entries(serviceTypeCounts)
    .sort(([, a], [, b]) => b - a)[0];

  const lastService = entries.length > 0
    ? sortMaintenanceByDate(entries)[0]
    : null;

  return {
    totalEntries,
    totalCost,
    serviceTypeCounts,
    mostCommonService: mostCommonService
      ? { type: mostCommonService[0] as ServiceType, count: mostCommonService[1] }
      : null,
    lastService,
  };
}

/**
 * Get workshop display name (custom name or workshop name)
 */
export function getWorkshopDisplayName(entry: MaintenanceEntry): string {
  if (entry.customServiceWorkshopName) {
    return entry.customServiceWorkshopName;
  }

  if (entry.workshop?.name) {
    return entry.workshop.name;
  }

  return "Unknown Workshop";
}

/**
 * Check if maintenance entry is recent (within last 30 days)
 */
export function isRecentMaintenance(entry: MaintenanceEntry): boolean {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const entryDate = parseISO(entry.serviceDate);
  return entryDate >= thirtyDaysAgo;
}
