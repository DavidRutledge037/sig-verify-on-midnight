import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export interface WalletState {
  connected: boolean;
  address: string | null;
  did: string | null;
  networkId: NetworkId;
  kycLevel: number | null;
}

export interface WalletProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getSecretKey(): Promise<Uint8Array>;
  getNetworkId(): Promise<NetworkId>;
  getState(): WalletState;
  getAddress(): Promise<string>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  getDID(): Promise<string | null>;
  deployContract(bytecode: string, initialState: any): Promise<any>;
  executeContract(contractAddress: string, method: string, args: any[]): Promise<any>;
  queryContract(contractAddress: string, method: string, args: any[]): Promise<any>;
}

export enum WalletType {
  MidnightLace = 'midnight-lace',
  MockWallet = 'mock-wallet'
}

export interface MidnightLaceAPI {
  enable(appName: string): Promise<{
    balanceAndProveTransaction: (transaction: any) => Promise<any>;
    state: () => Promise<WalletState>;
    getNetworkId(): Promise<NetworkId>;
  }>;
  isEnabled: () => Promise<boolean>;
  enable(): Promise<any>;
  getAddress(): Promise<string>;
  getPublicKey(): Promise<string>;
  executeContract(circuitId: string, method: string, args: any[]): Promise<any>;
  queryContract(circuitId: string, method: string, args: any[]): Promise<any>;
}

export interface SigningRequest {
  documentHash: string;
  requiredKYCLevel?: number;
  senderDID: string;
  timestamp: number;
}

declare global {
  interface Window {
    lace?: {
      enable(): Promise<any>;
      isEnabled(): Promise<boolean>;
      getAddress(): Promise<string>;
      signMessage(message: string): Promise<string>;
      getNetwork(): Promise<string>;
    };
    midnight?: {
      mnLace: any; 
    };
  }
}
