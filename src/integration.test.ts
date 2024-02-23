
import {beforeEach, describe, expect, test} from '@jest/globals';
import * as fs from 'fs-extra';
import * as path from 'path';
// @ts-ignore
import {exec} from './exec';

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


describe('integration', () => {
    beforeEach(async () => {
        await fs.remove(RESOURCES_DIR);
        await fs.remove(OUT_DIR);
    });
    // Verify that generating sample books produces a video file matching length
    // of total mp3 files duration.
    test('sample book generated', async () => {
        const options = {
            env: {...process.env, 'BOOK': TEST_BOOK},
            encoding: 'utf8',
        };
        const commands = [
            'add-book.ts',
            'generate-chapters.ts',
            'concat-chapters.ts',
            'create-timecodes.ts',
        ];
        const results = [];
        for (const command of commands) {
            results.push(await exec(`./${command}`, options));
        };
        assertOutputOfCreateTimecodesMatches(results[results.length - 1]);
        const videoLength = await getDurationSec(path.join(OUT_DIR, 'output.mp4'));
        // There are two mp3 files, each roughly 5s. Total 11.2s.
        expect(videoLength).toBeCloseTo(11.2, 1);
    }, /* timeout= */ 60_000);
});