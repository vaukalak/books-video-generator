import { Chapter, Timing } from "../context";

export function formatYoutubeTimecodes(stories: Chapter[], timings: Timing[]): string {
  return timings
    .map(({ startTimeSec: startTime }, i) => {
      const date = new Date(startTime * 1000);
      const isoDate = date.toISOString();
      const time = `${isoDate.substring(11, 19)}`;
      return `${time} ${stories[i].name}`;
    })
    .join("\n");
}
