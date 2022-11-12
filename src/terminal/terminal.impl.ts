import shallow from 'zustand/shallow';

import type { Char, Prompt } from '../domain';
import { useStore } from './store';
import { updatePrompt } from './terminal.app';

export function useUpdatePrompt() {
    const store = useStore(
        (store) => ({
            prompt: store.terminal.rows[store.terminal.rows.length - 1]
                .content as Prompt,
            updatePrompt: store.updatePrompt,
            cursor: store.cursor,
            setCursorPosition: store.setCursorPosition,
            addRow: store.addRow,
        }),
        shallow
    );

    return (newChar: Char) =>
        updatePrompt(newChar, {
            store,
        });
}

export function useSubmitPrompt() {}
