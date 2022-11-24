import create from 'zustand';
import produce from 'immer';

import {
    createInitialTerminal,
    createRow,
    Cursor,
    getPrompt,
    isResult,
    Prompt,
    Result,
    setPrompt,
    Terminal,
    TerminalRow,
} from '../domain';

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
                const prompt = getPrompt(state.terminal);

                prompt.line.content.splice(columnIndex, 0, {
                    id: createId(),
                    data: newChar,
                });

                setPrompt(prompt, state.terminal);
            })
        ),
    addRow: (rowContent: Prompt | Result) => {
        set(
            produce<AppStore>((state) => {
                const index = state.terminal.rows.length;
                const newRow = createRow(createId(), rowContent);

                let rowsToAdd = 1;

                if (isResult(newRow.content)) {
                    rowsToAdd = newRow.content.lines.length;
                }

                state.terminal.rows.push(newRow);
                state.cursor.position.row += rowsToAdd;
                state.cursor.position.column = 0;
            })
        );
    },
    removeCharacter: (columnIndex) =>
        set(
            produce<AppStore>((state) => {
                const prompt = getPrompt(state.terminal);
                prompt.line.content.splice(columnIndex - 1, 1);

                setPrompt(prompt, state.terminal);
            })
        ),
    getPrompt: () => {
        const index = get().terminal.rows.length - 1;
        const prompt = get().terminal.rows[index].content as Prompt;

        return prompt;
    },
}));
