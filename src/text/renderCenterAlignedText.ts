
import { Chapter, Context } from "../context";
import { fid } from "../getChapterNames";

const createDrawText = (context: Context, text: string, off: number) => {
  const { config, book } = context;
  const text_h = 100;
  const x = `x=(w-text_w)/2`;
  const y = `y=(h-${text_h})/2+(${text_h}*${off})`;
  const font = `fontfile=resource/${book}/font.ttf`;
  const fontSize = `fontsize=${config.text_options.font_size}`;
  const fontColor = `fontcolor=${config.text_options.font_color}`;
  const textCommand = `text='${text}'`;
  return `drawtext=${font}:${fontSize}:${fontColor}:${textCommand}:${x}:${y}`;
};

export function renderCenterAlignedText(context: Context) {
  return (chapters: Chapter[], chapterIndex: number) => {
    const chapterName = chapters[chapterIndex].name;
    const isFirstOrLast = chapterIndex === 0 || chapterIndex === chapters.length - 1;
    const text = isFirstOrLast
      ? chapterName
      : `#${fid(chapterIndex)}\\:${chapterName}`;
    const lines = text.split("\n");
    const allText = lines.map((line, i) => {
      const offsetY = Math.floor(-lines.length / 2) + 1 + i;
      return createDrawText(context, line, offsetY);
    });
    return allText.join("[t1];[t1]");
  };
};
