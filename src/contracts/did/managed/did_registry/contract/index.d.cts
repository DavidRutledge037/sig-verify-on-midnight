import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type VerificationMethod = { id: Uint8Array;
                                   controller: Uint8Array;
                                   publicKey: Uint8Array
                                 };

export type Service = { id: Uint8Array;
                        serviceType: Uint8Array;
                        endpoint: Uint8Array
                      };

export type DIDDocument = { id: Uint8Array;
                            controller: Uint8Array;
                            verificationMethods: VerificationMethod[];
                            services: Service[]
                          };

export type Witnesses<T> = {
  local_secret_key(context: __compactRuntime.WitnessContext<Ledger, T>): [T, Uint8Array];
}

export type ImpureCircuits<T> = {
  generate_key_proof(context: __compactRuntime.CircuitContext<T>,
                     instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  set_admin(context: __compactRuntime.CircuitContext<T>, new_admin_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  create_did(context: __compactRuntime.CircuitContext<T>,
             verification_methods_0: VerificationMethod[],
             services_0: Service[]): __compactRuntime.CircuitResults<T, Uint8Array>;
  update_did(context: __compactRuntime.CircuitContext<T>,
             did_id_0: Uint8Array,
             verification_methods_0: VerificationMethod[],
             services_0: Service[]): __compactRuntime.CircuitResults<T, []>;
  deactivate_did(context: __compactRuntime.CircuitContext<T>,
                 did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  get_did_document(context: __compactRuntime.CircuitContext<T>,
                   did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, DIDDocument>;
  is_deactivated(context: __compactRuntime.CircuitContext<T>,
                 did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
}

export type PureCircuits = {
  public_key(sk_0: Uint8Array, instance_0: Uint8Array): Uint8Array;
}

export type Circuits<T> = {
  generate_key_proof(context: __compactRuntime.CircuitContext<T>,
                     instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  public_key(context: __compactRuntime.CircuitContext<T>,
             sk_0: Uint8Array,
             instance_0: Uint8Array): __compactRuntime.CircuitResults<T, Uint8Array>;
  set_admin(context: __compactRuntime.CircuitContext<T>, new_admin_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  create_did(context: __compactRuntime.CircuitContext<T>,
             verification_methods_0: VerificationMethod[],
             services_0: Service[]): __compactRuntime.CircuitResults<T, Uint8Array>;
  update_did(context: __compactRuntime.CircuitContext<T>,
             did_id_0: Uint8Array,
             verification_methods_0: VerificationMethod[],
             services_0: Service[]): __compactRuntime.CircuitResults<T, []>;
  deactivate_did(context: __compactRuntime.CircuitContext<T>,
                 did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, []>;
  get_did_document(context: __compactRuntime.CircuitContext<T>,
                   did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, DIDDocument>;
  is_deactivated(context: __compactRuntime.CircuitContext<T>,
                 did_id_0: Uint8Array): __compactRuntime.CircuitResults<T, bigint>;
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
