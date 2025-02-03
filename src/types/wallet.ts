export interface MidnightWallet {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getAddress(): Promise<string>;
    getPublicKey(): Promise<string>;
    getNetwork(): Promise<string>;
    signTransaction(tx: any): Promise<string>;
    signMessage(message: string): Promise<string>;
    isConnected(): Promise<boolean>;
}

export interface WalletInfo {
    address: string;
    publicKey: string;
    isConnected: boolean;
    network: string;
    balance?: string;
}

export interface WalletTransaction {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
    timestamp: number;
    type: string;
}

export type WalletError = 
    | 'NOT_INSTALLED'
    | 'NOT_CONNECTED'
    | 'WRONG_NETWORK'
    | 'REJECTED'
    | 'FAILED'; 