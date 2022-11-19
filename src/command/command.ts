import { Command, createResult, ParsedLine, Result } from '../domain';

export const handleCommand = (command: Command): Result => {
    const handler = commandFactory(command);

    const result = handler.getResult(command);

    return result;
};

function commandFactory(command: Command): CommandHandler {
    if (command.name === 'pwd') {
        return pwdHandler;
    }
    if (command.name === 'whoami') {
        return whoamiHandler;
    }

    return notFoundHandler;
}

interface CommandHandler {
    getResult(command: Command): Result;
}

const pwdHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['some directory'];

        return createResult(lines);
    },
};

const whoamiHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['tav'];

        return createResult(lines);
    },
};

const notFoundHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['Command not found'];
        return createResult(lines);
    },
};
