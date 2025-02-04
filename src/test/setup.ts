import '@testing-library/jest-dom';
import { vi } from 'vitest';

const storageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        key: vi.fn((index: number) => Object.keys(store)[index] || null),
        length: 0
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: storageMock
});

// Mock performance.now()
global.performance = {
    now: vi.fn(() => Date.now())
} as any;

// Clear mocks before each test
beforeEach(() => {
    storageMock.clear();
    vi.clearAllMocks();
}); 