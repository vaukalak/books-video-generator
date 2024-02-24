#!/usr/bin/env -S npx ts-node --files

import { context } from "./src/context";
import { chaptersGenerator } from "./src/chaptersGenerator";
import {
  renderImageBackground,
} from "./src/background/renderImageBackground";
import {
  renderVideoBackground,
} from "./src/background/renderVideoBackground";
import {
  renderCenterAlignedText,
} from "./src/text/renderCenterAlignedText";

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
