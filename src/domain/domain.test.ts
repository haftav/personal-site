import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createId, resetId } from '../utils';

import { createInitialTerminal, createResult, Prompt } from './domain';

beforeEach(() => {
    resetId();
});

describe('domain.ts', () => {
    it('Creates initial terminal with a prompt', () => {
        expect(createInitialTerminal()).toMatchObject({
            rows: [
                {
                    index: 0,
                    content: {
                        line: {
                            content: [
                                {
                                    id: '1',
                                    data: '',
                                },
                            ],
                        },
                    },
                },
            ],
        });
    });

    it('Creates result objects', () => {
        expect(createResult(['ab cd'])).toMatchObject({
            lines: [
                {
                    content: [
                        {
                            id: '1',
                            data: 'a',
                        },
                        {
                            id: '2',
                            data: 'b',
                        },
                        {
                            id: '3',
                            data: '',
                        },
                        {
                            id: '4',
                            data: 'c',
                        },
                        {
                            id: '5',
                            data: 'd',
                        },
                    ],
                },
            ],
        });

        resetId();

        expect(createResult(['a', 'b', 'c'])).toMatchObject({
            lines: [
                {
                    content: [
                        {
                            id: '1',
                            data: 'a',
                        },
                    ],
                },
                {
                    content: [
                        {
                            id: '2',
                            data: 'b',
                        },
                    ],
                },
                {
                    content: [
                        {
                            id: '3',
                            data: 'c',
                        },
                    ],
                },
            ],
        });

        resetId();

        expect(createResult([''])).toMatchObject({
            lines: [
                {
                    content: [
                        {
                            id: '1',
                            data: '',
                        },
                    ],
                },
            ],
        });
    });
});
