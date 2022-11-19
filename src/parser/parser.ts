// TODO: this needs to parse Prompt interface and output Command result
import type { Prompt, PromptString, ParsedLine, Command } from '../domain';

const whitespaceChars = new Set<string>();
whitespaceChars.add(' ');

export function parse(promptString: PromptString): Command {
    // first element is command, following are args or flags
    const [name, ...rest] = promptString.split(' ');

    return {
        name,
        flags: [],
        args: [],
    };
    // flags can take the form -flagName (for single characters) or--flagName [flagData] or --flagName=[flagData] (for multi character flag names)
}

function getFlags() {}

function getArgs() {}
