import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient, IndexedTx } from "@cosmjs/stargate";

interface MidnightConfig {
    nodeUrl: string;
    chainId: string;
    mnemonic: string;
}

interface TransactionResult {
    transactionHash: string;
    blockHeight: number;
    timestamp: Date;
    gasUsed: number;
    fee: string;
}

// Custom message types for Midnight
interface MsgCreateDid {
    creator: string;
    did: string;
    verificationMethod: {
        id: string;
        type: string;
        controller: string;
        publicKeyMultibase: string;
    }[];
    authentication: string[];
}

interface MsgStoreDocument {
    creator: string;
    hash: string;
    owner: string;
}

interface MidnightServiceConfig {
    nodeUrl: string;
    chainId: string;
    mnemonic?: string;
    documentStoreAddress?: string;
    didStoreAddress?: string;
}

interface TransactionDetails {
    transactionHash: string;
    blockHeight: number;
    timestamp: Date;
    gasUsed: number;
    fee: string;
}

interface DocumentDetails {
    transactionHash: string;
    blockHeight: number;
    timestamp: Date;
    owner: string;
}

class MidnightService {
    private readonly config: MidnightServiceConfig;
    private client: StargateClient | null = null;
    private signingClient: SigningStargateClient | null = null;
    private wallet: DirectSecp256k1HdWallet | null = null;

    constructor(config: MidnightServiceConfig) {
        this.config = config;
    }

    async connect() {
        try {
            this.client = await StargateClient.connect(this.config.nodeUrl);
            if (this.config.mnemonic) {
                this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                    this.config.mnemonic,
                    { prefix: "midnight" }
                );
            }
            console.log("Connected to Midnight network");
        } catch (error) {
            console.error("Failed to connect:", error);
            throw error;
        }
    }

    private safeNumber(value: bigint): number {
        // Safely convert bigint to number, with overflow check
        const num = Number(value);
        if (num > Number.MAX_SAFE_INTEGER) {
            console.warn("Warning: Number conversion may lose precision");
        }
        return num;
    }

    async submitDID(didDocument: any): Promise<TransactionResult> {
        if (!this.signingClient || !this.wallet) {
            throw new Error("Not connected to Midnight network");
        }

        const [account] = await this.wallet.getAccounts();
        
        const msg: MsgCreateDid = {
            creator: account.address,
            did: didDocument.id,
            verificationMethod: didDocument.verificationMethod,
            authentication: didDocument.authentication
        };

        const tx = await this.signingClient.signAndBroadcast(
            account.address,
            [{
                typeUrl: "/midnight.did.v1.MsgCreateDid",
                value: msg
            }],
            "auto"
        );

        return {
            transactionHash: tx.transactionHash,
            blockHeight: tx.height,
            timestamp: new Date(),
            gasUsed: tx.gasUsed,
            fee: tx.gasUsed.toString()
        };
    }

    async queryDID(did: string): Promise<any> {
        if (!this.client) throw new Error("Not connected");
        if (!this.config.didStoreAddress) throw new Error("DID store address not configured");
        
        // Mock response for now
        return {
            id: did,
            controller: "mock_controller",
            verificationMethod: []
        };
    }

    async submitDocument(hash: string, owner: string): Promise<TransactionResult> {
        if (!this.signingClient || !this.wallet) {
            throw new Error("Not connected to Midnight network");
        }

        const [account] = await this.wallet.getAccounts();
        
        const msg: MsgStoreDocument = {
            creator: account.address,
            hash: hash,
            owner: owner
        };

        const tx = await this.signingClient.signAndBroadcast(
            account.address,
            [{
                typeUrl: "/midnight.document.v1.MsgStoreDocument",
                value: msg
            }],
            "auto"
        );

        return {
            transactionHash: tx.transactionHash,
            blockHeight: tx.height,
            timestamp: new Date(),
            gasUsed: tx.gasUsed,
            fee: tx.gasUsed.toString()
        };
    }

    async getTransactionDetails(hash: string): Promise<TransactionDetails> {
        if (!this.client) throw new Error("Not connected");
        
        const tx = await this.client.getTx(hash);
        if (!tx) throw new Error(`Transaction ${hash} not found`);

        return {
            transactionHash: hash,
            blockHeight: tx.height,
            timestamp: new Date(),
            gasUsed: this.safeNumber(tx.gasUsed),
            fee: "0"
        };
    }

    async queryDocument(hash: string): Promise<any> {
        if (!this.client) throw new Error("Not connected");
        if (!this.config.documentStoreAddress) throw new Error("Document store address not configured");
        
        // Mock response for now
        return {
            transactionHash: hash,
            blockHeight: 0,
            timestamp: new Date(),
            gasUsed: 0,
            fee: "0"
        };
    }

    async getHeight(): Promise<number> {
        if (!this.client) throw new Error("Not connected");
        return await this.client.getHeight();
    }

    disconnect() {
        if (this.client) {
            this.client.disconnect();
            this.client = null;
        }
        if (this.signingClient) {
            this.signingClient.disconnect();
            this.signingClient = null;
        }
        this.wallet = null;
    }
}

export { 
    MidnightService, 
    type MidnightConfig, 
    type TransactionResult,
    type MsgCreateDid,
    type MsgStoreDocument,
    type MidnightServiceConfig,
    type TransactionDetails,
    type DocumentDetails
}; 