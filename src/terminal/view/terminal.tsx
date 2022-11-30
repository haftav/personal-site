import * as React from 'react';
import { About, Container, Work } from '../../components';
import { TerminalRow, Result, Prompt, Char, isPrompt } from '../../domain';
import { useRouterStore } from '../../router';
import { useStore } from '../store';
import { CELL_HEIGHT, CELL_WIDTH } from './constants';

import {
    useHandleKeyPress,
    useTerminalFocus,
    useTerminalSize,
    useCursorPixelPosition,
    useScrollOnOverflow,
    useExitToMain,
} from './hooks';

export const TerminalView = () => {
    const route = useRouterStore((state) => state.route);

    switch (route) {
        case 'about':
            return <AboutView />;
        case 'work':
            return <WorkView />;
        case 'blog':
            return <Blog />;
        default:
            return <Terminal />;
    }
};

export const Terminal = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    const { ref: terminalRef, width, height } = useTerminalSize();
    const { ref: hiddenInputRef, setFocus } = useTerminalFocus();
    const handleKeyPress = useHandleKeyPress();

    const { left, top } = useCursorPixelPosition(width);

    useScrollOnOverflow(containerRef, height, top);

    const rows = useStore((store) => store.terminal.rows);
    const rowsLength = rows.length;

    return (
        <div
            ref={containerRef}
            style={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                padding: '8px',
                overflow: 'scroll',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100vh',
                }}
                ref={terminalRef}
                onClick={setFocus}
            >
                {rows.map((row, index) => (
                    <Row
                        row={row}
                        key={row.id}
                        isLastRow={index === rowsLength - 1}
                    />
                ))}
                <Cursor left={left} top={top} />
                <input
                    ref={hiddenInputRef}
                    onKeyDown={handleKeyPress}
                    aria-hidden="true"
                    defaultValue=""
                    style={{ width: 0, height: 0, border: 'none' }}
                    autoCapitalize="none"
                />
            </div>
        </div>
    );
};

interface CursorProps {
    left: number;
    top: number;
}

export const Cursor = (props: CursorProps) => {
    const { left, top } = props;

    return (
        <div
            style={{
                width: CELL_WIDTH,
                height: CELL_HEIGHT,
                position: 'absolute',
                top: top,
                left,
                backgroundColor: 'white',
                zIndex: 1,
            }}
        />
    );
};

export const Row = ({
    row,
    isLastRow,
}: {
    row: TerminalRow;
    isLastRow: boolean;
}) => {
    const { content } = row;

    return isPrompt(content) ? (
        <PromptRow prompt={content} isCurrentPrompt={isLastRow} />
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

export const PromptRow = ({
    prompt,
    isCurrentPrompt,
}: {
    prompt: Prompt;
    isCurrentPrompt?: boolean;
}) => {
    const cursorPosition = useStore((store) => store.cursor.position);

    return (
        <div>
            {prompt.prefix.split('').map((char, index) => (
                <span
                    key={index}
                    style={{
                        display: 'inline-block',
                        width: CELL_WIDTH,
                        lineHeight: '20px',
                    }}
                >
                    {char}
                </span>
            ))}
            {prompt.line.content.map((char, index) => (
                <Char
                    char={char}
                    key={char.id}
                    isUnderCursor={
                        isCurrentPrompt && cursorPosition.column === index
                    }
                />
            ))}
        </div>
    );
};

const Char = ({
    char,
    isUnderCursor,
}: {
    char: Char;
    isUnderCursor?: boolean;
}) => {
    return (
        <span
            style={{
                position: 'relative',
                zIndex: isUnderCursor ? 2 : 1,
                color: isUnderCursor ? 'black' : 'white',
                display: 'inline-block',
                width: CELL_WIDTH,
                lineHeight: '20px',
            }}
        >
            {char.data}
        </span>
    );
};

const AboutView = () => {
    useExitToMain();

    return (
        <Container title="About me">
            <About />
        </Container>
    );
};

const WorkView = () => {
    useExitToMain();

    return (
        <Container title="Work">
            <Work />
        </Container>
    );
};

const Blog = () => {
    useExitToMain();

    return (
        <Container title="Blog">
            <p>Coming soon...</p>
        </Container>
    );
};
