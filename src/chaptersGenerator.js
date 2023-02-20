const fs = require("fs");
const { exec } = require("./exec");
const { getTimings } = require("./getTimings");
const { getStorieNames, fid } = require("./getStorieNames.js");

const sleep = async () => {
  return new Promise((res) => {
    setTimeout(res, 2000);
  });
};

const clean = (context) => {
  try {
    fs.rmSync(`out/${context.bookName}`, { force: true, recursive: true });
  } catch {}
};

const chaptersGenerator = async (context) => {
  const { bookName, videoBackground, createCenterAlignedText } = context;
  clean(context);
  fs.mkdirSync(`out/${bookName}/chapters`, { recursive: true });
  const stories = await getStorieNames(context);
  const timings = await getTimings(context, stories);

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const fileName = fid(story.id);

    const { config } = context;

    const inclusions = `${context.renderBackground(
      timings[i]
    )} -i resource/${bookName}/audio/${fileName}.mp3 -shortest -map 0:v -map 1:a`;
    const options =
      config.background_mode === "image"
        ? "-c:v libx264 -c:a aac -pix_fmt yuv420p"
        : "";
    const drawText = `-filter_complex "${context.renderText(stories, i)}"`;
    await exec(
      `ffmpeg -y ${inclusions} ${drawText} -t ${timings[i].duration} ${options} out/${bookName}/chapters/${fileName}.mp4`
    );
    await sleep();
  }
  console.log("DONE :)");
};

module.exports = { chaptersGenerator };
