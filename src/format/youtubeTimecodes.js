const formatYoutubeTimecodes = (stories, durations) => {
  return durations
    .map(({ startTime }, i) => {
      const date = new Date(startTime * 1000);
      const isoDate = date.toISOString();
      const time = `${isoDate.substring(11, 19)}`;
      return `${time} ${stories[i].name}`;
    })
    .join("\n");
};

module.exports = { formatYoutubeTimecodes };
