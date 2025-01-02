CREATE TABLE "mutations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"model" varchar(255) NOT NULL,
	"objectId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"field" varchar(255) NOT NULL,
	"userId" varchar(255),
	"accountId" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "mutations" ADD CONSTRAINT "mutations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mutations" ADD CONSTRAINT "mutations_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;