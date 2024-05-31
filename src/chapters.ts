import * as fs from "fs";
import { parse } from "csv-parse";
import { finished } from "stream/promises";
import { Chapter, Context, Timing } from "./context";
import { exec } from "./exec";

export function fid(id: number): string {
  return `${"0".repeat(3 - id.toString().length)}${id}`;
}

function getSourceAudio(context: Context, chapterId: number): string {
  const file = `resource/${context.book}/audio/${fid(chapterId)}.mp3`;
  if (!fs.existsSync(file)) {
    throw new Error(`File ${file} not found`);
  }
  return file;
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

