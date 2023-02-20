const yaml = require("yaml");
const book = process.env.BOOK;

if (!book) {
  throw new Error("define BOOK!");
}

const context = {
  book,
};

module.exports = { context };
