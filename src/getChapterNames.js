const fs = require("fs");
const { parse } = require("csv-parse");
const { finished } = require("stream/promises");
const { exec } = require("./exec");

const fid = (s) => `${"0".repeat(3 - s.toString().length)}${s}`;

const getChapterNames = async (context) => {
  const { book } = context;
  const records = [];
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
};

module.exports = {
  fid,
  getChapterNames,
};
