import { DIDResolver } from '../services/DIDResolver';
import { BatchProcessor } from '../services/BatchProcessor';
import { performance } from 'perf_hooks';

describe('DID Performance Tests', () => {
    let resolver: DIDResolver;
    let batchProcessor: BatchProcessor;

    beforeEach(() => {
        resolver = new DIDResolver();
        batchProcessor = new BatchProcessor(resolver);
    });

    test('should handle bulk DID creation under load', async () => {
        const startTime = performance.now();
        const numDIDs = 1000;
        
        const dids = await Promise.all(
            Array.from({ length: numDIDs }, () => resolver.create('test'))
        );

        const endTime = performance.now();
        const timePerDID = (endTime - startTime) / numDIDs;

        expect(dids.length).toBe(numDIDs);
        expect(timePerDID).toBeLessThan(50); // 50ms per DID creation
    });

    test('should efficiently resolve DIDs in parallel', async () => {
        const dids = await Promise.all(
            Array.from({ length: 100 }, () => resolver.create('test'))
        );

        const startTime = performance.now();
        const resolved = await Promise.all(
            dids.map(did => resolver.resolve(did.id))
        );
        const endTime = performance.now();

        const timePerResolution = (endTime - startTime) / dids.length;
        expect(timePerResolution).toBeLessThan(20); // 20ms per resolution
        expect(resolved.length).toBe(dids.length);
    });

    test('should maintain performance with cache under load', async () => {
        const did = await resolver.create('test');
        
        const iterations = 1000;
        const startTime = performance.now();
        
        for (let i = 0; i < iterations; i++) {
            await resolver.resolve(did.id);
        }
        
        const endTime = performance.now();
        const timePerResolution = (endTime - startTime) / iterations;
        
        expect(timePerResolution).toBeLessThan(1); // 1ms per cached resolution
    });
}); 