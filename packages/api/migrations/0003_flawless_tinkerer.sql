CREATE TYPE "public"."transfer_status" AS ENUM('pending', 'accepted', 'rejected', 'cancelled', 'expired');--> statement-breakpoint
CREATE TABLE "notifications" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"data" text,
	"isRead" text DEFAULT 'false' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transferRequests" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vehicleUUID" uuid NOT NULL,
	"fromUserId" text NOT NULL,
	"toUserEmail" text NOT NULL,
	"toUserId" text,
	"status" "transfer_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"requestedAt" timestamp DEFAULT now() NOT NULL,
	"respondedAt" timestamp,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagnostics" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferRequests" ADD CONSTRAINT "transferRequests_vehicleUUID_vehicles_uuid_fk" FOREIGN KEY ("vehicleUUID") REFERENCES "public"."vehicles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferRequests" ADD CONSTRAINT "transferRequests_fromUserId_user_id_fk" FOREIGN KEY ("fromUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferRequests" ADD CONSTRAINT "transferRequests_toUserId_user_id_fk" FOREIGN KEY ("toUserId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;