export interface Transaction {
    type: 'document' | 'kyc' | 'did';
    action: string;
    timestamp: number;
    metadata: Record<string, any>;
    network: string;
    proof?: string;
    signature?: string;
}

export interface TransactionStatus {
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
    timestamp: number;
} 