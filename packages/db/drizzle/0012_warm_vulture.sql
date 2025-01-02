ALTER TABLE "mutations" ALTER COLUMN "field" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mutations" ADD COLUMN "value" varchar(255);