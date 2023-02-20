const { format } = require("date-fns");

const renderVideoBackground = (context) => (timing) => {
  const fps = 30;
  const bgLoopDuration = Math.round(51349.333 * fps);
  const startOffsetMs = (timing.startTime * fps) % bgLoopDuration;
  console.log({ startOffsetMs });
  const startOffset = format((startOffsetMs * 1000) / fps, "00:mm:ss.SSS");
  return `-ss ${startOffset} -i resource/${context.book}/background.mp4`;
};

module.exports = { renderVideoBackground };
