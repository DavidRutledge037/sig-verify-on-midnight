declare namespace jest {
    interface Matchers<R> {
        toBeValidDID(): R;
    }
}

declare global {
    namespace NodeJS {
        interface Global {
            fetch: typeof fetch;
        }
    }
}

export {}; 