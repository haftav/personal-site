import create from 'zustand';
import produce from 'immer';

import {
    Prompt,
    Result,
    createInitialTerminal,
    createRow,
    getPrompt,
    isResult,
    setPrompt,
} from '../domain';
import { createId } from '../utils';
import type { Store } from './terminal.app';

export const useStore = create<Store>((set) => ({
    cursor: {
        position: {
            row: 0,
            column: 0,
        },
    },
    terminal: createInitialTerminal(),
    setCursorPosition: (newColumn) =>
        set(
            produce<Store>((state) => {
                state.cursor.position.column = newColumn;
            })
        ),
    updatePrompt: (newChar, columnIndex) =>
        set(
            produce<Store>((state) => {
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
            produce<Store>((state) => {
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
            produce<Store>((state) => {
                const prompt = getPrompt(state.terminal);
                prompt.line.content.splice(columnIndex - 1, 1);

                setPrompt(prompt, state.terminal);
            })
        ),
}));
