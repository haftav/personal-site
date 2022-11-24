import { describe, it, expect } from 'vitest';
import { Command, isResult, isPrompt, Result } from '../domain';
import { resultToString } from '../utils';
import { handleCommand, aboutMe, fakeDirectories } from './command';

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
});
