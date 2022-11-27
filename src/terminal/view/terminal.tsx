import * as React from 'react';
import { PageContainer } from '../../components';
import { TerminalRow, Result, Prompt, Char, isPrompt } from '../../domain';
import { useRouterStore, router } from '../../router';
import { Button, List } from '../../ui';
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
    useExitToMain();

    return (
        <PageContainer title="About me">
            <p style={{ lineHeight: 1.5, marginBottom: 16 }}>
                Hi! I’m Tav. I love building software of any kind, especially
                web applications. I currently work at Sliderule, where I’m
                helping build a modern rules engine + workflow automation tool
                to simplify the process of creating, approving and deploying
                backend logic.
            </p>
        </PageContainer>
    );
};

const Work = () => {
    useExitToMain();

    return (
        <PageContainer title="Work">
            <List>
                <List.Item>
                    <List.Heading>
                        Lead frontend engineer - <i>Sliderule</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Currently leading frontend development of the
                            Sliderule web app, taking on responsibilities
                            ranging from frontend architectural decisions,
                            day-to-day feature work + prioritization, running
                            interviews, and helping build team culture
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Contract software engineer - <i>FarmRaise</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Planned and implemented command-line PDF generation
                            tool. Used Python to parse CSV data and output
                            completed PDF forms.
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Frontend developer - <i>PurposeWorks</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Implemented various features and enhancements on the
                            PurposeWorks client using React/TypeScript
                        </List.Item>
                        <List.Item>
                            Handled global application state and data fetching
                            with Redux action creators, selectors, and reducers
                        </List.Item>
                        <List.Item>
                            Integrated Google Analytics into client-side code to
                            gather user interaction data
                        </List.Item>
                    </List>
                </List.Item>
                <List.Item>
                    <List.Heading>
                        Frontend developer - <i>Overstock</i>
                    </List.Heading>
                    <List>
                        <List.Item>
                            Maintained various customer-facing and internal
                            frontend React applications, Express rendering
                            services, and NodeJS/Express APIs
                        </List.Item>
                        <List.Item>
                            Developed new features for customer-facing
                            applications such as sitewide header, sales pages,
                            and homepage carousel
                        </List.Item>
                        <List.Item>
                            Architected and implemented overhaul for sitewide
                            search input to improve accessibility and overall
                            functionality. Improved and developed features for
                            internal applications, including company-wide CMS
                            and web performance dashboard
                        </List.Item>
                        <List.Item>
                            Unit-tested updates to reduce issues and improve
                            code stability. Performed bug fixes, monitored
                            application health, and assisted in deployment
                            process
                        </List.Item>
                    </List>
                </List.Item>
            </List>
        </PageContainer>
    );
};

const Blog = () => {
    useExitToMain();

    return <PageContainer title="Blog"></PageContainer>;
};
