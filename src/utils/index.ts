let id = 0;

// TODO: close over id
export function createId() {
    return String(++id);
}

// for testing purposes
export function resetId() {
    id = 0;
}
