import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import * as dotenv from "dotenv";

interface WalletConfig {
    mnemonic?: string;
    prefix: string;
    nodeUrl: string;
    chainId: string;
}

export class MidnightWallet {
    private wallet: DirectSecp256k1HdWallet | null = null;
    private client: SigningStargateClient | null = null;

    constructor(private config: WalletConfig) {}

    async initialize(): Promise<void> {
        try {
            if (this.config.mnemonic) {
                this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                    this.config.mnemonic,
                    { prefix: this.config.prefix }
                );
            } else {
                this.wallet = await DirectSecp256k1HdWallet.generate(24, {
                    prefix: this.config.prefix
                });
            }

            this.client = await SigningStargateClient.connectWithSigner(
                this.config.nodeUrl,
                this.wallet
            );

            console.log('Wallet initialized successfully');
        } catch (error) {
            console.error('Failed to initialize wallet:', error);
            throw error;
        }
    }

    async getAddress(): Promise<string> {
        if (!this.wallet) throw new Error('Wallet not initialized');
        const [account] = await this.wallet.getAccounts();
        return account.address;
    }

    async getMnemonic(): Promise<string> {
        if (!this.wallet) throw new Error('Wallet not initialized');
        if (!('mnemonic' in this.wallet)) {
            throw new Error('Cannot access mnemonic');
        }
        return (this.wallet as any).mnemonic;
    }

    async getBalance(): Promise<string> {
        if (!this.client) throw new Error('Client not initialized');
        const address = await this.getAddress();
        const balance = await this.client.getBalance(address, 'umid');
        return balance.amount;
    }
} 