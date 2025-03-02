import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';

export interface SignatureProof {
  proof: string;
  publicInputs: {
    did: string;
    documentHash: string;
    timestamp: number;
  };
}

export class SignatureProofProvider {
  private static instance: SignatureProofProvider | null = null;
  private proofProvider: ReturnType<typeof httpClientProofProvider>;

  private constructor() {
    // Connect directly to testnet proof provider
    this.proofProvider = httpClientProofProvider({
      url: 'https://testnet.midnight.network',
      networkId: NetworkId.TestNet
    });
  }

  public static getInstance(): SignatureProofProvider {
    if (!SignatureProofProvider.instance) {
      SignatureProofProvider.instance = new SignatureProofProvider();
    }
    return SignatureProofProvider.instance;
  }

  public static resetInstance(): void {
    SignatureProofProvider.instance = null;
  }

  /**
   * Generate a signature proof using the Midnight testnet
   */
  async generateProof(
    documentHash: string,
    did: string,
    secretKey: Uint8Array
  ): Promise<SignatureProof> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);

      const result = await this.proofProvider.prove({
        circuitId: 'signature.prove_ownership',
        publicInputs: {
          documentHash,
          did,
          timestamp: timestamp.toString()
        },
        privateInputs: {
          secretKey: Array.from(secretKey)
        }
      });

      return {
        proof: result.proof,
        publicInputs: {
          did,
          documentHash,
          timestamp
        }
      };
    } catch (error) {
      console.error('Failed to generate signature proof:', error);
      throw new Error('Failed to generate signature proof');
    }
  }

  /**
   * Verify a signature proof using the Midnight testnet
   */
  async verifyProof(proof: SignatureProof): Promise<boolean> {
    try {
      const result = await this.proofProvider.verify({
        circuitId: 'signature.prove_ownership',
        proof: proof.proof,
        publicInputs: proof.publicInputs
      });
      return result.valid;
    } catch (error) {
      console.error('Failed to verify signature proof:', error);
      throw new Error('Failed to verify signature proof');
    }
  }
}
