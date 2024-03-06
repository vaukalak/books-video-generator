import * as fs from "fs";
import { exec } from "./exec";
import { getChapters } from "./chapters";
import { Context } from "./context";

async function sleep(): Promise<undefined> {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
}

function clean(context: Context) {
  try {
    fs.rmSync(context.outDir, { force: true, recursive: true });
  } catch {}
}

export async function chaptersGenerator(context: Context) {
  const { book } = context;
  clean(context);
  fs.mkdirSync(`${context.outDir}/chapters`, { recursive: true });
  const chapters = await getChapters(context);

  console.log('\nGenerating videos for each chapter:');
  for (let i = 0; i < chapters.length; i++) {
    const chapter = chapters[i];

    const inclusions = `${context.renderBackground(
      chapter.timing
    )} -i ${chapter.sourceAudioFile} -shortest -map 0:v -map 1:a`;
    const drawText = `-filter_complex "${context.renderText(chapter)}"`;
    await exec(
      `ffmpeg -y ${inclusions} ${drawText} -t ${chapter.timing.durationSec} ${context.encoding} ${chapter.generatedVideoFile}`
    );
    await sleep();
  }
  console.log("DONE :)");
}
