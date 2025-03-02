import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { ProofServerClient } from './proof-server-client';
import { DocumentProof, DocumentSigningProof } from './types';

export class DocumentProofProvider {
  private static instance: DocumentProofProvider;
  private proofServer: ProofServerClient;

  private constructor(networkId: NetworkId) {
    this.proofServer = ProofServerClient.getInstance(networkId);
  }

  public static getInstance(networkId: NetworkId): DocumentProofProvider {
    if (!DocumentProofProvider.instance) {
      DocumentProofProvider.instance = new DocumentProofProvider(networkId);
    }
    return DocumentProofProvider.instance;
  }

  /**
   * Generate a proof for document registration
   */
  async proveDocumentRegistration(
    publicInputs: { hash: string; owner: string; kycLevel: number },
    privateInputs: { 
      content: string;
      ownerSecretKey: Uint8Array;
    }
  ): Promise<DocumentProof> {
    try {
      const result = await this.proofServer.generateProof('document.register', {
        publicInputs,
        privateInputs: {
          content: privateInputs.content,
          ownerSecretKey: Array.from(privateInputs.ownerSecretKey)
        }
      });

      return {
        proof: result.proof,
        publicInputs: result.publicInputs as DocumentProof['publicInputs']
      };
    } catch (error) {
      console.error('Failed to generate document registration proof:', error);
      throw new Error('Failed to generate document registration proof');
    }
  }

  /**
   * Generate a proof for document signing
   */
  async proveDocumentSigning(
    publicInputs: { documentHash: string; signerDid: string },
    privateInputs: { 
      signerSecretKey: Uint8Array;
      documentContent: string;
    }
  ): Promise<DocumentSigningProof> {
    try {
      const result = await this.proofServer.generateProof('document.sign', {
        publicInputs,
        privateInputs: {
          signerSecretKey: Array.from(privateInputs.signerSecretKey),
          documentContent: privateInputs.documentContent
        }
      });

      return {
        proof: result.proof,
        publicInputs: result.publicInputs as DocumentSigningProof['publicInputs']
      };
    } catch (error) {
      console.error('Failed to generate document signing proof:', error);
      throw new Error('Failed to generate document signing proof');
    }
  }

  /**
   * Verify document access
   */
  async verifyDocumentAccess(
    documentHash: string,
    userDid: string,
    proof: string
  ): Promise<boolean> {
    try {
      return await this.proofServer.verifyProof(
        'document.verify_access',
        proof,
        { documentHash, userDid }
      );
    } catch (error) {
      console.error('Failed to verify document access:', error);
      throw new Error('Failed to verify document access');
    }
  }

  /**
   * Get circuit information
   */
  async getCircuitInfo(circuitId: 'document.register' | 'document.sign' | 'document.verify_access'): Promise<any> {
    return await this.proofServer.getCircuitInfo(circuitId);
  }
}
