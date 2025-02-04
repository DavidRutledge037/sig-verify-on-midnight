import { describe, test, expect, beforeEach } from 'vitest';
import { DIDResolver } from '../DIDResolver';

describe('DIDResolver', () => {
    let resolver: DIDResolver;

    beforeEach(() => {
        resolver = new DIDResolver();
    });

    test('should resolve valid DID', async () => {
        const did = 'did:midnight:test123';
        const result = await resolver.resolve(did);
        
        expect(result).toEqual({
            '@context': ['https://www.w3.org/ns/did/v1'],
            id: did,
            verificationMethod: [{
                id: `${did}#key-1`,
                type: 'Ed25519VerificationKey2020',
                controller: did,
                publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
            }]
        });
    });

    test('should reject invalid DID format', async () => {
        const did = 'invalid:did:format';
        await expect(resolver.resolve(did)).rejects.toThrow('Invalid DID format');
    });

    test('should cache resolved DIDs', async () => {
        const did = 'did:midnight:test456';
        
        // First resolution
        const result1 = await resolver.resolve(did);
        // Second resolution should return cached result
        const result2 = await resolver.resolve(did);
        
        expect(result1).toEqual(result2);
    });

    test('should handle multiple concurrent resolutions', async () => {
        const dids = [
            'did:midnight:test1',
            'did:midnight:test2',
            'did:midnight:test3'
        ];
        
        const results = await Promise.all(dids.map(did => resolver.resolve(did)));
        
        results.forEach((result, index) => {
            expect(result.id).toBe(dids[index]);
        });
    });
}); 