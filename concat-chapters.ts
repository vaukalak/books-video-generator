#!/usr/bin/env -S npx ts-node --files

import * as fs from "fs-extra";
import { context } from "./src/context";
import { exec } from "./src/exec";

(async () => {
  const { book, config } = context;
  const files = fs.readdirSync(`out/${book}/chapters`);
  const manifest = files.map((f) => `file 'chapters/${f}'`).join("\n");
  await fs.writeFile(`out/${book}/manifest.txt`, manifest);
  await exec(
    `ffmpeg -f concat -safe 0 -i out/${book}/manifest.txt -c copy out/${book}/output.${config.output_video_format}`
  );
})();
