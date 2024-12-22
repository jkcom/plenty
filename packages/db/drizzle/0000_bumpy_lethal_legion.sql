CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY DEFAULT 'KcU470bxbPQHFxwwGjFbs' NOT NULL,
	"name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
