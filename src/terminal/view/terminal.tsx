import * as React from 'react';
import { TerminalRow, Result, Prompt, Char, isPrompt } from '../../domain';
import { useRouterStore, router } from '../../router';
import { Button } from '../../ui';
import { useStore } from '../store';
import { CELL_HEIGHT, CELL_WIDTH } from './constants';

import {
    useHandleKeyPress,
    useTerminalFocus,
    useTerminalSize,
    useCursorPixelPosition,
    useScrollOnOverflow,
} from './hooks';

export const TerminalView = () => {
    const route = useRouterStore((state) => state.route);

    switch (route) {
        case 'about':
            return <AboutMe />;
        case 'work':
            return <Work />;
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
                {rows.map((row) => (
                    <Row row={row} key={row.id} />
                ))}
                <Cursor left={left} top={top} />
                <input
                    ref={hiddenInputRef}
                    onKeyDown={handleKeyPress}
                    value=""
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
                        width: CELL_WIDTH,
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
                width: CELL_WIDTH,
                lineHeight: '20px',
            }}
        >
            {char.data}
        </span>
    );
};

const AboutMe = () => {
    return (
        <div style={{ padding: 24 }}>
            <div>
                <Button onClick={() => router.navigate('main')}>
                    {'<<'} Back
                </Button>
            </div>
            <h1 style={{ padding: '16px 0px' }}>About me</h1>
            <p style={{ lineHeight: 1.5, marginBottom: 16 }}>
                Hi! I’m Tav. I love building software of any kind, especially
                web applications. My professional career began at Overstock,
                where I worked on customer-facing features like the sitewide
                header and footer, as well as various internal tools. I now work
                at Sliderule, where I’m helping build a modern rules engine +
                workflow automation tool to simplify the process of creating,
                approving and deploying backend logic.
            </p>
            <p>---</p>
            <p>type q or enter to exit</p>
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
