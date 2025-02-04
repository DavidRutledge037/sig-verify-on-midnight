import { describe, test, expect, beforeEach } from 'vitest';
import { CryptoService } from '../CryptoService';
import { SigningError, VerificationError } from '../../errors/CryptoServiceErrors';

describe('CryptoService', () => {
    let cryptoService: CryptoService;
    let keyPair: { publicKey: string; privateKey: string };

    beforeEach(async () => {
        cryptoService = new CryptoService();
        keyPair = await cryptoService.generateKeyPair();
    });

    describe('Key Generation', () => {
        test('should generate valid key pairs', async () => {
            expect(keyPair.privateKey).toBeDefined();
            expect(keyPair.publicKey).toBeDefined();
            expect(cryptoService.validatePrivateKey(keyPair.privateKey)).toBe(true);
            expect(cryptoService.validatePublicKey(keyPair.publicKey)).toBe(true);
        });

        test('should generate unique key pairs', async () => {
            const keyPair2 = await cryptoService.generateKeyPair();
            expect(keyPair.privateKey).not.toBe(keyPair2.privateKey);
            expect(keyPair.publicKey).not.toBe(keyPair2.publicKey);
        });
    });

    describe('Signing', () => {
        test('should create valid signatures', async () => {
            const content = 'Test message';
            const { signature, params } = await cryptoService.sign(content, keyPair.privateKey);
            
            expect(signature).toBeDefined();
            expect(signature.length).toBeGreaterThan(0);
            expect(params.type).toBe('MidnightSignature2024');
            expect(new Date(params.created)).toBeInstanceOf(Date);
        });

        test('should create different signatures for different messages', async () => {
            const { signature: sig1 } = await cryptoService.sign('Message 1', keyPair.privateKey);
            const { signature: sig2 } = await cryptoService.sign('Message 2', keyPair.privateKey);
            expect(sig1).not.toBe(sig2);
        });

        test('should throw on invalid private key', async () => {
            await expect(cryptoService.sign('Test', 'invalid-key'))
                .rejects.toThrow(SigningError);
        });
    });

    describe('Verification', () => {
        test('should verify valid signatures', async () => {
            const content = 'Test message';
            const { signature, params } = await cryptoService.sign(content, keyPair.privateKey);
            
            const isValid = await cryptoService.verify(
                content,
                signature,
                keyPair.publicKey,
                params
            );
            
            expect(isValid).toBe(true);
        });

        test('should reject modified content', async () => {
            const content = 'Original message';
            const { signature, params } = await cryptoService.sign(content, keyPair.privateKey);
            
            const isValid = await cryptoService.verify(
                'Modified message',
                signature,
                keyPair.publicKey,
                params
            );
            
            expect(isValid).toBe(false);
        });

        test('should reject invalid signatures', async () => {
            const invalidSignature = '0'.repeat(128);
            await expect(cryptoService.verify(
                'Test',
                invalidSignature,
                keyPair.publicKey,
                {
                    type: 'MidnightSignature2024',
                    created: new Date().toISOString(),
                    verificationMethod: 'test',
                    proofPurpose: 'assertionMethod'
                }
            )).rejects.toThrow(VerificationError);
        });
    });

    describe('Key Validation', () => {
        test('should validate correct keys', () => {
            expect(cryptoService.validatePrivateKey(keyPair.privateKey)).toBe(true);
            expect(cryptoService.validatePublicKey(keyPair.publicKey)).toBe(true);
        });

        test('should reject invalid private keys', () => {
            expect(cryptoService.validatePrivateKey('invalid')).toBe(false);
            expect(cryptoService.validatePrivateKey('0x123')).toBe(false);
            expect(cryptoService.validatePrivateKey('0'.repeat(64))).toBe(false);
        });

        test('should reject invalid public keys', () => {
            expect(cryptoService.validatePublicKey('invalid')).toBe(false);
            expect(cryptoService.validatePublicKey('0x123')).toBe(false);
            expect(cryptoService.validatePublicKey('0'.repeat(128))).toBe(false);
        });
    });

    describe('Edge Cases', () => {
        test('should handle empty messages', async () => {
            const { signature, params } = await cryptoService.sign('', keyPair.privateKey);
            const isValid = await cryptoService.verify('', signature, keyPair.publicKey, params);
            expect(isValid).toBe(true);
        });

        test('should handle long messages', async () => {
            const longMessage = 'a'.repeat(10000);
            const { signature, params } = await cryptoService.sign(longMessage, keyPair.privateKey);
            const isValid = await cryptoService.verify(longMessage, signature, keyPair.publicKey, params);
            expect(isValid).toBe(true);
        });

        test('should handle unicode messages', async () => {
            const unicodeMessage = '🌟 Hello, 世界! 🌍';
            const { signature, params } = await cryptoService.sign(unicodeMessage, keyPair.privateKey);
            const isValid = await cryptoService.verify(unicodeMessage, signature, keyPair.publicKey, params);
            expect(isValid).toBe(true);
        });
    });
}); 