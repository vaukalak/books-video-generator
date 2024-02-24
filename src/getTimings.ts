
import { Chapter, Context, Timing } from "./context";
import { exec } from "./exec";
import { fid } from "./getChapterNames";

export async function getTimings(context: Context, chapters: Chapter[]): Promise<Timing[]> {
  const { book } = context;
  console.log('\nGetting audio files lengths:');
  const durations: string[] = await Promise.all(
      chapters.map((s) => {
        return exec(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 resource/${book}/audio/${fid(
            s.id
          )}.mp3`
        );
      })
    );
  let startTime = 0;
  return durations.map((v) => {
    const duration = parseFloat(v);
    const result: Timing = {
      durationSec: duration,
      startTimeSec: startTime,
    };
    startTime += duration;
    return result;
  });
}