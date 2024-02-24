import * as fs from "fs";
import { exec } from "./exec";
import { getTimings } from "./getTimings";
import { getChapterNames, fid } from "./getChapterNames";
import { Context } from "./context";

async function sleep(): Promise<undefined> {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
}

function clean(context: Context) {
  try {
    fs.rmSync(`out/${context.book}`, { force: true, recursive: true });
  } catch {}
}

export async function chaptersGenerator(context: Context) {
  const { book } = context;
  clean(context);
  fs.mkdirSync(`out/${book}/chapters`, { recursive: true });
  const stories = await getChapterNames(context);
  const timings = await getTimings(context, stories);

  console.log('\nGenerating videos for each chapter:');
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const fileName = fid(story.id);

    const inclusions = `${context.renderBackground(
      timings[i]
    )} -i resource/${book}/audio/${fileName}.mp3 -shortest -map 0:v -map 1:a`;
    const drawText = `-filter_complex "${context.renderText(stories, i)}"`;
    await exec(
      `ffmpeg -y ${inclusions} ${drawText} -t ${timings[i].durationSec} ${context.encoding} out/${book}/chapters/${fileName}.mp4`
    );
    await sleep();
  }
  console.log("DONE :)");
}
