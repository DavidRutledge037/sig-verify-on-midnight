import { describe, test, expect, beforeEach } from 'vitest';
import { MidnightKeyManagement } from '../MidnightKeyManagement';
import { CryptoService } from '../CryptoService';

describe('MidnightKeyManagement', () => {
    let keyManagement: MidnightKeyManagement;
    let cryptoService: CryptoService;

    beforeEach(() => {
        cryptoService = new CryptoService();
        keyManagement = new MidnightKeyManagement(cryptoService);
    });

    describe('Seed Generation', () => {
        test('should generate valid seeds', async () => {
            const seed = await keyManagement.generateMidnightSeed();
            expect(seed).toMatch(/^[0-9a-f]{64}$/i);
        });

        test('should generate unique seeds', async () => {
            const seed1 = await keyManagement.generateMidnightSeed();
            const seed2 = await keyManagement.generateMidnightSeed();
            expect(seed1).not.toBe(seed2);
        });
    });

    describe('Key Derivation', () => {
        test('should derive valid key pairs from seed', async () => {
            const seed = await keyManagement.generateMidnightSeed();
            const keyPair = await keyManagement.deriveKeyPair(seed);
            
            expect(keyPair.privateKey).toMatch(/^[0-9a-f]{64}$/i);
            expect(keyPair.publicKey).toMatch(/^04[0-9a-f]{128}$/i);
            expect(cryptoService.validatePrivateKey(keyPair.privateKey)).toBe(true);
            expect(cryptoService.validatePublicKey(keyPair.publicKey)).toBe(true);
        });

        test('should derive different keys for different paths', async () => {
            const seed = await keyManagement.generateMidnightSeed();
            const keyPair1 = await keyManagement.deriveKeyPair(seed, {
                purpose: 44,
                coinType: 7777,
                account: 0,
                change: 0,
                index: 0
            });
            
            const keyPair2 = await keyManagement.deriveKeyPair(seed, {
                purpose: 44,
                coinType: 7777,
                account: 0,
                change: 0,
                index: 1
            });

            expect(keyPair1.privateKey).not.toBe(keyPair2.privateKey);
            expect(keyPair1.publicKey).not.toBe(keyPair2.publicKey);
        });
    });
}); 