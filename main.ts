// Haunted Server Room Sign — a make.fun program/v1 entry.
//
// The competition asks for one funny line for the door of a haunted
// server room, at most 120 characters. The line below is the sign
// itself: a ghost has moved into rack 4, and a reboot would be an
// eviction notice. The program has one job — check the line against
// the gate (a single line, 1 to 120 characters, not blank) and write
// it to /output/entry.txt, where the judge reads it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const SIGN =
  "DO NOT REBOOT RACK 4. I LIVE THERE NOW. — THE GHOST";

const MAX_CHARS = 120;
const OUTPUT_PATH = "/output/entry.txt";

function problemsWith(line: string): string[] {
  const problems: string[] = [];
  if (line.trim().length === 0) problems.push("entry is blank");
  if (line.length > MAX_CHARS) {
    problems.push(
      `entry is ${line.length} characters, over the ${MAX_CHARS} limit`,
    );
  }
  if (/[\r\n]/.test(line)) problems.push("entry must be a single line");
  return problems;
}

function publish(line: string): void {
  const problems = problemsWith(line);
  if (problems.length > 0) {
    throw new Error(`invalid entry: ${problems.join("; ")}`);
  }
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, line, "utf8");
  // Read it back: what the judge sees must be exactly the sign.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== line) {
    throw new Error("round-trip check failed: file differs from the sign");
  }
  console.log(`Wrote ${line.length} characters to ${OUTPUT_PATH}`);
}

publish(SIGN);
