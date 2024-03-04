#!/usr/bin/env -S npx ts-node --files

import { context } from "./src/context";
import { getChapterNames } from "./src/getChapterNames";
import { getTimings } from "./src/getTimings";
import { formatYoutubeTimecodes } from "./src/format/youtubeTimecodes";

(async () => {
  const chapters = await getChapterNames(context);
  const durations = await getTimings(context, chapters);
  console.log(formatYoutubeTimecodes(chapters, durations));
})();
