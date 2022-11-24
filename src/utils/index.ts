import type { Result } from '../domain';

let id = 0;
export function createId() {
    return String(++id);
}

// for testing purposes
export function resetId() {
    id = 0;
}

export function resultToString(result: Result): string {
    const lines = result.lines.map((line) => {
        const joined = line.content
            .map((char) => (char.data === '' ? ' ' : char.data))
            .join('');
        return joined;
    });

    return lines.join('\n');
}
