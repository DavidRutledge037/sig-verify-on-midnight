import { MidnightService } from './midnight';
import { ProofSubmission, TransactionDetails } from '../types/transaction';

export interface Proof {
    type: string;
    created: string;
    creator: string;
    signatureValue: Uint8Array;
    data: any;
}

export class ProofService {
    private midnightService: MidnightService;

    constructor(
        rpcUrl: string,
        chainId: string
    ) {
        this.midnightService = new MidnightService(rpcUrl, chainId);
    }

    async submitProof(proof: Proof): Promise<string> {
        try {
            // Format proof for submission
            const formattedProof: ProofSubmission = {
                ...proof,
                signatureValue: Buffer.from(proof.signatureValue).toString('base64'),
                created: new Date(proof.created).toISOString()
            };

            // Submit to chain
            const txHash = await this.midnightService.submitProof(formattedProof);
            
            // Wait for transaction confirmation
            await this.waitForConfirmation(txHash);
            
            return txHash;
        } catch (error) {
            console.error('Error submitting proof:', error);
            throw error;
        }
    }

    async verifyProof(txHash: string): Promise<boolean> {
        try {
            // Get transaction details
            const txDetails = await this.midnightService.getTransactionDetails(txHash);
            if (!txDetails) {
                throw new Error('Transaction not found');
            }

            // Verify the proof
            return await this.midnightService.verifyProof(txHash);
        } catch (error) {
            console.error('Error verifying proof:', error);
            throw error;
        }
    }

    async getProof(txHash: string): Promise<Proof | null> {
        try {
            const txDetails = await this.midnightService.getTransactionDetails(txHash);
            if (!txDetails || !txDetails.proof) {
                return null;
            }

            // Convert the chain proof back to our format
            return {
                type: txDetails.proof.type,
                created: txDetails.proof.created,
                creator: txDetails.proof.creator,
                signatureValue: Buffer.from(txDetails.proof.signatureValue, 'base64'),
                data: txDetails.proof.data
            };
        } catch (error) {
            console.error('Error getting proof:', error);
            throw error;
        }
    }

    private async waitForConfirmation(txHash: string, maxAttempts = 10): Promise<void> {
        for (let i = 0; i < maxAttempts; i++) {
            try {
                const txDetails = await this.midnightService.getTransactionDetails(txHash);
                if (txDetails && txDetails.code === 0) {
                    return;
                }
                if (txDetails && txDetails.code !== undefined) {
                    throw new Error(`Transaction failed with code ${txDetails.code}: ${txDetails.codespace}`);
                }
            } catch (error) {
                if (i === maxAttempts - 1) throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        throw new Error('Transaction confirmation timeout');
    }
} 