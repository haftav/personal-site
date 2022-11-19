import shallow from 'zustand/shallow';

import type { CharData, Prompt } from '../domain';

import { parser } from '../parser';
import { commandHandler } from '../command';
import { useStore } from './store';

import { removeCharacter, submitPrompt, updatePrompt } from './terminal.app';

export function useUpdatePrompt() {
    const store = useStore(
        (store) => ({
            terminal: store.terminal,
            updatePrompt: store.updatePrompt,
            cursor: store.cursor,
            setCursorPosition: store.setCursorPosition,
            addRow: store.addRow,
            removeCharacter: store.removeCharacter, // TODO: this is gross, need to figure out better solution
        }),
        shallow
    );

    return (newChar: CharData) =>
        updatePrompt(newChar, {
            store,
        });
}

export function useRemoveCharacter() {
    const store = useStore(
        (store) => ({
            cursor: store.cursor,
            setCursorPosition: store.setCursorPosition,
            removeCharacter: store.removeCharacter, // TODO: this is gross, need to figure out better solution
        }),
        shallow
    );

    return () =>
        removeCharacter({
            store,
        });
}

export function useSubmitPrompt() {
    const store = useStore();

    return () => submitPrompt({ store, parser, commandHandler });
}
