ALTER TABLE "diagnosticDTC" RENAME COLUMN "diagnosticId" TO "diagnosticUUID";--> statement-breakpoint
ALTER TABLE "diagnostics" RENAME COLUMN "vehicleId" TO "vehicleUUID";--> statement-breakpoint
ALTER TABLE "locations" RENAME COLUMN "vehicle_id" TO "vehicleUUID";--> statement-breakpoint
ALTER TABLE "maintenanceLog" RENAME COLUMN "vehicleId" TO "vehicleUUID";--> statement-breakpoint
ALTER TABLE "maintenanceLog" RENAME COLUMN "serviceWorkshopId" TO "serviceWorkshopUUID";--> statement-breakpoint
ALTER TABLE "ownershipTransfers" RENAME COLUMN "vehicleId" TO "vehicleUUID";--> statement-breakpoint
ALTER TABLE "sensorReadings" RENAME COLUMN "sensorSnapshotsId" TO "sensorSnapshotsUUID";--> statement-breakpoint
ALTER TABLE "sensorSnapshots" RENAME COLUMN "diagnosticId" TO "diagnosticUUID";--> statement-breakpoint
ALTER TABLE "diagnosticDTC" DROP CONSTRAINT "diagnosticDTC_diagnosticId_diagnostics_id_fk";
--> statement-breakpoint
ALTER TABLE "diagnostics" DROP CONSTRAINT "diagnostics_vehicleId_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "locations_vehicle_id_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "maintenanceLog" DROP CONSTRAINT "maintenanceLog_vehicleId_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "maintenanceLog" DROP CONSTRAINT "maintenanceLog_serviceWorkshopId_serviceWorkshops_id_fk";
--> statement-breakpoint
ALTER TABLE "ownershipTransfers" DROP CONSTRAINT "ownershipTransfers_vehicleId_vehicles_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorReadings" DROP CONSTRAINT "sensorReadings_sensorSnapshotsId_sensorSnapshots_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorSnapshots" DROP CONSTRAINT "sensorSnapshots_diagnosticId_diagnostics_id_fk";
--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "diagnostics" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "dtcLibrary" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "dtcLibrary" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "maintenanceLog" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ALTER COLUMN "fromUserId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ALTER COLUMN "toUserId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "sensorReadings" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "sensorReadings" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sensorSnapshots" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "sensorSnapshots" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "serviceWorkshops" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "serviceWorkshops" ALTER COLUMN "uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD PRIMARY KEY ("uuid");--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "ownerId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "vin" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_diagnosticUUID_diagnostics_uuid_fk" FOREIGN KEY ("diagnosticUUID") REFERENCES "public"."diagnostics"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_serviceWorkshopUUID_serviceWorkshops_uuid_fk" FOREIGN KEY ("serviceWorkshopUUID") REFERENCES "public"."serviceWorkshops"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ADD CONSTRAINT "ownershipTransfers_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorReadings" ADD CONSTRAINT "sensorReadings_sensorSnapshotsUUID_sensorSnapshots_uuid_fk" FOREIGN KEY ("sensorSnapshotsUUID") REFERENCES "public"."sensorSnapshots"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorSnapshots" ADD CONSTRAINT "sensorSnapshots_diagnosticUUID_diagnostics_uuid_fk" FOREIGN KEY ("diagnosticUUID") REFERENCES "public"."diagnostics"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "diagnostics" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "dtcLibrary" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "maintenanceLog" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "ownershipTransfers" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "sensorReadings" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "sensorSnapshots" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "serviceWorkshops" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "vehicles" DROP COLUMN "id";