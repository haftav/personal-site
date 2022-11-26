import { beforeEach, describe, expect, it } from 'vitest';
import { resetId } from '../utils';

import {
    createInitialTerminal,
    createResult,
    convertPromptToPromptString,
    Prompt,
    createChar,
} from './domain';

beforeEach(() => {
    resetId();
});

describe('domain.ts', () => {
    it('Creates initial terminal with a prompt', () => {
        expect(createInitialTerminal()).toMatchObject({
            rows: [
                {
                    content: {
                        line: {
                            content: [
                                {
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

describe('convertPromptToPromptString', () => {
    it('Converts prompt from list of chars into a string', () => {
        const prompt: Prompt = {
            line: {
                content: [
                    createChar('a'),
                    createChar('b'),
                    createChar('c'),
                    createChar(''),
                ],
            },
            prefix: '~ ',
        };

        const converted = convertPromptToPromptString(prompt);

        expect(converted).toBe('abc');
    });

    it('Converts prompt with spaces into string with spaces', () => {
        const prompt: Prompt = {
            line: {
                content: [
                    createChar('a'),
                    createChar(' '),
                    createChar('b'),
                    createChar(''),
                ],
            },
            prefix: '~ ',
        };

        const converted = convertPromptToPromptString(prompt);

        expect(converted).toBe('a b');
    });

    it('Removes extra whitespace', () => {
        const prompt1: Prompt = {
            line: {
                content: [
                    createChar('a'),
                    createChar(' '),
                    createChar(' '),
                    createChar(' '),
                    createChar(' '),
                    createChar(' '),
                    createChar('b'),
                    createChar(''),
                ],
            },
            prefix: '~ ',
        };

        const converted1 = convertPromptToPromptString(prompt1);

        expect(converted1).toBe('a b');

        const prompt2: Prompt = {
            line: {
                content: [
                    createChar('a'),
                    createChar(' '),
                    createChar(' '),
                    createChar('b'),
                    createChar(' '),
                    createChar(' '),
                    createChar('c'),
                    createChar(''),
                ],
            },
            prefix: '~ ',
        };

        const converted2 = convertPromptToPromptString(prompt2);

        expect(converted2).toBe('a b c');

        const prompt3: Prompt = {
            line: {
                content: [
                    createChar(' '),
                    createChar('a'),
                    createChar('b'),
                    createChar(' '),
                    createChar(''),
                ],
            },
            prefix: '~ ',
        };

        const converted3 = convertPromptToPromptString(prompt3);

        expect(converted3).toBe('ab');
    });
});
