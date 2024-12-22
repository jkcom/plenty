CREATE TABLE "accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"accountName" varchar(255) NOT NULL,
	CONSTRAINT "accounts_accountName_unique" UNIQUE("accountName")
);
--> statement-breakpoint
CREATE TABLE "account_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"accountId" varchar(255) NOT NULL,
	"userId" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account_user" ADD CONSTRAINT "account_user_accountId_accounts_id_fk" FOREIGN KEY ("accountId") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_user" ADD CONSTRAINT "account_user_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;