import shallow from 'zustand/shallow';

import type { CharData } from '../domain';

import { parser } from '../parser';
import { commandHandler } from '../command';
import { useStore } from './store';

import {
    removeCharacter,
    submitPrompt,
    updatePrompt,
    moveCursor,
} from './terminal.app';

export function useUpdatePrompt() {
    const store = useStore();

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
            removeCharacter: store.removeCharacter,
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

export function useMoveCursor() {
    const store = useStore(
        (store) => ({
            moveCursor: store.moveCursor,
            cursor: store.cursor,
            terminal: store.terminal,
        }),
        shallow
    );

    return (direction: 'left' | 'right') => moveCursor(direction, { store });
}
