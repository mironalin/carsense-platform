ALTER TABLE "diagnostics" ALTER COLUMN "vehicleId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "diagnostics" ALTER COLUMN "updatedAt" SET DEFAULT now();