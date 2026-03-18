import { readFileSync } from "fs";
import { join } from "path";

export const AIIR_COACHING_GUIDE = readFileSync(
  join(process.cwd(), "src/lib/frameworks/aiir-coaching-guide.md"),
  "utf-8",
);
