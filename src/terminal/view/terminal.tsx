import {
    isPrompt,
    Result,
    Prompt,
    TerminalRow,
    Char,
    getPrompt,
} from '../../domain';
import { useRouterStore, router } from '../../router';
import { useStore } from '../store';

import { useHandleKeyPress, useTerminalSize } from './hooks';

const columnWidth = 10;
const rowHeight = 20;

export const TerminalView = () => {
    const route = useRouterStore((state) => state.route);

    switch (route) {
        case 'about':
            return <AboutMe />;
        default:
            return <Terminal />;
    }
};

export const Terminal = () => {
    useHandleKeyPress();

    const { ref, width } = useTerminalSize();

    const rows = useStore((store) => store.terminal.rows);

    return (
        <div
            style={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                overflow: 'scroll',
            }}
            ref={ref}
        >
            {rows.map((row) => (
                <Row row={row} key={row.id} />
            ))}
            <Cursor terminalWidth={width} />
        </div>
    );
};

function calculateRowHeight(
    row: TerminalRow,
    terminalWidthInGridDimensions: number
) {
    const { content } = row;

    if (isPrompt(content)) {
        const prefixOffset = content.prefix.length;

        const characters = content.line.content;
        const numberOfCharactersInRow = characters.length;
        const column = prefixOffset + numberOfCharactersInRow;

        const heightInPixels =
            rowHeight +
            Math.floor(column / terminalWidthInGridDimensions) * rowHeight;

        return heightInPixels;
    } else {
        // iterate through all rows in each result, adding up heights
        return content.lines.reduce((accum, line) => {
            const characters = line.content;
            const column = characters.length;

            const heightInPixels =
                rowHeight +
                Math.floor(column / terminalWidthInGridDimensions) * rowHeight;

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

    // TODO: find another way to get prefix without storing it in store
    // it should be derived from the current 'view'
    const prefixOffset = prompt.prefix.length;

    const column = position.column + prefixOffset;

    const terminalWidthInGridDimensions = Math.floor(
        terminalWidth / columnWidth
    );

    const heightOfAllRowsExceptLastInPixels = rows
        .slice(0, rows.length - 1)
        .reduce(
            (accum, curr) =>
                accum + calculateRowHeight(curr, terminalWidthInGridDimensions),
            0
        );

    const correctedLeft =
        (column % terminalWidthInGridDimensions) * columnWidth;
    const correctedTop =
        Math.floor(column / terminalWidthInGridDimensions) * rowHeight;

    const top = heightOfAllRowsExceptLastInPixels + correctedTop;

    return (
        <div
            style={{
                width: columnWidth,
                height: rowHeight,
                position: 'absolute',
                top: top,
                left: correctedLeft,
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
        </div>
    );
};
