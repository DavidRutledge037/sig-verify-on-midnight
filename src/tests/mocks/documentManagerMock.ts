import { jest } from '@jest/globals';
import type { DocumentManager } from '../../contracts/DocumentManager.js';
import type { Document, DocumentMetadata } from '../../types/document.js';

export const mockDocumentManager: jest.Mocked<DocumentManager> = {
    documents: new Map(),
    userDocuments: new Map(),
    createDocument: jest.fn().mockResolvedValue('doc_id_123'),
    signDocument: jest.fn().mockResolvedValue(true),
    hashContent: jest.fn().mockReturnValue('content_hash_123'),
    getDocument: jest.fn().mockResolvedValue({
        id: 'doc_id_123',
        owner: 'owner_123',
        content: 'content_123',
        metadata: {
            title: 'Test Doc',
            mimeType: 'text/plain',
            size: 100
        } as DocumentMetadata
    }),
    verifySignature: jest.fn().mockResolvedValue(true)
}; 