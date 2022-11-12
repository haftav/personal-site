import { describe, it, expect } from 'vitest';
import { parse } from './parser';

describe('parser.ts', () => {
    it('Parses whoami command', () => {
        expect(parse('whoami')).toMatchObject(["I don't know, who are you?"]);
    });
});
