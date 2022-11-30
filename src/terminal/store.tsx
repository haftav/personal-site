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
    createChar,
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

                prompt.line.content.splice(columnIndex, 0, createChar(newChar));

                setPrompt(prompt, state.terminal);
            })
        ),
    addRow: (rowContent: Prompt | Result) => {
        set(
            produce<Store>((state) => {
                const newRow = createRow(createId(), rowContent);
                const rows = state.terminal.rows;

                const maxNumberOfRows = 100;

                if (rows.length + 1 > maxNumberOfRows) {
                    let index = 0;

                    if (isResult(rows[index + 1].content)) {
                        index += 1;
                    }

                    const sliceIndex = index + 1;

                    state.terminal.rows = state.terminal.rows.slice(sliceIndex);
                }

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
    moveCursor: (direction) =>
        set(
            produce<Store>((state) => {
                if (direction === 'left') {
                    state.cursor.position.column -= 1;
                } else {
                    state.cursor.position.column += 1;
                }
            })
        ),
}));
