CREATE TABLE "maintenanceLogServices" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"maintenanceLogUUID" uuid NOT NULL,
	"serviceType" "serviceType" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "maintenanceLogServices" ADD CONSTRAINT "maintenanceLogServices_maintenanceLogUUID_maintenanceLog_uuid_fk" FOREIGN KEY ("maintenanceLogUUID") REFERENCES "public"."maintenanceLog"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" DROP COLUMN "serviceType";