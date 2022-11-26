import { createId } from '../utils';

export interface Terminal {
    rows: TerminalRow[];
}
type RowId = string;
export interface TerminalRow {
    id: RowId;
    content: Prompt | Result;
}
type PromptPrefix = string;
export interface Prompt {
    line: Line;
    prefix: PromptPrefix;
}
export interface Result {
    lines: Line[];
}
interface Line {
    content: Char[];
}

type CharId = string;
export type CharData = string;
export interface Char {
    id: CharId;
    data: CharData;
}

export type Flag = string;
export type Arg = string;
export type CommandName = string;
export interface Command {
    name: CommandName;
    flags: Flag[];
    args: Arg[];
}

export type RowIndex = number;
export type ColumnIndex = number;
export interface CursorPosition {
    row: RowIndex;
    column: ColumnIndex;
}
export interface Cursor {
    position: CursorPosition;
}

export type PromptString = string;
export type ParsedLine = string;

export const routes = ['main', 'about', 'work', 'blog'] as const;

export type Route = typeof routes[number];

export function createInitialTerminal(): Terminal {
    return {
        rows: [createRow(createId(), createPrompt())],
    };
}

export function createRow(id: RowId, content: Prompt | Result): TerminalRow {
    return {
        id,
        content,
    };
}

// TODO: add Route type to domain
export function createPrompt(directory?: Route): Prompt {
    return {
        line: {
            content: [createChar()],
        },
        prefix: `thafner${directory ? '/' + directory : ''} ~ `,
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

export function isRoute(str: string): str is Route {
    return routes.includes(str as Route);
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
