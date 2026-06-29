CREATE TABLE "voice_concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text DEFAULT 'Untitled' NOT NULL,
	"voice" text DEFAULT 'alloy' NOT NULL,
	"persona" text DEFAULT '' NOT NULL,
	"script" text DEFAULT '' NOT NULL,
	"rules" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"opening_line" text DEFAULT '' NOT NULL,
	"context_notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
