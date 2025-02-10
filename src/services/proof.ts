import { MidnightService } from './midnight';
import { HashingService } from './hashing';

interface Proof {
    type: 'DID' | 'Hash';
    value: string;
    timestamp: Date;
    blockHeight: number;
    transactionHash: string;
}

interface ProofConfig {
    nodeUrl: string;
    chainId: string;
}

class ProofService {
    private midnight: MidnightService;

    constructor(nodeUrl: string, chainId: string) {
        this.midnight = new MidnightService({
            nodeUrl,
            chainId
        });
    }

    async connect() {
        await this.midnight.connect();
    }

    /**
     * Get proof of DID registration on Midnight
     */
    async getDIDProof(did: string): Promise<any> {
        try {
            const didData = await this.midnight.queryDID(did);
            return {
                did: did,
                proof: {
                    type: "MidnightProof2024",
                    created: new Date().toISOString(),
                    verificationMethod: didData.verificationMethod,
                    proofValue: "mock_proof_value" // Placeholder
                }
            };
        } catch (error) {
            console.error("Error getting DID proof:", error);
            throw error;
        }
    }

    /**
     * Get proof of hash registration on Midnight
     */
    async getHashProof(hash: string): Promise<any> {
        try {
            const docData = await this.midnight.queryDocument(hash);
            return {
                hash: hash,
                proof: {
                    type: "MidnightProof2024",
                    created: new Date().toISOString(),
                    owner: docData.owner,
                    proofValue: "mock_proof_value" // Placeholder
                }
            };
        } catch (error) {
            console.error("Error getting hash proof:", error);
            throw error;
        }
    }

    /**
     * Verify that a proof is valid
     */
    async verifyProof(proof: any): Promise<boolean> {
        // Placeholder verification logic
        return true;
    }

    disconnect() {
        this.midnight.disconnect();
    }
}

export { ProofService, type ProofConfig }; 