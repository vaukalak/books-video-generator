import * as fs from "fs";
import { exec } from "./exec";
import { getChapters } from "./chapters";
import { Chapter, Context } from "./context";

async function sleep(): Promise<undefined> {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
}

function clean(context: Context) {
  try {
    fs.rmSync(context.outDir, { force: true, recursive: true });
  } catch { }
}

async function generateChapterVideoFromImage(context: Context, chapter: Chapter) {
  const tempDir = `${context.outDir}/temp`;
  fs.mkdirSync(tempDir, { recursive: true });
  const format = context.config.output_video_format;

  // Generate 1sec video containing chapter name.
  const drawText = `-filter_complex "${context.renderText(chapter)}"`;
  const oneSecVideo = `${tempDir}/1sec_${chapter.id}.${format}`;
  await exec(`ffmpeg -y -framerate 24 ${context.renderBackground(
    chapter.timing
  )} ${drawText} -pix_fmt yuv420p -c:v libx264 -preset veryfast -t 1 ${oneSecVideo}`);

  // Generate full length video with no sound by repeating 1sec video.
  // Video length has to be integer so we make the video slightly
  // longer than audio length. It will be cut to the audio length at the next step.
  const fullVideoNoSound = `${tempDir}/full_no_sound_${chapter.id}.${format}`;
  const duration = Math.ceil(chapter.timing.durationSec);
  await exec(`ffmpeg -stream_loop ${duration} -i ${oneSecVideo} -c copy ${fullVideoNoSound}`);

  // Add sound
  await exec(
    `ffmpeg -y -t ${chapter.timing.durationSec} -i ${fullVideoNoSound}  -i ${chapter.sourceAudioFile} -c copy -map 0:v:0 -map 1:a:0 ${chapter.generatedVideoFile}`
  );
}

async function generateChapterVideoFromVideo(context: Context, chapter: Chapter) {
  const inclusions = `${context.renderBackground(
    chapter.timing
  )} -i ${chapter.sourceAudioFile} -shortest -map 0:v -map 1:a`;
  const drawText = `-filter_complex "${context.renderText(chapter)}"`;
  await exec(
    `ffmpeg -y ${inclusions} ${drawText} -t ${chapter.timing.durationSec} ${context.encoding} ${chapter.generatedVideoFile}`
  );
}

export async function chaptersGenerator(context: Context) {
  clean(context);
  fs.mkdirSync(`${context.outDir}/chapters`, { recursive: true });
  const chapters = await getChapters(context);

  console.log('\nGenerating videos for each chapter:');
  for (const chapter of chapters) {
    if (context.config.background_mode === 'image') {
      await generateChapterVideoFromImage(context, chapter);
    } else {
      await generateChapterVideoFromVideo(context, chapter);
    }
    await sleep();
  }
  console.log("DONE :)");
}
