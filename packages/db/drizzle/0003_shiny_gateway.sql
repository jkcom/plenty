ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT '6GKfUPA4efcFnxD0E_iAA';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "providerId" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "provider_id";