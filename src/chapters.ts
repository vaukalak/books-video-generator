import * as fs from "fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";
import { Chapter, Context, Timing } from "./context";
import { exec } from "./exec";

function pad(num: number, size: number): string {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

export function fid(id: number): string {
  return pad(id, 3);
}

function getSourceAudio(context: Context, chapterId: number): string {
  // Try to find audio file with 1, 2 or 3 digits as it's common for audio files to have
  // xx.mp3 or xxx.mp3 formats.
  for (let i = 1; i <= 3; i++) {
    const paddedChapter = pad(chapterId, i);
    const file = `resource/${context.book}/audio/${paddedChapter}.mp3`;
    if (fs.existsSync(file)) {
      return file;
    }
  }
  throw new Error(
    `Audio file for chapter ${chapterId} not found in resource/${context.book}/audio/`);
}

function getGeneratedVideoFile(context: Context, chapterId: number): string {
  return `${context.outDir}/chapters/${fid(chapterId)}.${context.config.output_video_format}`
}

async function getTimings(audioFiles: string[]): Promise<Timing[]> {
  console.log('\nGetting audio files lengths:');
  const durations: string[] = await Promise.all(
    audioFiles.map((file) => {
      return exec(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${file}`
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

async function createOneSecSilence(context: Context): Promise<string> {
  const file = `${context.outDir}/1sec.mp3`;
  await exec(`ffmpeg -y -f lavfi -i 'anullsrc=duration=1' ${file}`);
  return file;
}

/**
 * Creates chapters for given book/context. 
 */
export async function getChapters(context: Context): Promise<Chapter[]> {
  const { book } = context;
  const records: Array<[number, string]> = [];
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
  const oneSecFile = await createOneSecSilence(context);
  const audioFiles = records.slice(1).map(([id]) => {
    return context.config.preview_covers ? oneSecFile : getSourceAudio(context, id);
  });
  const timings = await getTimings(audioFiles);
  return records.slice(1).map(([id, name], ind): Chapter => {
    return {
      id,
      name,
      sourceAudioFile: audioFiles[ind],
      timing: timings[ind],
      generatedVideoFile: getGeneratedVideoFile(context, id),
    }
  });
}

