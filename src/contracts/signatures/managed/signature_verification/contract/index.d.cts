import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum DocumentType { Basic = 0, Legal = 1, Regulated = 2 }

export type Witnesses<T> = {
  local_secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  commit_to_did(context: __compactRuntime.CircuitContext<T>, did_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  generate_nullifier(context: __compactRuntime.CircuitContext<T>,
                     did_0: Uint8Array,
                     documentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  get_version(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, Uint8Array>;
  registerDocument(context: __compactRuntime.CircuitContext<T>,
                   documentHash_0: Uint8Array,
                   documentType_0: DocumentType,
                   ownerDID_0: Uint8Array,
                   multiParty_0: bigint,
                   requiredSignatures_0: bigint): __compactRuntime.CircuitResults<T, []>;
  generate_signature_proof(context: __compactRuntime.CircuitContext<T>,
                           documentHash_0: Uint8Array,
                           signerDID_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verify_signature_proof(context: __compactRuntime.CircuitContext<T>,
                         documentHash_0: Uint8Array,
                         signerCommitment_0: Uint8Array,
                         proof_0: Uint8Array,
                         nullifierHash_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  signDocument(context: __compactRuntime.CircuitContext<T>,
               documentHash_0: Uint8Array,
               signerDID_0: Uint8Array,
               proof_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  revokeDocument(context: __compactRuntime.CircuitContext<T>,
                 documentHash_0: Uint8Array,
                 ownerDID_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  verifySignatures(context: __compactRuntime.CircuitContext<T>,
                   documentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  commit_to_did(context: __compactRuntime.CircuitContext<T>, did_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  generate_nullifier(context: __compactRuntime.CircuitContext<T>,
                     did_0: Uint8Array,
                     documentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  get_version(context: __compactRuntime.CircuitContext<T>): __compactRuntime.CircuitResults<T, Uint8Array>;
  registerDocument(context: __compactRuntime.CircuitContext<T>,
                   documentHash_0: Uint8Array,
                   documentType_0: DocumentType,
                   ownerDID_0: Uint8Array,
                   multiParty_0: bigint,
                   requiredSignatures_0: bigint): __compactRuntime.CircuitResults<T, []>;
  generate_signature_proof(context: __compactRuntime.CircuitContext<T>,
                           documentHash_0: Uint8Array,
                           signerDID_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verify_signature_proof(context: __compactRuntime.CircuitContext<T>,
                         documentHash_0: Uint8Array,
                         signerCommitment_0: Uint8Array,
                         proof_0: Uint8Array,
                         nullifierHash_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
  signDocument(context: __compactRuntime.CircuitContext<T>,
               documentHash_0: Uint8Array,
               signerDID_0: Uint8Array,
               proof_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  revokeDocument(context: __compactRuntime.CircuitContext<T>,
                 documentHash_0: Uint8Array,
                 ownerDID_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  verifySignatures(context: __compactRuntime.CircuitContext<T>,
                   documentHash_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
}

export type Ledger = {
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<T, W extends Witnesses<T> = Witnesses<T>> {
  witnesses: W;
  circuits: Circuits<T>;
  impureCircuits: ImpureCircuits<T>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<T>): __compactRuntime.ConstructorResult<T>;
}

export declare function ledger(state: __compactRuntime.StateValue): Ledger;
export declare const pureCircuits: PureCircuits;
