import { Contract, Address, ZKProof } from '../types';
import { Document, DocumentMetadata, DocumentStatus } from '../types/document';
import { MidnightSDK } from '../sdk/midnight';
import { PrivacyLevel } from '../types/privacy';
import { createHash } from 'crypto';
import { EncryptionKey } from '../utils/encryption';

export class PrivateDocumentManager extends Contract {
    private documents: Map<string, Document>;
    private userDocuments: Map<string, Set<string>>;
    private sdk: MidnightSDK;
    private encryptionKeys: Map<string, EncryptionKey>;

    constructor(sdk: MidnightSDK) {
        super();
        this.documents = new Map();
        this.userDocuments = new Map();
        this.sdk = sdk;
        this.encryptionKeys = new Map();
    }

    public async createPrivateDocument(
        owner: Address,
        encryptedContent: Buffer,
        metadata: DocumentMetadata,
        allowedViewers: string[],
        zkProof: ZKProof
    ): Promise<string> {
        const hash = this.hashContent(encryptedContent);
        const id = `doc_${hash}_${Date.now()}`;

        const document: Document = {
            id,
            owner,
            hash,
            metadata,
            signatures: [],
            status: DocumentStatus.DRAFT,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        // Submit as shielded transaction
        await this.sdk.submitShieldedTransaction(
            'createPrivateDocument',
            [document, allowedViewers],
            zkProof
        );

        this.documents.set(id, document);
        this.addToUserDocuments(owner, id);

        return id;
    }

    private hashContent(content: Buffer): string {
        return createHash('sha256').update(content).digest('hex');
    }

    private addToUserDocuments(user: Address, documentId: string): void {
        if (!this.userDocuments.has(user)) {
            this.userDocuments.set(user, new Set());
        }
        this.userDocuments.get(user)!.add(documentId);
    }
} 