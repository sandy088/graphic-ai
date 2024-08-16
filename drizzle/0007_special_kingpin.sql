CREATE TABLE IF NOT EXISTS "element" (
	"name" text NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"elementType" text NOT NULL,
	"elementUrl" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "element_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nameIdx" ON "element" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "elementTypeIdx" ON "element" USING btree ("elementType");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "elementIdIdx" ON "element" USING btree ("id");