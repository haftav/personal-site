import { createId } from '../utils';

export interface Terminal {
    rows: TerminalRow[];
}

export interface TerminalRow {
    index: RowIndex;
    content: Prompt | Result;
}

export type RowIndex = number;
export type ColumnIndex = number;

export interface Prompt {
    line: Line;
    prefix: PromptPrefix;
}

type PromptPrefix = string;

export interface Result {
    lines: Line[];
}

interface Line {
    content: Char[];
}

export interface Char {
    id: CharId;
    data: CharData;
}
type CharId = string;
export type CharData = string;

export type PromptString = string;

export interface Command {
    name: CommandName;
    flags: Flag[];
    args: Arg[];
}
type CommandName = string;
type Flag = string;
type Arg = string;

export type ParsedLine = string;

export interface Cursor {
    position: CursorPosition;
}
export interface CursorPosition {
    row: RowIndex;
    column: ColumnIndex;
}

export function createInitialTerminal(): Terminal {
    return {
        rows: [createRow(0, createPrompt())],
    };
}

export function createRow(
    index: RowIndex,
    content: Prompt | Result
): TerminalRow {
    return {
        index,
        content,
    };
}

export function createPrompt(): Prompt {
    return {
        line: {
            content: [createChar()],
        },
        prefix: 'thafner ~ ',
    };
}

export function createResult(parsedLines: ParsedLine[]): Result {
    // turn strings into lists of chars
    return {
        lines: parsedLines.map((line) => ({
            content: convertParsedLinesToChars(line),
        })),
    };
}

export function createChar(char: string = '') {
    return {
        id: createId(),
        data: char,
    };
}

const whitespace = new Set<string>();
whitespace.add(' ');

export function convertPromptToPromptString(prompt: Prompt): PromptString {
    const chars = prompt.line.content;

    let output = '';

    let prevChar = null;

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i].data;

        if (whitespace.has(char)) {
            if (prevChar !== null && !whitespace.has(prevChar)) {
                output += char;
            }
        } else {
            output += char;
        }

        prevChar = char;
    }

    return output.trim();
}

function convertParsedLinesToChars(parsedLine: ParsedLine): Char[] {
    if (!parsedLine.length) {
        return [createChar()];
    }

    const output: Char[] = [];

    for (let i = 0; i < parsedLine.length; i++) {
        if (parsedLine[i] === ' ') {
            output.push(createChar());
        } else {
            output.push(createChar(parsedLine[i]));
        }
    }

    return output;
}

export function isPrompt(content: Prompt | Result): content is Prompt {
    if ('line' in content) {
        return true;
    }

    return false;
}

export function isResult(content: Prompt | Result): content is Result {
    if ('lines' in content) {
        return true;
    }

    return false;
}

export function getPrompt(terminal: Terminal): Prompt {
    const index = terminal.rows.length - 1;
    const prompt = terminal.rows[index].content;

    if (!isPrompt(prompt)) {
        throw new Error('Last row in terminal must always be a prompt.');
    }

    return prompt;
}

/*
 * Note - mutates terminal argument, use wisely (I should probably make this immutable)
 */
export function setPrompt(prompt: Prompt, terminal: Terminal): void {
    const index = terminal.rows.length - 1;

    terminal.rows[index].content = prompt;
}
