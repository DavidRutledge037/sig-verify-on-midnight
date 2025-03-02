import { ZKConfig, ProverKey, VerifierKey, ZKIR } from '@midnight-ntwrk/midnight-js-types';

// Circuit IDs for our signature system
export type SignatureCircuitId = 
  | 'signature.prove_ownership'
  | 'signature.verify';

export class SignatureZKConfig implements ZKConfig<SignatureCircuitId> {
  constructor(
    public readonly circuitId: SignatureCircuitId,
    public readonly proverKey: ProverKey,
    public readonly verifierKey: VerifierKey,
    public readonly zkir: ZKIR
  ) {}

  static async load(circuitId: SignatureCircuitId): Promise<SignatureZKConfig> {
    // In production, these would be loaded from the Midnight Network
    const proverKey = await fetch(`/circuits/${circuitId}.prover.key`).then(r => r.arrayBuffer());
    const verifierKey = await fetch(`/circuits/${circuitId}.verifier.key`).then(r => r.arrayBuffer());
    const zkir = await fetch(`/circuits/${circuitId}.zkir`).then(r => r.arrayBuffer());

    return new SignatureZKConfig(
      circuitId,
      { ProverKey: new Uint8Array(proverKey) },
      new Uint8Array(verifierKey),
      new Uint8Array(zkir)
    );
  }
}
