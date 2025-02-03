import { PrivateDocumentManager } from '../contracts/PrivateDocumentManager';
import { DIDManager } from '../contracts/DIDManager';
import { PrivateKYCManager } from '../contracts/PrivateKYCManager';
import { SecureStorageService } from './SecureStorageService';
import { DocumentVerificationService } from './DocumentVerificationService';
import { ZKProofGenerator } from '../utils/zkProofs';
import { Document, DocumentMetadata } from '../types';

export class DocumentWorkflowService {
    constructor(
        private documentManager: PrivateDocumentManager,
        private didManager: DIDManager,
        private kycManager: PrivateKYCManager,
        private storageService: SecureStorageService,
        private verificationService: DocumentVerificationService,
        private zkProofGenerator: ZKProofGenerator
    ) {}

    async uploadAndVerifyDocument(
        file: File,
        ownerDid: string,
        metadata: DocumentMetadata,
        allowedViewers: string[]
    ): Promise<string> {
        // 1. Process document
        const content = await file.arrayBuffer();
        const buffer = Buffer.from(content);

        // 2. Store encrypted document
        const cid = await this.storageService.storeEncrypted(
            buffer,
            ownerDid,
            metadata.title
        );

        // 3. Generate ZK proof for PII
        const zkProof = await this.zkProofGenerator.generateDocumentProof(
            buffer,
            ownerDid,
            'private_key'  // In production, from wallet
        );

        // 4. Create private document
        const documentId = await this.documentManager.createPrivateDocument(
            ownerDid,
            buffer,
            metadata,
            allowedViewers,
            zkProof
        );

        return documentId;
    }
} 