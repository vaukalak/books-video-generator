#!/usr/bin/env node

const { context } = require("./src/context");
const { chaptersGenerator } = require("./src/chaptersGenerator");
const {
  renderImageBackground,
} = require("./src/background/renderImageBackground");
const {
  renderCenterAlignedText,
} = require("./src/text/renderCenterAlignedText");

(async () => {
  context.renderBackground = renderImageBackground(context);
  context.renderText = renderCenterAlignedText(context);
  context.encoding =
    context.config.background_mode === "image"
      ? "-c:v libx264 -c:a aac -pix_fmt yuv420p"
      : "";
  await chaptersGenerator(context);
})();
