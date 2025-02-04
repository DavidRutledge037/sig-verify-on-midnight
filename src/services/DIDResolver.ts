import { DIDDocument } from '../types/DID';

export interface DIDResolver {
    resolve(did: string): Promise<DIDDocument>;
}

export class DIDResolver {
    private cache: Map<string, DIDDocument> = new Map();

    async create(address: string): Promise<DIDDocument> {
        const did = `did:midnight:${address}`;
        const document = {
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: did,
            verificationMethod: [{
                id: `${did}#key-1`,
                type: 'Ed25519VerificationKey2020',
                controller: did,
                publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
            }]
        };
        
        this.cache.set(did, document);
        return document;
    }

    async resolve(did: string): Promise<DIDDocument> {
        // Check cache first
        const cached = this.cache.get(did);
        if (cached) return cached;

        // Validate DID format
        if (!did.startsWith('did:midnight:')) {
            throw new Error('Invalid DID format');
        }

        // Mock network fetch
        const document = {
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: did,
            verificationMethod: [{
                id: `${did}#key-1`,
                type: 'Ed25519VerificationKey2020',
                controller: did,
                publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
            }]
        };

        this.cache.set(did, document);
        return document;
    }
} 