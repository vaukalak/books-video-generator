import * as fs from "fs";
import { parse } from "csv-parse";
import { finished } from"stream/promises";
import { Chapter, Context } from "./context";

export function fid(id: number): string {
  return `${"0".repeat(3 - id.toString().length)}${id}`;
}

export async function getChapterNames(context: Context): Promise<Chapter[]> {
  const { book } = context;
  const records: Array<[number, string]> = [];
  const parser = fs.createReadStream(`resource/${book}/chapters.csv`).pipe(
    parse({
      // CSV options if any
    })
  );
  parser.on("readable", function () {
    let record;
    while ((record = parser.read()) !== null) {
      // Work with each record
      records.push(record);
    }
  });
  await finished(parser);
  return records.slice(1).map(([id, name]) => ({ id, name }));
}

