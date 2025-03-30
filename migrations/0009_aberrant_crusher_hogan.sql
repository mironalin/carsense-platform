ALTER TABLE "diagnosticDTC" DROP CONSTRAINT "diagnosticDTC_codeRefId_dtcLibrary_id_fk";
--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD COLUMN "code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" ADD CONSTRAINT "diagnosticDTC_code_dtcLibrary_code_fk" FOREIGN KEY ("code") REFERENCES "public"."dtcLibrary"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "diagnosticDTC" DROP COLUMN "codeRefId";