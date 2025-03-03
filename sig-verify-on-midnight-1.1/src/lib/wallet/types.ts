import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export interface MidnightLaceAPI {
  getNetworkId(): Promise<string>;
  getAddress(): Promise<string>;
  getPublicKey(): Promise<string>;
  signMessage(message: string): Promise<string>;
  executeContract(circuitId: string, method: string, args: any[]): Promise<any>;
  queryContract(circuitId: string, method: string, args: any[]): Promise<any>;
}

export interface WalletProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAddress(): Promise<string>;
  getNetwork(): Promise<NetworkId>;
  getDID(): Promise<string>;
  signMessage(message: string): Promise<string>;
  executeContract(circuitId: string, method: string, args: any[]): Promise<any>;
  queryContract(circuitId: string, method: string, args: any[]): Promise<any>;
  getPublicKey(): Promise<string>;
  isInstalled(): boolean;
  getCurrentNetwork(): NetworkId;
}
