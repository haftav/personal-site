import create from 'zustand';
import produce from 'immer';

import { createInitialTerminal, Cursor, Prompt, Terminal } from '../domain';

import type { Store } from './terminal.app';
import { createId } from '../utils';

type AppStore = {
    cursor: Cursor;
    terminal: Terminal;
    getPrompt: () => Prompt;
} & Pick<
    Store,
    'setCursorPosition' | 'updatePrompt' | 'addRow' | 'removeCharacter'
>;

export const useStore = create<AppStore>((set, get) => ({
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

                newPrompt.line.content.splice(columnIndex, 0, {
                    id: createId(),
                    data: newChar,
                });

                state.terminal.rows[index].content = newPrompt;
            })
        ),
    addRow: () => {},
    removeCharacter: (columnIndex) =>
        set(
            produce<AppStore>((state) => {
                // last row should always be a prompt, I could also invariant here
                const index = state.terminal.rows.length - 1;
                const newPrompt = state.terminal.rows[index].content as Prompt;

                newPrompt.line.content.splice(columnIndex, 1);

                state.terminal.rows[index].content = newPrompt;
            })
        ),
    getPrompt: () => {
        const index = get().terminal.rows.length - 1;
        const prompt = get().terminal.rows[index].content as Prompt;

        return prompt;
    },
}));
