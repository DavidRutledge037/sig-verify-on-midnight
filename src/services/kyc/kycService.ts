import { ZKProof } from '../../types/zk';

export class KYCService {
  private readonly midnightEndpoint: string;

  constructor(endpoint: string) {
    this.midnightEndpoint = endpoint;
  }

  async initiateKYC(userAddress: string): Promise<string> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/kyc/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userAddress }),
      });

      if (!response.ok) {
        throw new Error('KYC initiation failed');
      }

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('KYC initiation failed:', error);
      throw error;
    }
  }

  async verifyKYC(proofData: ZKProof): Promise<boolean> {
    try {
      const response = await fetch(`${this.midnightEndpoint}/kyc/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proofData }),
      });

      if (!response.ok) {
        return false;
      }

      const { isValid } = await response.json();
      return isValid;
    } catch (error) {
      console.error('KYC verification failed:', error);
      return false;
    }
  }

  async generateZKProof(kycData: any): Promise<ZKProof> {
    try {
      // TODO: Implement ZK proof generation with Midnight's SDK
      const response = await fetch(`${this.midnightEndpoint}/kyc/generate-proof`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kycData }),
      });

      if (!response.ok) {
        throw new Error('ZK proof generation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('ZK proof generation failed:', error);
      throw error;
    }
  }
} 