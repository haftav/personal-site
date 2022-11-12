import * as React from 'react';
import { isPrompt, Result, Prompt, TerminalRow, Char } from '../domain';
import { useStore } from './store';
import { useUpdatePrompt } from './terminal.impl';

const columnWidth = 10;
const rowHeight = 20;

function useHandleKeyPress() {
    const updatePrompt = useUpdatePrompt();

    React.useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            console.log('key', e.key);

            const key = e.key.toLowerCase();

            if (key.length !== 1) {
                return;
            }

            const isLetter = key >= 'a' && key <= 'z';
            const isNumber = key >= '0' && key <= '9';

            if (isLetter || isNumber) {
                updatePrompt(e.key);
            }
        };

        document.addEventListener('keydown', listener);

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [updatePrompt]);
}

export const Terminal = () => {
    useHandleKeyPress();

    const rows = useStore((store) => store.terminal.rows);

    return (
        <div style={{ position: 'absolute', width: '100vw', height: '100vh' }}>
            {rows.map((row) => (
                <Row row={row} key={row.index} />
            ))}
            <Cursor />
        </div>
    );
};

export const Cursor = () => {
    const position = useStore((store) => store.cursor.position);

    return (
        <div
            style={{
                width: columnWidth,
                height: rowHeight,
                position: 'absolute',
                top: 0,
                left: position.column * columnWidth,
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
        <span style={{ display: 'inline-block', width: columnWidth }}>
            {char}
        </span>
    );
};
