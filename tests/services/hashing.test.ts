import { jest, describe, it, expect } from '@jest/globals';
import { HashingService } from '../../src/services/hashing';

describe('HashingService', () => {
    let hashingService: HashingService;

    beforeEach(() => {
        hashingService = new HashingService();
    });

    it('should generate a hash', () => {
        const data = 'test data';
        const hash = hashingService.hash(data);
        expect(hash).toBeDefined();
        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate consistent hashes', () => {
        const data = 'test data';
        const hash1 = HashingService.hashData(data);
        const hash2 = HashingService.hashData(data);

        expect(hash1).toBe(hash2);
        expect(hash1).toMatch(/^z[1-9A-HJ-NP-Za-km-z]+$/);
    });

    it('should handle Uint8Array input', () => {
        const data = new TextEncoder().encode('test data');
        const hash = HashingService.hashData(data);

        expect(hash).toMatch(/^z[1-9A-HJ-NP-Za-km-z]+$/);
    });

    it('should verify valid hashes', () => {
        const data = 'test data';
        const hash = HashingService.hashData(data);

        expect(HashingService.verifyHash(data, hash)).toBe(true);
    });

    it('should reject invalid hashes', () => {
        const data = 'test data';
        const wrongData = 'wrong data';
        const hash = HashingService.hashData(data);

        expect(HashingService.verifyHash(wrongData, hash)).toBe(false);
    });

    it('should handle empty input', () => {
        const hash = HashingService.hashData('');
        expect(hash).toMatch(/^z[1-9A-HJ-NP-Za-km-z]+$/);
    });
}); 