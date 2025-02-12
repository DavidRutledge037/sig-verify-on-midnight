import { SigningStargateClient } from "@cosmjs/stargate";
import { WalletService } from "./wallet.service";
import { DIDDocument } from "./did.service";
import env from "../config/env";

export interface BlockchainDIDRecord {
    did: string;
    hash: string;          // Hash of the DID document
    controller: string;    // Wallet address of controller
    timestamp: string;     // ISO timestamp
    status: 'active' | 'revoked';
    revocationData?: {
        timestamp: string;
        reason: string;
        revokedBy: string;
    };
}

export class DIDBlockchainService {
    constructor(private walletService: WalletService) {}

    /**
     * Stores DID document hash on Midnight blockchain
     */
    async storeDIDOnChain(didDocument: DIDDocument): Promise<string> {
        try {
            const client = await this.getClient();
            const address = await this.walletService.getAddress();

            // Create blockchain record
            const record: BlockchainDIDRecord = {
                did: didDocument.id,
                hash: await this.hashDIDDocument(didDocument),
                controller: address,
                timestamp: new Date().toISOString(),
                status: 'active'
            };

            // TODO: Replace with actual Midnight contract call
            const msg = {
                typeUrl: "/midnight.did.v1.MsgStoreDID",
                value: {
                    did: record.did,
                    hash: record.hash,
                    controller: record.controller,
                    timestamp: record.timestamp
                }
            };

            // Sign and broadcast transaction
            const fee = {
                amount: [{ denom: env.DENOM, amount: "5000" }],
                gas: "200000"
            };

            const response = await client.signAndBroadcast(
                address,
                [msg],
                fee,
                "Store DID Document"
            );

            if (response.code !== 0) {
                throw new Error(`Transaction failed: ${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error: any) {
            console.error('Failed to store DID on chain:', error);
            throw new Error(`Blockchain storage failed: ${error.message}`);
        }
    }

    /**
     * Verifies DID document against blockchain record
     */
    async verifyDIDOnChain(didDocument: DIDDocument): Promise<boolean> {
        try {
            const client = await this.getClient();
            
            // TODO: Replace with actual Midnight contract call
            // For now, we'll simulate the query
            const record = await this.queryDIDRecord(didDocument.id);
            
            if (!record) {
                return false;
            }

            // Verify hash matches
            const currentHash = await this.hashDIDDocument(didDocument);
            return record.hash === currentHash && record.status === 'active';
        } catch (error) {
            console.error('Failed to verify DID on chain:', error);
            return false;
        }
    }

    /**
     * Records DID revocation on chain
     */
    async revokeDIDOnChain(
        did: string, 
        reason: string
    ): Promise<string> {
        try {
            const client = await this.getClient();
            const address = await this.walletService.getAddress();

            // TODO: Replace with actual Midnight contract call
            const msg = {
                typeUrl: "/midnight.did.v1.MsgRevokeDID",
                value: {
                    did,
                    reason,
                    revokedBy: address,
                    timestamp: new Date().toISOString()
                }
            };

            const fee = {
                amount: [{ denom: env.DENOM, amount: "5000" }],
                gas: "200000"
            };

            const response = await client.signAndBroadcast(
                address,
                [msg],
                fee,
                "Revoke DID"
            );

            if (response.code !== 0) {
                throw new Error(`Transaction failed: ${response.rawLog}`);
            }

            return response.transactionHash;
        } catch (error: any) {
            console.error('Failed to revoke DID on chain:', error);
            throw new Error(`Blockchain revocation failed: ${error.message}`);
        }
    }

    private async getClient(): Promise<SigningStargateClient> {
        const client = await this.walletService.getClient();
        if (!client) {
            throw new Error('Wallet client not initialized');
        }
        return client;
    }

    private async hashDIDDocument(didDocument: DIDDocument): Promise<string> {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(didDocument));
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    private async queryDIDRecord(did: string): Promise<BlockchainDIDRecord | null> {
        // TODO: Replace with actual Midnight contract query
        // For now, return simulated data
        return null;
    }
} 