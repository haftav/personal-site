import { isPrompt, Result, Prompt, TerminalRow, Char } from '../../domain';
import { useStore } from '../store';

import { useHandleKeyPress, useTerminalSize } from './hooks';

const columnWidth = 10;
const rowHeight = 20;

export const Terminal = () => {
    useHandleKeyPress();

    const { ref, width } = useTerminalSize();

    const rows = useStore((store) => store.terminal.rows);

    return (
        <div
            style={{ position: 'absolute', width: '100vw', height: '100vh' }}
            ref={ref}
        >
            {rows.map((row) => (
                <Row row={row} key={row.index} />
            ))}
            <Cursor terminalWidth={width} />
        </div>
    );
};

interface CursorProps {
    terminalWidth: number;
}

export const Cursor = (props: CursorProps) => {
    const { terminalWidth } = props;

    const position = useStore((store) => store.cursor.position);
    // TODO: turn this into a selector
    const prompt = useStore((store) => store.getPrompt());

    const prefixOffset = prompt.prefix.length;
    console.log('offset', prefixOffset);

    const column = position.column + prefixOffset;

    const terminalWidthInGridDimensions = Math.floor(
        terminalWidth / columnWidth
    );

    const correctedLeft =
        (column % terminalWidthInGridDimensions) * columnWidth;
    const correctedTop =
        Math.floor(column / terminalWidthInGridDimensions) * rowHeight;

    return (
        <div
            style={{
                width: columnWidth,
                height: rowHeight,
                position: 'absolute',
                top: correctedTop,
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
    return <div>{JSON.stringify(result)}</div>;
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
