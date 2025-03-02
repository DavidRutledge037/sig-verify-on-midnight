import { ProverKey, VerifierKey } from '@midnight-ntwrk/midnight-js-types';
import { 
  ContractCallPrototype as LedgerContractCallPrototype,
  ContractCall as LedgerContractCall,
  Effects as LedgerEffects,
  Op as LedgerOp,
  AlignedValue as LedgerAlignedValue,
  Transcript as LedgerTranscript
} from '@midnight-ntwrk/ledger';

export enum DocumentType {
  Basic = 0,
  Legal = 1,
  Regulated = 2
}

export interface OwnershipPublicInput {
  documentHash: bigint;
  owner: bigint;
  kycLevel: bigint;
}

export interface OwnershipPrivateInput {
  secretKey: bigint;
  signature: bigint;
}

export interface SignaturePublicInput {
  documentHash: bigint;
  signer: bigint;
  documentType: bigint;
  timestamp: bigint;
}

export interface SignaturePrivateInput {
  secretKey: bigint;
  signature: bigint;
}

export interface DocumentMetadata {
  hash: string;
  name: string;
  type: DocumentType;
  size: number;
  timestamp: number;
  signer: string;
  proof?: SignatureProof;
}

export interface SignatureProof {
  proof: string;
  publicInputs: OwnershipPublicInput | SignaturePublicInput;
  circuitId: string;
}

export interface CircuitInfo {
  id: string;
  name: string;
  version: string;
}

export interface ProofServerError {
  code: string;
  message: string;
  details?: any;
}

export interface ProofRequest {
  circuitId: string;
  transcript: Transcript<LedgerAlignedValue>;
}

export interface ProofResponse {
  public: {
    hash?: string;
    owner?: string;
    kycLevel?: number;
    documentHash?: string;
    signer?: string;
    documentType?: string;
    timestamp?: number;
  };
  proof: string;
  circuitId: string;
}

export interface VerifyRequest {
  circuitId: string;
  proof: string;
  public: any;
}

export interface VerifyResponse {
  valid: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

// Re-export types with proper type annotations
export type ContractCallPrototype = LedgerContractCallPrototype;
export type ContractCall = LedgerContractCall;
export type Effects = LedgerEffects;
export type Op<T> = LedgerOp<T>;
export type AlignedValue = LedgerAlignedValue;

// Export Transcript type with the correct property names
export interface Transcript<T> {
  gas: bigint;
  effects: Effects;
  program: Op<T>[];
  publicInputs: T[];
  privateInputs: T[];
}
