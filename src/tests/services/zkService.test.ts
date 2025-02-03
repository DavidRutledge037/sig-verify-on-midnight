import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ZKService } from '../../services/zk/zkService';
import { ZKProof, ProofInput } from '../../types/zk';

describe('ZKService', () => {
  let zkService: ZKService;
  const mockEndpoint = 'https://api.midnight.test';

  beforeEach(() => {
    zkService = new ZKService(mockEndpoint);
    vi.resetAllMocks();
  });

  it('should generate a valid ZK proof', async () => {
    const mockInput: ProofInput = {
      privateInputs: { age: 25, income: 50000 },
      publicInputs: { ageRange: 'over18', incomeRange: 'above40k' }
    };

    const mockProof: ZKProof = {
      proof: 'mockProofString',
      publicInputs: ['input1'],
      verificationKey: 'key1',
      protocol: 'groth16'
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockProof
    });

    const result = await zkService.generateProof(mockInput);
    expect(result.proof).toBe('mockProofString');
    expect(result.protocol).toBe('groth16');
  });

  it('should verify a valid proof', async () => {
    const mockProof: ZKProof = {
      proof: 'validProof',
      publicInputs: ['input1'],
      verificationKey: 'key1',
      protocol: 'groth16'
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ isValid: true })
    });

    const result = await zkService.verifyProof(mockProof);
    expect(result.isValid).toBe(true);
  });

  it('should generate a signature proof', async () => {
    const mockMessage = 'Test document';
    const mockDid = 'did:midnight:123';
    const mockPrivateInputs = { key: 'private' };

    const mockProof: ZKProof = {
      proof: 'signatureProof',
      publicInputs: ['input1'],
      verificationKey: 'key1',
      protocol: 'plonk'
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockProof
    });

    const result = await zkService.generateSignatureProof(
      mockMessage,
      mockDid,
      mockPrivateInputs
    );
    
    expect(result.proof).toBe('signatureProof');
    expect(result.protocol).toBe('plonk');
  });

  it('should handle proof generation errors', async () => {
    const mockInput: ProofInput = {
      privateInputs: {},
      publicInputs: {}
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400
    });

    await expect(zkService.generateProof(mockInput))
      .rejects
      .toThrow('Failed to generate ZK proof');
  });
}); 