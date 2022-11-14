let id = 0;

export function createId() {
    return String(++id);
}

// for testing purposes
export function resetId() {
    id = 0;
}
