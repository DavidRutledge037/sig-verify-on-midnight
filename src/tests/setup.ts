import { TextEncoder } from 'util';

// Mock crypto.subtle
const cryptoMock = {
    subtle: {
        digest: async (algorithm: string, data: Uint8Array) => {
            const hash = Array.from(data)
                .reduce((acc, byte) => acc + byte, 0)
                .toString(16)
                .padStart(64, '0');
            return new Uint8Array(Buffer.from(hash, 'hex'));
        }
    }
};

// Setup global mocks
global.TextEncoder = TextEncoder;
// @ts-ignore
global.crypto = cryptoMock;

// Suppress console output during tests
global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
}; 