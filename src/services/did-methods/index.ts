import { DIDDocument } from '../did.service';

export interface DIDMethod {
    name: string;
    createDID(controller: string): Promise<DIDDocument>;
    verifyDID(didDocument: DIDDocument): Promise<boolean>;
    createProof(didDocument: DIDDocument, challenge: string): Promise<string>;
    resolveDID(did: string): Promise<DIDDocument | null>;
}

// Midnight DID Method
export class MidnightDIDMethod implements DIDMethod {
    name = 'midnight';
    
    async createDID(controller: string): Promise<DIDDocument> {
        const timestamp = new Date().toISOString();
        return {
            id: `did:midnight:${controller}`,
            controller,
            verificationMethod: [{
                id: `did:midnight:${controller}#keys-1`,
                type: "Secp256k1VerificationKey2018",
                controller: `did:midnight:${controller}`,
                publicKeyHex: controller
            }],
            created: timestamp,
            updated: timestamp
        };
    }
    
    async verifyDID(didDocument: DIDDocument): Promise<boolean> {
        // Basic validation
        if (!didDocument.id.startsWith('did:midnight:')) return false;
        if (!didDocument.verificationMethod?.length) return false;
        return true;
    }
    
    async createProof(didDocument: DIDDocument, challenge: string): Promise<string> {
        // For POC, return a mock proof
        return `mock_proof_${didDocument.id}_${challenge}`;
    }
    
    async resolveDID(did: string): Promise<DIDDocument | null> {
        if (!did.startsWith('did:midnight:')) return null;
        const controller = did.split(':')[2];
        return this.createDID(controller);
    }
}

// Key DID Method (for testing)
export class KeyDIDMethod implements DIDMethod {
    name = 'key';
    
    async createDID(controller: string): Promise<DIDDocument> {
        const timestamp = new Date().toISOString();
        return {
            id: `did:key:${controller}`,
            controller,
            verificationMethod: [{
                id: `did:key:${controller}#keys-1`,
                type: "Ed25519VerificationKey2018",
                controller: `did:key:${controller}`,
                publicKeyHex: controller
            }],
            created: timestamp,
            updated: timestamp
        };
    }
    
    async verifyDID(didDocument: DIDDocument): Promise<boolean> {
        if (!didDocument.id.startsWith('did:key:')) return false;
        if (!didDocument.verificationMethod?.length) return false;
        return true;
    }
    
    async createProof(didDocument: DIDDocument, challenge: string): Promise<string> {
        return `mock_proof_${didDocument.id}_${challenge}`;
    }
    
    async resolveDID(did: string): Promise<DIDDocument | null> {
        if (!did.startsWith('did:key:')) return null;
        const controller = did.split(':')[2];
        return this.createDID(controller);
    }
}

// Web DID Method (for integration with web domains)
export class WebDIDMethod implements DIDMethod {
    name = 'web';
    
    async createDID(controller: string): Promise<DIDDocument> {
        const timestamp = new Date().toISOString();
        return {
            id: `did:web:${controller}`,
            controller,
            verificationMethod: [{
                id: `did:web:${controller}#keys-1`,
                type: "Ed25519VerificationKey2018",
                controller: `did:web:${controller}`,
                publicKeyHex: controller
            }],
            created: timestamp,
            updated: timestamp
        };
    }
    
    async verifyDID(didDocument: DIDDocument): Promise<boolean> {
        if (!didDocument.id.startsWith('did:web:')) return false;
        if (!didDocument.verificationMethod?.length) return false;
        return true;
    }
    
    async createProof(didDocument: DIDDocument, challenge: string): Promise<string> {
        return `mock_proof_${didDocument.id}_${challenge}`;
    }
    
    async resolveDID(did: string): Promise<DIDDocument | null> {
        if (!did.startsWith('did:web:')) return null;
        const controller = did.split(':')[2];
        return this.createDID(controller);
    }
} 