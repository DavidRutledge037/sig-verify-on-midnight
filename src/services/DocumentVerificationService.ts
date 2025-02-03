import { ZKProofGenerator } from '../utils/zkProofs';
import { EncryptionService } from '../utils/encryption';
import { Document } from '../types/document';

export class DocumentVerificationService {
    private zkProofGenerator: ZKProofGenerator;
    private encryptionService: EncryptionService;

    constructor() {
        this.zkProofGenerator = new ZKProofGenerator();
        this.encryptionService = new EncryptionService();
    }

    async verifyDocument(
        document: Document,
        encryptedContent: Buffer,
        ownerAddress: string,
        proof: string
    ): Promise<boolean> {
        // Verify ZK proof
        const isValidProof = await this.zkProofGenerator.verifyDocumentProof(
            {
                proof,
                publicInputs: [document.hash, ownerAddress],
                privateInputs: []
            },
            encryptedContent,
            ownerAddress
        );

        return isValidProof;
    }
} 