const fs = require("fs");
const { exec } = require("./exec");
const { getTimings } = require("./getTimings");
const { getChapterNames, fid } = require("./getChapterNames");

const sleep = async () => {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
};

const clean = (context) => {
  try {
    fs.rmSync(`out/${context.book}`, { force: true, recursive: true });
  } catch {}
};

const chaptersGenerator = async (context) => {
  const { book } = context;
  clean(context);
  fs.mkdirSync(`out/${book}/chapters`, { recursive: true });
  const stories = await getChapterNames(context);
  const timings = await getTimings(context, stories);

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const fileName = fid(story.id);

    const inclusions = `${context.renderBackground(
      timings[i]
    )} -i resource/${book}/audio/${fileName}.mp3 -shortest -map 0:v -map 1:a`;
    const drawText = `-filter_complex "${context.renderText(stories, i)}"`;
    await exec(
      `ffmpeg -y ${inclusions} ${drawText} -t ${timings[i].duration} ${context.encoding} out/${book}/chapters/${fileName}.mp4`
    );
    await sleep();
  }
  console.log("DONE :)");
};

module.exports = { chaptersGenerator };
