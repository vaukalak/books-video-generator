#!/usr/bin/env node

const fs = require("fs");
const { context } = require("./src/context");
const { exec } = require("./src/exec");

(async () => {
  const { book } = context;
  const files = fs.readdirSync(`out/${book}/chapters`);
  const manifest = files.map((f) => `file 'chapters/${f}'`).join("\n");
  fs.writeFileSync(`out/${book}/manifest.txt`, manifest);
  await exec(
    `ffmpeg -f concat -safe 0 -i out/${book}/manifest.txt -c copy out/${book}/output.mp4`
  );
})();
