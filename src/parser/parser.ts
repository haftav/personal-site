// TODO: this needs to parse Prompt interface and output Command result
import type {
    Prompt,
    PromptString,
    ParsedLine,
    Command,
    Flag,
    Arg,
} from '../domain';

function isFlag(x: string): x is Flag {
    const singleFlagRegex = /^-\w$/i;
    const doubleFlagRegex = /^--\w*$/i;
    // must start with single or double dash
}

const whitespaceChars = new Set<string>();
whitespaceChars.add(' ');

export function parse(promptString: PromptString): Command {
    // first element is command, following are args or flags
    const [name, ...rest] = promptString.split(' ');

    // TODO: add this
    // examples
    // -a -b 2
    // --flag=flagname

    const flags: Flag[] = [];
    // NOTE: this will break when I start handling flags
    const args: Arg[] = rest;

    return {
        name,
        flags,
        args,
    };
    // flags can take the form -flagName (for single characters) or--flagName [flagData] or --flagName=[flagData] (for multi character flag names)
}

function getFlags() {}

function getArgs() {}
