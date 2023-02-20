const renderImageBackground = (context) => () => {
  return `-loop 1 -i resource/${context.book}/background.jpg`;
};

module.exports = { renderImageBackground };
