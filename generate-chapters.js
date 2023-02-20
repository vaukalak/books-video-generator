#!/usr/bin/env node

const { context } = require("./src/context");
const { chaptersGenerator } = require("./src/chaptersGenerator");
const {
  renderImageBackground,
} = require("./src/background/renderImageBackground");
const {
  renderVideoBackground,
} = require("./src/background/renderVideoBackground");
const {
  renderCenterAlignedText,
} = require("./src/text/renderCenterAlignedText");

(async () => {
  context.renderBackground =
    context.config.background_mode === "image"
      ? renderImageBackground(context)
      : renderVideoBackground(context);
  context.renderText = renderCenterAlignedText(context);
  context.encoding =
    context.config.background_mode === "image"
      ? "-c:v libx264 -c:a aac -pix_fmt yuv420p"
      : "";
  await chaptersGenerator(context);
})();
