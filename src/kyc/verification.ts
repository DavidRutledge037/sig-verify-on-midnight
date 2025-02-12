import { createHash } from 'crypto';

interface KYCData {
    userId: string;
    verificationLevel: 'basic' | 'advanced';
    status: 'pending' | 'verified' | 'rejected';
    documents: {
        type: string;
        hash: string;
        verified: boolean;
    }[];
}

class KYCManager {
    async submitVerification(userId: string, documents: File[]): Promise<KYCData> {
        const documentHashes = await Promise.all(
            documents.map(async (doc) => {
                const buffer = await doc.arrayBuffer();
                const hash = createHash('sha256')
                    .update(Buffer.from(buffer))
                    .digest('hex');
                
                return {
                    type: doc.type,
                    hash,
                    verified: false
                };
            })
        );

        return {
            userId,
            verificationLevel: 'basic',
            status: 'pending',
            documents: documentHashes
        };
    }
}

export { KYCManager, type KYCData }; 