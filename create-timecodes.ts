#!/usr/bin/env -S npx ts-node --files

// @ts-ignore
import { context } from "./src/context";
// @ts-ignore
import { getChapterNames } from "./src/getChapterNames";
// @ts-ignore
import { getTimings } from "./src/getTimings";
// @ts-ignore
import { formatYoutubeTimecodes } from "./src/format/youtubeTimecodes";

(async () => {
  const chapters = await getChapterNames(context);
  const durations = await getTimings(context, chapters);
  console.log(formatYoutubeTimecodes(chapters, durations));
})();
