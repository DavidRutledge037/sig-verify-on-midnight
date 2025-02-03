import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DIDService } from '../../services/did/didService';
import { ZKProof } from '../../types/zk';

describe('DIDService', () => {
  let didService: DIDService;
  const mockEndpoint = 'https://api.midnight.test';

  beforeEach(() => {
    didService = new DIDService(mockEndpoint);
    // Reset fetch mock
    vi.resetAllMocks();
  });

  it('should create a DID with valid KYC proof', async () => {
    const mockProof: ZKProof = {
      proof: 'mockProof',
      publicInputs: ['input1'],
      verificationKey: 'key1',
      protocol: 'groth16'
    };

    const mockResponse = {
      id: 'did:midnight:123',
      controller: 'did:midnight:123',
      verificationMethod: [],
      authentication: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await didService.createDID(mockProof);
    expect(result.id).toBe('did:midnight:123');
  });

  it('should verify a valid DID', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isValid: true })
    });

    const result = await didService.verifyDID('did:midnight:123');
    expect(result).toBe(true);
  });
}); 