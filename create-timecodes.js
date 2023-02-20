#!/usr/bin/env node
const { context } = require("./src/context");
const { getChapterNames } = require("./src/getChapterNames");
const { getTimings } = require("./src/getTimings");
const { formatYoutubeTimecodes } = require("./src/format/youtubeTimecodes");

(async () => {
  const chapters = await getChapterNames(context);
  const durations = await getTimings(context, chapters);
  console.log(formatYoutubeTimecodes(chapters, durations));
})();
