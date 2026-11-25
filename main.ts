// Snooze Button Roast — batch 16 entry for make.fun.
// One line roasting the alarm that rings at 6 a.m. on a Saturday.
// Writes the line to $MAKEFUN_OUTPUT_DIR/entry.txt.
import * as fs from "node:fs";
import { join } from "node:path";

interface EntrySpec {
  readonly text: string;
  readonly limit: number;
}

const SPEC: EntrySpec = Object.freeze({
  text: "The alarm rang at 6 a.m. on a Saturday. I hit snooze so hard the button filed for workers' comp. It has one job and it still shows up early.",
  limit: 200,
});

class LineWriter {
  private readonly folder: string;
  constructor(folder: string) {
    this.folder = folder;
  }
  private check(spec: EntrySpec): void {
    const body = spec.text.trim();
    if (body.length === 0) throw new Error("entry is empty");
    if (body.length > spec.limit) {
      throw new Error(`entry is ${body.length} chars, limit is ${spec.limit}`);
    }
    if (body.includes("\n")) throw new Error("entry must be a single line");
    if (!/^[A-Z]/.test(body)) throw new Error("entry should start with a capital");
  }
  write(spec: EntrySpec): string {
    this.check(spec);
    fs.mkdirSync(this.folder, { recursive: true });
    const file = join(this.folder, "entry.txt");
    fs.writeFileSync(file, spec.text.trim(), "utf8");
    return file;
  }
}

const dir = process.env.MAKEFUN_OUTPUT_DIR;
if (!dir) throw new Error("MAKEFUN_OUTPUT_DIR is not set");
const writer = new LineWriter(dir);
const written = writer.write(SPEC);
console.log(`wrote ${SPEC.text.length} chars to ${written}`);
