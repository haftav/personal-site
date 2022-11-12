import type { Prompt, PromptString, ParsedLine } from '../domain';

type HandlerFactory = (command: Command) => CommandHandler;
type Command = string;
interface CommandHandler {
    handleCommand: () => ParsedLine[];
}

function whoAmiHandler() {
    return ["I don't know, who are you?"];
}

function handleCommand(command: Command) {
    if (!command) {
        throw new Error();
    }

    if (command === 'whoami') {
        return whoAmiHandler();
    } else {
        return [`command not found: ${command}`];
    }
}

export function parse(promptString: PromptString): ParsedLine[] {
    const command = getCommand(promptString);

    return handleCommand(command);
}

// TODO: move to utils module
function convertCharListToString(prompt: Prompt) {
    return prompt.line.content.join('').trim();
}

function getCommand(lineString: string) {
    const splitLine = lineString.split(' ');

    if (!splitLine[0]) {
        return '';
    }

    return splitLine[0];
}
