
import { Chapter, Context } from "../context";

function createDrawText(context: Context, text: string) {
  const textOptions = context.config.text_options;
  const components = [
    `x=${textOptions.x}`,
    `y=${textOptions.y}`,
    `fontsize=${textOptions.font_size}`,
    `fontcolor=${textOptions.font_color}`,
    `text='${text}'`,
  ];
  if (textOptions.font_file) {
    components.push(`fontfile=resource/${context.book}/${textOptions.font_file}`);
  }
  if (textOptions.font) {
    components.push(`font=${textOptions.font}`);
  }
  return `drawtext=${components.join(':')}`;
}

export function renderCenterAlignedText(context: Context) {
  return (chapter: Chapter) => {
    return createDrawText(context, chapter.name);
  };
};
