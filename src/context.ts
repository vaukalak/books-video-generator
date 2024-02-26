import * as fs from "fs";
import { parse } from "yaml";

const book = process.env.BOOK;

if (!book) {
  throw new Error("define BOOK!");
}

/**
 * YAML config that allows users to customize video.
 * See sample/config.yml for documentation of what each
 * field means.
 */
export interface Config {
  readonly text_options: {
    font: string;
    font_file: string;
    font_size: number;
    font_color: string;
    x: string;
    y: string;
  };
  readonly background_mode: 'image'|'video';
  readonly preview_covers: boolean;
}

/** Timing of a single chapter. */
export interface Timing {
  readonly durationSec: number;
  readonly startTimeSec: number;
}

export interface Chapter {
  /** Index of the chapter. */
  readonly id: number;
  readonly name: string;
  readonly timing: Timing;
  /** Path to the user-provided audio file for the given chapter in `resource` dir. */
  readonly sourceAudioFile: string;
  /** Path to the generated video file in `out` dir. */
  readonly generatedVideoFile: string;
}

export interface Context {
  readonly book: string;
  /** Config provided by the user in config.yml */
  readonly config: Config;
  /** Directory containing generated video and other files produced by this tool. */
  readonly outDir: string;
  renderText: (chapter: Chapter) => string;
  renderBackground: (timing: Timing) => string;
  encoding: string;
}

function readConfig(book: string): Config {
  return parse(fs.readFileSync(`resource/${book}/config.yml`, {encoding: 'utf8'}));
}

function createContext(book: string): Context {
  const outDir = `out/${book}`;
  fs.mkdirSync(outDir,  { recursive: true });
  return {
    book,
    config: readConfig(book),
    outDir,
    renderText() { 
      throw new Error('unset'); 
    },
    renderBackground() {
      throw new Error('unset'); 
    },
    encoding: '',
  };
}

export const context = createContext(book);
