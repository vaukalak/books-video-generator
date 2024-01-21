
const fs = require('fs-extra');
const {exec} = require('./exec');
const path = require('path');

const TEST_BOOK = 'test_book';
const RESOURCES_DIR = `resource/${TEST_BOOK}`;
const OUT_DIR = `out/${TEST_BOOK}`;

async function getDurationSec(file) {
    const len = await exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${file}`);
    return Number(len);
}

beforeEach(async () => {
    await fs.remove(RESOURCES_DIR);
    await fs.remove(OUT_DIR);
});

function assertOutputOfCreateTimecodesMatches(output) {
    const linesWithTimecodes = output.split('\n').filter(line => /^\d\d:\d\d:\d\d .*/.test(line));
    expect(linesWithTimecodes).toEqual([
        '00:00:00 Раздзел 1',
        '00:00:05 Раздзел 2',
    ]);
}

// Verify that generating sample books produces a video file matching length
// of total mp3 files duration.
test('sample book generated', async () => {
    const options = {
        env: {'BOOK': TEST_BOOK},
        encoding: 'utf8',
    };
    const commands = [
        'add-book.js',
        'generate-chapters.js',
        'concat-chapters.js',
        'create-timecodes.js',
    ];
    const results = [];
    for (const command of commands) {
        results.push(await exec(`node ${command}`, options));
    };
    assertOutputOfCreateTimecodesMatches(results[results.length - 1]);
    const videoLength = await getDurationSec(path.join(OUT_DIR, 'output.mp4'));
    // There are two mp3 files, each roughly 5s. Total 11.2s.
    expect(videoLength).toBeCloseTo(11.26, 1);
}, /* timeout= */ 60_000);