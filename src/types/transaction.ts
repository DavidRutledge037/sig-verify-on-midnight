export interface TransactionDetails {
    // Fields used by ProofService
    hash: string;
    height: number;
    index: number;
    proof: {
        type: string;
        created: string;
        creator: string;
        signatureValue: string;
        data: any;
    };
    tx: Uint8Array;
    
    // Additional fields required by MidnightService
    transactionHash: string;
    blockHeight: number;
    timestamp: Date;
    gasUsed: number;
    fee: string;  // Changed to string to match MidnightService expectations
    code?: number;
    codespace?: string;
    logs?: Array<{
        msg_index: number;
        log: string;
        events: Array<{
            type: string;
            attributes: Array<{
                key: string;
                value: string;
            }>;
        }>;
    }>;
}

export interface Block {
    header: {
        height: string;
        time: string;
        chain_id: string;
        proposer_address?: string;
    };
    data: {
        txs: string[];
    };
    last_commit?: {
        height: string;
        signatures: Array<{
            validator_address: string;
            signature: string;
        }>;
    };
}

export interface IndexedTx {
    height: number;
    hash: string;
    tx: Uint8Array;
    code: number;
    events: Array<{
        type: string;
        attributes: Array<{
            key: string;
            value: string;
            index?: boolean;
        }>;
    }>;
    gasUsed?: number;
    gasWanted?: number;
}

export interface ProofSubmission {
    type: string;
    created: string;
    creator: string;
    signatureValue: string;
    data: any;
}

export interface TransactionResponse {
    height: string;
    txhash: string;
    codespace?: string;
    code?: number;
    data?: string;
    raw_log: string;
    logs?: Array<{
        msg_index: number;
        log: string;
        events: Array<{
            type: string;
            attributes: Array<{
                key: string;
                value: string;
            }>;
        }>;
    }>;
    gas_wanted: string;
    gas_used: string;
} 