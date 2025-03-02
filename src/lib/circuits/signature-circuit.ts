import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { SHA256 } from 'crypto-js';
import { ProofServerClient } from '../proof/proof-server-client.js';
import { DocumentType as ProofDocumentType } from '../proof/types.js';

// Using our own DocumentType enum for the circuit
export enum DocumentType {
  Basic = 0,
  Legal = 1,
  Regulated = 2
}

export interface SignatureProof {
  proof: string;
  publicInputs: {
    did: string;
    documentHash: string;
    documentType: DocumentType;
    timestamp: number;
  };
}

export class SignatureCircuitWrapper {
  private static instance: SignatureCircuitWrapper | null = null;
  private proofServer: ProofServerClient;
  private readonly CIRCUIT_ID = 'signature.prove_ownership';

  private constructor(networkId: NetworkId) {
    this.proofServer = ProofServerClient.getInstance(networkId);
  }

  public static getInstance(networkId: NetworkId): SignatureCircuitWrapper {
    if (!SignatureCircuitWrapper.instance) {
      SignatureCircuitWrapper.instance = new SignatureCircuitWrapper(networkId);
    }
    return SignatureCircuitWrapper.instance;
  }

  public static resetInstance(): void {
    SignatureCircuitWrapper.instance = null;
  }

  public async generateProof(
    did: string,
    documentHash: string,
    documentType: DocumentType,
    secretKey: Uint8Array
  ): Promise<SignatureProof> {
    try {
      const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
      
      // Convert inputs to strings for the proof server
      const publicInputs = [
        did,
        documentHash,
        documentType.toString(),
        timestamp.toString()
      ];
      
      const privateInputs = [
        Buffer.from(secretKey).toString('hex')
      ];

      // Generate proof using Midnight's proof server
      const response = await this.proofServer.generateProof(this.CIRCUIT_ID, {
        circuitId: this.CIRCUIT_ID,
        publicInputs,
        privateInputs
      });

      return {
        proof: response.proof,
        publicInputs: {
          did,
          documentHash,
          documentType,
          timestamp
        }
      };
    } catch (error) {
      console.error('Failed to generate signature proof:', error);
      throw new Error('Failed to generate signature proof');
    }
  }

  public async verifyProof(proof: SignatureProof): Promise<boolean> {
    try {
      // Convert public inputs to strings for verification
      const publicInputs = [
        proof.publicInputs.did,
        proof.publicInputs.documentHash,
        proof.publicInputs.documentType.toString(),
        proof.publicInputs.timestamp.toString()
      ];

      // Verify the proof using Midnight's proof server
      const response = await this.proofServer.verifyProof(this.CIRCUIT_ID, proof.proof, publicInputs);
      return response;
    } catch (error) {
      console.error('Failed to verify proof:', error);
      throw error;
    }
  }
}
