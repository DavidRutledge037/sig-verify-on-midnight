import { DIDManagement } from './DIDManagement';
import { DocumentSigning } from './DocumentSigning';

interface KYCDocument {
    content: {
        userId: string;
        level: string;
        timestamp: number;
    };
    signature: string;
    signerDID: string;
}

export class KYCVerification {
    constructor(
        private didManagement: DIDManagement,
        private documentSigning: DocumentSigning
    ) {}

    async verifyKYC(document: KYCDocument): Promise<boolean> {
        // Validate document format
        if (!document.content || !document.signature || !document.signerDID) {
            throw new Error('Invalid KYC document format');
        }

        // First verify the DID exists
        await this.didManagement.resolveDID(document.signerDID);

        // Then verify document signature
        return this.documentSigning.verifySignature(document);
    }
} 