import * as fs from "fs";
import { parse } from "yaml";

const book = process.env.BOOK;

if (!book) {
  throw new Error("define BOOK!");
}

/**
 * YAML config that allows users to customize video.
 * Fields should match sample/config.yml
 */
export interface Config {
  text_options: {
    font_size: number,
    font_color: string,
  };
  background_mode: 'image'|'video';
}

export interface Chapter {
  // Index of the chapter.
  readonly id: number;
  readonly name: string;
}

/** Timing of a single chapter. */
export interface Timing {
  readonly durationSec: number;
  readonly startTimeSec: number;
}

export interface Context {
  readonly book: string;
  readonly config: Config;
  renderText: (chapters: Chapter[], chapterIndex: number) => string;
  renderBackground: (timing: Timing) => string;
  encoding: string;
}

function readConfig(book: string): Config {
  return parse(fs.readFileSync(`resource/${book}/config.yml`).toString())
}

export const context: Context = {
  book,
  config: readConfig(book),
  renderText() { 
    throw new Error('unset'); 
  },
  renderBackground() {
    throw new Error('unset'); 
  },
  encoding: '',
};
