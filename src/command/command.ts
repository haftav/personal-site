import { Command, createResult, ParsedLine, Result } from '../domain';

export const handleCommand = (command: Command): Result => {
    const handler = commandFactory(command);

    const result = handler.getResult(command);

    return result;
};

function commandFactory(command: Command): CommandHandler {
    if (command.name === 'help') {
        return helpHandler;
    }
    if (command.name === 'pwd') {
        return pwdHandler;
    }
    if (command.name === 'ls') {
        return lsHandler;
    }
    if (command.name === 'cd') {
        return cdHandler;
    }
    if (command.name === 'whoami') {
        return whoamiHandler;
    }

    return notFoundHandler;
}

interface CommandHandler {
    getResult(command: Command): Result;
}

const helpHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['Available commands:', 'whoami'];

        return createResult(lines);
    },
};

const pwdHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['coming soon...'];

        return createResult(lines);
    },
};

export const fakeDirectories = ['about', 'work', 'skills', 'blog'];

const lsHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = [fakeDirectories.join(' ')];

        return createResult(lines);
    },
};

const cdHandler: CommandHandler = {
    getResult: () => {
        const lines: ParsedLine[] = ['coming soon...'];

        return createResult(lines);
    },
};

export const aboutMe: ParsedLine[] = [
    'Hi!',
    "I'm Tav.",
    'I love building web applications and am currently working with Sliderule on no-code backend tools.',
];

const whoamiHandler: CommandHandler = {
    getResult: () => {
        return createResult(aboutMe);
    },
};

const notFoundHandler: CommandHandler = {
    getResult: (command) => {
        const lines: ParsedLine[] = [`command not found: ${command.name}`];
        return createResult(lines);
    },
};
