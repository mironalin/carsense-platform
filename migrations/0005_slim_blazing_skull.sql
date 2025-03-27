CREATE TABLE "sensorReadings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sensorReadings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uuid" uuid DEFAULT gen_random_uuid(),
	"sensorSnapshotsId" integer,
	"pid" text NOT NULL,
	"value" double precision NOT NULL,
	"unit" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dtcInstances" RENAME TO "diagnosticDTC";--> statement-breakpoint
ALTER TABLE "diagnosticDTC" DROP CONSTRAINT "dtcInstances_diagnosticId_diagnostics_id_fk";
--> statement-breakpoint
ALTER TABLE "diagnosticDTC" DROP CONSTRAINT "dtcInstances_codeRefId_dtcLibrary_id_fk";
--> statement-breakpoint
ALTER TABLE "sensorReadings" ADD CONSTRAINT "sensorReadings_sensorSnapshotsId_sensorSnapshots_id_fk" FOREIGN KEY ("sensorSnapshotsId") REFERENCES "public"."sensorSnapshots"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_diagnosticId_diagnostics_id_fk" FOREIGN KEY ("diagnosticId") REFERENCES "public"."diagnostics"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_codeRefId_dtcLibrary_id_fk" FOREIGN KEY ("codeRefId") REFERENCES "public"."dtcLibrary"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensorSnapshots" DROP COLUMN "sensors";