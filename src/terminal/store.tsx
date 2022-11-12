import create from 'zustand';
import produce from 'immer';

import { createInitialTerminal, Cursor, Prompt, Terminal } from '../domain';

import type { Store } from './terminal.app';

interface AppStore {
    cursor: Cursor;
    terminal: Terminal;
    setCursorPosition: Store['setCursorPosition'];
    updatePrompt: Store['updatePrompt'];
    addRow: Store['addRow'];
}

export const useStore = create<AppStore>((set) => ({
    cursor: {
        position: {
            row: 0,
            column: 0,
        },
    },
    terminal: createInitialTerminal(),
    setCursorPosition: (newColumn) =>
        set(
            produce<AppStore>((state) => {
                state.cursor.position.column = newColumn;
            })
        ),
    updatePrompt: (newChar, columnIndex) =>
        set(
            produce<AppStore>((state) => {
                // last row should always be a prompt, I could also invariant here
                const index = state.terminal.rows.length - 1;
                const newPrompt = state.terminal.rows[index].content as Prompt;

                newPrompt.line.content.splice(columnIndex, 0, newChar);

                state.terminal.rows[index].content = newPrompt;
            })
        ),
    addRow: () => {},
}));
