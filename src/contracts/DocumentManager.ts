import { Contract, Address } from '../types';
import { Document, DocumentMetadata, DocumentStatus, DocumentSignature } from '../types/document';
import { createHash } from 'crypto';

export class DocumentManager extends Contract {
    private documents: Map<string, Document>;
    private userDocuments: Map<string, Set<string>>;

    constructor() {
        super();
        this.documents = new Map();
        this.userDocuments = new Map();
    }

    public async createDocument(
        owner: Address,
        content: string,
        metadata: DocumentMetadata
    ): Promise<string> {
        const hash = this.hashContent(content);
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

        this.documents.set(id, document);
        this.addToUserDocuments(owner, id);

        return id;
    }

    public async signDocument(
        documentId: string,
        signer: Address,
        signature: string,
        zkProof?: string
    ): Promise<void> {
        const document = this.documents.get(documentId);
        if (!document) {
            throw new Error('Document not found');
        }

        if (document.status !== DocumentStatus.PENDING) {
            throw new Error('Document is not in PENDING state');
        }

        const sig: DocumentSignature = {
            signer,
            signature,
            timestamp: Date.now(),
            zkProof
        };

        document.signatures.push(sig);
        document.updatedAt = Date.now();
        
        // Update document status if all required signatures are collected
        if (this.hasAllRequiredSignatures(document)) {
            document.status = DocumentStatus.SIGNED;
        }
    }

    private hashContent(content: string): string {
        return createHash('sha256').update(content).digest('hex');
    }

    private addToUserDocuments(user: Address, documentId: string): void {
        if (!this.userDocuments.has(user)) {
            this.userDocuments.set(user, new Set());
        }
        this.userDocuments.get(user)!.add(documentId);
    }

    private hasAllRequiredSignatures(document: Document): boolean {
        // Implement your signature verification logic here
        return document.signatures.length > 0;
    }
} 