import { Chapter } from "../context";

export function formatYoutubeTimecodes(chapters: Chapter[]): string {
  return chapters
    .map(({ name, timing }) => {
      const date = new Date(timing.startTimeSec * 1000);
      const isoDate = date.toISOString();
      const time = `${isoDate.substring(11, 19)}`;
      return `${time} ${name}`;
    })
    .join("\n");
}
