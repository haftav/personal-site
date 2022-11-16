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

    console.log('terminalWidth', terminalWidth);
    console.log('column', position.column);

    const terminalWidthInGrid = Math.floor(terminalWidth / columnWidth);

    const correctedLeft =
        (position.column % Math.floor(terminalWidth / columnWidth)) *
        columnWidth;
    const correctedTop =
        Math.floor(position.column / terminalWidthInGrid) * rowHeight;

    console.log('left', correctedLeft);

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
            {prompt.line.content.map((char) => (
                <Char char={char} />
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
