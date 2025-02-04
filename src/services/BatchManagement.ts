import { BatchProcessor } from './BatchProcessor';
import { DIDResolver } from './DIDResolver';

export interface BatchStatus {
    id: string;
    total: number;
    processed: number;
    failed: number;
    inProgress: boolean;
    cancelled: boolean;
    timestamp: number;
}

export class BatchManagement {
    private processor: BatchProcessor;
    private batches: Map<string, BatchStatus>;
    private currentBatchId: string | null = null;
    private processingPromise: Promise<void> | null = null;

    constructor(processor?: BatchProcessor) {
        this.processor = processor || new BatchProcessor(new DIDResolver());
        this.batches = new Map();
    }

    async startBatch(id: string, dids: string[]): Promise<BatchStatus> {
        // Create initial status
        const status: BatchStatus = {
            id,
            total: dids.length,
            processed: 0,
            failed: 0,
            inProgress: true,
            cancelled: false,
            timestamp: Date.now()
        };

        // Set initial state and return a copy
        this.batches.set(id, { ...status });
        this.currentBatchId = id;

        // Start processing in background
        this.processingPromise = (async () => {
            try {
                const result = await this.processor.processBatch('verify', dids, (progress) => {
                    const current = this.batches.get(id);
                    if (current && current.inProgress && !current.cancelled) {
                        // Calculate processed items based on progress percentage
                        current.processed = Math.floor((progress / 100) * dids.length);
                    }
                });

                const current = this.batches.get(id);
                if (current && !current.cancelled) {
                    current.processed = result.processed.length;
                    current.failed = result.failed.length;
                    current.inProgress = false;
                }
            } catch (error) {
                const current = this.batches.get(id);
                if (current) {
                    current.inProgress = false;
                    current.cancelled = true;
                }
            } finally {
                if (this.currentBatchId === id) {
                    this.currentBatchId = null;
                }
                this.processingPromise = null;
            }
        })();

        // Return the initial status
        return status;
    }

    getBatchStatus(id: string): BatchStatus | null {
        return this.batches.get(id) || null;
    }

    cancelBatch(id: string): boolean {
        const status = this.batches.get(id);
        if (status && status.inProgress && this.currentBatchId === id) {
            this.processor.cancelCurrentBatch();
            status.cancelled = true;
            status.inProgress = false;
            this.currentBatchId = null;
            return true;
        }
        return false;
    }
} 