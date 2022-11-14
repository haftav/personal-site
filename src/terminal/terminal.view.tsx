import * as React from 'react';
import { isPrompt, Result, Prompt, TerminalRow, Char } from '../domain';
import { useStore } from './store';
import { useUpdatePrompt, useRemoveCharacter } from './terminal.impl';

const columnWidth = 10;
const rowHeight = 20;

function useHandleKeyPress() {
    const updatePrompt = useUpdatePrompt();
    const removeCharacter = useRemoveCharacter();

    React.useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();

            const isBackspace = key === 'backspace';

            if (isBackspace) {
                console.log('removing');
                removeCharacter();
                return;
            }

            if (key.length !== 1) {
                return;
            }

            updatePrompt(e.key);
        };

        document.addEventListener('keydown', listener);

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [updatePrompt, removeCharacter]);
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
            {char.data}
        </span>
    );
};
