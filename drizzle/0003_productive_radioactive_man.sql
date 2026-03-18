ALTER TABLE "playgrounds" ADD COLUMN "role_description" text DEFAULT 'AI leadership coach specializing in the AIIR Leadership Framework' NOT NULL;--> statement-breakpoint
ALTER TABLE "playgrounds" ADD COLUMN "feedback_style" text DEFAULT 'Reflective' NOT NULL;--> statement-breakpoint
ALTER TABLE "playgrounds" ADD COLUMN "coaching_posture" text DEFAULT 'Exploratory' NOT NULL;