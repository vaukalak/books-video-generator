const fs = require("fs");
const cp = require("child_process");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");
const { format } = require("date-fns");

const exec = (command) => {
  return new Promise((res, rej) => {
    console.log(command);
    cp.exec(command, function (err, stdout, stderr) {
      if (err) {
        console.error(err);
        rej(new Error(err));
      } else {
        res(stdout);
      }
    });
  });
};

(async () => {
  const files = fs.readdirSync("out");
  const manifest = files
    .filter((f) => f.indexOf("404_") !== -1)
    .map((f) => `file '${f}'`)
    .join("\n");
//   console.log(manifest);
  fs.writeFileSync("out/manifest.txt", manifest);
  await exec(
    "ffmpeg -f concat -safe 0 -i out/manifest.txt -c copy out/output.mp4"
  );
})();
