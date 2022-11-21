import { describe, it, expect } from 'vitest';
import type { Command } from '../domain';
import { resultToString } from '../utils';
import { handleCommand, aboutMe, fakeDirectories } from './command';

describe('Handles CLI commands correctly', () => {
    it('handles whoami', () => {
        const command: Command = {
            name: 'whoami',
            args: [],
            flags: [],
        };

        expect(resultToString(handleCommand(command))).toBe(aboutMe.join('\n'));
    });

    it('handles command not found', () => {
        const command: Command = {
            name: 'whattheheckareyoutyping',
            args: [],
            flags: [],
        };

        expect(resultToString(handleCommand(command))).toBe(
            'command not found: whattheheckareyoutyping'
        );
    });

    it('handles ls', () => {
        const command: Command = {
            name: 'ls',
            args: [],
            flags: [],
        };

        expect(resultToString(handleCommand(command))).toBe(
            fakeDirectories.join(' ')
        );
    });
});
