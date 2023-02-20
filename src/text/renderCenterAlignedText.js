const createDrawText = (context, text, off) => {
  const { config, book } = context;
  const text_h = 100;
  const x = `x=(w-text_w)/2`;
  const y = `y=(h-${text_h})/2+(${text_h}*${off})`;
  const font = `fontfile=resource/${book}/font.ttf`;
  const fontSize = `fontsize=${config.text_options.fontsize}`;
  const fontColor = `fontcolor=${config.text_options.fontcolor}`;
  const textCommand = `text='${text}'`;
  return `drawtext=${font}:${fontSize}:${fontColor}:${textCommand}:${x}:${y}`;
};

const renderCenterAlignedText = (context) => (chapters, chpaterIndex) => {
  const lines = chapters[chpaterIndex].name.split("\n");
  const allText = lines.map((line, i) => {
    const offsetY = Math.floor(-lines.length / 2) + 1 + i;
    return createDrawText(context, line, offsetY);
  });
  return allText.join("[t1];[t1]");
};

module.exports = { renderCenterAlignedText };
