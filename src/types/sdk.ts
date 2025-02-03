import type { PrivacyLevel } from './privacy.js';

export interface ZKProof {
    proof: string;
    publicInputs: any[];
    privateInputs: any[];
}

export interface MidnightSDK {
    nodeUrl: string;
    chainId: string;
    privacyLevel: PrivacyLevel;
    getNetwork(): Promise<string>;
    getAddress(): Promise<string>;
    getTransactionStatus(txHash: string): Promise<'confirmed' | 'pending' | 'failed'>;
    submitShieldedTransaction(method: string, args: any[], proof?: ZKProof): Promise<string>;
    generateZKProof(data: any): Promise<ZKProof>;
    verifyZKProof(proof: ZKProof): Promise<boolean>;
}

export interface MidnightSDKConfig {
    nodeUrl: string;
    chainId: string;
    privacyLevel: PrivacyLevel;
}

export interface ShieldedTransaction {
    hash: string;
    status: 'pending' | 'confirmed' | 'failed';
}

export interface TransactionOptions {
    privacy?: PrivacyLevel;
    gasLimit?: number;
    maxFee?: number;
}

export class Contract {
    protected owner: string = '';
    
    constructor() {
        this.owner = '';
    }
}

export const msg = {
    sender: '',
    value: 0,
    data: new Uint8Array()
}; 