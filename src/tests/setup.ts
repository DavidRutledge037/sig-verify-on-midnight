import '@testing-library/jest-dom';
import 'jest-environment-jsdom';
import { jest } from '@jest/globals';
import crypto from 'crypto-browserify';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Setup crypto for browser environment
Object.defineProperty(global, 'crypto', {
    value: {
        getRandomValues: (arr: Uint8Array) => {
            const bytes = crypto.randomBytes(arr.length);
            arr.set(new Uint8Array(bytes));
            return arr;
        },
        subtle: crypto.subtle
    }
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
};

// Make jest available globally
global.jest = jest;

// Setup test environment
beforeAll(() => {
    // Add any global setup here
});

afterAll(() => {
    // Add any global cleanup here
}); 