import { jest } from '@jest/globals';
import { KeyManager } from '../../src/identity/keys';

describe('Key Manager Tests', () => {
    let keyManager: KeyManager;

    beforeEach(() => {
        keyManager = new KeyManager();
    });

    it('should generate a key pair', async () => {
        const keyPair = await keyManager.generateKeyPair();
        expect(keyPair.publicKey).toBeDefined();
        expect(keyPair.privateKey).toBeDefined();
        expect(keyPair.publicKey instanceof Uint8Array).toBe(true);
        expect(keyPair.privateKey instanceof Uint8Array).toBe(true);
    });

    it('should sign and verify a message', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const message = new Uint8Array(Buffer.from('test message'));
        const signature = await keyManager.sign(message, keyPair.privateKey);
        const isValid = await keyManager.verify(message, signature, keyPair.publicKey);
        expect(isValid).toBe(true);
    });

    it('should fail to verify with wrong message', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const message = new Uint8Array(Buffer.from('test message'));
        const wrongMessage = new Uint8Array(Buffer.from('wrong message'));
        const signature = await keyManager.sign(message, keyPair.privateKey);
        const isValid = await keyManager.verify(wrongMessage, signature, keyPair.publicKey);
        expect(isValid).toBe(false);
    });

    it('should derive address from public key', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const address = keyManager.deriveAddress(keyPair.publicKey);
        expect(address).toMatch(/^midnight1/);
    });

    it('should convert public key to and from hex', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const hexKey = keyManager.publicKeyToHex(keyPair.publicKey);
        const recoveredKey = keyManager.publicKeyFromHex(hexKey);
        expect(Buffer.from(recoveredKey).toString('hex')).toBe(hexKey);
    });

    it('should get public key from private key', async () => {
        const keyPair = await keyManager.generateKeyPair();
        const derivedPublicKey = keyManager.getPublicKeyFromPrivate(keyPair.privateKey);
        expect(Buffer.from(derivedPublicKey).toString('hex'))
            .toBe(Buffer.from(keyPair.publicKey).toString('hex'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
}); 