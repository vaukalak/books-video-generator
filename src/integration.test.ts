
import { beforeEach, describe, expect, it } from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as cp from 'child_process';
import { exec } from './exec';
import { Config } from './context';
import * as yaml from 'yaml';

const TEST_BOOK = 'test_book';
const RESOURCES_DIR = `resource/${TEST_BOOK}`;
const OUT_DIR = `out/${TEST_BOOK}`;

async function getDurationSec(file: string) {
    const len = await exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${file}`);
    return Number(len);
}


function assertOutputOfCreateTimecodesMatches(output: string) {
    const linesWithTimecodes = output.split('\n').filter(line => /^\d\d:\d\d:\d\d .*/.test(line));
    expect(linesWithTimecodes).toEqual([
        '00:00:00 Раздзел 1',
        '00:00:05 Раздзел 2',
    ]);
}

/**
 * Helper function to update book config from a test. It should be called after 
 * ./add-book.ts script has been called.
 * @param updateFn function to update default Config. It should return a new config
 *     which will be written to the yaml file.
 */
function updateConfig(book: string, updateFn: (config: Config) => Config) {
    const configFile = `resource/${book}/config.yml`;
    const config: Config = yaml.parse(fs.readFileSync(configFile, { encoding: 'utf8' }));
    const updatedConfig = updateFn(config);
    fs.writeFileSync(configFile, yaml.stringify(updatedConfig));
}

function expectBetween(value: number, min: number, max: number) {
    expect(value).toBeGreaterThanOrEqual(min);
    expect(value).toBeLessThanOrEqual(max);
}


describe('integration', () => {
    beforeEach(async () => {
        await fs.remove(RESOURCES_DIR);
        await fs.remove(OUT_DIR);
    });
    // Verify that generating sample books produces a video file matching length
    // of total mp3 files duration.
    it('sample book generated', async () => {
        const options: cp.ExecOptions = {
            env: { ...process.env, 'BOOK': TEST_BOOK },
        };
        const commands = [
            'add-book.ts',
            'generate-chapters.ts',
            'concat-chapters.ts',
            'create-timecodes.ts',
        ];
        const results = [];
        for (const command of commands) {
            console.time(command);
            results.push(await exec(`./${command}`, options));
            console.timeLog(command);
        };
        assertOutputOfCreateTimecodesMatches(results[results.length - 1]);
        const videoLength = await getDurationSec(path.join(OUT_DIR, 'output.mp4'));
        // There are two mp3 files, each roughly 5s. Total 11.2s.
        expectBetween(videoLength, 11.2, 12);
    }, /* timeout= */ 60_000);

    it('preview mode is working', async () => {
        const options = {
            env: { ...process.env, 'BOOK': TEST_BOOK },
            encoding: 'utf8',
        };
        await exec(`./add-book.ts`, options);

        // Enable preview_covers.
        updateConfig(TEST_BOOK, (config) => {
            return { ...config, preview_covers: true };
        });

        await exec(`./generate-chapters.ts`, options);
        await exec(`./concat-chapters.ts`, options);
        const videoLength = await getDurationSec(path.join(OUT_DIR, 'output.mp4'));
        // When preview is enabled each chapter should be generated from a 1sec file,
        // so total length is 2sec.
        expectBetween(videoLength, 2, 2.5);

    }, /* timeout= */ 60_000);

    it('different length filenames are supported', async () => {
        const options: cp.ExecOptions = {
            env: { ...process.env, 'BOOK': TEST_BOOK },
        };
        await exec(`./add-book.ts`, options);

        await fs.move(`${RESOURCES_DIR}/audio/000.mp3`, `${RESOURCES_DIR}/audio/0.mp3`);
        await fs.move(`${RESOURCES_DIR}/audio/001.mp3`, `${RESOURCES_DIR}/audio/01.mp3`);

        await exec(`./generate-chapters.ts`, options);
        const chapter0Length = await getDurationSec(path.join(OUT_DIR, 'chapters/000.mp4'));
        expectBetween(chapter0Length, 5.5, 6);
        const chapter1Length = await getDurationSec(path.join(OUT_DIR, 'chapters/001.mp4'));
        expectBetween(chapter1Length, 5.5, 6);

    }, /* timeout= */ 60_000);
});