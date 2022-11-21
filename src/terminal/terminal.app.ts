// TODO:
// limit number of rows in store
// fake directory navigation
// human-readable view
// handle modifier keys
import {
    Char,
    CharData,
    ColumnIndex,
    Command,
    convertPromptToPromptString,
    createPrompt,
    createRow,
    Cursor,
    CursorPosition,
    getPrompt,
    Prompt,
    PromptString,
    Result,
    Terminal,
} from '../domain';

export interface Store {
    terminal: Terminal;
    cursor: Cursor;
    setCursorPosition: (newColumn: ColumnIndex) => void;
    updatePrompt: (newChar: CharData, columnIndex: ColumnIndex) => void;
    addRow: (row: Result | Prompt) => void;
    removeCharacter: (columnIndex: ColumnIndex) => void;
}

interface Parser {
    parse: (promptString: PromptString) => Command;
}

interface CommandHandler {
    handleCommand: (command: Command) => Result;
}

export const updatePrompt = (newChar: CharData, deps: { store: Store }) => {
    const { store } = deps;

    const cursorPosition = store.cursor.position;

    store.updatePrompt(newChar, cursorPosition.column);
    store.setCursorPosition(cursorPosition.column + 1);
};

export const submitPrompt = (deps: {
    store: Store;
    parser: Parser;
    commandHandler: CommandHandler;
}) => {
    const { store, parser, commandHandler } = deps;

    const prompt = getPrompt(store.terminal);

    const promptString = convertPromptToPromptString(prompt);

    if (!promptString) {
        store.addRow(createPrompt());
        return;
    }

    // TODO: how do I handle 'clear'? add some extra height to container to account for scroll overflow?
    const command = parser.parse(promptString);
    const result = commandHandler.handleCommand(command);

    if (result) {
        store.addRow(result);
    }

    store.addRow(createPrompt());
};

export const removeCharacter = (deps: {
    store: Pick<Store, 'removeCharacter' | 'cursor' | 'setCursorPosition'>;
}) => {
    const { store } = deps;

    const cursorPosition = store.cursor.position;

    if (cursorPosition.column === 0) {
        return;
    }

    store.removeCharacter(cursorPosition.column);
    store.setCursorPosition(cursorPosition.column - 1);
};

export const moveCursor = () => {};

export const navigateBackwardInPromptHistory = () => {};

export const navigateForwardInPromptHistory = () => {};
