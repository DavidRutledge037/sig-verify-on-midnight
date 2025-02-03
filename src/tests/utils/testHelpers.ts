import { vi } from 'vitest';
import { ZKProof } from '../../types/zk';
import { DIDDocument } from '../../types/did';

export class TestHelpers {
  static mockFetch(response: any, ok: boolean = true) {
    return vi.fn().mockResolvedValueOnce({
      ok,
      json: async () => response
    });
  }

  static mockFetchError(error: string) {
    return vi.fn().mockRejectedValueOnce(new Error(error));
  }

  static createMockZKProof(
    overrides: Partial<ZKProof> = {}
  ): ZKProof {
    return {
      proof: 'mockProof123',
      publicInputs: ['input1'],
      verificationKey: 'key123',
      protocol: 'groth16',
      ...overrides
    };
  }

  static createMockDIDDocument(
    did: string = 'did:midnight:123',
    overrides: Partial<DIDDocument> = {}
  ): DIDDocument {
    return {
      id: did,
      controller: did,
      verificationMethod: [],
      authentication: [],
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      ...overrides
    };
  }

  static async mockServiceFlow(mocks: {
    kycSession?: boolean;
    zkProof?: boolean;
    kycVerification?: boolean;
    didCreation?: boolean;
    didVerification?: boolean;
    signatureProof?: boolean;
    proofVerification?: boolean;
  } = {}) {
    const mockResponses: any[] = [];

    if (mocks.kycSession) {
      mockResponses.push({
        ok: true,
        json: async () => ({ sessionId: 'session123' })
      });
    }

    if (mocks.zkProof) {
      mockResponses.push({
        ok: true,
        json: async () => this.createMockZKProof()
      });
    }

    if (mocks.kycVerification) {
      mockResponses.push({
        ok: true,
        json: async () => ({ isValid: true })
      });
    }

    if (mocks.didCreation) {
      mockResponses.push({
        ok: true,
        json: async () => this.createMockDIDDocument()
      });
    }

    if (mocks.didVerification) {
      mockResponses.push({
        ok: true,
        json: async () => ({ isValid: true })
      });
    }

    if (mocks.signatureProof) {
      mockResponses.push({
        ok: true,
        json: async () => this.createMockZKProof({
          protocol: 'plonk',
          proof: 'signatureProof123'
        })
      });
    }

    if (mocks.proofVerification) {
      mockResponses.push({
        ok: true,
        json: async () => ({ isValid: true })
      });
    }

    let currentMock = 0;
    global.fetch = vi.fn().mockImplementation(() => mockResponses[currentMock++]);
  }

  static mockNetworkError() {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
  }

  static resetMocks() {
    vi.resetAllMocks();
  }
} 