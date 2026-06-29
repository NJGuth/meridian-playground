ALTER TABLE "voice_concepts" ADD COLUMN "warmth" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "cooperativeness" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "aggression" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "patience" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "volatility" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "tolerance" integer DEFAULT 50 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "reactivity_enabled" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "mood_triggers" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "hidden_agenda" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "agenda_unlock_condition" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "target_duration_minutes" integer;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "auto_end_on_expiry" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "voice_concepts" ADD COLUMN "variation_enabled" integer DEFAULT 0 NOT NULL;