import { jest } from '@jest/globals';
import type { Mock } from 'jest-mock';
import { DIDDocument } from '../../src/types/did.types.js';
import { KeyPair } from '../../src/types/key.types.js';
import { DIDService } from '../../src/services/did.service.js';

// Helper type to infer the resolved value type from a Promise
type Awaited<T> = T extends Promise<infer U> ? U : T;

// Helper type for mocked functions
export type MockedFunction<T extends (...args: any[]) => any> = jest.Mock<ReturnType<T>, Parameters<T>>;

// Helper function to create a properly typed mock function
export function createMockFn<T extends (...args: any[]) => any>(
    implementation?: (...args: Parameters<T>) => ReturnType<T>
): MockedFunction<T> {
    return jest.fn(implementation) as MockedFunction<T>;
}

// Helper function to create a properly typed async mock function
export function createAsyncMockFn<T extends (...args: any[]) => Promise<any>>(
    implementation?: (...args: Parameters<T>) => ReturnType<T>
): MockedFunction<T> {
    return jest.fn(implementation) as MockedFunction<T>;
}

// Helper function to create a mock that resolves to a value
export function mockResolvedValue<T extends (...args: any[]) => Promise<any>>(
    value: Awaited<ReturnType<T>>
): MockedFunction<T> {
    return jest.fn().mockResolvedValue(value) as MockedFunction<T>;
}

// Helper function to create a mock that returns a value
export function mockReturnValue<T extends (...args: any[]) => any>(
    value: ReturnType<T>
): MockedFunction<T> {
    return jest.fn().mockReturnValue(value) as MockedFunction<T>;
} 