#!/usr/bin/env -S npx ts-node --files
import * as fs from "fs-extra";

const book = process.env.BOOK;

if (!book) {
  throw new Error("define BOOK!");
}

(async () => {
  fs.mkdirSync("resource", { recursive: true });
  fs.copySync("sample", `resource/${book}`);
  console.info(`book created: ${book}`);
})();
