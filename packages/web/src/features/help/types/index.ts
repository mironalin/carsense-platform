import type { LucideIcon } from "lucide-react";

export interface FAQ {
  question: string;
  answer: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface GettingStartedStep {
  number: number;
  title: string;
  description: string;
  icon?: LucideIcon;
} 