import { DIDMethod } from './index';
import { DIDDocument } from '../did.service';

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