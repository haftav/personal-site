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
}

export interface Result {
    lines: Line[];
}

interface Line {
    content: Char[];
}

export type Char = string;

export type PromptString = string;
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
            content: [''],
        },
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

// TODO: extract to utils module
function convertParsedLinesToChars(parsedLine: ParsedLine): Char[] {
    if (!parsedLine.length) {
        return [''];
    }

    const output: Char[] = [];

    for (let i = 0; i < parsedLine.length; i++) {
        const currentChar = parsedLine[i];

        if (currentChar === ' ') {
            output.push('');
        } else {
            output.push(currentChar);
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
