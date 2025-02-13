export interface IWalletService {
  initialize(): Promise<void>;
  getPublicKey(): Promise<Uint8Array>;
  sign(message: Uint8Array): Promise<Uint8Array>;
  verify(message: Uint8Array, signature: Uint8Array): Promise<boolean>;
} 