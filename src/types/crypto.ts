// Basic crypto types for the application
export interface CryptoKey {
  type: string;
  extractable: boolean;
  algorithm: {
    name: string;
  };
  usages: string[];
}

export interface SignatureResult {
  signature: string;
  publicKey?: string;
}

export interface VerificationResult {
  isValid: boolean;
  error?: string;
}

export interface CryptoProvider {
  sign(message: string, privateKey: string): Promise<SignatureResult>;
  verify(message: string, signature: string, publicKey: string): Promise<VerificationResult>;
} 