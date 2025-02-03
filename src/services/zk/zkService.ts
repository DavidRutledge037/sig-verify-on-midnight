import { ZKProof, ZKVerificationResult, ProofInput } from '../../types/zk';

export class ZKService {
  private readonly midnightEndpoint: string;

  constructor(endpoint: string) {
    this.midnightEndpoint = endpoint;
  }

  async generateProof(input: ProofInput): Promise<ZKProof> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/zk/generate-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ZK proof');
      }

      return await response.json();
    } catch (error) {
      console.error('ZK proof generation failed:', error);
      throw error;
    }
  }

  async verifyProof(proof: ZKProof): Promise<ZKVerificationResult> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/zk/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proof),
      });

      if (!response.ok) {
        return { isValid: false, error: 'Verification request failed' };
      }

      return await response.json();
    } catch (error) {
      console.error('ZK proof verification failed:', error);
      return { isValid: false, error: error.message };
    }
  }

  async generateSignatureProof(
    message: string, 
    did: string, 
    privateInputs: any
  ): Promise<ZKProof> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/zk/signature-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          did,
          privateInputs,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate signature proof');
      }

      return await response.json();
    } catch (error) {
      console.error('Signature proof generation failed:', error);
      throw error;
    }
  }
} 