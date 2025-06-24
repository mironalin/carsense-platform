import type { HealthTrend } from "../types";

export function calculateTrend(healthTrends: HealthTrend[]): "up" | "down" | "stable" {
  if (healthTrends.length < 2)
    return "stable";

  const recent = healthTrends.slice(-3).map(t => t.healthScore);
  const firstHalf = recent.slice(0, Math.ceil(recent.length / 2));
  const secondHalf = recent.slice(Math.ceil(recent.length / 2));
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;

  if (secondAvg > firstAvg + 2)
    return "up";
  if (secondAvg < firstAvg - 2)
    return "down";
  return "stable";
}

export function getCurrentScore(healthTrends: HealthTrend[]): number {
  return healthTrends.length > 0 ? healthTrends[healthTrends.length - 1].healthScore : 100;
}

export function getTotalKilometers(healthTrends: HealthTrend[]): number {
  return healthTrends.reduce((sum, trend) => sum + trend.dailyMileage, 0);
}

export function getHealthStatusColor(score: number): string {
  if (score >= 95)
    return "text-emerald-600 dark:text-emerald-400";
  if (score >= 85)
    return "text-green-600 dark:text-green-400";
  if (score >= 70)
    return "text-yellow-600 dark:text-yellow-400";
  if (score >= 55)
    return "text-orange-600 dark:text-orange-400";
  if (score >= 40)
    return "text-red-600 dark:text-red-400";
  return "text-red-700 dark:text-red-500";
}

export function getHealthStatusText(score: number): string {
  if (score >= 95)
    return "Excellent";
  if (score >= 85)
    return "Very Good";
  if (score >= 70)
    return "Good";
  if (score >= 55)
    return "Fair";
  if (score >= 40)
    return "Poor";
  return "Critical";
}

export function getHealthStatusDescription(score: number): string {
  if (score >= 95)
    return "Vehicle is in optimal condition";
  if (score >= 85)
    return "Minor issues, well maintained";
  if (score >= 70)
    return "Some concerns, monitor closely";
  if (score >= 55)
    return "Needs attention soon";
  if (score >= 40)
    return "Requires immediate service";
  return "Serious issues detected";
}

export function formatKilometers(kilometers: number): string {
  return new Intl.NumberFormat("en-US").format(kilometers);
}
