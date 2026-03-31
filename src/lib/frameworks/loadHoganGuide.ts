import { readFileSync } from "fs";
import { join } from "path";

export const HOGAN_INTERPRETATION_GUIDE = readFileSync(
  join(process.cwd(), "src/lib/frameworks/hogan-guide.md"),
  "utf-8",
);
