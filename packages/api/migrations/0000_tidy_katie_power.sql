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
CREATE TABLE "diagnostics" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "diagnostics_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"vehicleId" integer,
	"odometer" integer NOT NULL,
	"locationLat" double precision,
	"locationLong" double precision,
	"notes" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dtcInstances" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dtcInstances_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"diagnosticId" integer NOT NULL,
	"codeRefId" integer NOT NULL,
	"confirmed" boolean,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dtcLibrary" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dtcLibrary_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"code" text NOT NULL,
	"description" text NOT NULL,
	"severity" "severity" NOT NULL,
	"affectedSystem" text,
	"category" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "dtcLibrary_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "locations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"vehicle_id" integer,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"accuracy" double precision,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenanceLog" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "maintenanceLog_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"vehicleId" integer NOT NULL,
	"serviceWorkshopId" integer NOT NULL,
	"customServiceWorkshopName" text,
	"serviceDate" timestamp NOT NULL,
	"serviceType" "serviceType" NOT NULL,
	"cost" double precision,
	"notes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensorSnapshots" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sensorSnapshots_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"diagnosticId" integer,
	"source" "source" DEFAULT 'obd2',
	"sensors" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "serviceWorkshops" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "serviceWorkshops_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
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
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "vehicles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"ownerId" text NOT NULL,
	"vin" text NOT NULL,
	"make" text NOT NULL,
	"model" text NOT NULL,
	"year" integer NOT NULL,
	"engineType" text NOT NULL,
	"fuelType" text NOT NULL,
	"transmissionType" text NOT NULL,
	"drivetrain" text NOT NULL,
	"licensePlate" text NOT NULL,
	"odometerUpdatedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "vehicles_vin_unique" UNIQUE("vin")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnostics" ADD CONSTRAINT "diagnostics_vehicleId_vehicles_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dtcInstances" ADD CONSTRAINT "dtcInstances_diagnosticId_diagnostics_id_fk" FOREIGN KEY ("diagnosticId") REFERENCES "public"."diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dtcInstances" ADD CONSTRAINT "dtcInstances_codeRefId_dtcLibrary_id_fk" FOREIGN KEY ("codeRefId") REFERENCES "public"."dtcLibrary"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "locations_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_vehicleId_vehicles_id_fk" FOREIGN KEY ("vehicleId") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenanceLog" ADD CONSTRAINT "maintenanceLog_serviceWorkshopId_serviceWorkshops_id_fk" FOREIGN KEY ("serviceWorkshopId") REFERENCES "public"."serviceWorkshops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorSnapshots" ADD CONSTRAINT "sensorSnapshots_diagnosticId_diagnostics_id_fk" FOREIGN KEY ("diagnosticId") REFERENCES "public"."diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_ownerId_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;