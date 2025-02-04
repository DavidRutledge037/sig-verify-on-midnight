import { DIDResolver } from './DIDResolver';

export interface BatchResult {
    success: boolean;
    processed: string[];
    failed: string[];
    cancelled?: boolean;
    timestamp?: number;
}

export class BatchProcessor {
    private resolver: DIDResolver;
    private maxConcurrent = 5;
    private isCancelled = false;

    constructor(resolver: DIDResolver) {
        this.resolver = resolver;
    }

    async processBatch(
        operation: string,
        dids: string[],
        progressCallback?: (progress: number) => void
    ): Promise<BatchResult> {
        this.isCancelled = false;
        
        const result: BatchResult = {
            success: false,
            processed: [],
            failed: [],
            timestamp: Date.now(),
            cancelled: false
        };

        try {
            const chunks = this.chunkArray(dids, this.maxConcurrent);
            let processedCount = 0;

            for (const chunk of chunks) {
                if (this.isCancelled) {
                    result.cancelled = true;
                    break;
                }

                const promises = chunk.map(did => this.processItem(did, operation));
                const chunkResults = await Promise.allSettled(promises);

                if (this.isCancelled) {
                    result.cancelled = true;
                    break;
                }

                chunkResults.forEach((chunkResult, index) => {
                    const did = chunk[index];
                    if (chunkResult.status === 'fulfilled' && chunkResult.value) {
                        result.processed.push(did);
                    } else {
                        result.failed.push(did);
                    }
                });

                processedCount += chunk.length;
                if (!this.isCancelled && progressCallback) {
                    const progress = Math.round((processedCount / dids.length) * 100);
                    progressCallback(progress);
                }
            }

            result.success = !this.isCancelled && result.failed.length === 0;
        } catch (error) {
            result.success = false;
            result.cancelled = this.isCancelled;
        }

        return result;
    }

    cancelCurrentBatch(): void {
        this.isCancelled = true;
    }

    private async processItem(did: string, operation: string): Promise<boolean> {
        if (this.isCancelled) return false;
        
        try {
            await this.resolver.resolve(did);
            return !this.isCancelled;
        } catch {
            return false;
        }
    }

    private chunkArray<T>(array: T[], size: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
} 