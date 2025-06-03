CREATE TYPE "public"."roles" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."serviceType" AS ENUM('oil_change', 'brake_replacement', 'engine_diagnostics', 'tire_rotation', 'battery_replacement', 'coolant_flush', 'transmission_service', 'general_inspection', 'timing_belt_replacement', 'timing_chain_replacement', 'spark_plug_replacement', 'air_filter_replacement', 'fuel_filter_replacement', 'ac_service', 'suspension_inspection', 'wheel_alignment', 'exhaust_repair', 'clutch_replacement', 'software_update', 'engine_overhaul');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('obd2', 'user_input', 'ai_estimated', 'simulated');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"public_key" text NOT NULL,
	"private_key" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"role" "roles" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "diagnosticDTC" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnosticUUID" uuid NOT NULL,
	"code" text NOT NULL,
	"confirmed" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "diagnostics" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleUUID" uuid NOT NULL,
	"odometer" integer NOT NULL,
	"locationLat" double precision,
	"locationLong" double precision,
	"notes" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dtcLibrary" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"severity" "severity" NOT NULL,
	"affectedSystem" text,
	"category" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dtcLibrary_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleUUID" uuid NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"accuracy" double precision,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenanceLog" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleUUID" uuid NOT NULL,
	"serviceWorkshopUUID" uuid NOT NULL,
	"customServiceWorkshopName" text,
	"serviceDate" timestamp NOT NULL,
	"serviceType" "serviceType" NOT NULL,
	"cost" double precision,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ownershipTransfers" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleUUID" uuid NOT NULL,
	"fromUserId" text NOT NULL,
	"toUserId" text NOT NULL,
	"transferredAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensorReadings" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sensorSnapshotsUUID" uuid NOT NULL,
	"pid" text NOT NULL,
	"value" double precision NOT NULL,
	"unit" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensorSnapshots" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"diagnosticUUID" uuid NOT NULL,
	"source" "source" DEFAULT 'obd2',
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serviceWorkshops" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"servicesOffered" jsonb,
	"rating" double precision,
	"phone" text,
	"email" text,
	"website" text,
	"operatingHours" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ownerId" text NOT NULL,
	"vin" text,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"engineType" text NOT NULL,
	"fuelType" text NOT NULL,
	"transmissionType" text NOT NULL,
	"drivetrain" text NOT NULL,
	"licensePlate" text NOT NULL,
	"odometerUpdatedAt" timestamp DEFAULT now(),
	"deletedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vehicles_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_diagnosticUUID_diagnostics_uuid_fk" FOREIGN KEY ("diagnosticUUID") REFERENCES "public"."diagnostics"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_code_dtcLibrary_code_fk" FOREIGN KEY ("code") REFERENCES "public"."dtcLibrary"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_serviceWorkshopUUID_serviceWorkshops_uuid_fk" FOREIGN KEY ("serviceWorkshopUUID") REFERENCES "public"."serviceWorkshops"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ADD CONSTRAINT "ownershipTransfers_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ADD CONSTRAINT "ownershipTransfers_fromUserId_user_id_fk" FOREIGN KEY ("fromUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ownershipTransfers" ADD CONSTRAINT "ownershipTransfers_toUserId_user_id_fk" FOREIGN KEY ("toUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorReadings" ADD CONSTRAINT "sensorReadings_sensorSnapshotsUUID_sensorSnapshots_uuid_fk" FOREIGN KEY ("sensorSnapshotsUUID") REFERENCES "public"."sensorSnapshots"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorSnapshots" ADD CONSTRAINT "sensorSnapshots_diagnosticUUID_diagnostics_uuid_fk" FOREIGN KEY ("diagnosticUUID") REFERENCES "public"."diagnostics"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;