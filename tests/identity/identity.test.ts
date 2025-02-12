import { jest, describe, it, expect } from '@jest/globals';
import { IdentityManager } from '../../src/identity/identity';

describe('IdentityManager', () => {
    let identityManager: IdentityManager;

    beforeEach(() => {
        identityManager = new IdentityManager();
    });

    it('should create a new identity', () => {
        const identity = identityManager.createIdentity();
        expect(identity).toBeDefined();
        expect(identity.id).toBeDefined();
    });

    it('should create a valid identity', async () => {
        const identity = await identityManager.createIdentity();
        
        // Check DID format for Midnight
        expect(identity.did.id).toMatch(/^did:midnight:[1-9A-HJ-NP-Za-km-z]+$/);
        
        // Verify DID document structure
        expect(identity.did['@context']).toContain('https://www.w3.org/ns/did/v1');
        expect(identity.did.verificationMethod[0].type).toBe('Ed25519VerificationKey2020');
        
        // Verify key pair exists
        expect(identity.keyPair.publicKey).toBeDefined();
        expect(identity.keyPair.privateKey).toBeDefined();
    });

    it('should sign and verify messages', async () => {
        const identity = await identityManager.createIdentity();
        const message = 'Hello, World!';
        
        const signature = await identityManager.sign(message, identity);
        const isValid = await identityManager.verify(message, signature, identity.did.id);
        
        expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', async () => {
        const identity = await identityManager.createIdentity();
        const message = 'Hello, World!';
        const wrongMessage = 'Wrong message';
        
        const signature = await identityManager.sign(message, identity);
        const isValid = await identityManager.verify(wrongMessage, signature, identity.did.id);
        
        expect(isValid).toBe(false);
    });
}); 