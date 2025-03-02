import { createAlignedValue } from '../../lib/proof/types.js';

export class KYCPrivateState {
  constructor(did, level, proof) {
    this.did = did;
    this.level = level;
    this.proof = proof;
  }

  toAlignedValue() {
    return createAlignedValue({
      did: this.did,
      level: this.level,
      proof: this.proof,
      timestamp: Date.now()
    });
  }

  static fromAlignedValue(alignedValue) {
    const { did, level, proof } = alignedValue.value;
    return new KYCPrivateState(did, level, proof);
  }
}

export class KYCVerificationWitness {
  constructor(did, requiredLevel) {
    this.did = did;
    this.requiredLevel = requiredLevel;
  }

  toAlignedValue() {
    return createAlignedValue({
      did: this.did,
      requiredLevel: this.requiredLevel,
      timestamp: Date.now()
    });
  }

  static fromAlignedValue(alignedValue) {
    const { did, requiredLevel } = alignedValue.value;
    return new KYCVerificationWitness(did, requiredLevel);
  }
}

export const witnesses = {
  KYCPrivateState,
  KYCVerificationWitness
};
