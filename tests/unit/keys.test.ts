import { jest } from '@jest/globals';
import { KeyManager } from '../../src/identity/keys';
import { mockKeyPair } from '../utils/mock-types';
import { createMockKeyManager } from '../utils/service-mocks';

describe('KeyManager Tests', () => {
    let keyManager: KeyManager;

    beforeEach(() => {
        keyManager = createMockKeyManager();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should generate a key pair', async () => {
        const keyPair = await keyManager.generateKeyPair();
        expect(keyPair).toBeDefined();
        expect(keyPair.privateKey).toBeDefined();
        expect(keyPair.publicKey.length).toBeGreaterThan(0);
        expect(keyPair.privateKey.length).toBeGreaterThan(0);
    });

    it('should sign and verify a message', async () => {
        const message = new Uint8Array(Buffer.from('test message'));
        const keyPair = await keyManager.generateKeyPair();
        
        const signature = await keyManager.sign(message, keyPair.privateKey);
        const isValid = await keyManager.verify(message, signature, keyPair.publicKey);
        
        expect(isValid).toBe(true);
    });

    it('should fail verification with wrong message', async () => {
        const message = new Uint8Array(Buffer.from('test message'));
        const wrongMessage = new Uint8Array(Buffer.from('wrong message'));
        const keyPair = await keyManager.generateKeyPair();
        
        const signature = await keyManager.sign(message, keyPair.privateKey);
        const isValid = await keyManager.verify(wrongMessage, signature, keyPair.publicKey);
        
        expect(isValid).toBe(false);
    });
}); 