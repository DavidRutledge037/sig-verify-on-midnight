import { DIDDocument, DIDResolutionResult } from '../../types/did';
import { ZKProof } from '../../types/zk';

export class DIDService {
  private readonly midnightEndpoint: string;

  constructor(endpoint: string) {
    this.midnightEndpoint = endpoint;
  }

  async createDID(kycProof: ZKProof): Promise<DIDDocument> {
    try {
      // TODO: Integrate with Midnight Network's DID creation
      const response = await fetch(`${this.midnightEndpoint}/did/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kycProof }),
      });

      if (!response.ok) {
        throw new Error('Failed to create DID');
      }

      return await response.json();
    } catch (error) {
      console.error('DID creation failed:', error);
      throw error;
    }
  }

  async verifyDID(did: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/did/verify/${did}`);
      if (!response.ok) {
        return false;
      }
      const result = await response.json();
      return result.isValid;
    } catch (error) {
      console.error('DID verification failed:', error);
      return false;
    }
  }

  async resolveDID(did: string): Promise<DIDResolutionResult> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/did/resolve/${did}`);
      if (!response.ok) {
        throw new Error('DID resolution failed');
      }
      return await response.json();
    } catch (error) {
      console.error('DID resolution failed:', error);
      throw error;
    }
  }
} 