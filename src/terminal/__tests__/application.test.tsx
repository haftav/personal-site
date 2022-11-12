/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { Prompt } from '../../domain';

import { useStore } from '../store';
import { useUpdatePrompt } from '../terminal.impl';

const length = useStore.getState().terminal.rows.length;
const getPrompt = () =>
    useStore.getState().terminal.rows[length - 1].content as Prompt;

const initialStoreState = useStore.getState();

beforeEach(() => {
    useStore.setState(initialStoreState, true);
});

describe('updatePrompt', () => {
    it('Updates empty prompt', () => {
        const { result: updatePromptRef } = renderHook(() => useUpdatePrompt());

        expect(useStore.getState().cursor.position).toMatchObject({
            row: 0,
            column: 0,
        });
        expect(getPrompt()).toMatchObject({
            line: {
                content: [''],
            },
        });

        act(() => updatePromptRef.current('a'));

        expect(useStore.getState().cursor.position).toMatchObject({
            row: 0,
            column: 1,
        });
        expect(getPrompt()).toMatchObject({
            line: {
                content: ['a', ''],
            },
        });
    });

    it('Updates prompt with content', () => {
        const { result: updatePromptRef } = renderHook(() => useUpdatePrompt());

        act(() => updatePromptRef.current('a'));
        act(() => updatePromptRef.current('b'));
        act(() => updatePromptRef.current('c'));

        expect(useStore.getState().cursor.position).toMatchObject({
            row: 0,
            column: 3,
        });
        expect(getPrompt()).toMatchObject({
            line: {
                content: ['a', 'b', 'c', ''],
            },
        });
    });
});
