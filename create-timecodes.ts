#!/usr/bin/env -S npx ts-node --files

import { context } from "./src/context";
import { getChapters } from "./src/chapters";
import { formatYoutubeTimecodes } from "./src/format/youtubeTimecodes";

(async () => {
  const chapters = await getChapters(context);
  console.log(formatYoutubeTimecodes(chapters));
})();
