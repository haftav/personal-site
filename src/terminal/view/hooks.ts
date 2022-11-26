import * as React from 'react';
import { TerminalRow, getPrompt, isPrompt } from '../../domain';
import { useStore } from '../store';
import { CELL_WIDTH, CELL_HEIGHT } from './constants';

import {
    useUpdatePrompt,
    useRemoveCharacter,
    useSubmitPrompt,
} from '../terminal.impl';

interface Dimensions {
    width: number;
    height: number;
}

export function useTerminalSize() {
    const ref = React.useRef<HTMLDivElement>(null);

    const [size, setSize] = React.useState<Dimensions>({
        width: 0,
        height: 0,
    });

    React.useLayoutEffect(() => {
        if (ref.current) {
            setSize({
                width: ref.current.offsetWidth,
                height: ref.current.offsetHeight,
            });
        }
    }, []);

    React.useEffect(() => {
        function handleWindowResize() {
            if (ref.current) {
                setSize({
                    width: ref.current.offsetWidth,
                    height: ref.current.offsetHeight,
                });
            }
        }

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    return {
        ref,
        width: size.width,
        height: size.height,
    };
}

export function useHandleKeyPress() {
    const updatePrompt = useUpdatePrompt();
    const removeCharacter = useRemoveCharacter();
    const submitPrompt = useSubmitPrompt();

    const listener: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
        const key = e.key.toLowerCase();

        const isEnter = key === 'enter';
        const isBackspace = key === 'backspace';

        if (isEnter) {
            submitPrompt();
            return;
        }

        if (isBackspace) {
            removeCharacter();
            return;
        }

        if (key.length !== 1) {
            return;
        }

        updatePrompt(e.key);
    };

    return listener;
}

export function useTerminalFocus() {
    const ref = React.useRef<HTMLInputElement>(null);

    const setFocus = () => {
        ref.current?.focus();
    };

    React.useEffect(() => {
        ref.current?.focus();
    }, []);

    return {
        ref,
        setFocus,
    };
}

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
            CELL_HEIGHT +
            Math.floor(column / terminalWidthInGridCells) * CELL_HEIGHT;

        return heightInPixels;
    } else {
        // iterate through all rows in each result, adding up heights
        return content.lines.reduce((accum, line) => {
            const characters = line.content;
            const column = characters.length;

            const heightInPixels =
                CELL_HEIGHT +
                Math.floor(column / terminalWidthInGridCells) * CELL_HEIGHT;

            return accum + heightInPixels;
        }, 0);
    }
}

export function useCursorPixelPosition(terminalWidth: number) {
    const position = useStore((store) => store.cursor.position);
    const prompt = useStore((store) => getPrompt(store.terminal));
    const rows = useStore((store) => store.terminal.rows);

    const prefixOffset = prompt.prefix.length;

    const column = position.column + prefixOffset;

    const terminalWidthInGridCells = Math.floor(terminalWidth / CELL_WIDTH);

    const heightOfAllRowsExceptLastInPixels = rows
        .slice(0, rows.length - 1)
        .reduce(
            (accum, curr) =>
                accum + calculateRowHeight(curr, terminalWidthInGridCells),
            0
        );

    const left = (column % terminalWidthInGridCells) * CELL_WIDTH;
    const currentRowTop =
        Math.floor(column / terminalWidthInGridCells) * CELL_HEIGHT;
    const top = heightOfAllRowsExceptLastInPixels + currentRowTop;

    return {
        left,
        top,
    };
}

export function useScrollOnOverflow(
    containerRef: React.RefObject<HTMLDivElement>,
    terminalHeight: number,
    cursorTopInPixels: number
) {
    // first part of conditional is ugly, should figure out better solution
    React.useEffect(() => {
        if (
            terminalHeight &&
            cursorTopInPixels + CELL_HEIGHT > terminalHeight
        ) {
            if (containerRef.current) {
                console.log(cursorTopInPixels);
                containerRef.current.scrollTop =
                    containerRef.current.scrollHeight;
            }
        }
    }, [cursorTopInPixels, terminalHeight]);
}
