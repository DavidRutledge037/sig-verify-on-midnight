import { createHash } from 'crypto';

interface Document {
    id: string;
    hash: string;
    metadata: {
        type: string;
        timestamp: number;
        owner: string;
    };
    status: 'draft' | 'pending' | 'signed';
}

class DocumentManager {
    async uploadDocument(file: File, owner: string): Promise<Document> {
        const buffer = await file.arrayBuffer();
        const hash = createHash('sha256')
            .update(Buffer.from(buffer))
            .digest('hex');

        return {
            id: hash.substring(0, 8),
            hash,
            metadata: {
                type: file.type,
                timestamp: Date.now(),
                owner
            },
            status: 'draft'
        };
    }
}

export { DocumentManager, type Document }; 