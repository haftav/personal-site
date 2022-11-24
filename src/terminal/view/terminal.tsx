import {
    TerminalRow,
    Result,
    Prompt,
    Char,
    getPrompt,
    isPrompt,
} from '../../domain';
import { useRouterStore, router } from '../../router';
import { useStore } from '../store';

import { useHandleKeyPress, useTerminalFocus, useTerminalSize } from './hooks';

const columnWidth = 10;
const rowHeight = 20;

export const TerminalView = () => {
    const route = useRouterStore((state) => state.route);

    switch (route) {
        case 'about':
            return <AboutMe />;
        case 'work':
            return <Work />;
        case 'skills':
            return <Skills />;
        case 'blog':
            return <Blog />;
        default:
            return <Terminal />;
    }
};

export const Terminal = () => {
    const { ref: terminalRef, width } = useTerminalSize();
    const { ref: hiddenInputRef, setFocus } = useTerminalFocus();
    const handleKeyPress = useHandleKeyPress();

    const rows = useStore((store) => store.terminal.rows);

    return (
        <div
            style={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                overflow: 'scroll',
            }}
            ref={terminalRef}
            onClick={setFocus}
        >
            {rows.map((row) => (
                <Row row={row} key={row.id} />
            ))}
            <Cursor terminalWidth={width} />
            <input
                ref={hiddenInputRef}
                onKeyDown={handleKeyPress}
                value=""
                style={{ width: 0, height: 0, border: 'none' }}
                autoCapitalize="none"
            />
        </div>
    );
};

function calculateRowHeight(
    row: TerminalRow,
    terminalWidthInGridCells: number
) {
    const { content } = row;

    if (isPrompt(content)) {
        const prefixOffset = content.prefix.length;

        const characters = content.line.content;
        const numberOfCharactersInRow = characters.length;
        const column = prefixOffset + numberOfCharactersInRow;

        const heightInPixels =
            rowHeight +
            Math.floor(column / terminalWidthInGridCells) * rowHeight;

        return heightInPixels;
    } else {
        // iterate through all rows in each result, adding up heights
        return content.lines.reduce((accum, line) => {
            const characters = line.content;
            const column = characters.length;

            const heightInPixels =
                rowHeight +
                Math.floor(column / terminalWidthInGridCells) * rowHeight;

            return accum + heightInPixels;
        }, 0);
    }
}

interface CursorProps {
    terminalWidth: number;
}

export const Cursor = (props: CursorProps) => {
    const { terminalWidth } = props;

    const position = useStore((store) => store.cursor.position);
    const prompt = useStore((store) => getPrompt(store.terminal));
    const rows = useStore((store) => store.terminal.rows);

    const prefixOffset = prompt.prefix.length;

    const column = position.column + prefixOffset;

    const terminalWidthInGridCells = Math.floor(terminalWidth / columnWidth);

    const heightOfAllRowsExceptLastInPixels = rows
        .slice(0, rows.length - 1)
        .reduce(
            (accum, curr) =>
                accum + calculateRowHeight(curr, terminalWidthInGridCells),
            0
        );

    const left = (column % terminalWidthInGridCells) * columnWidth;
    const currentRowTop =
        Math.floor(column / terminalWidthInGridCells) * rowHeight;
    const top = heightOfAllRowsExceptLastInPixels + currentRowTop;

    return (
        <div
            style={{
                width: columnWidth,
                height: rowHeight,
                position: 'absolute',
                top: top,
                left,
                backgroundColor: 'white',
            }}
        />
    );
};

export const Row = ({ row }: { row: TerminalRow }) => {
    const { content } = row;

    return isPrompt(content) ? (
        <PromptRow prompt={content} />
    ) : (
        <ResultRow result={content} />
    );
};

export const ResultRow = ({ result }: { result: Result }) => {
    return (
        <div>
            {result.lines.map((line, index) => (
                <div key={index}>
                    {line.content.map((char) => (
                        <Char char={char} key={char.id} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const PromptRow = ({ prompt }: { prompt: Prompt }) => {
    return (
        <div>
            {prompt.prefix.split('').map((char, index) => (
                <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        width: columnWidth,
                        lineHeight: '20px',
                    }}
                >
                    {char}
                </span>
            ))}
            {prompt.line.content.map((char) => (
                <Char char={char} key={char.id} />
            ))}
        </div>
    );
};

const Char = ({ char }: { char: Char }) => {
    return (
        <span
            style={{
                display: 'inline-block',
                width: columnWidth,
                lineHeight: '20px',
            }}
        >
            {char.data}
        </span>
    );
};

const AboutMe = () => {
    return (
        <div>
            <div>
                <button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </button>
            </div>
            <h1>About me</h1>
        </div>
    );
};

const Skills = () => {
    return (
        <div>
            <div>
                <button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </button>
            </div>

            <h1>Skills</h1>
        </div>
    );
};

const Work = () => {
    return (
        <div>
            <div>
                <button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </button>
            </div>

            <h1>Work</h1>
        </div>
    );
};

const Blog = () => {
    return (
        <div>
            <div>
                <button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </button>
            </div>
            <h1>Blog</h1>
        </div>
    );
};
