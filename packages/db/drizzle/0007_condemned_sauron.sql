ALTER TABLE "accounts" DROP CONSTRAINT "accounts_accountName_unique";--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "slug" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "accountName";--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_slug_unique" UNIQUE("slug");