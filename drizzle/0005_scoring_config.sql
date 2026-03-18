CREATE TABLE "scoring_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ld12_high_threshold" integer DEFAULT 75 NOT NULL,
	"ld12_good_threshold" integer DEFAULT 25 NOT NULL,
	"profile_shape_developing_mean" integer DEFAULT 35 NOT NULL,
	"profile_shape_spiky_std_dev" integer DEFAULT 20 NOT NULL,
	"values_high_threshold" integer DEFAULT 75 NOT NULL,
	"values_moderate_threshold" integer DEFAULT 25 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
