import { WalletService } from './WalletService';
import { MidnightSDK } from '../sdk/midnight';

export interface TransactionConfig {
    type: 'document' | 'kyc' | 'did';
    action: string;
    metadata?: Record<string, any>;
}

export interface TransactionResult {
    txHash: string;
    timestamp: number;
    status: 'pending' | 'confirmed' | 'failed';
}

export class TransactionService {
    constructor(
        private sdk: MidnightSDK,
        private walletService: WalletService
    ) {}

    async buildTransaction(config: TransactionConfig): Promise<any> {
        // Build transaction based on Midnight's requirements
        const tx = {
            type: config.type,
            action: config.action,
            timestamp: Date.now(),
            metadata: config.metadata || {},
            network: await this.sdk.getNetwork()
        };

        return tx;
    }

    async signAndSubmit(
        transaction: any,
        zkProof?: any
    ): Promise<TransactionResult> {
        try {
            // 1. Sign with Lace wallet
            const signedTx = await this.walletService.signTransaction(transaction);

            // 2. If ZK proof provided, attach it
            if (zkProof) {
                signedTx.proof = zkProof;
            }

            // 3. Submit to Midnight network
            const txHash = await this.sdk.submitShieldedTransaction(
                'submitTransaction',
                [signedTx],
                zkProof
            );

            return {
                txHash,
                timestamp: Date.now(),
                status: 'pending'
            };
        } catch (error) {
            throw new Error(`Transaction failed: ${error}`);
        }
    }

    async getTransactionStatus(txHash: string): Promise<'pending' | 'confirmed' | 'failed'> {
        // Check transaction status on Midnight network
        const status = await this.sdk.getTransactionStatus(txHash);
        return status;
    }
} 