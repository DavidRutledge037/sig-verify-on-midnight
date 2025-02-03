export interface ZKProof {
  proof: string;
  publicInputs: string[];
  verificationKey: string;
  protocol: 'groth16' | 'plonk';
}

export interface ZKVerificationResult {
  isValid: boolean;
  error?: string;
}

export interface ProofInput {
  privateInputs: any;
  publicInputs: any;
} 