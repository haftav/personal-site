/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import type { Prompt } from '../../domain';
import { resetId } from '../../utils';
import { useStore } from '../store';
import { useRemoveCharacter, useUpdatePrompt } from '../terminal.impl';

const length = useStore.getState().terminal.rows.length;
const getPrompt = () =>
    useStore.getState().terminal.rows[length - 1].content as Prompt;

const initialStoreState = useStore.getState();

beforeEach(() => {
    useStore.setState(initialStoreState, true);
    resetId();
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
                content: [
                    {
                        data: '',
                    },
                ],
            },
        });

        act(() => updatePromptRef.current('a'));

        expect(useStore.getState().cursor.position).toMatchObject({
            row: 0,
            column: 1,
        });
        expect(getPrompt()).toMatchObject({
            line: {
                content: [
                    {
                        data: 'a',
                    },
                    {
                        data: '',
                    },
                ],
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
                content: [
                    {
                        data: 'a',
                    },
                    {
                        data: 'b',
                    },
                    {
                        data: 'c',
                    },
                    {
                        data: '',
                    },
                ],
            },
        });
    });
});

describe('removeCharacter', () => {
    it('does a thing', () => {
        const { result: removeCharacterRef } = renderHook(() =>
            useRemoveCharacter()
        );
        useStore.setState({
            cursor: {
                position: {
                    row: 0,
                    column: 1,
                },
            },
        });

        act(() => removeCharacterRef.current());

        expect(true);
    });
});
