CREATE TABLE IF NOT EXISTS "users_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"pw" text NOT NULL,
	"content" json,
	"misc" json,
	CONSTRAINT "users_table_email_unique" UNIQUE("email")
);
