const fs = require("fs");
const { parse } = require('csv-parse');
const { finished } = require('stream/promises');
const { format } = require("date-fns");
const { exec } = require("./exec");

const createDrawText = (text, off, l) => {
  const text_h = 100;
  const x = `x=(w-text_w)/2`;
  const y = `y=(h-${text_h})/2+(${text_h}*${off})`;
  const font =`fontfile=resource/IKRASLAB.TTF`;
  const fontSize=`fontsize=${78}`;
  const fontColor=`fontcolor=black`
  const textCommand = `text='${text}'`;
  return `drawtext=${font}:${fontSize}:${fontColor}:${textCommand}:${x}:${y}`;
}

const sleep = async () => {
  return new Promise(res => {
    setTimeout(res, 2000);
  })
}

(async () => {
  try {
    fs.rmSync("out", { force: true, recursive: true });
  } catch {}
  fs.mkdirSync("out");
  const stories = (await getStorieNames()).slice(1).map(([id, name]) => ({ id, name }));
  // console.log(stories);
  const fid = s => s.toString().length === 1 ? `0${s}` : s;
  const currentStories = stories.slice(0, 4);
  const startSoundDelay = 0;
  const durations = (await Promise.all(
    currentStories.map(s => {
      const id = fid(s.id);
      const fileName = `404_${id}`;
      return exec(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 resource/audio/${fileName}.mp3`
      )
    })
  )).map(v => parseFloat(v) + startSoundDelay);
  const fps = 30;
  const bgLoopDuration = Math.round(51349.333 * fps);
  let cummulatedDuration = 0;
  console.log(">>> durations:", durations);
  for (let i = 0; i < currentStories.length; i++) {
    const story = currentStories[i];
    const id = fid(story.id);
    const fileName = `404_${id}`;
    const startOffsetMs = ((cummulatedDuration * fps) % bgLoopDuration);
    console.log({ startOffsetMs });
    const startOffset = format(startOffsetMs * 1000 / fps, "00:mm:ss.SSS");
    const videoTime = format(durations[i], "00:mm:ss.SSS");
    cummulatedDuration += durations[i];
    const inclusions = `-ss ${startOffset} -i resource/main_loop5.mp4 -itsoffset ${startSoundDelay} -i resource/audio/${fileName}.mp3 -shortest -map 0:v -map 1:a`;
    const options = "";
    const chapterName = `#${id}\\: ${story.name}`;
    
    const lines = chapterName.split("\n");
    // `[in]drawtext=font='Arial': text='This is text line 1':x=(w-tw)/2:y=((h-text_h)/2)-(text_h-(th/4)): fontsize=55: fontcolor=red, drawtext=font='Arial': text='This is text line 2':x=(w-tw)/2:y=((h-text_h)/2)+(text_h-(th/4)): fontsize=55: fontcolor=green[out]`
    const allText = lines.map((line, i) => {
      const offsetY = Math.floor((-lines.length / 2)) + 1 + i;
      console.log(offsetY);
      text = createDrawText(line, offsetY, chapterName.length);
      if (i === 0) {
        return text;
      }
      return `[t1];[t1]${text}`;
    });
    const drawText = `-filter_complex "${allText.join("")}"`;
    // const textAndPosition = lines.map((l, i) => `:text='${l}':x=(w-text_w)/2:y=(h-text_h)/2+text_h*${i}`).join('');
    // const drawText = `-vf "drawtext=fontfile=resource/IKRASLAB.ttf${textAndPosition}:fontcolor=black:fontsize=64:box=1:boxcolor=black@0.0:boxborderw=5"`;
    await exec(
      `ffmpeg -y ${inclusions} ${options} ${drawText} -t ${durations[i]} out/${fileName}.mp4`
    );
    await sleep();
  }
  console.log("DONE :)")
})();
