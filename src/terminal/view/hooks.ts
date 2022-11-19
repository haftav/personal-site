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

    React.useEffect(() => {
        const listener = (e: KeyboardEvent) => {
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

        document.addEventListener('keydown', listener);

        return () => {
            document.removeEventListener('keydown', listener);
        };
    }, [updatePrompt, removeCharacter, submitPrompt]);
}
