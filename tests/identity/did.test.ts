import { describe, it, expect } from 'vitest';
import { DIDManager } from '../../src/identity/did';

describe('DIDManager', () => {
    const didManager = new DIDManager();

    it('should create a valid DID document', async () => {
        const publicKey = 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK';
        const didDoc = await didManager.createDID(publicKey);

        // Check DID format
        expect(didDoc.id).toMatch(/^did:midnight:[1-9A-HJ-NP-Za-km-z]+$/);
        
        // Check context
        expect(didDoc['@context']).toContain('https://www.w3.org/ns/did/v1');
        expect(didDoc['@context']).toContain('https://w3id.org/security/suites/ed25519-2020/v1');

        // Check verification method
        expect(didDoc.verificationMethod[0].type).toBe('Ed25519VerificationKey2020');
        expect(didDoc.verificationMethod[0].publicKeyMultibase).toBe(publicKey);

        // Check authentication and other proof purposes
        expect(didDoc.authentication).toContain(`${didDoc.id}#key-1`);
        expect(didDoc.assertionMethod).toContain(`${didDoc.id}#key-1`);
        expect(didDoc.keyAgreement).toContain(`${didDoc.id}#key-1`);
        expect(didDoc.capabilityInvocation).toContain(`${didDoc.id}#key-1`);
        expect(didDoc.capabilityDelegation).toContain(`${didDoc.id}#key-1`);
    });

    it('should validate DID format', () => {
        const validDID = 'did:midnight:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK';
        const invalidDID = 'did:example:123';

        expect(didManager.isValidDID(validDID)).toBe(true);
        expect(didManager.isValidDID(invalidDID)).toBe(false);
    });

    it('should extract public key from DID document', async () => {
        const publicKey = 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK';
        const didDoc = await didManager.createDID(publicKey);

        const extractedKey = didManager.getPublicKey(didDoc);
        expect(extractedKey).toBe(publicKey);
    });

    it('should create unique DIDs for different public keys', async () => {
        const publicKey1 = 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK';
        const publicKey2 = 'z6MkrW5ZBn8hX1tTCAaNQdGhk1nQE5J9Ut3URehGYHQHBBA9';

        const didDoc1 = await didManager.createDID(publicKey1);
        const didDoc2 = await didManager.createDID(publicKey2);

        expect(didDoc1.id).not.toBe(didDoc2.id);
    });
}); 