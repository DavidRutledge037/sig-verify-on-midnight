import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';
export { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export interface WalletProvider {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getSecretKey(): Promise<string>;
  getNetworkId(): Promise<NetworkId>;
}
