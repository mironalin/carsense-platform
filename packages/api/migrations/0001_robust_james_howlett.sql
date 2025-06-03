ALTER TABLE "locations" RENAME COLUMN "createdAt" TO "timestamp";--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "altitude" double precision;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "speed" double precision;--> statement-breakpoint
ALTER TABLE "locations" DROP COLUMN "updatedAt";