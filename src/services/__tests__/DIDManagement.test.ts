import { describe, test, expect, beforeEach } from 'vitest';
import { DIDManagement } from '../DIDManagement';
import { DIDResolver } from '../DIDResolver';

describe('DIDManagement', () => {
    let didManagement: DIDManagement;
    let mockResolver: DIDResolver;
    let resolveCallCount = 0;

    const mockDIDDoc = {
        id: 'did:midnight:test1',
        verificationMethod: [{
            id: 'did:midnight:test1#key-1',
            type: 'Ed25519VerificationKey2020',
            controller: 'did:midnight:test1',
            publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
        }],
        authentication: ['did:midnight:test1#key-1']
    };

    beforeEach(() => {
        resolveCallCount = 0;
        mockResolver = {
            resolve: (did: string) => {
                resolveCallCount++;
                if (did === 'did:midnight:invalid') {
                    return Promise.reject(new Error('Resolution failed'));
                }
                return Promise.resolve(mockDIDDoc);
            }
        } as DIDResolver;

        didManagement = new DIDManagement(mockResolver);
    });

    test('should resolve DID document', async () => {
        const did = 'did:midnight:test1';
        const result = await didManagement.resolveDID(did);
        
        expect(result).toEqual({
            id: did,
            verificationMethod: [{
                id: `${did}#key-1`,
                type: 'Ed25519VerificationKey2020',
                controller: did,
                publicKeyMultibase: 'z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK'
            }],
            authentication: [`${did}#key-1`]
        });
    });

    test('should cache resolved DIDs', async () => {
        const did = 'did:midnight:test2';
        
        await didManagement.resolveDID(did);
        await didManagement.resolveDID(did);
        
        expect(resolveCallCount).toBe(1);
    });

    test('should handle resolution errors', async () => {
        const did = 'did:midnight:invalid';
        
        await expect(didManagement.resolveDID(did)).rejects.toThrow('Resolution failed');
    });

    test('should validate DID format', async () => {
        const invalidDID = 'invalid:did:format';
        
        await expect(didManagement.resolveDID(invalidDID)).rejects.toThrow('Invalid DID format');
    });
}); 