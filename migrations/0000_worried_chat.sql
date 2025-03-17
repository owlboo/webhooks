CREATE TABLE "folder" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"headers" json,
	"url" varchar,
	"method" varchar,
	"query" varchar,
	"body" json,
	"client_ip" varchar,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"folder_id" uuid,
	"tag" varchar,
	"is_read" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "incoming_webhooks_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folder"("id") ON DELETE no action ON UPDATE no action;