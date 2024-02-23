#!/usr/bin/env -S npx ts-node --files

// @ts-ignore
import { context } from "./src/context";
// @ts-ignore
import { chaptersGenerator } from "./src/chaptersGenerator";
// @ts-ignore
import {
  renderImageBackground,
  // @ts-ignore
} from "./src/background/renderImageBackground";
// @ts-ignore
import {
  renderVideoBackground,
  // @ts-ignore
} from "./src/background/renderVideoBackground";
import {
  renderCenterAlignedText,
  // @ts-ignore
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
