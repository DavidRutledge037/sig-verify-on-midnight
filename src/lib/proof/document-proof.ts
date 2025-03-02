import { ProofServerClient } from './proof-server-client.js';
import { AlignedValue, DocumentType, Effects, Op, ProofResponse, Transcript } from './types.js';

interface DocumentRegistrationPublicInput {
  hash: string;
  owner: string;
  kycLevel: number;
}

interface DocumentRegistrationPrivateInput {
  content: string;
  ownerSecretKey: Uint8Array;
}

interface DocumentSigningPublicInput {
  documentHash: string;
  signer: string;
  documentType: DocumentType;
  timestamp: number;
}

interface DocumentSigningPrivateInput {
  signature: Uint8Array;
  signerSecretKey: Uint8Array;
}

interface DocumentVerificationInput {
  documentHash: string;
  userDid: string;
  proof: string;
}

export class DocumentProofProvider {
  private static instance: DocumentProofProvider;
  private proofServer: ProofServerClient;

  private constructor() {
    this.proofServer = ProofServerClient.getInstance();
  }

  public static getInstance(): DocumentProofProvider {
    if (!DocumentProofProvider.instance) {
      DocumentProofProvider.instance = new DocumentProofProvider();
    }
    return DocumentProofProvider.instance;
  }

  private createAlignedValue(value: any): AlignedValue {
    const valueStr = value.toString();
    const byteArray = new Uint8Array(Buffer.from(valueStr));
    return {
      value: [byteArray],
      alignment: [{
        tag: "atom",
        value: { tag: "bytes", length: byteArray.length }
      }]
    };
  }

  public async proveDocumentRegistration(
    publicInput: DocumentRegistrationPublicInput,
    privateInput: DocumentRegistrationPrivateInput
  ): Promise<ProofResponse> {
    const transcript: Transcript<AlignedValue> = {
      gas: BigInt(0),
      effects: {
        claimedNullifiers: [],
        claimedReceives: [],
        claimedSpends: [],
        claimedContractCalls: [],
        mints: new Map<string, bigint>()
      },
      program: [],
      public: [this.createAlignedValue(publicInput)]
    };

    return await this.proofServer.generateProof(transcript);
  }

  public async proveDocumentSigning(
    publicInput: DocumentSigningPublicInput,
    privateInput: DocumentSigningPrivateInput
  ): Promise<ProofResponse> {
    const transcript: Transcript<AlignedValue> = {
      gas: BigInt(0),
      effects: {
        claimedNullifiers: [],
        claimedReceives: [],
        claimedSpends: [],
        claimedContractCalls: [],
        mints: new Map<string, bigint>()
      },
      program: [],
      public: [this.createAlignedValue(publicInput)]
    };

    return await this.proofServer.generateProof(transcript);
  }

  public async verifyDocumentProof(input: DocumentVerificationInput): Promise<boolean> {
    const result = await this.proofServer.verifyProof({
      circuitId: 'document.verify',
      proof: input.proof,
      public: [
        this.createAlignedValue({
          documentHash: input.documentHash,
          userDid: input.userDid
        })
      ]
    });

    return result.valid;
  }
}
