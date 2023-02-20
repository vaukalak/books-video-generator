const getTimings = async (context, stories) => {
  const { book } = context;
  let startTime = 0;
  return (
    await Promise.all(
      stories.map((s) => {
        return exec(
          `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 resource/${book}/audio/${fid(
            s.id
          )}.mp3`
        );
      })
    )
  ).map((v) => {
    const duration = parseFloat(v, 10);
    startTime += duration;
    return {
      duration,
      startTime,
    };
  });
};

module.exports = {
  getTimings,
};
