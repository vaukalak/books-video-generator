const fs = require('fs');

const SUPPORTED_IMAGES = ['jpg', 'png'];

const renderImageBackground = (context) => () => {
  const candidates = SUPPORTED_IMAGES
    .map(ext => `resource/${context.book}/background.${ext}`);
  for (const image of candidates) {
    if (fs.statSync(image, { throwIfNoEntry: false })) {
      return `-loop 1 -i ${image}`;
    }
  }
  throw new Error(
    `No background image found. Checked the following paths: ${candidates.join(', ')}`);
};

module.exports = { renderImageBackground };
