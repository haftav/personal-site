import {
    Command,
    ParsedLine,
    Result,
    Prompt,
    Arg,
    Route,
    createPrompt,
    createResult,
    isRoute,
} from '../domain';
import { router } from '../router';

export const handleCommand = (command: Command): Array<Prompt | Result> => {
    const handler = commandFactory(command);

    const result = handler.getResult(command);

    return result;
};

function commandFactory(command: Command): CommandHandler {
    if (command.name === 'help') {
        return createHelpHandler();
    }
    if (command.name === 'pwd') {
        return createPwdHandler();
    }
    if (command.name === 'ls') {
        return createLsHandler();
    }
    if (command.name === 'cd') {
        return createCdHandler(command.args, { router });
    }
    if (command.name === 'whoami') {
        return createWhoamiHandler();
    }

    return notFoundHandler;
}

interface CommandHandler {
    getResult(command: Command): Array<Prompt | Result>;
}

const createHelpHandler = (): CommandHandler => {
    return {
        getResult: () => {
            const lines: ParsedLine[] = [
                'Available commands:',
                'whoami',
                'ls',
                'cd',
            ];

            return [createResult(lines), createPrompt()];
        },
    };
};

const createPwdHandler = (): CommandHandler => {
    return {
        getResult: () => {
            const lines: ParsedLine[] = ['coming soon...'];

            return [createResult(lines), createPrompt()];
        },
    };
};

export const fakeDirectories = ['about', 'work', 'skills', 'blog'];

const createLsHandler = (): CommandHandler => {
    return {
        getResult: () => {
            const lines: ParsedLine[] = [fakeDirectories.join(' ')];

            return [createResult(lines), createPrompt()];
        },
    };
};

interface RouterService {
    navigate(path: Route): void;
}

const createCdHandler = (
    args: Arg[],
    deps: { router: RouterService }
): CommandHandler => {
    const { router } = deps;

    return {
        getResult: () => {
            let directory = args[0];

            if (!directory || directory === '~' || directory === '/') {
                directory = 'main';
            }

            try {
                if (!isRoute(directory)) {
                    throw new Error('Directory does not exist');
                }

                router.navigate(directory);

                return [createPrompt()];
            } catch (err) {
                return [
                    createResult([
                        `cd: no such file or directory: ${directory}`,
                    ]),
                    createPrompt(),
                ];
            }
        },
    };
};

export const aboutMe: ParsedLine[] = [
    'Hi!',
    "I'm Tav.",
    'I love building web applications and am currently working with Sliderule on no-code backend tools.',
];

const createWhoamiHandler = (): CommandHandler => {
    return {
        getResult: () => {
            return [createResult(aboutMe), createPrompt()];
        },
    };
};

const notFoundHandler: CommandHandler = {
    getResult: (command) => {
        const lines: ParsedLine[] = [`command not found: ${command.name}`];
        return [createResult(lines), createPrompt()];
    },
};
