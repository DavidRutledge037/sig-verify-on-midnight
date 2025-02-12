import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { KeyManager } from '../../src/identity/keys';

describe('Keys Unit Tests', () => {
    let keyManager: KeyManager;

    beforeEach(() => {
        jest.clearAllMocks();
        keyManager = new KeyManager();
    });

    it('should generate key pair', () => {
        const keyPair = keyManager.generateKeyPair();
        
        expect(keyPair).toBeDefined();
        expect(keyPair.publicKey).toBeDefined();
        expect(keyPair.privateKey).toBeDefined();
        expect(keyPair.publicKey.length).toBeGreaterThan(0);
        expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should sign and verify message', () => {
        const keyPair = keyManager.generateKeyPair();
        const message = 'test message';
        
        const signature = keyManager.sign(message, keyPair.privateKey);
        const isValid = keyManager.verify(message, signature, keyPair.publicKey);
        
        expect(signature).toBeDefined();
        expect(isValid).toBe(true);
    });

    it('should reject invalid signatures', () => {
        const keyPair = keyManager.generateKeyPair();
        const message = 'test message';
        const wrongMessage = 'wrong message';
        
        const signature = keyManager.sign(message, keyPair.privateKey);
        const isValid = keyManager.verify(wrongMessage, signature, keyPair.publicKey);
        
        expect(isValid).toBe(false);
    });

    // ... rest of tests ...
}); 