import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import { BatchProcessor } from '../BatchProcessor';
import { DIDResolver } from '../DIDResolver';

describe('BatchProcessor', () => {
    let batchProcessor: BatchProcessor;
    let resolver: DIDResolver;
    let mockResolve: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
        
        mockResolve = vi.fn().mockImplementation(async (did: string) => ({
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: did,
            verificationMethod: []
        }));
        
        vi.spyOn(resolver, 'resolve').mockImplementation(mockResolve);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    test('should process batch operations with progress tracking', async () => {
        const dids = Array.from({ length: 5 }, (_, i) => `did:midnight:test${i}`);
        const progressCallback = vi.fn();

        const promise = batchProcessor.processBatch('verify', dids, progressCallback);
        await vi.advanceTimersToNextTimerAsync();
        const result = await promise;

        expect(result.processed).toHaveLength(5);
        expect(result.failed).toHaveLength(0);
        expect(result.success).toBe(true);
        expect(progressCallback).toHaveBeenCalledWith(100);
    });

    test('should handle partial batch failures', async () => {
        const dids = [
            'did:midnight:valid1',
            'invalid:did',
            'did:midnight:valid2'
        ];

        mockResolve.mockImplementation(async (did: string) => {
            if (did === 'invalid:did') {
                throw new Error('Invalid DID format');
            }
            return {
                '@context': ['https://www.w3.org/ns/did/v1'],
                id: did,
                verificationMethod: []
            };
        });

        const promise = batchProcessor.processBatch('verify', dids);
        await vi.advanceTimersToNextTimerAsync();
        const result = await promise;
        
        expect(result.success).toBe(false);
        expect(result.failed).toHaveLength(1);
        expect(result.failed[0]).toBe('invalid:did');
        expect(result.processed).toHaveLength(2);
    });

    test('should respect concurrency limits', async () => {
        const dids = Array.from({ length: 10 }, (_, i) => `did:midnight:test${i}`);
        let activeCount = 0;
        let maxConcurrent = 0;

        mockResolve.mockImplementation(async () => {
            activeCount++;
            maxConcurrent = Math.max(maxConcurrent, activeCount);
            await vi.advanceTimersByTimeAsync(100);
            activeCount--;
            return {
                '@context': ['https://www.w3.org/ns/did/v1'],
                id: 'test',
                verificationMethod: []
            };
        });

        const promise = batchProcessor.processBatch('verify', dids);
        await vi.advanceTimersToNextTimerAsync();
        const result = await promise;

        expect(result.processed).toHaveLength(10);
        expect(maxConcurrent).toBeLessThanOrEqual(5);
    });

    test('should handle batch operation cancellation', async () => {
        const dids = Array.from({ length: 10 }, (_, i) => `did:midnight:test${i}`);
        let processedCount = 0;
        let resolvePromises: ((value: unknown) => void)[] = [];

        // Make each resolution wait for manual resolution
        mockResolve.mockImplementation(async () => {
            processedCount++;
            await new Promise(resolve => {
                resolvePromises.push(resolve);
            });
            return {
                '@context': ['https://www.w3.org/ns/did/v1'],
                id: 'test',
                verificationMethod: []
            };
        });

        // Start processing
        const promise = batchProcessor.processBatch('verify', dids);
        
        // Let the first chunk start
        await vi.advanceTimersByTimeAsync(0);
        
        // Cancel before resolving any promises
        batchProcessor.cancelCurrentBatch();
        
        // Now resolve all pending operations
        resolvePromises.forEach(resolve => resolve(true));
        await vi.runAllTimersAsync();
        
        const result = await promise;
        
        expect(result.cancelled).toBe(true);
        expect(result.success).toBe(false);
        expect(processedCount).toBeLessThanOrEqual(5); // Should only process first chunk
        expect(result.processed.length + result.failed.length).toBeLessThanOrEqual(5);
    });
}); 