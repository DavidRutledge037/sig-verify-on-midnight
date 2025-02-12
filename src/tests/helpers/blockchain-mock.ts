import { BlockchainDIDRecord } from '../../services/did-blockchain.service';

export class BlockchainMock {
    private records: Map<string, BlockchainDIDRecord> = new Map();

    async storeDID(record: BlockchainDIDRecord): Promise<string> {
        this.records.set(record.did, record);
        return `mock_tx_${Date.now()}`;
    }

    async getDID(did: string): Promise<BlockchainDIDRecord | null> {
        return this.records.get(did) || null;
    }

    async revokeDID(did: string, reason: string): Promise<string> {
        const record = this.records.get(did);
        if (record) {
            record.status = 'revoked';
            record.revocationData = {
                timestamp: new Date().toISOString(),
                reason,
                revokedBy: 'mock_address'
            };
            this.records.set(did, record);
        }
        return `mock_revoke_tx_${Date.now()}`;
    }

    reset(): void {
        this.records.clear();
    }
} 