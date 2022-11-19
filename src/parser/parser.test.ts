import { describe, it, expect } from 'vitest';
import { parse } from './parser';

describe('parser.ts', () => {
    it('parses single command', () => {
        const single = 'whoami';

        expect(parse(single)).toMatchObject({
            name: 'whoami',
            args: [],
            flags: [],
        });
    });

    it('parses command with arguments', () => {
        const oneArg = 'cd work';

        expect(parse(oneArg)).toMatchObject({
            name: 'cd',
            args: ['work'],
            flags: [],
        });
    });
});
