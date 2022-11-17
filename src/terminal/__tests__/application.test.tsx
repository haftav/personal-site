/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';

import { createInitialTerminal, Prompt } from '../../domain';
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
    it('Correctly removes character', () => {
        const newTerminal = createInitialTerminal();

        newTerminal.rows[0].content = {
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
        } as Prompt;

        useStore.setState({
            terminal: newTerminal,
        });

        useStore.setState({
            cursor: {
                position: {
                    row: 0,
                    column: 1,
                },
            },
        });

        const { result: removeCharacterRef } = renderHook(() =>
            useRemoveCharacter()
        );

        act(() => removeCharacterRef.current());

        expect(getPrompt()).toMatchObject({
            line: {
                content: [
                    {
                        data: 'a',
                    },
                ],
            },
        });
    });

    it("Doesn't let you remove past prompt start", () => {
        const newTerminal = createInitialTerminal();

        newTerminal.rows[0].content = {
            line: {
                content: [
                    {
                        data: '',
                    },
                ],
            },
        } as Prompt;

        useStore.setState({
            terminal: newTerminal,
        });

        useStore.setState({
            cursor: {
                position: {
                    row: 0,
                    column: 0,
                },
            },
        });

        const { result: removeCharacterRef } = renderHook(() =>
            useRemoveCharacter()
        );

        act(() => removeCharacterRef.current());

        expect(getPrompt()).toMatchObject({
            line: {
                content: [
                    {
                        data: '',
                    },
                ],
            },
        });
    });
});
