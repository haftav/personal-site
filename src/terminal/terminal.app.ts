import {
    Char,
    CharData,
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
    updatePrompt: (newChar: CharData, columnIndex: ColumnIndex) => void;
    addRow: (row: Result | Prompt) => void;
    removeCharacter: (columnIndex: ColumnIndex) => void;
}

interface Parser {
    parse: (prompt: Prompt) => Result;
}

export const updatePrompt = (newChar: CharData, deps: { store: Store }) => {
    const { store } = deps;

    const cursorPosition = store.cursor.position;

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

export const removeCharacter = (deps: {
    store: Pick<Store, 'removeCharacter' | 'cursor' | 'setCursorPosition'>;
}) => {
    const { store } = deps;

    const cursorPosition = store.cursor.position;

    store.removeCharacter(cursorPosition.column);
    store.setCursorPosition(cursorPosition.column - 1);
};

export const moveCursor = () => {};

export const navigateBackwardInPromptHistory = () => {};

export const navigateForwardInPromptHistory = () => {};
