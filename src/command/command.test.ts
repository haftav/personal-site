import { describe, it, expect, beforeEach } from 'vitest';
import { Command, isResult, isPrompt, Result, routes } from '../domain';
import { useRouterStore } from '../router';
import { resultToString } from '../utils';
import { handleCommand, aboutMe, fakeDirectories } from './command';

// probably not the cleanest way to test this
const initialStoreState = useRouterStore.getState();

beforeEach(() => {
    useRouterStore.setState(initialStoreState, true);
});

describe('Handles CLI commands correctly', () => {
    it('handles whoami', () => {
        const command: Command = {
            name: 'whoami',
            args: [],
            flags: [],
        };

        const results = handleCommand(command);
        expect(results.length).toBe(2);

        const [result, prompt] = results;

        expect(isResult(result)).toBeTruthy();
        expect(isPrompt(prompt)).toBeTruthy();

        expect(resultToString(result as Result)).toBe(aboutMe.join('\n'));
    });

    it('handles command not found', () => {
        const command: Command = {
            name: 'whattheheckareyoutyping',
            args: [],
            flags: [],
        };

        const results = handleCommand(command);
        expect(results.length).toBe(2);

        const [result, prompt] = results;

        expect(isResult(result)).toBeTruthy();
        expect(isPrompt(prompt)).toBeTruthy();

        expect(resultToString(result as Result)).toBe(
            'command not found: whattheheckareyoutyping'
        );
    });

    it('handles ls', () => {
        const command: Command = {
            name: 'ls',
            args: [],
            flags: [],
        };

        const results = handleCommand(command);
        expect(results.length).toBe(2);

        const [result, prompt] = results;

        expect(isResult(result)).toBeTruthy();
        expect(isPrompt(prompt)).toBeTruthy();

        expect(resultToString(result as Result)).toBe(
            fakeDirectories.join(' ')
        );
    });

    it('handles cd to main view', () => {
        const cdToNothing: Command = {
            name: 'cd',
            args: [],
            flags: [],
        };

        const cdToSquiggly: Command = {
            name: 'cd',
            args: ['~'],
            flags: [],
        };

        const cdToSlash: Command = {
            name: 'cd',
            args: ['/'],
            flags: [],
        };

        const [result1] = handleCommand(cdToNothing);
        expect(isPrompt(result1)).toBeTruthy();
        expect(useRouterStore.getState().route).toBe('main');

        const [result2] = handleCommand(cdToSquiggly);
        expect(isPrompt(result2)).toBeTruthy();
        expect(useRouterStore.getState().route).toBe('main');

        const [result3] = handleCommand(cdToSlash);
        expect(isPrompt(result3)).toBeTruthy();
        expect(useRouterStore.getState().route).toBe('main');
    });

    it('handles cd to a directory', () => {
        routes.forEach((route) => {
            const command: Command = {
                name: 'cd',
                args: [route],
                flags: [],
            };

            const [result] = handleCommand(command);

            expect(isPrompt(result)).toBeTruthy();
            expect(useRouterStore.getState().route).toBe(route);
        });
    });
});
