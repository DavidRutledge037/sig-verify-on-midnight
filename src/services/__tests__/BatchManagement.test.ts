import { describe, test, expect, beforeEach, vi } from 'vitest';
import { BatchManagement } from '../BatchManagement';
import { BatchProcessor } from '../BatchProcessor';
import { DIDResolver } from '../DIDResolver';

describe('BatchManagement', () => {
    let batchManagement: BatchManagement;
    let mockProcessor: BatchProcessor;
    let processingResolve: (value: any) => void;

    beforeEach(() => {
        mockProcessor = new BatchProcessor(new DIDResolver());
        
        // Create a controlled processing promise
        let processingPromise = new Promise(resolve => {
            processingResolve = resolve;
        });

        vi.spyOn(mockProcessor, 'processBatch').mockImplementation(async (_, dids, progressCallback) => {
            if (progressCallback) {
                progressCallback(50); // Report 50% progress
            }
            await processingPromise;
            return {
                success: true,
                processed: dids,
                failed: [],
                cancelled: false
            };
        });

        batchManagement = new BatchManagement(mockProcessor);
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    test('should start new batch', async () => {
        const batchId = 'test-batch-1';
        const dids = ['did:midnight:test1', 'did:midnight:test2'];
        
        const status = await batchManagement.startBatch(batchId, dids);
        
        expect(status).toEqual({
            id: batchId,
            total: dids.length,
            processed: 0,
            failed: 0,
            inProgress: true,
            cancelled: false,
            timestamp: expect.any(Number)
        });
    });

    test('should track batch progress', async () => {
        const batchId = 'test-batch-2';
        const dids = Array.from({ length: 5 }, (_, i) => `did:midnight:test${i}`);
        
        await batchManagement.startBatch(batchId, dids);
        await vi.runAllTimersAsync();
        
        const status = batchManagement.getBatchStatus(batchId);
        expect(status).not.toBeNull();
        expect(status?.processed).toBe(2); // 50% of 5 dids
        expect(status?.inProgress).toBe(true);

        // Complete the processing
        processingResolve({
            success: true,
            processed: dids,
            failed: [],
            cancelled: false
        });
    });

    test('should cancel batch', async () => {
        const batchId = 'test-batch-3';
        const dids = Array.from({ length: 10 }, (_, i) => `did:midnight:test${i}`);
        
        // Start the batch
        await batchManagement.startBatch(batchId, dids);
        await vi.runAllTimersAsync();
        
        // Cancel the batch
        const cancelled = batchManagement.cancelBatch(batchId);
        expect(cancelled).toBe(true);
        
        // Complete the processing
        processingResolve({
            success: false,
            processed: [],
            failed: [],
            cancelled: true
        });
        
        // Check final status
        const status = batchManagement.getBatchStatus(batchId);
        expect(status?.cancelled).toBe(true);
        expect(status?.inProgress).toBe(false);
    });

    test('should handle non-existent batch', () => {
        expect(batchManagement.getBatchStatus('non-existent')).toBeNull();
        expect(batchManagement.cancelBatch('non-existent')).toBe(false);
    });
}); 