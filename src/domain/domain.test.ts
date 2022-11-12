import { describe, expect, it } from 'vitest';

import { createInitialTerminal, createResult, Prompt } from './domain';

describe('domain.ts', () => {
    it('Creates initial terminal with a prompt', () => {
        expect(createInitialTerminal()).toMatchObject({
            rows: [
                {
                    index: 0,
                    content: {
                        line: {
                            content: [''],
                        },
                    },
                },
            ],
        });
    });

    it('Creates result objects', () => {
        expect(createResult(['some content'])).toMatchObject({
            lines: [
                {
                    content: [
                        's',
                        'o',
                        'm',
                        'e',
                        '',
                        'c',
                        'o',
                        'n',
                        't',
                        'e',
                        'n',
                        't',
                    ],
                },
            ],
        });

        expect(createResult(['line 1', 'line 2', 'line 3'])).toMatchObject({
            lines: [
                {
                    content: ['l', 'i', 'n', 'e', '', '1'],
                },
                {
                    content: ['l', 'i', 'n', 'e', '', '2'],
                },
                {
                    content: ['l', 'i', 'n', 'e', '', '3'],
                },
            ],
        });

        expect(createResult([''])).toMatchObject({
            lines: [
                {
                    content: [''],
                },
            ],
        });
    });
});
