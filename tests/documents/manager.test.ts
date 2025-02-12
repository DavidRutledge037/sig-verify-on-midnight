import { jest, describe, it, expect } from '@jest/globals';
import { DocumentManager } from '../../src/documents/manager';

describe('DocumentManager', () => {
    let documentManager: DocumentManager;

    beforeEach(() => {
        documentManager = new DocumentManager();
    });

    // Mock File API
    const createMockFile = (content: string, name: string = 'test.pdf', type: string = 'application/pdf') => {
        return {
            name,
            type,
            arrayBuffer: async () => new TextEncoder().encode(content).buffer
        } as File;
    };

    it('should create a new document', () => {
        const doc = documentManager.createDocument('test');
        expect(doc).toBeDefined();
        expect(doc.id).toBeDefined();
        expect(doc.content).toBe('test');
    });

    it('should upload a document and generate metadata', async () => {
        const owner = 'test-owner';
        const mockFile = createMockFile('test content');
        
        const result = await documentManager.uploadDocument(mockFile, owner);

        expect(result.id).toBeDefined();
        expect(result.hash).toBeDefined();
        expect(result.metadata.owner).toBe(owner);
        expect(result.metadata.type).toBe('application/pdf');
        expect(result.status).toBe('draft');
    });

    it('should generate unique document hashes for different content', async () => {
        const owner = 'test-owner';
        const file1 = createMockFile('content 1');
        const file2 = createMockFile('content 2');

        const result1 = await documentManager.uploadDocument(file1, owner);
        const result2 = await documentManager.uploadDocument(file2, owner);

        expect(result1.hash).not.toBe(result2.hash);
    });
}); 