import { StargateClient } from "@cosmjs/stargate";

interface TransactionReport {
    hash: string;
    blockHeight: number;
    timestamp: Date;
    gasUsed: number;
    fee: string;
    events: Array<{
        type: string;
        attributes: Array<{
            key: string;
            value: string;
        }>;
    }>;
    success: boolean;
}

interface NetworkStats {
    totalTransactions: number;
    averageGasUsed: number;
    averageBlockTime: number;
    successRate: number;
}

class ReportingService {
    private readonly client: StargateClient;
    private transactionCache: Map<string, TransactionReport>;

    constructor(client: StargateClient) {
        this.client = client;
        this.transactionCache = new Map();
    }

    async getTransactionReport(hash: string): Promise<TransactionReport | null> {
        // Check cache first
        if (this.transactionCache.has(hash)) {
            return this.transactionCache.get(hash)!;
        }

        const tx = await this.client.getTx(hash);
        if (!tx) return null;

        const report: TransactionReport = {
            hash,
            blockHeight: tx.height,
            timestamp: new Date(tx.timestamp),
            gasUsed: tx.gasUsed,
            fee: tx.fee.amount[0]?.amount || "0",
            events: tx.events.map(event => ({
                type: event.type,
                attributes: event.attributes.map(attr => ({
                    key: Buffer.from(attr.key).toString('utf-8'),
                    value: Buffer.from(attr.value).toString('utf-8')
                }))
            })),
            success: tx.code === 0
        };

        // Cache the report
        this.transactionCache.set(hash, report);
        return report;
    }

    async getNetworkStats(fromBlock: number, toBlock: number): Promise<NetworkStats> {
        let totalTx = 0;
        let totalGas = 0;
        let successfulTx = 0;
        let totalBlockTime = 0;
        let lastBlockTime: Date | null = null;

        for (let height = fromBlock; height <= toBlock; height++) {
            const block = await this.client.getBlock(height);
            const blockTime = new Date(block.header.time);
            
            if (lastBlockTime) {
                totalBlockTime += blockTime.getTime() - lastBlockTime.getTime();
            }
            lastBlockTime = blockTime;

            // Get all transactions in the block
            for (const txHash of block.txs) {
                const report = await this.getTransactionReport(txHash);
                if (report) {
                    totalTx++;
                    totalGas += report.gasUsed;
                    if (report.success) successfulTx++;
                }
            }
        }

        return {
            totalTransactions: totalTx,
            averageGasUsed: totalTx > 0 ? totalGas / totalTx : 0,
            averageBlockTime: totalBlockTime / (toBlock - fromBlock),
            successRate: totalTx > 0 ? successfulTx / totalTx : 0
        };
    }

    async monitorTransactions(callback: (report: TransactionReport) => void) {
        let lastHeight = await this.client.getHeight();

        // Poll for new blocks
        setInterval(async () => {
            const currentHeight = await this.client.getHeight();
            
            for (let height = lastHeight + 1; height <= currentHeight; height++) {
                const block = await this.client.getBlock(height);
                
                // Process all transactions in the block
                for (const txHash of block.txs) {
                    const report = await this.getTransactionReport(txHash);
                    if (report) {
                        callback(report);
                    }
                }
            }
            
            lastHeight = currentHeight;
        }, 6000); // Poll every 6 seconds (average block time)
    }

    clearCache() {
        this.transactionCache.clear();
    }
}

export { 
    ReportingService, 
    type TransactionReport, 
    type NetworkStats 
}; 