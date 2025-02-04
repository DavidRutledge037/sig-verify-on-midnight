import { BatchProcessor } from '../services/BatchProcessor';
import { DIDResolver } from '../services/DIDResolver';

describe('Batch Processing Performance', () => {
    let batchProcessor: BatchProcessor;
    let resolver: DIDResolver;

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
    });

    test('should handle large batch operations efficiently', async () => {
        const numItems = 5000;
        const dids = await Promise.all(
            Array.from({ length: numItems }, () => resolver.create('test'))
        );

        const startTime = performance.now();
        const result = await batchProcessor.processBatch(
            'verify',
            dids.map(d => d.id)
        );
        const endTime = performance.now();

        const timePerItem = (endTime - startTime) / numItems;
        expect(timePerItem).toBeLessThan(10); // 10ms per item
        expect(result.success).toBe(true);
    });

    test('should maintain memory usage under load', async () => {
        const initialMemory = process.memoryUsage().heapUsed;
        const batchSize = 10000;
        
        await batchProcessor.processBatch(
            'verify',
            Array.from({ length: batchSize }, (_, i) => `did:midnight:test${i}`)
        );

        const finalMemory = process.memoryUsage().heapUsed;
        const memoryPerItem = (finalMemory - initialMemory) / batchSize;
        
        expect(memoryPerItem).toBeLessThan(1024); // Less than 1KB per item
    });

    test('should handle concurrent batch operations', async () => {
        const numBatches = 5;
        const itemsPerBatch = 1000;
        
        const startTime = performance.now();
        const batches = await Promise.all(
            Array.from({ length: numBatches }, () => 
                batchProcessor.processBatch(
                    'verify',
                    Array.from({ length: itemsPerBatch }, (_, i) => `did:midnight:test${i}`)
                )
            )
        );
        const endTime = performance.now();

        const totalTime = endTime - startTime;
        expect(totalTime).toBeLessThan(numBatches * itemsPerBatch * 10); // 10ms per item
        expect(batches).toHaveLength(numBatches);
    });
}); 