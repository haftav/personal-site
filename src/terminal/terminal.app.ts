import {
    Char,
    ColumnIndex,
    createPrompt,
    Cursor,
    CursorPosition,
    Prompt,
    Result,
} from '../domain';

export interface Store {
    cursor: Cursor;
    prompt: Prompt;
    setCursorPosition: (newColumn: ColumnIndex) => void;
    updatePrompt: (newChar: Char, columnIndex: ColumnIndex) => void;
    addRow: (row: Result | Prompt) => void;
}

interface Parser {
    parse: (prompt: Prompt) => Result;
}

export const updatePrompt = (newChar: Char, deps: { store: Store }) => {
    const { store } = deps;

    const cursorPosition = store.cursor.position;

    console.log('cursorPosition', cursorPosition);

    store.updatePrompt(newChar, cursorPosition.column);
    store.setCursorPosition(cursorPosition.column + 1);
};

export const submitPrompt = (deps: { store: Store; parser: Parser }) => {
    const { store, parser } = deps;
    const prompt = store.prompt;
    const result = parser.parse(prompt);

    store.addRow(result);
    store.addRow(createPrompt());
};

export const removeCharacter = () => {};

export const moveCursor = () => {};

export const navigateBackwardInPromptHistory = () => {};

export const navigateForwardInPromptHistory = () => {};
