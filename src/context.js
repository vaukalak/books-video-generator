const fs = require("fs");
const { parse } = require("yaml");
const book = process.env.BOOK;

if (!book) {
  throw new Error("define BOOK!");
}

const config = parse(fs.readFileSync(`resource/${book}/config.yml`).toString());

const context = {
  book,
  config,
};

module.exports = { context };
