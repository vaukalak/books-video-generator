#!/usr/bin/env -S npx ts-node --files

import * as fs from "fs-extra";
// @ts-ignore
import { context } from "./src/context";
// @ts-ignore
import { exec } from "./src/exec";

(async () => {
  const { book } = context;
  const files = fs.readdirSync(`out/${book}/chapters`);
  const manifest = files.map((f) => `file 'chapters/${f}'`).join("\n");
  await fs.writeFile(`out/${book}/manifest.txt`, manifest);
  await exec(
    `ffmpeg -f concat -safe 0 -i out/${book}/manifest.txt -c copy out/${book}/output.mp4`
  );
})();
