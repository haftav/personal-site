import * as React from 'react';

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
