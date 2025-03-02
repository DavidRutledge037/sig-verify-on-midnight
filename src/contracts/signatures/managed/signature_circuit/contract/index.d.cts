import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<T> = {
  local_secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  generate_key_proof(context: __compactRuntime.CircuitContext<T>,
                     instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  set_admin(context: __compactRuntime.CircuitContext<T>, new_admin_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  sign_document(context: __compactRuntime.CircuitContext<T>,
                doc_0: Uint8Array,
                did_0: Uint8Array,
                doc_type_0: number): __compactRuntime.CircuitResults<T, []>;
  commit_to_did(context: __compactRuntime.CircuitContext<T>, did_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verify_signature(context: __compactRuntime.CircuitContext<T>,
                   doc_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
}

export type PureCircuits = {
}

export type Circuits<T> = {
  generate_key_proof(context: __compactRuntime.CircuitContext<T>,
                     instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  set_admin(context: __compactRuntime.CircuitContext<T>, new_admin_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  sign_document(context: __compactRuntime.CircuitContext<T>,
                doc_0: Uint8Array,
                did_0: Uint8Array,
                doc_type_0: number): __compactRuntime.CircuitResults<T, []>;
  commit_to_did(context: __compactRuntime.CircuitContext<T>, did_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  verify_signature(context: __compactRuntime.CircuitContext<T>,
                   doc_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
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
