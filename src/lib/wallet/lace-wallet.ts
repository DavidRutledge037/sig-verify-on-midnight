import { WalletProvider, WalletState } from './types.js';
import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id.js';

declare global {
  interface Window {
    lace?: {
      enable(): Promise<any>;
      isEnabled(): Promise<boolean>;
      getAddress(): Promise<string>;
      signMessage(message: string): Promise<string>;
      getNetwork(): Promise<string>;
    };
  }
}

export class LaceWallet implements WalletProvider {
  private state: WalletState = {
    connected: false,
    address: null,
    did: null,
    networkId: NetworkId.TestNet,
    kycLevel: null
  };

  public isConnected(): boolean {
    return this.state.connected;
  }

  public async getSecretKey(): Promise<Uint8Array> {
    throw new Error('Secret key access not supported in Lace wallet');
  }

  public async getNetworkId(): Promise<NetworkId> {
    return this.state.networkId;
  }

  public getState(): WalletState {
    return { ...this.state };
  }

  public async connect(): Promise<boolean> {
    if (!window.lace) {
      throw new Error('Lace wallet not found');
    }

    try {
      await window.lace.enable();
      const address = await window.lace.getAddress();
      const network = await window.lace.getNetwork();
      
      this.state = {
        ...this.state,
        connected: true,
        address,
        networkId: network === 'TestNet' ? NetworkId.TestNet : NetworkId.MainNet
      };
      
      return true;
    } catch (error) {
      console.error('Failed to connect to Lace wallet:', error);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    this.state = {
      connected: false,
      address: null,
      did: null,
      networkId: NetworkId.TestNet,
      kycLevel: null
    };
  }

  public async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.state.connected || !window.lace) {
      throw new Error('Wallet not connected');
    }

    const messageHex = Buffer.from(message).toString('hex');
    const signature = await window.lace.signMessage(messageHex);
    return Buffer.from(signature, 'hex');
  }
}
